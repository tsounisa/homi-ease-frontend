import React, { useState, useEffect, useCallback } from 'react';
import { getHouses } from '../api/house';
import { getRooms } from '../api/room';
import { getDevices, updateDevice } from '../api/device';

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
    } catch (err) {
      setError('Failed to fetch houses.');
      console.error(err);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    if (selectedHouse) {
      try {
        const response = await getRooms(selectedHouse);
        
        // FIX: Handle API Envelope vs Raw Array
        let roomsData = [];
        if (Array.isArray(response)) {
          roomsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          roomsData = response.data;
        }

        setRooms(roomsData);
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
        const response = await getDevices(selectedRoom);
        
        // FIX: Handle API Envelope vs Raw Array
        let devicesData = [];
        if (Array.isArray(response)) {
          devicesData = response;
        } else if (response.data && Array.isArray(response.data)) {
          devicesData = response.data;
        }

        // STRICT SWAGGER ALIGNMENT: 
        // Filter by 'light', not 'switch'. Check swagger "Device" enums.
        setLights(devicesData.filter(device => device.type === 'light'));
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

  const handleToggleLight = async (device) => {
    setMessage('');
    setError('');
    
    // STRICT SWAGGER ALIGNMENT:
    // Status is an object: { isOn: boolean, brightness: number }
    const currentIsOn = device.status?.isOn || false;
    const newStatus = { ...device.status, isOn: !currentIsOn };

    try {
      // Send updated object, not a string
      await updateDevice(device._id, { status: newStatus });
      
      setMessage(`Light turned ${!currentIsOn ? 'ON' : 'OFF'} successfully!`);
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
            // STRICT SWAGGER ALIGNMENT: Use _id
            <option key={house._id} value={house._id}>
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
              <option key={room._id} value={room._id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedRoom && lights.length > 0 && (
        <div className="lights-grid">
          <h3>Lights in {rooms.find(r => r._id === selectedRoom)?.name}</h3>
          {lights.map((light) => {
            const isOn = light.status?.isOn || false;
            return (
              <div key={light._id} className="device-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>{light.name}</h4>
                <p>Status: <strong>{isOn ? 'ON' : 'OFF'}</strong></p>
                
                <button 
                  onClick={() => handleToggleLight(light)}
                  style={{ backgroundColor: isOn ? '#ffcc00' : '#ccc' }}
                >
                  Turn {isOn ? 'OFF' : 'ON'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedRoom && lights.length === 0 && <p>No smart lights found in this room.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default LightingControlPage;