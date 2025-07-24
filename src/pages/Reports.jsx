import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Reports.css';
import { getAllExpenses } from '../api/expenseApi';
import { getAllStocks } from '../api/stockApi';
import { getTaxProfiles } from '../api/taxProfileApi';
import { getInvestments } from '../api/investmentApi';
import { getTransactions } from '../api/investmentApi';

const pieColors = ['#1976d2', '#00b894', '#fdcb6e', '#d63031', '#6c47e0', '#f7b731', '#636e72'];

export default function Reports() {
  // State for all data
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [taxProfiles, setTaxProfiles] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getAllExpenses().then(res => setExpenses(res.data || []));
    getInvestments().then(res => setInvestments(res.data || []));
    getAllStocks().then(res => setStocks(res.data || []));
    getTaxProfiles().then(res => setTaxProfiles(res.data || []));
    getTransactions().then(res => setTransactions(res.data || []));
  }, []);

  // Expense metrics
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const avgExpense = expenses.length ? (totalExpense / expenses.length).toFixed(2) : 0;
  const minExpense = expenses.length ? Math.min(...expenses.map(e => e.amount)) : 0;
  const maxExpense = expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0;

  // Investment metrics
  const totalInvestment = investments.reduce((sum, i) => sum + (i.targetAmount || 0), 0);
  const avgInvestment = investments.length ? (totalInvestment / investments.length).toFixed(2) : 0;
  const bestInvestment = investments.reduce((best, i) => (!best || i.targetAmount > best.targetAmount) ? i : best, null);
  const worstInvestment = investments.reduce((worst, i) => (!worst || i.targetAmount < worst.targetAmount) ? i : worst, null);

  // Stock metrics
  const totalStockValue = stocks.reduce((sum, s) => sum + (s.currentPrice || s.price || 0), 0);
  const bestStock = stocks.reduce((best, s) => (!best || (s.currentPrice || s.price || 0) > (best.currentPrice || best.price || 0)) ? s : best, null);
  const worstStock = stocks.reduce((worst, s) => (!worst || (s.currentPrice || s.price || 0) < (worst.currentPrice || worst.price || 0)) ? s : worst, null);

  // Tax metrics
  const totalTax = taxProfiles.reduce((sum, t) => sum + (t.taxPaid || 0), 0);
  const avgTax = taxProfiles.length ? (totalTax / taxProfiles.length).toFixed(2) : 0;
  const bestYear = taxProfiles.reduce((best, t) => (!best || t.taxPaid < best.taxPaid) ? t : best, null);
  const worstYear = taxProfiles.reduce((worst, t) => (!worst || t.taxPaid > worst.taxPaid) ? t : worst, null);

  // Pie chart for expenses by category
  const pieData = Object.entries(expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (curr.amount || 0);
    return acc;
  }, {})).map(([name, value], idx) => ({ name, value, color: pieColors[idx % pieColors.length] }));

  // Line chart for investment transactions over time
  const investmentTx = transactions.filter(tx => tx.goalId); // Only investment transactions
  const lineData = investmentTx.map(tx => ({
    date: tx.dateTime ? tx.dateTime.slice(0, 10) : '',
    amount: tx.amount || 0
  }));

  // Format as Indian Rupees
  const formatINR = value => `₹${Number(value).toLocaleString('en-IN')}`;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px 0' }}>
      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 24, padding: '0 24px' }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Expenses</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalExpense)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Avg: {formatINR(avgExpense)} | Min: {formatINR(minExpense)} | Max: {formatINR(maxExpense)}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Investment</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalInvestment)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Avg: {formatINR(avgInvestment)} | Best: {bestInvestment ? bestInvestment.goalName : 'N/A'} | Worst: {worstInvestment ? worstInvestment.goalName : 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Stock Value</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalStockValue)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Best: {bestStock ? bestStock.name : 'N/A'} | Worst: {worstStock ? worstStock.name : 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Tax Paid</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalTax)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Avg: {formatINR(avgTax)} | Best Year: {bestYear ? bestYear.year : 'N/A'} | Worst Year: {worstYear ? worstYear.year : 'N/A'}</div>
        </div>
      </div>
      {/* Middle Section: Pie and Line Charts */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Pie Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Expense Analysis Chart</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <PieChart width={320} height={32} style={{ pointerEvents: 'none' }}>
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{ position: 'relative' }}
              />
            </PieChart>
          </div>
        </div>
        {/* Line Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Investment Transactions Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Section: Transactions Table */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, margin: '0 24px', minWidth: 320 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Investment Transactions</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
              <th>Date</th><th>Amount</th><th>Mode</th><th>Note</th>
            </tr>
          </thead>
          <tbody>
            {investmentTx.map((tx, idx) => (
              <tr key={tx.id || idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td>{tx.dateTime ? tx.dateTime.slice(0, 10) : ''}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatINR(tx.amount)}</td>
                <td>{tx.mode}</td>
                <td>{tx.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 