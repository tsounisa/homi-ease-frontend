import React, { useState, useEffect } from 'react';
import { addRoom } from '../api/room';
import { getHouses } from '../api/house'; 

const AddRoomForm = ({ onRoomAdded }) => {
  const [roomName, setRoomName] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const [houses, setHouses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await getHouses();
        
        // FIX: Handle API Envelope vs Raw Array
        let housesData = [];
        if (Array.isArray(response)) {
          housesData = response;
        } else if (response.data && Array.isArray(response.data)) {
          housesData = response.data;
        } else if (response.houses && Array.isArray(response.houses)) {
           housesData = response.houses;
        }

        setHouses(housesData);
        
        // Select first house by default if available
        if (housesData.length > 0) {
          setSelectedHouse(housesData[0]._id); 
        }
      } catch (err) {
        setError('Failed to fetch houses for room creation.');
        console.error('Error fetching houses:', err);
      }
    };
    fetchHouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!selectedHouse) {
      setError('Please select a house.');
      return;
    }
    try {
      const response = await addRoom(selectedHouse, { name: roomName });
      
      // Handle response wrapper if present
      const newRoom = response.data ? response.data : response;

      setMessage(`Room "${newRoom.name}" added successfully to the selected house!`);
      setRoomName('');
      if (onRoomAdded) {
        onRoomAdded(newRoom);
      }
    } catch (err) {
      setError('Failed to add room. Please try again.');
      console.error('Error adding room:', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '20px 0' }}>
      <h3>Add New Room</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select House:</label>
          <select onChange={(e) => setSelectedHouse(e.target.value)} value={selectedHouse} required>
            <option value="">--Select a House--</option>
            {houses.map((house) => (
              <option key={house._id} value={house._id}>
                {house.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Room</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddRoomForm;