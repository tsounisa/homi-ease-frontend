import React, { useState, useEffect, useCallback } from 'react';
import { getHouses } from '../api/house';
import { getRooms } from '../api/room';
import { getDevices, addDevice, deleteDevice } from '../api/device'; 

const ManageDevicesPage = () => {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [pairedDevices, setPairedDevices] = useState([]);
  
  // Form State
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('light'); 
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchHouses = useCallback(async () => {
    try {
      const response = await getHouses();
      
      // --- FIX START: Handle API Envelope Structure ---
      let housesData = [];
      if (Array.isArray(response)) {
        housesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        housesData = response.data;
      } else if (response.houses && Array.isArray(response.houses)) {
         housesData = response.houses;
      }
      // --- FIX END ---

      setHouses(housesData);

      if (housesData.length > 0 && !selectedHouse) {
        setSelectedHouse(housesData[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch houses.');
      console.error(err);
    }
  }, [selectedHouse]);

  const fetchRooms = useCallback(async () => {
    if (selectedHouse) {
      try {
        const response = await getRooms(selectedHouse);
        
        // --- FIX: Apply same check for Rooms just in case ---
        let roomsData = [];
        if (Array.isArray(response)) {
            roomsData = response;
        } else if (response.data && Array.isArray(response.data)) {
            roomsData = response.data;
        }
        
        setRooms(roomsData);
        
        if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]._id);
        } else {
          setSelectedRoom('');
        }
      } catch (err) {
        setError('Failed to fetch rooms.');
      }
    } else {
      setRooms([]);
      setSelectedRoom('');
    }
  }, [selectedHouse]);

  const fetchPairedDevices = useCallback(async () => {
    if (selectedRoom) {
      try {
        const response = await getDevices(selectedRoom);
        
        // --- FIX: Apply same check for Devices ---
        let devicesData = [];
         if (Array.isArray(response)) {
            devicesData = response;
        } else if (response.data && Array.isArray(response.data)) {
            devicesData = response.data;
        }

        setPairedDevices(devicesData);
      } catch (err) {
        setError('Failed to fetch devices.');
      }
    } else {
      setPairedDevices([]);
    }
  }, [selectedRoom]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchPairedDevices();
  }, [fetchPairedDevices]);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedRoom) {
      setError('Please select a room first.');
      return;
    }

    let initialStatus;
    switch (deviceType) {
      case 'light':
        initialStatus = { isOn: false, brightness: 100 };
        break;
      case 'thermostat':
        initialStatus = { temperature: 22, mode: 'cool' }; 
        break;
      case 'security':
        initialStatus = { isArmed: true, isTriggered: false };
        break;
      case 'media':
        initialStatus = { isPlaying: false, volume: 30 };
        break;
      default:
        initialStatus = { isOn: false };
    }

    const deviceData = {
      name: deviceName,
      type: deviceType,
      status: initialStatus 
    };

    try {
      const response = await addDevice(selectedRoom, deviceData);
      
      // Handle response wrapper for the newly created device
      const addedDevice = response.data ? response.data : response;

      setMessage(`Device "${addedDevice.name}" added successfully!`);
      setDeviceName('');
      fetchPairedDevices(); 
    } catch (err) {
      setError('Failed to add device.');
      console.error(err);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    setMessage('');
    setError('');
    try {
      await deleteDevice(deviceId);
      setMessage('Device deleted successfully!');
      fetchPairedDevices();
    } catch (err) {
      setError('Failed to delete device.');
    }
  };

  const renderStatus = (status) => {
    if (typeof status === 'object' && status !== null) {
      return Object.entries(status)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ');
    }
    return JSON.stringify(status);
  };

  return (
    <div className="page-container">
      <h2>Manage Devices</h2>

      {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
      {message && <p className="success-message" style={{color: 'green'}}>{message}</p>}

      <div className="add-form-container" style={{ marginBottom: '2rem' }}>
        <h3>Add New Device</h3>
        <form onSubmit={handleAddDevice}>
          <div style={{ marginBottom: '10px' }}>
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

          <div style={{ marginBottom: '10px' }}>
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

          <div style={{ marginBottom: '10px' }}>
            <label>Device Name:</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. Living Room Lamp"
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Device Type:</label>
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
              <option value="light">Light</option>
              <option value="thermostat">Thermostat</option>
              <option value="security">Security (Sensor/Lock)</option>
              <option value="media">Media</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={!selectedRoom || !deviceName}>
            Add Device
          </button>
        </form>
      </div>

      <div className="list-container">
        <h3>Devices in Selected Room</h3>
        {pairedDevices.length > 0 ? (
          <ul className="device-list">
            {pairedDevices.map((device) => (
              <li key={device._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', padding: '10px', border: '1px solid #eee' }}>
                <span>
                    <strong>{device.name}</strong> ({device.type}) - {renderStatus(device.status)}
                </span>
                <button onClick={() => handleDeleteDevice(device._id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No devices found in this room.</p>
        )}
      </div>
    </div>
  );
};

export default ManageDevicesPage;