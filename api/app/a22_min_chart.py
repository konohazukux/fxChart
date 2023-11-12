# chatGPT
# 分足データからchartを作成したい

# inputファイルは
# ../log/13minuts/yyyy-mm-dd/yyyymmdd-HHMM.log
# ような形式になっている
# 例： ../log/13minuts/2023-08-02/20230802-1556.log

# ファイルの内容は
# % cat ../log/13minuts/2023-08-02/20230802-1556.log
# 2023-08-02 15:56, USDJPY, 142.569, 142.629, 142.565, 142.629
# のような形式になっている
# open, high, low, closeの順に並んでいる  

# 日付を指定して、その日の分足データをchartにする

# 言語はpython3でお願いします



import os
import pandas as pd
import mplfinance as mpf

def read_data_for_date(date):
    # ディレクトリのパスを生成
    dirpath = f"../log/13minuts/{date}/"
    
    # ディレクトリが存在するか確認
    if not os.path.exists(dirpath):
        print(f"Directory {dirpath} does not exist!")
        return None
    
    # ディレクトリ内のすべてのファイルを読み込む
    print(f"-- Reading files for {date}")
    all_data = []
    for filename in os.listdir(dirpath):
        if filename.endswith(".log"):
            filepath = os.path.join(dirpath, filename)
            data = pd.read_csv(filepath, header=None, names=["Datetime", "Pair", "Open", "High", "Low", "Close"])
            all_data.append(data)
    print(f"-- Readed")
    
    # すべてのデータを結合
    combined_data = pd.concat(all_data)
    combined_data["Datetime"] = pd.to_datetime(combined_data["Datetime"])
    combined_data.set_index("Datetime", inplace=True)
    # Datetimeでソート
    combined_data = combined_data.sort_index()

    print(f"-- make dataframe")
    print(combined_data)
    return combined_data

def plot_candlestick_chart(date):
    data = read_data_for_date(date)
    
    if data is None:
        return

    # 5期間と20期間の移動平均線を計算
    data['SMA5'] = data['Close'].rolling(window=5).mean()
    data['SMA25'] = data['Close'].rolling(window=25).mean()
    data['SMA75'] = data['Close'].rolling(window=75).mean()
    
    # 移動平均線のプロットを作成
    ap1 = mpf.make_addplot(data['SMA5'], color='blue')
    ap2 = mpf.make_addplot(data['SMA25'], color='red')
    ap3 = mpf.make_addplot(data['SMA75'], color='green')

    # ローソク足チャートを作成
    mpf.plot(data, type='candle', style='charles', title=f"Price Data for {date}", addplot=[ap1, ap2, ap3])

if __name__ == "__main__":
    # date = input("Enter the date (yyyy-mm-dd): ")
    date = "2023-09-12"
    plot_candlestick_chart(date)
