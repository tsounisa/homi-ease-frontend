import React, { useState, useEffect, useCallback } from 'react';
import { getHouses } from '../api/house';
import { getRooms } from '../api/room';
import { getDevices, addDevice, deleteDevice } from '../api/device'; // <-- FIX: Removed getAvailableDevices

const ManageDevicesPage = () => {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [pairedDevices, setPairedDevices] = useState([]);
  
  // Form State
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('switch'); // Default type
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchHouses = useCallback(async () => {
    try {
      const data = await getHouses();
      setHouses(data);
      if (data.length > 0 && !selectedHouse) {
        setSelectedHouse(data[0].id || data[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch houses.');
    }
  }, [selectedHouse]);

  const fetchRooms = useCallback(async () => {
    if (selectedHouse) {
      try {
        const data = await getRooms(selectedHouse);
        setRooms(data);
        if (data.length > 0) {
          setSelectedRoom(data[0].id || data[0]._id);
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
        const data = await getDevices(selectedRoom);
        setPairedDevices(data);
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

    const deviceData = {
      name: deviceName,
      type: deviceType,
      status: 'OFF' // Default status for new devices
    };

    try {
      const addedDevice = await addDevice(selectedRoom, deviceData);
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
                <option key={house.id || house._id} value={house.id || house._id}>
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
                <option key={room.id || room._id} value={room.id || room._id}>
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
              <option value="switch">Switch (Light/Plug)</option>
              <option value="sensor">Sensor</option>
              <option value="thermostat">Thermostat</option>
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
              <li key={device.id || device._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', padding: '10px', border: '1px solid #eee' }}>
                <span><strong>{device.name}</strong> ({device.type}) - Status: {device.status}</span>
                <button onClick={() => handleDeleteDevice(device.id || device._id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>
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