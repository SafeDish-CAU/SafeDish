from database import Database

import config

# 추천서버 DB 리셋

db = Database(config.NEO4J_URI, config.NEO4J_USER, config.NEO4J_PASSWORD)
db.reset()
db.close()