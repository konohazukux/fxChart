# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

origins = [
    "http://localhost:3000",  # Reactのアドレス
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, query_param: str = None):
    return {"item_id": item_id, "query_param": query_param}

@app.get("/data")
def read_data(date: str = "2023-09-12"):
    # CSVファイルのパスを指定
    csv_file_path = os.path.join('data/13minutes', f"{date}.csv")
    
    # ファイルの存在確認
    if not os.path.exists(csv_file_path):
        raise HTTPException(status_code=404, detail="Data not found")
    
    # CSVファイルの読み込み
    df = pd.read_csv(csv_file_path)
    print(df.to_dict(orient="records"))
    return df.to_dict(orient="records")
