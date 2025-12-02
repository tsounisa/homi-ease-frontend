import React, { useState, useEffect, useCallback } from 'react';
import { getHouses } from '../api/house';
import { getRooms } from '../api/room';
import { getDevices, updateDevice } from '../api/device'; // <-- FIX: Import updateDevice

const LightingControlPage = () => {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [lights, setLights] = useState([]);
  const [message, setMessage] = useState('');
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

  const fetchRooms = useCallback(async () => {
    if (selectedHouse) {
      try {
        const data = await getRooms(selectedHouse);
        setRooms(data);
        setSelectedRoom('');
      } catch (err) {
        setError('Failed to fetch rooms.');
        console.error(err);
      }
    } else {
      setRooms([]);
    }
  }, [selectedHouse]);

  const fetchLights = useCallback(async () => {
    if (selectedRoom) {
      try {
        const data = await getDevices(selectedRoom);
        // Φιλτράρουμε μόνο τα switches για τον έλεγχο φωτισμού
        setLights(data.filter(device => device.type === 'switch'));
      } catch (err) {
        setError('Failed to fetch lights.');
        console.error(err);
      }
    } else {
      setLights([]);
    }
  }, [selectedRoom]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchLights();
  }, [fetchLights]);

  const handleToggleLight = async (deviceId, currentStatus) => {
    setMessage('');
    setError('');
    try {
      // FIX: Το Backend περιμένει string 'ON' ή 'OFF'
      const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
      await updateDevice(deviceId, { status: newStatus });
      
      setMessage(`Light turned ${newStatus} successfully!`);
      fetchLights(); 
    } catch (err) {
      setError('Failed to control light.');
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h2>Lighting Control</h2>

      <div className="form-group">
        <label>Select House:</label>
        <select onChange={(e) => setSelectedHouse(e.target.value)} value={selectedHouse}>
          <option value="">--Select a House--</option>
          {houses.map((house) => (
            <option key={house.id || house._id} value={house.id || house._id}>
              {house.name}
            </option>
          ))}
        </select>
      </div>

      {selectedHouse && (
        <div className="form-group">
          <label>Select Room:</label>
          <select onChange={(e) => setSelectedRoom(e.target.value)} value={selectedRoom}>
            <option value="">--Select a Room--</option>
            {rooms.map((room) => (
              <option key={room.id || room._id} value={room.id || room._id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedRoom && lights.length > 0 && (
        <div className="lights-grid">
          <h3>Lights in {rooms.find(r => (r.id || r._id) === selectedRoom)?.name}</h3>
          {lights.map((light) => (
            <div key={light.id || light._id} className="device-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h4>{light.name}</h4>
              <p>Status: <strong>{light.status}</strong></p>
              
              <button onClick={() => handleToggleLight(light.id || light._id, light.status)}>
                Turn {light.status === 'ON' ? 'OFF' : 'ON'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRoom && lights.length === 0 && <p>No smart switches found in this room.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default LightingControlPage;