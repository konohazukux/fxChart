import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from 'lightweight-charts';
import axios from 'axios';

const App = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [date, setDate] = useState("2023-11-10"); // デフォルトの日付

  useEffect(() => {
    if(chartRef.current) {

      if (chart) {
        chart.remove();
        setChart(null);
      }

      const newChart = createChart(chartRef.current, { 
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
      const candlestickSeries = newChart.addCandlestickSeries();
      setChart(newChart);

      // APIからデータを取得
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/data?date=${date}`);
          const data = response.data.map(item => {
            // console.log(item);
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
      <div className="chart-container">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="date-picker"
        />
        <div ref={chartRef} style={{ width: '800px', height: '600px' }}></div>
      </div>
    </>
  );
};

// Appを外のファイルからも使用できるように export default で外から参照可能にする
export default App;
