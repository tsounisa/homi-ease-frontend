import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import LightingControlPage from '../pages/LightingControlPage';
import ManageDevicesPage from '../pages/ManageDevicesPage';
import AddHouseRoomPage from '../pages/AddHouseRoomPage';
import AutomationPage from '../pages/AutomationPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/lighting" element={<LightingControlPage />} />
      <Route path="/manage-devices" element={<ManageDevicesPage />} />
      <Route path="/add-house-room" element={<AddHouseRoomPage />} />
      <Route path="/automations" element={<AutomationPage />} />
    </Routes>
  );
};

export default AppRouter;