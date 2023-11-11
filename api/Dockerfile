# Dockerfile
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

# アプリケーションのディレクトリを作成
WORKDIR /app

# 依存関係のファイルをコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt
