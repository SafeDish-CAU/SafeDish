import threading
import time
from typing import List, Dict, Any

from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError


class Database():
    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

        try:
            with self.driver.session() as session:
                session.run(
                    """
                    CREATE CONSTRAINT user_id_unique IF NOT EXISTS
                    FOR (u:User)
                    REQUIRE u.userId IS UNIQUE
                    """
                )

                session.run(
                    """
                    CREATE CONSTRAINT store_id_unique IF NOT EXISTS
                    FOR (s:Store)
                    REQUIRE s.storeId IS UNIQUE
                    """
                )

                session.run(
                    """
                    CREATE CONSTRAINT menu_id_unique IF NOT EXISTS
                    FOR (m:Menu)
                    REQUIRE m.menuId IS UNIQUE
                    """
                )
        except Exception:
            pass

    def close(self):
        if self.driver:
            self.driver.close()

    def reset(self):
        with self.driver.session() as session:
            constraints = session.run("SHOW CONSTRAINTS")
            for record in constraints:
                constraint_name = record.get("name")
                if constraint_name:
                    session.run(f"DROP CONSTRAINT {constraint_name} IF EXISTS")

            indexes = session.run("SHOW INDEXES")
            for record in indexes:
                index_name = record.get("name")
                if index_name:
                    session.run(f"DROP INDEX {index_name} IF EXISTS")

            session.run("MATCH (n) DETACH DELETE n")

    def create_user(self, user_id: str, latitude: float, longitude: float):
        with self.driver.session() as session:
            session.run(
                """
                MERGE (u:User {userId: $user_id})
                SET u.location = point({latitude: $latitude, longitude: $longitude})
                """,
                user_id=user_id,
                latitude=latitude,
                longitude=longitude,
            )

    def create_store(self, store_id: int, latitude: float, longitude: float):
        with self.driver.session() as session:
            session.run(
                """
                MERGE (s:Store {storeId: $store_id})
                SET s.location = point({latitude: $latitude, longitude: $longitude})
                """,
                store_id=store_id,
                latitude=latitude,
                longitude=longitude,
            )

    def create_menu(self, menu_id: int, store_id: int, category: int, allergy: int):
        with self.driver.session() as session:
            session.run(
                """
                MERGE (s:Store {storeId: $store_id})
                MERGE (m:Menu {menuId: $menu_id})
                SET m.category = $category,
                    m.allergy  = $allergy
                MERGE (s)-[:HAS_MENU]->(m)
                """,
                store_id=store_id,
                menu_id=menu_id,
                category=category,
                allergy=allergy,
            )

    def create_order(self, user_id: str, menu_id: int, quantity: int):
        with self.driver.session() as session:
            session.run(
                """
                MERGE (u:User {userId: $user_id})
                MERGE (m:Menu {menuId: $menu_id})
                MERGE (u)-[r:ORDERED]->(m)
                ON CREATE SET
                    r.count = $quantity,
                    r.lastOrderedAt = datetime()
                ON MATCH SET
                    r.count = coalesce(r.count, 0) + $quantity,
                    r.lastOrderedAt = datetime()
                """,
                user_id=user_id,
                menu_id=menu_id,
                quantity=quantity,
            )

    def recommend(self, user_id: str, allergy: int, w_distance: List[float], candidate_k: int, top_n: int):
        with self.driver.session() as session:
            try:
                result = session.run(
                    """
                    MATCH (me:User {userId: $user_id})
                    WHERE me.location IS NOT NULL
                      AND me.embedding IS NOT NULL

                    CALL {
                      WITH me
                      MATCH (me)-[myR:ORDERED]->(myM:Menu)
                      WHERE myM.category IS NOT NULL
                      WITH myM.category AS catCode, sum(myR.count) AS cnt
                      ORDER BY cnt DESC
                      WITH collect({cat: catCode, cnt: cnt}) AS catCounts,
                           sum(cnt) AS totalCnt
                      RETURN
                        CASE
                          WHEN totalCnt IS NULL OR totalCnt = 0 THEN []
                          ELSE [cc IN catCounts |
                                  {code: cc.cat, weight: (cc.cnt * 1.0) / totalCnt}
                               ]
                        END AS catWeights
                    }

                    OPTIONAL MATCH (me)-[:ORDERED]->(myMenu:Menu)
                    WITH me, catWeights, collect(DISTINCT myMenu) AS myMenus

                    MATCH (m:Menu)<-[:HAS_MENU]-(s:Store)
                    WHERE s.location IS NOT NULL
                      AND point.distance(me.location, s.location) <= 3000
                      AND apoc.bitwise.op(toInteger(coalesce(m.allergy, 0)), "&", toInteger($allergy_mask)) = 0
                      AND m.embedding IS NOT NULL

                    WITH me, catWeights, myMenus, m, s,
                         point.distance(me.location, s.location) AS dist,
                         gds.similarity.cosine(me.embedding, m.embedding) AS fastrpSim
                    ORDER BY fastrpSim DESC
                    LIMIT $candidate_k

                    CALL {
                      WITH me, m
                      MATCH (u:User)-[r:ORDERED]->(m)
                      WHERE u.embedding IS NOT NULL

                      WITH me, u, r,
                           gds.similarity.cosine(me.embedding, u.embedding) AS userSim,
                           duration.inDays(r.lastOrderedAt, datetime()).days AS daysAgo
                      WITH
                        userSim,
                        r,
                        CASE
                          WHEN daysAgo IS NULL THEN 0.0
                          ELSE 1.0 / (1.0 + toFloat(daysAgo))
                        END AS timeDecay
                      RETURN
                        sum(userSim * r.count * timeDecay) AS cfScore
                    }

                    WITH me, catWeights, myMenus, m, s, dist, fastrpSim, cfScore,
                         CASE WHEN m IN myMenus THEN 1 ELSE 0 END AS hasOrdered,
                         CASE
                           WHEN dist <= 500  THEN $w0
                           WHEN dist <= 1000 THEN $w1
                           WHEN dist <= 1500 THEN $w2
                           WHEN dist <= 2000 THEN $w3
                           WHEN dist <= 2500 THEN $w4
                           ELSE $w5
                         END AS distanceWeight,
                         coalesce(
                           head([cw IN catWeights WHERE cw.code = m.category | cw.weight]),
                           0.0
                         ) AS categoryWeight

                    WITH
                      s,
                      m,
                      fastrpSim,
                      cfScore,
                      hasOrdered,
                      distanceWeight,
                      categoryWeight,
                      (
                        0.5 * fastrpSim +
                        0.7 * categoryWeight +
                        0.5 * distanceWeight +
                        0.8 * cfScore -
                        0.3 * hasOrdered
                      ) AS finalScore

                    RETURN
                      s.storeId        AS storeId,
                      m.menuId         AS menuId,
                      fastrpSim        AS fastrpSim,
                      cfScore          AS cfScore,
                      hasOrdered       AS hasOrdered,
                      distanceWeight   AS distanceWeight,
                      categoryWeight   AS categoryWeight,
                      finalScore       AS finalScore
                    ORDER BY finalScore DESC
                    LIMIT $top_n
                    """,
                    user_id=user_id,
                    allergy_mask=allergy,
                    w0=w_distance[0],
                    w1=w_distance[1],
                    w2=w_distance[2],
                    w3=w_distance[3],
                    w4=w_distance[4],
                    w5=w_distance[5],
                    candidate_k=candidate_k,
                    top_n=top_n,
                )

                recommendations: List[Dict[str, Any]] = []
                for record in result:
                    recommendations.append(
                        {
                            "store_id": record["storeId"],
                            "menu_id": record["menuId"],
                            "fastrp_sim": record["fastrpSim"],
                            "cf_score": record["cfScore"],
                            "has_ordered": record["hasOrdered"],
                            "distance_weight": record["distanceWeight"],
                            "category_weight": record["categoryWeight"],
                            "final_score": record["finalScore"],
                        }
                    )

                return recommendations
            except Neo4jError as e:
                # Neo4j가 준 진짜 원인
                print("Neo4jError:", e)
                print("code:", getattr(e, "code", None))
                raise
            except Exception as e:
                print("PythonError:", e)
                raise

    def compute_fastrp_embeddings(self, embedding_dim):
        with self.driver.session() as session:
            try:
                session.run(
                    """
                    CALL gds.graph.drop('recoGraph', false)
                    YIELD graphName
                    RETURN graphName
                    """
                )
            except Exception:
                pass

            try:
                session.run(
                    """
                    CALL gds.graph.project(
                      'recoGraph',
                      ['User', 'Menu', 'Store'],
                      {
                        ORDERED:  {type: 'ORDERED',  orientation: 'UNDIRECTED'},
                        HAS_MENU: {type: 'HAS_MENU', orientation: 'UNDIRECTED'}
                      }
                    )
                    """
                )

                session.run(
                    """
                    CALL gds.fastRP.write(
                      'recoGraph',
                      {
                        embeddingDimension: $dim,
                        writeProperty: 'embedding'
                      }
                    )
                    """,
                    dim=embedding_dim,
                )

                session.run(
                    """
                    CALL gds.graph.drop('recoGraph')
                    YIELD graphName
                    RETURN graphName
                    """
                )
            except Exception:
                pass

    def start_fastrp_scheduler(self, interval_minutes, embedding_dim):
        stop_event = threading.Event()

        def worker():
            while not stop_event.is_set():
                try:
                    print("[FastRP] 임베딩 계산 시작")
                    self.compute_fastrp_embeddings(embedding_dim=embedding_dim)
                    print("[FastRP] 임베딩 계산 완료")
                except Exception as e:
                    print(f"[FastRP] 임베딩 계산 실패: {e}")
                if stop_event.wait(interval_minutes * 60):
                    break

        t = threading.Thread(target=worker, daemon=True)
        t.start()
        return t, stop_event
