  import React, { useEffect, useState } from 'react';
import './TaxProfile.css';
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from 'recharts';

const sampleTaxData = [
{ id: 1, type: 'Rent', amount: 12000, month: 'Jan' },
{ id: 2, type: 'Rent', amount: 12000, month: 'Feb' },
{ id: 3, type: 'Tax', amount: 5000, month: 'Jan' },
{ id: 4, type: 'Tax', amount: 5200, month: 'Feb' },
{ id: 5, type: 'Tax', amount: 4800, month: 'Mar' },
{ id: 6, type: 'Rent', amount: 12000, month: 'Mar' },
];

function TaxProfile() {
const [records, setRecords] = useState([]);

useEffect(() => {
setRecords(sampleTaxData);
}, []);

const summaryData = records.reduce((acc, curr) => {
const found = acc.find(item => item.type === curr.type);
if (found) {
found.amount += curr.amount;
} else {
acc.push({ type: curr.type, amount: curr.amount });
}
return acc;
}, []);

return (
<div className="taxprofile-container">
<h2 className="text-center mb-4">🏠 Tax & Rent Summary</h2>
  {/* Table */}
  <table className="table table-striped table-bordered">
    <thead className="table-dark">
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Amount (₹)</th>
        <th>Month</th>
      </tr>
    </thead>
    <tbody>
      {records.map(entry => (
        <tr key={entry.id}>
          <td>{entry.id}</td>
          <td>{entry.type}</td>
          <td>₹{entry.amount}</td>
          <td>{entry.month}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Bar Chart */}
  <h4 className="mt-5">Total Amount by Type</h4>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={summaryData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="type" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" fill="#34a853" />
    </BarChart>
  </ResponsiveContainer>
</div>

);
}

export default TaxProfile;