import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FaDollarSign, FaPiggyBank, FaWallet } from 'react-icons/fa';
import './Expenses.css';
import { getAllExpenses, addExpense, deleteExpense, updateExpense, getExpensesByMonth } from '../api/expenseApi';
import { getIncome, setOrUpdateIncome } from '../api/incomeApi';
import { useNavigate } from 'react-router-dom';

// Mock data
const summaryCards = [
  { label: 'Total Income', value: '$45,000', change: '+6%', sub: 'vs last 30 days', icon: <FaDollarSign size={28} color="#00b894" />, color: '#eafaf1' },
  { label: 'Total Expense', value: '$27,450', change: '+2%', sub: 'vs last 30 days', icon: <FaWallet size={28} color="#00b894" />, color: '#e3f4fd' },
  { label: 'Total Savings', value: '$17,550', change: '-1%', sub: 'vs last 30 days', icon: <FaPiggyBank size={28} color="#00b894" />, color: '#f3f8fa' },
];

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ amount: '', category: '', description: '', expenseDate: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', category: '', description: '', expenseDate: '' });
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filtering, setFiltering] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState(null);
  const [income, setIncome] = useState(null);
  const [incomeInput, setIncomeInput] = useState('');
  const [incomeSuccess, setIncomeSuccess] = useState('');
  const [incomeError, setIncomeError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const fetchExpenses = () => {
    setLoading(true);
    setError('');
    getAllExpenses()
      .then(res => {
        setExpenses(Array.isArray(res.data) ? res.data : []);
        setFilteredExpenses(null); // Reset filter on full fetch
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch expenses.');
        setExpenses([]);
        setFilteredExpenses(null);
        setLoading(false);
      });
  };

  const fetchIncome = () => {
    getIncome()
      .then(res => {
        setIncome(res.data);
        setIncomeInput(res.data ? res.data.amount : '');
      })
      .catch(() => {
        setIncome(null);
        setIncomeInput('');
      });
  };

  useEffect(() => {
    if (!user) {
      setError('User not logged in. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchExpenses();
    fetchIncome();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.amount || !form.category || !form.expenseDate) {
      setError('Amount, category, and date are required.');
      return;
    }
    const expensePayload = {
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      expenseDate: form.expenseDate
      // userId: userId // REMOVED, backend uses session user
    };
    console.log('Submitting expense:', expensePayload);
    addExpense(expensePayload)
      .then(() => {
        setSuccess('Expense added successfully.');
        setForm({ amount: '', category: '', description: '', expenseDate: '' });
        setFilteredExpenses(null); // Clear filter so new expense is visible
        setFilterMonth('');
        setFilterYear('');
        fetchExpenses();
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Session expired. Please log in again.');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setError('Failed to add expense.');
        }
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this expense?')) return;
    deleteExpense(id)
      .then(() => {
        setSuccess('Expense deleted.');
        fetchExpenses();
      })
      .catch(() => setError('Failed to delete expense.'));
  };

  const handleEditClick = (exp) => {
    setEditId(exp.id);
    setEditForm({
      amount: exp.amount ?? '',
      category: exp.category ?? '',
      description: exp.description ?? '',
      expenseDate: exp.expenseDate?.slice(0, 10) ?? ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = (id) => {
    updateExpense(id, {
      amount: parseFloat(editForm.amount),
      category: editForm.category,
      description: editForm.description,
      expenseDate: editForm.expenseDate
    })
      .then(() => {
        setSuccess('Expense updated.');
        setEditId(null);
        fetchExpenses();
      })
      .catch(() => setError('Failed to update expense.'));
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    if (!filterMonth || !filterYear) {
      setError('Select both month and year to filter.');
      return;
    }
    setFiltering(true);
    setError(''); setSuccess('');
    getExpensesByMonth(filterMonth, filterYear)
      .then(res => {
        setFilteredExpenses(Array.isArray(res.data) ? res.data : []);
        setFiltering(false);
      })
      .catch(() => {
        setError('Failed to filter expenses.');
        setFilteredExpenses([]);
        setFiltering(false);
      });
  };

  const handleClearFilter = () => {
    setFilterMonth('');
    setFilterYear('');
    setFilteredExpenses(null);
    fetchExpenses();
  };

  const handleIncomeInputChange = (e) => {
    setIncomeInput(e.target.value);
  };

  const handleSetIncome = (e) => {
    e.preventDefault();
    setIncomeError(''); setIncomeSuccess('');
    if (!incomeInput || isNaN(incomeInput)) {
      setIncomeError('Please enter a valid income amount.');
      return;
    }
    setOrUpdateIncome(parseFloat(incomeInput))
      .then(res => {
        setIncome(res.data);
        setIncomeSuccess('Income saved successfully.');
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setIncomeError('Session expired. Please log in again.');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setIncomeError('Failed to save income.');
        }
      });
  };

  // Use filteredExpenses if present, otherwise all expenses
  const displayExpenses = filteredExpenses !== null ? filteredExpenses : expenses;

  // Helper to safely format numbers
  const safeLocale = (val) => Number(val || 0).toLocaleString();

  // Helper to format numbers as Indian Rupees
  const formatINR = (value) =>
    value != null
      ? value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
      : '₹0.00';

  const totalIncome = income && typeof income.amount === 'number' ? income.amount : 0;
  const totalExpense = displayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = totalIncome - totalExpense;

  const summaryCards = [
    { label: 'Total Income', value: formatINR(totalIncome), icon: null, color: '#eafaf1' },
    { label: 'Total Expense', value: formatINR(totalExpense), icon: <FaWallet size={28} color="#00b894" />, color: '#e3f4fd' },
    { label: 'Total Savings', value: formatINR(totalSavings), icon: <FaPiggyBank size={28} color="#00b894" />, color: '#f3f8fa' },
  ];

  const barData = displayExpenses.slice(0, 5).map(e => ({ name: e.category, value: e.amount }));
  const pieData = [
    { name: 'Spent', value: totalExpense, color: '#1976d2' },
    { name: 'Saved', value: totalSavings > 0 ? totalSavings : 0, color: '#00b894' }
  ];
  const lineData = displayExpenses.map(e => ({ date: e.expenseDate, value: e.amount }));
  const pieColors = pieData.map(d => d.color);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px 0' }}>
      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 24, padding: '0 24px' }}>
        {summaryCards.map((card, idx) => (
          <div key={card.label} style={{ background: card.color, borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>{card.icon}<span style={{ fontWeight: 700, fontSize: 16 }}>{card.label}</span></div>
            <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{card.value}</div>
            {/* Removed the 'vs last 30 days' line */}
          </div>
        ))}
      </div>
      {/* Middle Section: Bar, Pie, and Line Charts */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Bar Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Top 5 Expense Source</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00b894" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Report Overview</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Line Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Expense Activity</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#00b894" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Add Expense Form */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, margin: '0 24px 24px 24px' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Add Expense</h2>
        <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount ?? ''} onChange={handleInputChange} style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 90 }} required />
          <input name="category" type="text" placeholder="Category" value={form.category ?? ''} onChange={handleInputChange} style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} required />
          <input name="description" type="text" placeholder="Description" value={form.description ?? ''} onChange={handleInputChange} style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 140 }} />
          <input name="expenseDate" type="date" value={form.expenseDate ?? ''} onChange={handleInputChange} style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc' }} required />
          <button type="submit" style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </form>
      </div>
      {/* Set Income Form */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, margin: '0 24px 24px 24px' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Set Your Income</h2>
        <form onSubmit={handleSetIncome} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="income" type="number" step="0.01" placeholder="Enter your income" value={incomeInput} onChange={handleIncomeInputChange} style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} required />
          <button type="submit" style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Save</button>
        </form>
        {incomeSuccess && <div style={{ color: '#00b894', marginTop: 8 }}>{incomeSuccess}</div>}
        {incomeError && <div style={{ color: 'red', marginTop: 8 }}>{incomeError}</div>}
      </div>
      {/* Filter Controls */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, margin: '0 24px 24px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <form onSubmit={handleFilter} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label>Filter by Month/Year:</label>
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc' }}>
            <option value="">Month</option>
            {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc' }}>
            <option value="">Year</option>
            {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}>Filter</button>
          <button type="button" onClick={handleClearFilter} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}>Clear</button>
        </form>
        {filtering && <span>Filtering...</span>}
      </div>
      {/* Expenses Table */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, margin: '0 24px' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>All Expenses</h2>
        {success && <div style={{ color: '#00b894', marginBottom: 8 }}>{success}</div>}
        {error && <div style={{ color: '#d63031', marginBottom: 8 }}>{error}</div>}
        {loading ? (
          <div>Loading expenses...</div>
        ) : displayExpenses.length === 0 ? (
          <div>No expenses found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f8fa' }}>
                <th style={{ padding: 8, textAlign: 'left' }}>Amount</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Category</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Description</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Date</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Created At</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayExpenses.map(exp => {
                console.log('editId:', editId, 'exp.id:', exp.id);
                return (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #e3eafc' }}>
                    {editId === exp.id ? (
                      <>
                        <td style={{ padding: 8 }}><input name="amount" type="number" value={editForm.amount ?? ''} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                        <td style={{ padding: 8 }}><input name="category" type="text" value={editForm.category ?? ''} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                        <td style={{ padding: 8 }}><input name="description" type="text" value={editForm.description ?? ''} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 120 }} /></td>
                        <td style={{ padding: 8 }}><input name="expenseDate" type="date" value={editForm.expenseDate ?? ''} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc' }} /></td>
                        <td style={{ padding: 8 }}>{exp.createdAt}</td>
                        <td style={{ padding: 8 }}>
                          <button onClick={() => exp.id && handleEditSave(exp.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                          <button onClick={handleEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: 8 }}>{exp.amount}</td>
                        <td style={{ padding: 8 }}>{exp.category}</td>
                        <td style={{ padding: 8 }}>{exp.description}</td>
                        <td style={{ padding: 8 }}>{exp.expenseDate}</td>
                        <td style={{ padding: 8 }}>{exp.createdAt}</td>
                        <td style={{ padding: 8 }}>
                          <button onClick={() => handleEditClick(exp)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                          <button onClick={() => exp.id && handleDelete(exp.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
