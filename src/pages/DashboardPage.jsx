import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHouses } from '../api/house';
import { Link, useNavigate } from 'react-router-dom'; 

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState('');

  const fetchHouses = useCallback(async () => {
    try {
      const response = await getHouses();
      
      console.log('Get Houses Response:', response); // Debugging

      // FIX: Handle both Raw Array (Swagger) and Envelope (Actual API) patterns
      let housesData = [];
      
      if (Array.isArray(response)) {
        // Case 1: API returns [ ... ]
        housesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Case 2: API returns { success: true, data: [ ... ] }
        housesData = response.data;
      } else if (response.houses && Array.isArray(response.houses)) {
         // Case 3: Fallback for some backends { houses: [ ... ] }
         housesData = response.houses;
      }

      setHouses(housesData); 
    } catch (err) {
      setError('Failed to fetch houses.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user) { 
      fetchHouses();
    }
  }, [fetchHouses, user]);

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

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
      
      <div>
        {houses && houses.length > 0 ? (
          <ul className="house-list">
            {houses.map((house) => (
              <li key={house._id}>
                <Link to={`/houses/${house._id}`}>{house.name}</Link>
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
        <Link to="/add-house-room" className="dashboard-nav-button">Add House/Room</Link>
        <Link to="/manage-devices" className="dashboard-nav-button">Manage Devices</Link>
      </nav>
    </div>
  );
};

export default DashboardPage;