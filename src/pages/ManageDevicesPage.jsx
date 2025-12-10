import React, { useState, useEffect, useCallback } from 'react';
import { getHouses } from '../api/house';
import { getRooms } from '../api/room';
import { getDevices, getAvailableDevices, addDevice, deleteDevice } from '../api/device';
import { useAuth } from '../context/AuthContext';

const ManageDevicesPage = () => {
  const { user } = useAuth();
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [availableDevices, setAvailableDevices] = useState([]);
  const [pairedDevices, setPairedDevices] = useState([]); // Devices already paired in the selected room
  const [selectedAvailableDevice, setSelectedAvailableDevice] = useState('');
  const [newDeviceName, setNewDeviceName] = useState(''); // For custom device if no available selected
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchHouses = useCallback(async () => {
    try {
      const data = await getHouses();
      setHouses(data);
      if (data.length > 0 && !selectedHouse) {
        setSelectedHouse(data[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch houses.');
      console.error(err);
    }
  }, [selectedHouse]);

  const fetchRooms = useCallback(async () => {
    if (selectedHouse) {
      try {
        const data = await getRooms(selectedHouse);
        setRooms(data);
        if (data.length > 0 && !selectedRoom) {
          setSelectedRoom(data[0]._id);
        } else if (data.length === 0) {
          setSelectedRoom('');
        }
      } catch (err) {
        setError('Failed to fetch rooms.');
        console.error(err);
      }
    } else {
      setRooms([]);
      setSelectedRoom('');
    }
  }, [selectedHouse, selectedRoom]);

  const fetchAvailableDevices = useCallback(async () => {
    try {
      const data = await getAvailableDevices();
      setAvailableDevices(data);
      if (data.length > 0) {
        setSelectedAvailableDevice(data[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch available devices.');
      console.error(err);
    }
  }, []);

  const fetchPairedDevices = useCallback(async () => {
    if (selectedRoom) {
      try {
        const data = await getDevices(selectedRoom);
        setPairedDevices(data);
      } catch (err) {
        setError('Failed to fetch paired devices for this room.');
        console.error(err);
      }
    } else {
      setPairedDevices([]);
    }
  }, [selectedRoom]);

  useEffect(() => {
    fetchHouses();
    fetchAvailableDevices();
  }, [fetchHouses, fetchAvailableDevices]);

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
      setError('Please select a room to add the device to.');
      return;
    }

    if (!user) {
      setError('You must be logged in to add a device.');
      return;
    }

    let deviceData = {};
    if (selectedAvailableDevice) {
      // Pairing an available device
      const deviceToPair = availableDevices.find(d => d._id === selectedAvailableDevice);
      if (!deviceToPair) {
        setError('Selected available device not found.');
        return;
      }
      deviceData = {
        availableDeviceId: deviceToPair._id,
        owner: user._id, // Pass owner for backend check
      };
    } else if (newDeviceName) {
      // Adding a custom device
      deviceData = {
        name: newDeviceName,
        type: 'custom', // Default type for custom devices
        category: 'other', // Default category
        status: { isOn: false },
      };
    } else {
      setError('Please select an available device or enter a custom device name.');
      return;
    }

    try {
      const addedDevice = await addDevice(selectedRoom, deviceData);
      setMessage(`Device "${addedDevice.name}" added successfully!`);
      setNewDeviceName('');
      setSelectedAvailableDevice(availableDevices.length > 0 ? availableDevices[0]._id : '');
      fetchPairedDevices(); // Refresh paired devices list
      fetchAvailableDevices(); // Refresh available devices list
    } catch (err) {
      setError('Failed to add device.');
      console.error(err);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    setMessage('');
    setError('');
    try {
      await deleteDevice(deviceId);
      setMessage('Device deleted successfully!');
      fetchPairedDevices(); // Refresh paired devices list
      fetchAvailableDevices(); // Refresh available devices list
    } catch (err) {
      setError('Failed to delete device.');
      console.error(err);
    }
  };

  return (
    <div className="manage-devices-page-container">
      <h2>Manage Devices</h2>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {/* Add Device Section */}
      <div className="add-form-container">
        <h3>Add New Device</h3>
        <form onSubmit={handleAddDevice}>
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

          <div>
            <label>Available Devices (for pairing):</label>
            <select
              onChange={(e) => setSelectedAvailableDevice(e.target.value)}
              value={selectedAvailableDevice}
            >
              <option value="">--Select an Available Device--</option>
              {availableDevices.map((device) => (
                <option key={device._id} value={device._id}>
                  {device.name} ({device.description})
                </option>
              ))}
            </select>
          </div>

          {/* Option to add a custom device if no available device is selected */}
          {!selectedAvailableDevice && (
            <div>
              <label>Or Enter Custom Device Name:</label>
              <input
                type="text"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                placeholder="e.g., My Custom Sensor"
              />
            </div>
          )}

          <button type="submit" disabled={!selectedRoom || (!selectedAvailableDevice && !newDeviceName)}>
            Add Device
          </button>
        </form>
      </div>

      {/* Delete Device Section */}
      <div className="add-form-container">
        <h3>Paired Devices in Selected Room ({rooms.find(r => r._id === selectedRoom)?.name || 'N/A'})</h3>
        {pairedDevices.length > 0 ? (
          <ul className="device-list">
            {pairedDevices.map((device) => (
              <li key={device._id}>
                <span>{device.name} ({device.type})</span>
                <button onClick={() => handleDeleteDevice(device._id)} className="delete-button">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No devices paired in this room.</p>
        )}
      </div>
    </div>
  );
};

export default ManageDevicesPage;
