import os
import json

from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT"))

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

FASTRP_COMPUTE_INTERVAL = int(os.getenv("FASTRP_COMPUTE_INTERVAL"))
FASTRP_EMBEDDING_DIMS = int(os.getenv("FASTRP_EMBEDDING_DIMS"))

DISTANCE_WEIGHT = json.loads(os.getenv("DISTANCE_WEIGHT"))
CANDIDATE_K = int(os.getenv("CANDIDATE_K"))
