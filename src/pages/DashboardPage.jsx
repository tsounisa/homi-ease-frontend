import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHouses } from '../api/house';
import { Link } from 'react-router-dom';
// Removed AddHouseForm and AddRoomForm imports

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState('');

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
    fetchHouses();
  }, [fetchHouses]);

  // Removed handleHouseAdded and handleRoomAdded as forms are moved

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header">
        <h2>Welcome, {user ? user.name : 'Guest'}!</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <h3>Your Houses</h3>
      {error && <p className="error-message">{error}</p>}
      {houses.length > 0 ? (
        <ul className="house-list">
          {houses.map((house) => (
            <li key={house._id}>{house.name}</li>
          ))}
        </ul>
      ) : (
        <p>No houses found. Add a new house to get started!</p>
      )}

      {/* Removed AddHouseForm and AddRoomForm */}

      <nav className="dashboard-nav">
        <Link to="/automations" className="dashboard-nav-button">Automations</Link>
        <Link to="/lighting" className="dashboard-nav-button">Lighting Control</Link>
        <Link to="/add-house-room" className="dashboard-nav-button">Add House/Room</Link>
        <Link to="/manage-devices" className="dashboard-nav-button">Manage Devices</Link> {/* New button */}
        {/* Add more navigation links as needed */}
      </nav>
    </div>
  );
};

export default DashboardPage;
