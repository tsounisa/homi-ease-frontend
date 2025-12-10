import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import AutomationPage from '../pages/AutomationPage';
import LightingControlPage from '../pages/LightingControlPage';
import AddHouseRoomPage from '../pages/AddHouseRoomPage';
import ManageDevicesPage from '../pages/ManageDevicesPage'; // Import the new page
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/automations" element={<AutomationPage />} />
          <Route path="/lighting" element={<LightingControlPage />} />
          <Route path="/add-house-room" element={<AddHouseRoomPage />} />
          <Route path="/manage-devices" element={<ManageDevicesPage />} /> {/* New protected route */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
