import React, { useState, useEffect } from 'react';
import { addRoom } from '../api/room';
import { getHouses } from '../api/house'; // To fetch houses for selection

const AddRoomForm = ({ onRoomAdded }) => {
  const [roomName, setRoomName] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const [houses, setHouses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const data = await getHouses();
        setHouses(data);
        if (data.length > 0) {
          setSelectedHouse(data[0]._id); // Select the first house by default
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
      const newRoom = await addRoom(selectedHouse, { name: roomName });
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
