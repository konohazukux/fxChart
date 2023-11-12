import pandas as pd
import os
from datetime import datetime, timedelta

# 秒足から分足を作成
# input ./data/11sourceData/
# output ./data/13minutes/

def calculate_ohlc(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
        
        if not lines:
            return None

        # bidのデータを取得するインデックスは2です。
        print(lines)
        prices = [float(line.split(",")[2].strip()) for line in lines]

        # 始値は最初の行から
        open_price = prices[0]
        
        # 終値は最後の行から
        close_price = prices[-1]

        high_price = max(prices)
        low_price = min(prices)

        return open_price, high_price, low_price, close_price


def process_file(target_datetime):
    date_str = target_datetime.strftime("%Y-%m-%d")
    time_str = target_datetime.strftime("%Y%m%d-%H%M")
    
    source_file_path = f"./data/11sourceData/{date_str}/{time_str}.log"
    
    if not os.path.exists(source_file_path):
        print(f"File {source_file_path} does not exist.")
        return

    result = calculate_ohlc(source_file_path)
    if result:
        open_price, high_price, low_price, close_price = result
        
        # 結果を保存
        output_file = f"./data/13minutes/{date_str}.csv"

        # ファイルが存在しない、または空の場合、ヘッダーを書き込む
        if not os.path.exists(output_file) or os.path.getsize(output_file) == 0:
            with open(output_file, 'w') as f:
                f.write("datetime,symbol,open,high,low,close\n")

        with open(output_file, 'a') as f:
            f.write(f"{date_str} {target_datetime.strftime('%H:%M')}, USDJPY, {open_price}, {high_price}, {low_price}, {close_price}\n")

def get_date(start_str, end_str):
    start_datetime = datetime.strptime(start_str, '%Y-%m-%d %H:%M')
    end_datetime = datetime.strptime(end_str, '%Y-%m-%d %H:%M')

    current_datetime = start_datetime
    while current_datetime <= end_datetime:
        print(current_datetime)
        process_file(current_datetime)
        current_datetime += timedelta(minutes=1)

if __name__ == '__main__':
    start_str = '2023-05-13 00:00'
    end_str   = '2023-12-04 23:00'
    get_date(start_str, end_str)
