import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/SidebarCustom.css';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/expenses', icon: '💸', label: 'Expenses' },
  { to: '/investments', icon: '📈', label: 'Investments' },
  { to: '/stocks', icon: '📊', label: 'Stocks' },
  { to: '/tax', icon: '🧾', label: 'Tax Profile' },
  { to: '/reports', icon: '📑', label: 'Reports' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
  { to: '/help', icon: '❓', label: 'Help' },
];

export default function Sidebar({ open = true }) {
  const location = useLocation();
  return (
    <aside
      className={`finsmart-sidebar transition-transform duration-300 z-40
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      <div>
        <div className="flex items-center gap-3 mb-8 px-4">
          {/* Removed logo image */}
          <span className="font-bold text-lg text-white tracking-wide">Finsmart</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link${location.pathname === item.to ? ' active' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer flex flex-col gap-2 items-center px-4 mt-8">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">A</span>
          <span className="text-gray-100 font-semibold">Alex</span>
        </div>
        <Link to="/logout" className="text-red-400 text-sm mt-2 hover:underline">Sign Out</Link>
      </div>
    </aside>
  );
} 