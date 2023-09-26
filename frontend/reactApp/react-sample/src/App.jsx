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
        let allData = [];
        for (let hour = 0; hour < 24; hour++) {
          for (let minute = 0; minute < 60; minute++) {
            const timeStr = `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}`;
            try {
              const response = await axios.get(`./data/${date}/${date.replace(/-/g, '')}-${timeStr}.log`);
              const lineData = response.data.split(", ");
              const [time, , open, high, low, close] = lineData;
              allData.push({ time, open: parseFloat(open), high: parseFloat(high), low: parseFloat(low), close: parseFloat(close) });
            } catch (error) {
              console.error(`Error fetching data for ${timeStr}:`, error);
            }
          }
        }
        candlestickSeries.setData(allData);
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
