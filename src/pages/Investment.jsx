// src/pages/Investment.jsx
import React, { useEffect, useState } from 'react';
import './Investment.css'; // Make sure this CSS file exists or comment out this line
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Investment() {
  const [investments, setInvestments] = useState([]);

  // Sample static data for testing
  useEffect(() => {
    const mockData = [
      { id: 1, type: 'EMI', amount: 15000 },
      { id: 2, type: 'SIP', amount: 5000 },
      { id: 3, type: 'Stocks', amount: 25000 },
    ];
    setInvestments(mockData);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Investment Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={investments}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h3 className="mt-4">Details</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Investment Type</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.type}</td>
              <td>{inv.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Investment;
