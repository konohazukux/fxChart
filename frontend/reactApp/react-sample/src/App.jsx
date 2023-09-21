import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from 'lightweight-charts';
import axios from 'axios';

const App = () => {
  const chartRef = useRef(null);
  const [date, setDate] = useState("2023-09-12"); // デフォルトの日付

  useEffect(() => {
    if(chartRef.current) {
      const chart = createChart(chartRef.current, { 
        width: 400, 
        height: 300,
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
          const seenTimes = new Set();
          const data = response.data
            .map(item => {
              const dateOnly = item.datetime.split(" ")[0]; // "yyyy-mm-dd hh:mm"から"yyyy-mm-dd"を取得
              return {
                time: dateOnly,
                open: parseFloat(item.open),
                high: parseFloat(item.high),
                low: parseFloat(item.low),
                close: parseFloat(item.close)
              };
            })
            .filter(item => {
              if (seenTimes.has(item.time)) {
                return false;
              }
              seenTimes.add(item.time);
              return true;
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
      <div ref={chartRef} style={{ width: '400px', height: '300px' }}></div>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
    </>
  );
};

// Appを外のファイルからも使用できるように export default で外から参照可能にする
export default App;
