import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Utility to calculate payoff at each stock price
const getPayoffData = (legs, minPrice = 50, maxPrice = 150, step = 1) => {
  const stockPrices = [];
  for (let i = minPrice; i <= maxPrice; i += step) {
    stockPrices.push(i);
  }

  const payoffData = stockPrices.map(S => {
    let totalPayoff = 0;

    legs.forEach(leg => {
      const type = leg.type;
      const action = leg.buySell;
      const strike = leg.strike;
      const premium = leg.premium;

      let intrinsicValue = 0;
      if (type === "call") {
        intrinsicValue = Math.max(S - strike, 0);
      } else if (type === "put") {
        intrinsicValue = Math.max(strike - S, 0);
      }

      let payoff = 0;
      if (action === "buy") {
        payoff = intrinsicValue - premium;
      } else if (action === "sell") {
        payoff = -intrinsicValue + premium;
      }

      totalPayoff += payoff;
    });

    return { stockPrice: S, payoff: totalPayoff };
  });

  return payoffData;
};

const OptionPayoffChart = () => {
  const data = getPayoffData(optionLegs);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stockPrice" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="payoff" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OptionPayoffChart;
