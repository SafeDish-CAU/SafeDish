from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

import config
from database import Database


class UserCreateRequest(BaseModel):
    id: str
    latitude: float
    longitude: float


class StoreCreateRequest(BaseModel):
    id: int
    latitude: float
    longitude: float


class MenuCreateRequest(BaseModel):
    id: int
    store_id: int
    category: int
    allergy: int


class OrderCreateRequest(BaseModel):
    user_id: str
    menu_id: int
    quantity: int


class RecommendRequest(BaseModel):
    user_id: str
    allergy: int


class RecommendResponse(BaseModel):
    items: List[int] = Field(default_factory=list)


db = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global db
    # start
    db = Database(config.NEO4J_URI, config.NEO4J_USER, config.NEO4J_PASSWORD)
    compute_worker, compute_stop_event = db.start_fastrp_scheduler(
        config.FASTRP_COMPUTE_INTERVAL,
        config.FASTRP_EMBEDDING_DIMS,
    )

    # run
    yield

    # shutdown
    if compute_stop_event is not None:
        compute_stop_event.set()
    if compute_worker is not None:
        compute_worker.join(timeout=10)
    db.close()

app = FastAPI(lifespan=lifespan)


@app.post("/user", status_code=204)
async def create_user(req: UserCreateRequest):
    global db
    db.create_user(req.id, req.latitude, req.longitude)


@app.post("/store", status_code=204)
async def create_store(req: StoreCreateRequest):
    global db
    db.create_store(req.id, req.latitude, req.longitude)


@app.post("/menu", status_code=204)
async def create_menu(req: MenuCreateRequest):
    global db
    db.create_menu(req.id, req.store_id, req.category, req.allergy)


@app.post("/order", status_code=204)
async def create_order(req: OrderCreateRequest):
    global db
    db.create_order(req.user_id, req.menu_id, req.quantity)


@app.post("/recommend", response_model=RecommendResponse)
async def get_recommend_by_user(req: RecommendRequest):
    global db
    recs = db.recommend(req.user_id, req.allergy,
                        config.DISTANCE_WEIGHT, config.CANDIDATE_K, 5)
    menu_ids = [r["menu_id"] for r in recs]
    return RecommendResponse(items=menu_ids)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=config.PORT, reload=True)
