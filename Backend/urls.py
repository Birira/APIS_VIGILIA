#uvicorn main:app --reload

from fastapi import *
import json

from read_colmena import read_colmena
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",

]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    colmena = read_colmena()
    res = colmena.to_json(orient="records")
    return json.loads(res)
