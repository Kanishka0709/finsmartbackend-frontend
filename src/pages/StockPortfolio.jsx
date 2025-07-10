import React, { useEffect, useState } from 'react';
import '../pages/StackPortfolio.css';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const sampleStockData = [
  { id: 1, symbol: 'AAPL', quantity: 50, pricePerShare: 150, transactionType: 'BUY' },
  { id: 2, symbol: 'GOOGL', quantity: 10, pricePerShare: 2800, transactionType: 'BUY' },
  { id: 3, symbol: 'TSLA', quantity: 20, pricePerShare: 700, transactionType: 'SELL' },
  { id: 4, symbol: 'MSFT', quantity: 30, pricePerShare: 300, transactionType: 'BUY' },
];

function StockPortfolio() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setStocks(sampleStockData);
  }, []);

  const chartData = stocks.map(stock => ({
    symbol: stock.symbol,
    totalValue: stock.quantity * stock.pricePerShare,
  }));

  return (
    <div className="portfolio-container">
      <h2 className="text-center mb-4">📈 Stock Portfolio Overview</h2>

      {/* Data Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price/Share</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.id}>
              <td>{stock.id}</td>
              <td>{stock.symbol}</td>
              <td>{stock.transactionType}</td>
              <td>{stock.quantity}</td>
              <td>${stock.pricePerShare}</td>
              <td>${stock.quantity * stock.pricePerShare}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Graph */}
      <h4 className="mt-5">Stock Value Comparison</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="symbol" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalValue" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>

      {/* Line Chart */}
      <h4 className="mt-5">Trend Line (Sample)</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="symbol" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalValue" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockPortfolio;
