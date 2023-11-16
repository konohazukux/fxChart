import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from 'lightweight-charts';
import axios from 'axios';

const App = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [date, setDate] = useState(null);

  // チャートシリーズを設定する関数
  const setupSeries = (chart, data, seriesType = 'Candlestick') => {
    const series = seriesType === 'Candlestick' ? chart.addCandlestickSeries() : chart.addLineSeries({
      color: 'rgba(4, 111, 232, 1)',
      lineWidth: 2,
    });

    const formattedData = data.map(item => {
      const timestamp = new Date(item.datetime).getTime() / 1000;
      return seriesType === 'Candlestick' ? {
        time: timestamp,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
      } : {
        time: timestamp,
        value: parseFloat(item[seriesType.toLowerCase()]),
      };
    });

    series.setData(formattedData);
  };

  useEffect(() => {
    if (chartRef.current && date !== null) {
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
        localization: {
          timeFormatter: timestamp => new Date(timestamp * 1000).toLocaleTimeString(),
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      setChart(newChart);

      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/data?date=${date}`);
          setupSeries(newChart, response.data, 'Candlestick');
          setupSeries(newChart, response.data, 'Sma5');
          setupSeries(newChart, response.data, 'Sma25');
          setupSeries(newChart, response.data, 'Sma75');
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
