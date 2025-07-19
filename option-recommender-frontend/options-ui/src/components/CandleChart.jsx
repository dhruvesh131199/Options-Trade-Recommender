import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

function CandleChart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!data.length || !chartRef.current) return;

    try {
      const chartOptions = {
        layout: {
          textColor: "black",
          background: { type: "solid", color: "white" },
        },
      };

      const chart = createChart(chartRef.current, chartOptions);

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      // Ensure time is number and sorted
      const fixedData = data
        .map(d => ({ ...d, time: Number(d.time) }))
        .sort((a, b) => a.time - b.time);

      candleSeries.setData(fixedData);
      chart.timeScale().fitContent();

      const resizeObserver = new ResizeObserver(() => {
        chart.resize(chartRef.current.clientWidth, 400);
      });
      resizeObserver.observe(chartRef.current);

      return () => {
        resizeObserver.disconnect();
        chart.remove();
      };
    } catch (error) {
      console.error("Error in CandleChart useEffect:", error);
    }
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}

export default CandleChart;
