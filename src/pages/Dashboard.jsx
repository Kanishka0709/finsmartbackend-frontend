import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const summaryCards = [
  {
    title: 'Total Balance',
    value: '₹2,45,000',
    desc: 'All accounts combined',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    title: 'Expense This Month',
    value: '₹12,000',
    desc: 'Spent so far',
    color: 'from-purple-500 to-indigo-400',
  },
  {
    title: 'Investment Growth',
    value: '+8.2%',
    desc: 'This year',
    color: 'from-green-400 to-emerald-400',
  },
  {
    title: 'Tax Profile',
    value: 'Active',
    desc: 'Up to date',
    color: 'from-yellow-400 to-orange-300',
  },
];

const transactions = [
  { id: 1, purpose: 'Grocery Shopping', date: '2024-06-01', amount: '-₹2,000', status: 'Done' },
  { id: 2, purpose: 'Salary Credited', date: '2024-06-01', amount: '+₹50,000', status: 'Done' },
  { id: 3, purpose: 'Stock Purchase', date: '2024-05-30', amount: '-₹5,000', status: 'Pending' },
  { id: 4, purpose: 'Tax Refund', date: '2024-05-28', amount: '+₹1,200', status: 'Failed' },
];

const chartData = [
  { month: 'Jan', Expenses: 12000, Investments: 8000 },
  { month: 'Feb', Expenses: 9000, Investments: 10000 },
  { month: 'Mar', Expenses: 15000, Investments: 12000 },
  { month: 'Apr', Expenses: 11000, Investments: 9000 },
  { month: 'May', Expenses: 13000, Investments: 14000 },
  { month: 'Jun', Expenses: 10000, Investments: 16000 },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="bg-gray-50 min-h-screen flex relative">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col">
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'pl-60' : 'pl-4'} pt-16 p-6 md:p-10 bg-gray-50`}>
          {/* Sidebar Toggle Button */}
          <button
            className="absolute top-6 left-4 z-50 bg-white border border-gray-200 shadow rounded-full p-2 flex items-center justify-center hover:bg-blue-100 transition md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
          {/* Welcome and Add Transaction */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-500">Welcome, [User Name]!</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-6 py-2 rounded-xl shadow hover:scale-105 transition">
              + Add Transaction
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card, idx) => (
              <div
                key={idx}
                className={`rounded-2xl shadow-lg p-6 text-white bg-gradient-to-br ${card.color} flex flex-col gap-2`}
              >
                <div className="text-lg font-semibold">{card.title}</div>
                <div className="text-3xl font-extrabold">{card.value}</div>
                <div className="text-xs opacity-80">{card.desc}</div>
              </div>
            ))}
          </div>

          {/* Chart and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expense Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 col-span-1 lg:col-span-2 flex flex-col">
              <div className="text-lg font-semibold text-blue-900 mb-2">Expense Trend (6 months)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Expenses" fill="#00C6FF" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Investments" fill="#43a047" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Latest Transactions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-lg font-semibold text-blue-900 mb-4">Latest Transactions</div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl">
                  <thead>
                    <tr className="bg-blue-50 text-blue-700">
                      <th className="py-2 px-4">Purpose</th>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Amount</th>
                      <th className="py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id} className="border-b hover:bg-blue-50">
                        <td className="py-2 px-4 font-semibold text-gray-800">{tx.purpose}</td>
                        <td className="py-2 px-4">{tx.date}</td>
                        <td className={`py-2 px-4 font-bold ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{tx.amount}</td>
                        <td className="py-2 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${tx.status === 'Done' ? 'bg-green-100 text-green-700' : tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
