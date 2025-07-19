import React, { useEffect, useRef } from "react";
import { CandlestickSeries, createChart } from 'lightweight-charts';

function CandleChart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!data.length || !chartRef.current) return;

    const chartOptions = { layout: { textColor: 'black', background: { type: 'solid', color: 'white' } } };
    const chart = createChart(chartRef.current, chartOptions);

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
        wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(data);

    return () => chart.remove();

  }, [data]);


  return <div ref={chartRef} style={{ width: "100%", height: "300px" }} />;
}

export default CandleChart;
