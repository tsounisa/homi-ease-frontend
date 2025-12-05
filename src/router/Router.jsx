import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import LightingControlPage from '../pages/LightingControlPage';
import ManageDevicesPage from '../pages/ManageDevicesPage';
import AddHouseRoomPage from '../pages/AddHouseRoomPage';
import AutomationPage from '../pages/AutomationPage';
import ProtectedRoute from './ProtectedRoute'; // Import the guard component

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} /> {/* Added to match ProtectedRoute redirect */}

      {/* Protected Routes - Only accessible if token exists */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lighting" element={<LightingControlPage />} />
        <Route path="/manage-devices" element={<ManageDevicesPage />} />
        <Route path="/add-house-room" element={<AddHouseRoomPage />} />
        <Route path="/automations" element={<AutomationPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;