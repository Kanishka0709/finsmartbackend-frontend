// src/pages/Investment.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartLine, FaPiggyBank, FaWallet, FaPercent, FaGift, FaUser, FaDollarSign } from 'react-icons/fa';
import './Investment.css';
import { getInvestments, addInvestment, updateInvestment, deleteInvestment, getTransactions, addTransaction, deleteTransaction, updateTransaction } from '../api/investmentApi';

// Mock data
// Remove mock topCards and investedFunds

const portfolioCards = [
  { label: '20% Off', sub: 'Our Your Invest', icon: <FaGift size={28} color="#f7b731" />, bg: '#fffbe7' },
  { label: 'Demographic', value: '30', icon: <FaUser size={28} color="#20bf6b" />, bg: '#fdf3f3' },
  { label: 'Earning', value: '$5897', icon: <FaDollarSign size={28} color="#8854d0" />, bg: '#f3f8fa' },
];

export default function Investment() {
  // CRUD state for investment goals
  const [goals, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState({ goal_name: '', start_date: '', end_date: '', status: '', target_amount: '', user_id: 1 });
  const [editGoalId, setEditGoalId] = useState(null);
  const [editGoalForm, setEditGoalForm] = useState(goalForm);
  const [goalError, setGoalError] = useState('');
  const [goalSuccess, setGoalSuccess] = useState('');

  // CRUD state for investment transactions
  const [transactions, setTransactions] = useState([]);
  const [txForm, setTxForm] = useState({ amount: '', date_time: '', mode: '', note: '', goal_id: '' });
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [txError, setTxError] = useState('');
  const [txSuccess, setTxSuccess] = useState('');

  // CRUD state for investment transactions (edit)
  const [editTxId, setEditTxId] = useState(null);
  const [editTxForm, setEditTxForm] = useState({ amount: '', date_time: '', mode: '', note: '' });

  // Fetch goals
  const fetchGoals = () => {
    getInvestments().then(res => setGoals(res.data)).catch(() => setGoals([]));
  };
  useEffect(() => {
    getInvestments().then(res => {
      setGoals(res.data);
      if (res.data.length > 0 && (!selectedGoalId || selectedGoalId === 'undefined')) {
        setSelectedGoalId(String(res.data[0].id));
      }
    }).catch(() => setGoals([]));
  }, []);

  useEffect(() => {
    if (goals.length > 0 && (!selectedGoalId || selectedGoalId === 'undefined')) {
      setSelectedGoalId(String(goals[0].id));
    }
  }, [goals]);

  // Fetch transactions
  const fetchTransactions = () => {
    getTransactions()
      .then(res => {
        setTransactions(res.data);
        console.log('Fetched transactions:', res.data); // Debug log
        if (res.data && res.data.length > 0) {
          console.log('Sample transaction:', res.data[0]);
        }
      })
      .catch(() => setTransactions([]));
  };
  useEffect(() => { fetchTransactions(); }, []);

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setGoalForm({ ...goalForm, [name]: value });
  };
  const handleGoalEditChange = (e) => {
    const { name, value } = e.target;
    setEditGoalForm({ ...editGoalForm, [name]: value });
  };
  const handleGoalAdd = (e) => {
    e.preventDefault(); setGoalError(''); setGoalSuccess('');
    const { user_id, goal_name, start_date, end_date, target_amount, ...rest } = goalForm;
    const goalPayload = {
      goalName: goal_name,
      startDate: start_date,
      endDate: end_date,
      status: rest.status,
      targetAmount: Number(target_amount)
    };
    addInvestment(goalPayload)
      .then(() => { setGoalSuccess('Goal added.'); setGoalForm({ ...goalForm, goal_name: '', start_date: '', end_date: '', status: '', target_amount: '' }); fetchGoals(); })
      .catch(() => setGoalError('Failed to add goal.'));
  };
  const handleGoalEdit = (goal) => {
    setEditGoalId(goal.id);
    // Map camelCase backend fields to snake_case form fields for editing
    setEditGoalForm({
      goal_name: goal.goalName || '',
      start_date: goal.startDate || '',
      end_date: goal.endDate || '',
      status: goal.status || '',
      target_amount: goal.targetAmount || '',
      user_id: goal.userId || 1,
    });
  };
  const handleGoalEditSave = (id) => {
    const { user_id, goal_name, start_date, end_date, target_amount, ...rest } = editGoalForm;
    const goalPayload = {
      goalName: goal_name,
      startDate: start_date,
      endDate: end_date,
      status: rest.status,
      targetAmount: Number(target_amount)
    };
    updateInvestment(id, goalPayload)
      .then(() => { setGoalSuccess('Goal updated.'); setGoalError(''); setEditGoalId(null); fetchGoals(); })
      .catch(() => { setGoalError('Failed to update goal.'); setGoalSuccess(''); });
  };
  const handleGoalEditCancel = () => { setEditGoalId(null); };
  const handleGoalDelete = (id) => {
    if (!window.confirm('Delete this goal?')) return;
    deleteInvestment(id)
      .then(() => { setGoalSuccess('Goal deleted.'); fetchGoals(); })
      .catch(() => setGoalError('Failed to delete goal.'));
  };

  const handleTxInputChange = (e) => {
    const { name, value } = e.target;
    setTxForm({ ...txForm, [name]: value });
  };
  const handleTxAdd = (e) => {
    e.preventDefault(); setTxError(''); setTxSuccess('');
    if (!selectedGoalId || selectedGoalId === 'undefined') {
      setTxError('Please select a goal.');
      return;
    }
    console.log('selectedGoalId before submit:', selectedGoalId, typeof selectedGoalId);
    // Build payload as per backend expectation
    let dateTime = txForm.date_time;
    // If dateTime is missing seconds, add ':00'
    if (dateTime && dateTime.length === 16) dateTime = dateTime + ':00';
    console.log('selectedGoalId:', selectedGoalId, typeof selectedGoalId);
    const txPayload = {
      amount: Number(txForm.amount),
      mode: txForm.mode,
      dateTime: dateTime,
      note: txForm.note,
      goalId: Number(selectedGoalId)
    };
    console.log('Transaction payload before send:', txPayload);
    addTransaction(txPayload)
      .then(() => { setTxSuccess('Transaction added.'); setTxForm({ amount: '', date_time: '', mode: '', note: '', goal_id: selectedGoalId }); fetchTransactions(); })
      .catch(() => setTxError('Failed to add transaction.'));
  };
  const handleTxEdit = (tx) => {
    setEditTxId(tx.id);
    setEditTxForm({
      amount: tx.amount,
      date_time: tx.dateTime ? tx.dateTime.slice(0, 16) : '',
      mode: tx.mode,
      note: tx.note || '',
    });
  };
  const handleTxEditChange = (e) => {
    setEditTxForm({ ...editTxForm, [e.target.name]: e.target.value });
  };
  const handleTxEditSave = (id) => {
    const txPayload = {
      amount: Number(editTxForm.amount),
      mode: editTxForm.mode,
      dateTime: editTxForm.date_time,
      note: editTxForm.note,
      goalId: Number(selectedGoalId),
    };
    updateTransaction(id, txPayload)
      .then(() => { setTxSuccess('Transaction updated.'); setEditTxId(null); fetchTransactions(); })
      .catch(() => setTxError('Failed to update transaction.'));
  };
  const handleTxEditCancel = () => { setEditTxId(null); };
  const handleTxDelete = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    deleteTransaction(id)
      .then(() => { setTxSuccess('Transaction deleted.'); fetchTransactions(); })
      .catch(() => setTxError('Failed to delete transaction.'));
  };
  // Filter transactions by selected goal
  console.log('All transactions:', transactions);
  console.log('Selected goal ID:', selectedGoalId);
  const filteredTx = selectedGoalId
    ? transactions.filter(tx => String(tx.goal?.id || tx.goalId) === String(selectedGoalId))
    : [];
  console.log('Filtered transactions:', filteredTx);

  // Check for duplicate IDs and warn
  const goalIds = goals.map(g => g.id);
  const hasDuplicateIds = new Set(goalIds).size !== goalIds.length;
  if (hasDuplicateIds) {
    console.warn('Duplicate goal IDs detected in investment goals:', goalIds);
  }

  // Calculate real values from backend data
  const yourInvestment = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
  const currentValue = filteredTx.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const roi = yourInvestment > 0 ? (((currentValue - yourInvestment) / yourInvestment) * 100).toFixed(2) : '0.00';
  const indexValue = 41045.12; // Placeholder, replace with real index if available
  const indexChange = '+1500 1.5%'; // Placeholder

  // Format as Indian Rupees
  const formatINR = value => `₹${Number(value).toLocaleString('en-IN')}`;

  // For Invested Funds Table, use goals
  const investedFunds = goals.map(g => ({
    icon: <FaWallet size={22} color="#4b7bec" />, // Optionally vary icon/color by type
    name: g.goalName,
    id: g.id,
    type: g.status || 'N/A',
    acc: 'Personal account',
    last: g.endDate || '',
    value: g.targetAmount
  }));

  // For Investment Growth Chart, use transactions over time
  const lineData = filteredTx.map(tx => ({
    day: tx.dateTime ? tx.dateTime.slice(5, 10) : '',
    value: Number(tx.amount) || 0
  }));

  // Calculate best performing investment (by targetAmount as a proxy)
  const bestInvestment = goals.reduce((best, g) => {
    return (!best || g.targetAmount > best.targetAmount) ? g : best;
  }, null);
  // Get user age from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userAge = user.age || 'N/A';
  // Calculate total number of investments
  const totalInvestments = goals.length;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px 0' }}>
      {/* Top Section */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, padding: '0 24px' }}>
        <div style={{ background: '#f3f8fa', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaChartLine size={28} color="#1976d2" /><span style={{ fontWeight: 700, fontSize: 16 }}>Index</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{indexValue}</div>
          <div style={{ fontSize: 13, color: '#20bf6b', fontWeight: 600 }}>{indexChange}</div>
        </div>
        <div style={{ background: '#fffbe7', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaPiggyBank size={28} color="#f7b731" /><span style={{ fontWeight: 700, fontSize: 16 }}>Your Investment</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{formatINR(yourInvestment)}</div>
        </div>
        <div style={{ background: '#f7f3fa', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaWallet size={28} color="#a55eea" /><span style={{ fontWeight: 700, fontSize: 16 }}>Current Value</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{formatINR(currentValue)}</div>
        </div>
        <div style={{ background: '#fdf3f3', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaPercent size={28} color="#eb3b5a" /><span style={{ fontWeight: 700, fontSize: 16 }}>% ROI</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>+{roi}%</div>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Left: Invested Funds Table */}
        <div style={{ flex: 2, minWidth: 340 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Invested Funds</div>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                  <th style={{ padding: '8px 0' }}> </th>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Account</th>
                  <th>Last Payment</th>
                  <th style={{ textAlign: 'right' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {investedFunds.map((fund, idx) => (
                  <tr key={fund.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td>{fund.icon}</td>
                    <td>{fund.name}</td>
                    <td>{fund.id}</td>
                    <td>{fund.type}</td>
                    <td>{fund.acc}</td>
                    <td>{fund.last}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatINR(fund.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Right: Investment Growth Chart and Portfolio */}
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Investment Growth</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f7b731" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Your Portfolio */}
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Your Portfolio</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fffbe7', borderRadius: 14, padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px #0001', fontWeight: 600, fontSize: 16 }}>
              <FaGift size={28} color="#f7b731" />
              <div>
                <div style={{ fontSize: 15, color: '#888', fontWeight: 600 }}>Best Investment</div>
                <div style={{ fontSize: 20, color: '#222', fontWeight: 800 }}>{bestInvestment ? bestInvestment.goalName : 'N/A'}</div>
              </div>
            </div>
            <div style={{ background: '#fdf3f3', borderRadius: 14, padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px #0001', fontWeight: 600, fontSize: 16 }}>
              <FaUser size={28} color="#20bf6b" />
              <div>
                <div style={{ fontSize: 15, color: '#888', fontWeight: 600 }}>Total Investments</div>
                <div style={{ fontSize: 20, color: '#222', fontWeight: 800 }}>{totalInvestments}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CRUD for Investment Goals */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 32, maxWidth: 1200, margin: '32px auto' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#1976d2' }}>Investment Goals</h2>
        <form onSubmit={handleGoalAdd} style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="goal_name" type="text" placeholder="Goal Name" value={goalForm.goal_name} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="start_date" type="date" placeholder="Start Date" value={goalForm.start_date} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="end_date" type="date" placeholder="End Date" value={goalForm.end_date} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="status" type="text" placeholder="Status" value={goalForm.status} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <input name="target_amount" type="number" placeholder="Target Amount" value={goalForm.target_amount} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </form>
        {goalSuccess && <div style={{ color: '#00b894', marginBottom: 8 }}>{goalSuccess}</div>}
        {goalError && <div style={{ color: '#d63031', marginBottom: 8 }}>{goalError}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f8fa' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Goal Name</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Start Date</th>
              <th style={{ padding: 8, textAlign: 'left' }}>End Date</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Target Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id} style={{ borderBottom: '1px solid #e3eafc', background: editGoalId === goal.id ? '#eafaf1' : undefined }}>
                {editGoalId === goal.id ? (
                  <>
                    <td><input name="goal_name" type="text" value={editGoalForm.goal_name} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="start_date" type="date" value={editGoalForm.start_date} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="end_date" type="date" value={editGoalForm.end_date} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="status" type="text" value={editGoalForm.status} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="target_amount" type="number" value={editGoalForm.target_amount} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td>
                      <button onClick={() => handleGoalEditSave(goal.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                      <button onClick={handleGoalEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{goal.goalName}</td>
                    <td>{goal.startDate}</td>
                    <td>{goal.endDate}</td>
                    <td>{goal.status}</td>
                    <td>{goal.targetAmount}</td>
                    <td>
                      <button onClick={() => handleGoalEdit(goal)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleGoalDelete(goal.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* CRUD for Investment Transactions */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 32, maxWidth: 1200, margin: '32px auto' }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: '#1976d2' }}>Investment Transactions</h3>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="goalSelect" style={{ marginRight: 8 }}>Select Goal:</label>
          <select id="goalSelect" value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)} required style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc' }}>
            <option value="">-- Select --</option>
            {goals.map((goal, idx) => <option key={goal.id || (goal.goalName + idx)} value={String(goal.id)}>{goal.goalName}</option>)}
          </select>
        </div>
        <form onSubmit={handleTxAdd} style={{ marginBottom: 18, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="amount" type="number" placeholder="Amount" value={txForm.amount} onChange={handleTxInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 90 }} />
          <input name="date_time" type="datetime-local" placeholder="Date/Time" value={txForm.date_time} onChange={handleTxInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 160 }} />
          <input name="mode" type="text" placeholder="Mode" value={txForm.mode} onChange={handleTxInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 80 }} />
          <input name="note" type="text" placeholder="Note" value={txForm.note} onChange={handleTxInputChange} style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }} disabled={!selectedGoalId || selectedGoalId === 'undefined'}>
            Add
          </button>
        </form>
        {txSuccess && <div style={{ color: '#00b894', marginBottom: 8 }}>{txSuccess}</div>}
        {txError && <div style={{ color: '#d63031', marginBottom: 8 }}>{txError}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f8fa' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Date/Time</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Mode</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Note</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.map(tx => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #e3eafc' }}>
                {editTxId === tx.id ? (
                  <>
                    <td><input name="amount" type="number" value={editTxForm.amount} onChange={handleTxEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="date_time" type="datetime-local" value={editTxForm.date_time} onChange={handleTxEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 160 }} /></td>
                    <td><input name="mode" type="text" value={editTxForm.mode} onChange={handleTxEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="note" type="text" value={editTxForm.note} onChange={handleTxEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 120 }} /></td>
                    <td>
                      <button onClick={() => handleTxEditSave(tx.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                      <button onClick={handleTxEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{tx.amount}</td>
                    <td>{tx.dateTime}</td>
                    <td>{tx.mode}</td>
                    <td>{tx.note}</td>
                    <td>
                      <button onClick={() => handleTxEdit(tx)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleTxDelete(tx.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
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
