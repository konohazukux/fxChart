# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

DATA_DIR = "./data"

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
    # ディレクトリの存在確認
    data_path = os.path.join(DATA_DIR, date)
    if not os.path.exists(data_path):
        raise HTTPException(status_code=404, detail="Data not found")

    # ログファイルの読み込み
    all_data = []
    for hour in range(24):
        for minute in range(60):
            log_file_name = f"{date.replace('-', '')}-{hour:02}{minute:02}.log"
            log_file_path = os.path.join(data_path, log_file_name)
            if os.path.exists(log_file_path):
                df = pd.read_csv(log_file_path, header=None, names=["datetime", "symbol", "open", "high", "low", "close"])
                all_data.append(df)

    final_df = pd.concat(all_data, ignore_index=True)
    return final_df.to_dict(orient="records")