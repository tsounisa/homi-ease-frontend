import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHouses } from '../api/house';
import { Link, useNavigate } from 'react-router-dom'; 

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState('');

  // 1. REMOVE the "useEffect navigate('/')" block. 
  // ProtectedRoute ensures we are logged in. 
  // If user is null here, it just means we are "fetching profile".

  const fetchHouses = useCallback(async () => {
    try {
      const data = await getHouses();
      setHouses(data || []); // Safety net in case API returns null
    } catch (err) {
      setError('Failed to fetch houses.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    // Only fetch houses once we know WHO the user is
    if (user) { 
      fetchHouses();
    }
  }, [fetchHouses, user]);

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  // 2. Add a Loading State
  // If we passed ProtectedRoute, but user is null, we are just waiting for data.
  if (!user) {
    return <div className="loading">Loading User Profile...</div>;
  }

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.name}!</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <h3>Your Houses</h3>
      {error && <p className="error-message">{error}</p>}
      
      {/* 3. Check length safely */}
      {/* Added data-cy="house-list" for E2E testing */}
      <div data-cy="house-list">
        {houses && houses.length > 0 ? (
          <ul className="house-list">
            {houses.map((house) => (
              <li key={house._id || house.id}>
                {/* Add a link to view rooms inside this house */}
                <Link to={`/house/${house._id || house.id}`}>{house.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No houses found. Add a new house to get started!</p>
        )}
      </div>

      <nav className="dashboard-nav">
        <Link to="/automations" className="dashboard-nav-button">Automations</Link>
        <Link to="/lighting" className="dashboard-nav-button">Lighting Control</Link>
        
        {/* CRITICAL UPDATE: Added data-cy="add-house-button" here */}
        <Link 
            to="/add-house-room" 
            className="dashboard-nav-button"
            data-cy="add-house-button"
        >
            Add House/Room
        </Link>
        
        <Link to="/manage-devices" className="dashboard-nav-button">Manage Devices</Link>
      </nav>
    </div>
  );
};

export default DashboardPage;