import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from 'lightweight-charts';
import axios from 'axios';

const App = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null); // チャートインスタンスをステートに保存
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (chartRef.current && date !== null) {
      // 既存のチャートをクリア
      if (chart) {
        chart.remove();
        setChart(null);
      }

      // 新しいチャートを作成
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
        localization: {
          timeFormatter: timestamp => {
            // タイムスタンプを受け取り、HH:mm形式にフォーマットする
            return new Date(timestamp * 1000).toLocaleTimeString();
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
      const candlestickSeries = newChart.addCandlestickSeries();
      const lineSeries = newChart.addLineSeries({
        color: 'rgba(4, 111, 232, 1)', // ラインの色
        lineWidth: 2, // ラインの太さ 
      });
      setChart(newChart); // 新しいチャートインスタンスをステートに保存

      // APIからデータを取得
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
          // candlestickSeries.setData(data);

          const data1 = response.data.map(item => {
          const timestamp = new Date(item.datetime).getTime() / 1000;
            return {
              time: timestamp,
              value: parseFloat(item.close) // ラインチャートでは `value` プロパティを使用
            };
          });
          lineSeries.setData(data1);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [date]);

  return (
    <>
      <h1 style={{ color: 'red' }}>Candlestick Chart</h1>
      <div className="chart-container">
        <input
          type="date"
          value={date || ''}
          onChange={e => setDate(e.target.value)}
          className="date-picker"
        />
        <div ref={chartRef} className="chart" style={{ width: '800px', height: '600px' }}></div>
      </div>
    </>
  );
};

export default App;
