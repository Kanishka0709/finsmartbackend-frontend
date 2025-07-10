import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Investment from '../pages/Investment';
import StockPortfolio from '../pages/StockPortfolio';
import TaxProfile from '../pages/TaxProfile';

// Auth wrapper
import RequireAuth from '../components/RequireAuth';
import DashboardLayout from '../components/DashboardLayout';

function AppRoutes({ sidebarOpen, setSidebarOpen }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard Layout Routes */}
      <Route
        element={
          <RequireAuth>
            <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/investments" element={<Investment />} />
        <Route path="/stocks" element={<StockPortfolio />} />
        <Route path="/tax" element={<TaxProfile />} />
        {/* Add more dashboard-related routes here if needed */}
      </Route>
      </Routes>
  );
}

export default AppRoutes;
