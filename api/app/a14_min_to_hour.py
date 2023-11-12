import pandas as pd
import os
from datetime import datetime, timedelta


# 15分足を作成

def read_files_for_day(target_date):
    print(f"Reading files for {target_date.strftime('%Y-%m-%d')}")
    data_frames = []
    for hour in range(24):
        for minute in range(60):
            time_str = target_date.strftime("%Y%m%d-{:02d}{:02d}".format(hour, minute))
            file_path = f"../log/13minuts/{target_date.strftime('%Y-%m-%d')}/{time_str}.log"
            
            if os.path.exists(file_path):
                df = pd.read_csv(file_path, header=None, names=["datetime", "symbol", "open", "close", "high", "low"])
                data_frames.append(df)
    
    return pd.concat(data_frames, ignore_index=True) if data_frames else None

def resample_data(df, freq):
    df["datetime"] = pd.to_datetime(df["datetime"])
    df.set_index("datetime", inplace=True)

    ohlc_dict = {
        'open': 'first',
        'high': 'max',
        'low': 'min',
        'close': 'last',
        'symbol': 'last'
    }

    return df.resample(freq).apply(ohlc_dict).dropna()

def save_resampled_data(df, base_path, date_str):
    output_file = f"{base_path}/{date_str}.log"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    df.to_csv(output_file, header=False, index=True, mode='w')

def process_data(start_date, end_date):
    current_date = start_date
    
    while current_date <= end_date:
        df = read_files_for_day(current_date)
        if df is not None:
            # Resample and save data for 15 minutes interval
            save_resampled_data(resample_data(df, '15T'), "../log/14quater_hour", current_date.strftime("%Y-%m-%d"))
        
        current_date += timedelta(days=1)

# Usage example
start_datetime = datetime(2023, 7, 27, 0, 0)
end_datetime = datetime(2023, 10, 28, 23, 59)
process_data(start_datetime, end_datetime)
