import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from 'lightweight-charts';
import axios from 'axios';

const App = () => {
  const chartRef = useRef(null);
  const [date, setDate] = useState("2023-09-12"); // デフォルトの日付

  useEffect(() => {
    if(chartRef.current) {
      const chart = createChart(chartRef.current, { 
        width: 800, 
        height: 600,
        layout: {
          backgroundColor: '#ffffff',
          textColor: 'rgba(33, 56, 77, 1)',
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
        },
      });
      const candlestickSeries = chart.addCandlestickSeries();

      // ファイルからデータを読み込む
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/data?date=${date}`);
          const data = response.data.map(item => {
            const timestamp = new Date(item.datetime).getTime() / 1000; // UNIXタイムスタンプに変換
            return {
              time: timestamp,
              open: parseFloat(item.open),
              high: parseFloat(item.high),
              low: parseFloat(item.low),
              close: parseFloat(item.close)
            };
          });
          candlestickSeries.setData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [date]);

  return (
    <>
      <h1 style={{ color: 'red' }}> Candlestick Chart </h1>
      <div ref={chartRef} style={{ width: '800px', height: '600px' }}></div>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
    </>
  );
};

// Appを外のファイルからも使用できるように export default で外から参照可能にする
export default App;
