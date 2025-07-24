import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { FaChartLine, FaArrowUp, FaArrowDown, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import './StackPortfolio.css';
import {
  getAllStockTransactions,
  createStockTransaction,
  updateStockTransaction,
  deleteStockTransaction,
  getAllStocks,
  createStock,
  updateStock,
  deleteStock
} from '../api/stockApi';

// Mock data
const statCards = [
  { label: 'Total Stocks', value: 18, icon: <FaChartLine size={28} color="#1976d2" />, color: '#e3f4fd' },
  { label: 'Total Value', value: '$24,500', icon: <FaDollarSign size={28} color="#00b894" />, color: '#eafaf1' },
  { label: 'Gains', value: '+$1,200', icon: <FaArrowUp size={28} color="#00b894" />, color: '#eafaf1' },
  { label: 'Losses', value: '-$350', icon: <FaArrowDown size={28} color="#d63031" />, color: '#fdeaea' },
];

const summaryCards = [
  { label: 'Total Buy', value: '$12,000', icon: <FaShoppingCart size={22} color="#1976d2" />, color: '#e3f4fd' },
  { label: 'Total Sell', value: '$10,800', icon: <FaShoppingCart size={22} color="#d63031" />, color: '#fdeaea' },
  { label: 'Net Orders', value: '32', icon: <FaChartLine size={22} color="#7e8ce0" />, color: '#f0f2fd' },
];

const lineData = [
  { date: 'Feb', value: 30 },
  { date: 'Mar', value: 32 },
  { date: 'Apr', value: 34 },
  { date: 'May', value: 33 },
  { date: 'Jun', value: 36 },
  { date: 'Jul', value: 35 },
  { date: 'Aug', value: 37 },
  { date: 'Sep', value: 36 },
  { date: 'Oct', value: 38 },
  { date: 'Nov', value: 39 },
  { date: 'Dec', value: 41 },
  { date: 'Jan', value: 42 },
];

const breakdownData = [
  { name: 'Tech', USA: 21, India: 26, Russia: 8, Canada: 9, Japan: 9, Germany: 12 },
  { name: 'Auto', USA: 29, India: 17, Russia: 8, Canada: 8, Japan: 13, Germany: 6 },
  { name: 'Finance', USA: 23, India: 19, Russia: 7, Canada: 11, Japan: 12, Germany: 11 },
  { name: 'Energy', USA: 19, India: 25, Russia: 11, Canada: 11, Japan: 9, Germany: 18 },
  { name: 'Retail', USA: 25, India: 19, Russia: 7, Canada: 5, Japan: 9, Germany: 10 },
  { name: 'Other', USA: 18, India: 20, Russia: 10, Canada: 9, Japan: 12, Germany: 14 },
];
const breakdownColors = ['#1976d2', '#00b894', '#fdcb6e', '#d63031', '#636e72', '#6c47e0'];

const initialForm = {
  currentPrice: '',
  purchasePrice: '',
  quantity: '',
  transactionDate: '',
  transactionType: '',
  stock: { id: '' },
};

export default function StockPortfolio() {
  // Top Stat Cards
  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stockForm, setStockForm] = useState({ symbol: '', currentPrice: '', exchange: '', sector: '' });
  const [stockEditId, setStockEditId] = useState(null);
  const [stockEditForm, setStockEditForm] = useState({ symbol: '', currentPrice: '', exchange: '', sector: '' });
  const [stockError, setStockError] = useState('');
  const [stockSuccess, setStockSuccess] = useState('');

  // Debug logs for edit mode issue
  useEffect(() => {
    console.log('editId:', editId, 'transactions:', transactions.map(tx => tx.id));
  }, [editId, transactions]);

  const fetchTransactions = () => {
    getAllStockTransactions()
      .then(res => setTransactions(res.data))
      .catch(() => setTransactions([]));
  };

  useEffect(() => {
    fetchTransactions();
    fetchStocks();
  }, []);

  const fetchStocks = () => {
    getAllStocks().then(res => setStocks(res.data)).catch(() => setStocks([]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!stocks.length) {
      setError('Please add a stock before adding a transaction.');
      return;
    }
    createStockTransaction({
      ...form,
      transactionType: form.transactionType.toUpperCase(),
      stock: { id: form.stock.id }
    })
      .then(() => {
        setSuccess('Transaction added.');
        setForm(initialForm);
        fetchTransactions();
      })
      .catch(() => setError('Failed to add transaction.'));
  };

  const handleEdit = (tx) => {
    setEditId(tx.id);
    setEditForm({
      currentPrice: tx.currentPrice,
      purchasePrice: tx.purchasePrice,
      quantity: tx.quantity,
      transactionDate: tx.transactionDate?.slice(0, 10),
      transactionType: tx.transactionType,
      stock: { id: tx.stock?.id || '' },
    });
  };

  const handleEditSave = (id) => {
    updateStockTransaction(id, {
      ...editForm,
      transactionType: editForm.transactionType.toUpperCase(),
      stock: { id: editForm.stock.id }
    })
      .then(() => {
        setSuccess('Transaction updated.');
        setError(''); // Clear any previous error
        setEditId(null);
        fetchTransactions();
      })
      .catch(() => {
        setError('Failed to update transaction.');
        setSuccess(''); // Clear any previous success
      });
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    deleteStockTransaction(id)
      .then(() => {
        setSuccess('Transaction deleted.');
        fetchTransactions();
      })
      .catch(() => setError('Failed to delete transaction.'));
  };

  const handleStockInputChange = (e) => {
    const { name, value } = e.target;
    setStockForm({ ...stockForm, [name]: value });
  };

  const handleStockEditChange = (e) => {
    const { name, value } = e.target;
    setStockEditForm({ ...stockEditForm, [name]: value });
  };

  const handleStockAdd = (e) => {
    e.preventDefault();
    setStockError(''); setStockSuccess('');
    createStock(stockForm)
      .then(() => {
        setStockSuccess('Stock added.');
        setStockForm({ symbol: '', currentPrice: '', exchange: '', sector: '' });
        fetchStocks();
      })
      .catch(() => setStockError('Failed to add stock.'));
  };

  const handleStockEdit = (stock) => {
    setStockEditId(stock.id);
    setStockEditForm({
      symbol: stock.symbol,
      currentPrice: stock.currentPrice,
      exchange: stock.exchange,
      sector: stock.sector
    });
  };

  const handleStockEditSave = (id) => {
    updateStock(id, stockEditForm)
      .then(() => {
        setStockSuccess('Stock updated.');
        setStockEditId(null);
        fetchStocks();
      })
      .catch(() => setStockError('Failed to update stock.'));
  };

  const handleStockEditCancel = () => {
    setStockEditId(null);
  };

  const handleStockDelete = (id) => {
    if (!window.confirm('Delete this stock?')) return;
    deleteStock(id)
      .then(() => {
        setStockSuccess('Stock deleted.');
        fetchStocks();
      })
      .catch(() => setStockError('Failed to delete stock.'));
  };

  // Compute chart data from transactions: total quantity (buy minus sell) per date
  const chartData = transactions.reduce((acc, tx) => {
    const date = tx.transactionDate?.slice(0, 10);
    if (!date) return acc;
    const existing = acc.find(item => item.date === date);
    const qty = tx.transactionType === 'BUY' ? tx.quantity : -tx.quantity;
    if (existing) {
      existing.value += qty;
    } else {
      acc.push({ date, value: qty });
    }
    return acc;
  }, []);

  // Stat Cards (Top)
  const totalStocks = stocks.length;
  const totalValue = transactions.reduce((sum, tx) => sum + (tx.currentPrice * tx.quantity), 0);
  const totalBuy = transactions.filter(tx => tx.transactionType === 'BUY').reduce((sum, tx) => sum + (tx.purchasePrice * tx.quantity), 0);
  const totalSell = transactions.filter(tx => tx.transactionType === 'SELL').reduce((sum, tx) => sum + (tx.purchasePrice * tx.quantity), 0);
  const netOrders = transactions.length;
  const gains = totalSell - totalBuy;
  const losses = gains < 0 ? gains : 0;
  const netGains = gains > 0 ? gains : 0;

  const statCards = [
    { label: 'Total Stocks', value: totalStocks, icon: <FaChartLine size={28} color="#1976d2" />, color: '#e3f4fd' },
    { label: 'Total Value', value: `₹${totalValue.toLocaleString('en-IN')}`, icon: <FaDollarSign size={28} color="#00b894" />, color: '#eafaf1' },
    { label: 'Gains', value: `+₹${netGains.toLocaleString('en-IN')}`, icon: <FaArrowUp size={28} color="#00b894" />, color: '#eafaf1' },
    { label: 'Losses', value: `-₹${Math.abs(losses).toLocaleString('en-IN')}`, icon: <FaArrowDown size={28} color="#d63031" />, color: '#fdeaea' },
  ];

  const summaryCards = [
    { label: 'Total Buy', value: `₹${totalBuy.toLocaleString('en-IN')}`, icon: <FaShoppingCart size={22} color="#1976d2" />, color: '#e3f4fd' },
    { label: 'Total Sell', value: `₹${totalSell.toLocaleString('en-IN')}`, icon: <FaShoppingCart size={22} color="#d63031" />, color: '#fdeaea' },
    { label: 'Net Orders', value: netOrders, icon: <FaChartLine size={22} color="#7e8ce0" />, color: '#f0f2fd' },
  ];

  // Breakdown by Sector (Bar Chart)
  const sectorMap = {};
  stocks.forEach(stock => {
    if (!sectorMap[stock.sector]) sectorMap[stock.sector] = 0;
    sectorMap[stock.sector] += 1;
  });
  const breakdownData = Object.entries(sectorMap).map(([sector, count]) => ({ name: sector, count }));

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', width: '100%', padding: '24px 0' }}>
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 24, padding: '0 24px' }}>
        {statCards.map((card, idx) => (
          <div key={card.label} style={{ background: card.color, borderRadius: 18, padding: '24px 18px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22 }}>
            {card.icon}
            <div>
              <div style={{ fontSize: 15, color: '#888', fontWeight: 600 }}>{card.label}</div>
              <div style={{ fontSize: 26, color: '#222', fontWeight: 900 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 18, marginBottom: 24, padding: '0 24px' }}>
        {summaryCards.map((card, idx) => (
          <div key={card.label} style={{ background: card.color, borderRadius: 14, padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px #0001', fontWeight: 600, fontSize: 18 }}>
            {card.icon}
            <div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{card.label}</div>
              <div style={{ fontSize: 20, color: '#222', fontWeight: 800 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, padding: '0 24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Line Chart */}
        <div style={{ background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 2px 16px #0001', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#1976d2' }}>Stock Value Overview</div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Breakdown Bar Chart */}
        <div style={{ background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 2px 16px #0001', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#1976d2' }}>Stock Breakdown by Sector</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={breakdownData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Manage Stocks CRUD Table and Form */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #0001', padding: 32, margin: '24px 24px 24px 24px', maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#1976d2' }}>Manage Stocks</h2>
        <hr style={{ marginBottom: 24, border: 'none', borderTop: '1px solid #e3eafc' }} />
        <form onSubmit={handleStockAdd} style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="symbol" type="text" placeholder="Symbol" value={stockForm.symbol} onChange={handleStockInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 80 }} />
          <input name="currentPrice" type="number" step="0.01" placeholder="Current Price" value={stockForm.currentPrice} onChange={handleStockInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 90 }} />
          <input name="exchange" type="text" placeholder="Exchange" value={stockForm.exchange} onChange={handleStockInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 90 }} />
          <input name="sector" type="text" placeholder="Sector" value={stockForm.sector} onChange={handleStockInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 90 }} />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </form>
        {stockSuccess && <div style={{ color: '#00b894', marginBottom: 8 }}>{stockSuccess}</div>}
        {stockError && <div style={{ color: '#d63031', marginBottom: 8 }}>{stockError}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f8fa' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Symbol</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Current Price</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Exchange</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Sector</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id} style={{ borderBottom: '1px solid #e3eafc', background: stockEditId === stock.id ? '#eafaf1' : undefined }}>
                {stockEditId === stock.id ? (
                  <>
                    <td><input name="symbol" type="text" value={stockEditForm.symbol} onChange={handleStockEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="currentPrice" type="number" value={stockEditForm.currentPrice} onChange={handleStockEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="exchange" type="text" value={stockEditForm.exchange} onChange={handleStockEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="sector" type="text" value={stockEditForm.sector} onChange={handleStockEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td>
                      <button onClick={() => handleStockEditSave(stock.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                      <button onClick={handleStockEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{stock.symbol}</td>
                    <td>{stock.currentPrice}</td>
                    <td>{stock.exchange}</td>
                    <td>{stock.sector}</td>
                    <td>
                      <button onClick={() => handleStockEdit(stock)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleStockDelete(stock.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Stock Transactions CRUD Table and Form */}
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 16px #0001',
        padding: 32,
        margin: '48px 24px 24px 24px',
        maxWidth: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#1976d2' }}>Stock Transactions</h2>
        <hr style={{ marginBottom: 24, border: 'none', borderTop: '1px solid #e3eafc' }} />
        <form onSubmit={handleAdd} style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            name="stock"
            value={form.stock.id}
            onChange={e => {
              const selectedStock = stocks.find(s => s.id === Number(e.target.value));
              setForm({
                ...form,
                stock: { id: Number(e.target.value) },
                currentPrice: selectedStock ? selectedStock.currentPrice : ''
              });
            }}
            required
            style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }}
          >
            <option value="">Select Stock</option>
            {stocks.map(stock => (
              <option key={stock.id} value={stock.id}>{stock.symbol}</option>
            ))}
          </select>
          <input
            name="currentPrice"
            type="number"
            placeholder="Current Price"
            value={form.currentPrice}
            readOnly
            style={{ background: '#f3f3f3', padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 90 }}
          />
          <input name="purchasePrice" type="number" step="0.01" placeholder="Purchase Price" value={form.purchasePrice} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 90 }} />
          <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 80 }} />
          <input name="transactionDate" type="date" placeholder="Date" value={form.transactionDate} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc' }} />
          <input name="transactionType" type="text" placeholder="Type (buy/sell)" value={form.transactionType} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </form>
        {success && <div style={{ color: '#00b894', marginBottom: 8 }}>{success}</div>}
        {error && <div style={{ color: '#d63031', marginBottom: 8 }}>{error}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f8fa' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Current Price</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Purchase Price</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Quantity</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Date</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Type</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={tx.id || idx} style={{ borderBottom: '1px solid #e3eafc', background: editId === tx.id ? '#eafaf1' : undefined }}>
                {editId === tx.id ? (
                  <>
                    <td><input name="currentPrice" type="number" value={editForm.currentPrice} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="purchasePrice" type="number" value={editForm.purchasePrice} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 60 }} /></td>
                    <td><input name="transactionDate" type="date" value={editForm.transactionDate} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc' }} /></td>
                    <td><input name="transactionType" type="text" value={editForm.transactionType} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td>
                      <button onClick={() => handleEditSave(tx.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                      <button onClick={handleEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{tx.currentPrice}</td>
                    <td>{tx.purchasePrice}</td>
                    <td>{tx.quantity}</td>
                    <td>{tx.transactionDate?.slice(0, 10)}</td>
                    <td>{tx.transactionType}</td>
                    <td>
                      <button onClick={() => handleEdit(tx)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleDelete(tx.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
