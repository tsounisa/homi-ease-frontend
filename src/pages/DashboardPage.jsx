import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHouses } from '../api/house';
import { Link, useNavigate } from 'react-router-dom'; // <-- Import useNavigate

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // <-- Hook for navigation
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState('');

  // --- 1. SAFETY CHECK: Redirect if not logged in ---
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchHouses = useCallback(async () => {
    try {
      const data = await getHouses();
      setHouses(data);
    } catch (err) {
      setError('Failed to fetch houses.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user) { // Fetch only if user exists
      fetchHouses();
    }
  }, [fetchHouses, user]);

  // --- 2. LOGOUT HANDLER ---
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect explicitly to Login page
  };

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header">
        {/* Αν για κάποιο λόγο το user είναι null στιγμιαία πριν το redirect, δεν δείχνουμε Guest */}
        <h2>Welcome, {user?.name}!</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <h3>Your Houses</h3>
      {error && <p className="error-message">{error}</p>}
      {houses.length > 0 ? (
        <ul className="house-list">
          {houses.map((house) => (
            <li key={house._id || house.id}>{house.name}</li>
          ))}
        </ul>
      ) : (
        <p>No houses found. Add a new house to get started!</p>
      )}

      <nav className="dashboard-nav">
        <Link to="/automations" className="dashboard-nav-button">Automations</Link>
        <Link to="/lighting" className="dashboard-nav-button">Lighting Control</Link>
        <Link to="/add-house-room" className="dashboard-nav-button">Add House/Room</Link>
        <Link to="/manage-devices" className="dashboard-nav-button">Manage Devices</Link>
      </nav>
    </div>
  );
};

export default DashboardPage;