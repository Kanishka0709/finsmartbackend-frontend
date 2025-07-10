import React, { useEffect, useState } from 'react';
import '../pages/Expenses.css';
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
PieChart,
Pie,
Cell,
} from 'recharts';

const sampleExpenses = [
{ id: 1, category: 'Food', amount: 1200, description: 'Groceries', expenseDate: '2024-07-01' },
{ id: 2, category: 'Transport', amount: 500, description: 'Bus pass', expenseDate: '2024-07-03' },
{ id: 3, category: 'Rent', amount: 10000, description: 'Monthly rent', expenseDate: '2024-07-05' },
{ id: 4, category: 'Utilities', amount: 2200, description: 'Electricity bill', expenseDate: '2024-07-07' },
{ id: 5, category: 'Entertainment', amount: 1500, description: 'Movie & snacks', expenseDate: '2024-07-08' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

function Expense() {
const [expenses, setExpenses] = useState([]);

useEffect(() => {
setExpenses(sampleExpenses);
}, []);

const categoryData = expenses.reduce((acc, curr) => {
const found = acc.find(item => item.category === curr.category);
if (found) {
found.amount += curr.amount;
} else {
acc.push({ category: curr.category, amount: curr.amount });
}
return acc;
}, []);

return (
<div className="expense-container">
<h2 className="text-center mb-4">💸 Expense Tracker Overview</h2>

  {/* Table */}
  <table className="table table-bordered table-hover">
    <thead className="table-dark">
      <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Description</th>
        <th>Amount (₹)</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {expenses.map(exp => (
        <tr key={exp.id}>
          <td>{exp.id}</td>
          <td>{exp.category}</td>
          <td>{exp.description}</td>
          <td>₹{exp.amount}</td>
          <td>{exp.expenseDate}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Bar Chart */}
  <h4 className="mt-5">Expenses by Category (Bar Chart)</h4>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={categoryData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>

  {/* Pie Chart */}
  <h4 className="mt-5">Expenses by Category (Pie Chart)</h4>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={categoryData}
        dataKey="amount"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {categoryData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>
);
}

export default Expense;
