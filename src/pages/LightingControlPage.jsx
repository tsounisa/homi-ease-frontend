import React, { useState, useEffect, useCallback } from 'react';
import { getHouses } from '../api/house';
import { getRooms } from '../api/room';
import { getDevices, controlDevice } from '../api/device';

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
        setSelectedRoom(''); // Reset room selection when house changes
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
        console.log('Fetched lights data:', data); // Add this line for debugging
        // Assuming 'light' is a type of device
        setLights(data.filter(device => device.type === 'light'));
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

  const handleToggleLight = async (deviceId, currentIsOn) => {
    setMessage('');
    setError('');
    try {
      const action = currentIsOn ? { isOn: false } : { isOn: true };
      await controlDevice(deviceId, action);
      setMessage(`Light ${action.isOn ? 'turned on' : 'turned off'} successfully!`);
      fetchLights(); // Re-fetch lights to update status
    } catch (err) {
      setError('Failed to control light.');
      console.error(err);
    }
  };

  const handleChangeBrightness = async (deviceId, brightness) => {
    setMessage('');
    setError('');
    try {
      await controlDevice(deviceId, { brightness: parseInt(brightness) });
      setMessage(`Light brightness set to ${brightness}% successfully!`);
      fetchLights(); // Re-fetch lights to update status
    } catch (err) {
      setError('Failed to change brightness.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Lighting Control</h2>

      <div>
        <label>Select House:</label>
        <select onChange={(e) => setSelectedHouse(e.target.value)} value={selectedHouse}>
          <option value="">--Select a House--</option>
          {houses.map((house) => (
            <option key={house._id} value={house._id}>
              {house.name}
            </option>
          ))}
        </select>
      </div>

      {selectedHouse && (
        <div>
          <label>Select Room:</label>
          <select onChange={(e) => setSelectedRoom(e.target.value)} value={selectedRoom}>
            <option value="">--Select a Room--</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedRoom && lights.length > 0 && (
        <div>
          <h3>Lights in {rooms.find(r => r._id === selectedRoom)?.name}</h3>
          {lights.map((light) => (
            <div key={light._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h4>{light.name}</h4>
              <p>Status: {light.status.isOn ? 'On' : 'Off'}</p>
              {light.status.brightness !== undefined && (
                <p>Brightness: {light.status.brightness}%</p>
              )}
              <button onClick={() => handleToggleLight(light._id, light.status.isOn)}>
                Turn {light.status.isOn ? 'Off' : 'On'}
              </button>
              <div>
                <label>Brightness:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={light.status.brightness || 0} // Corrected to light.status.brightness
                  onChange={(e) => handleChangeBrightness(light._id, e.target.value)}
                />
                <span>{light.status.brightness || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoom && lights.length === 0 && <p>No lights found in this room.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default LightingControlPage;
