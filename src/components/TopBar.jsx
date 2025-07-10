import React from 'react';
import '../styles/TopBarCustom.css';

export default function TopBar() {
  return (
    <header className="finsmart-topbar">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, Alex!</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-100 rounded-full px-5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 w-56"
        />
        <button className="topbar-btn">+ Add Transaction</button>
        <div className="flex items-center gap-2">
          {/* Removed avatar image */}
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold ml-1">Premium Member</span>
        </div>
      </div>
    </header>
  );
} 