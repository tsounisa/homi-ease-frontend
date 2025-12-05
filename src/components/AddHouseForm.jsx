import React, { useState } from 'react';
import { addHouse } from '../api/house';

const AddHouseForm = ({ onHouseAdded }) => {
  const [houseName, setHouseName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // STRICT SWAGGER ALIGNMENT:
      // Request Body: { name: string }
      // Response: House object ({ _id, name, userId })
      const newHouse = await addHouse({ name: houseName });
      
      setMessage(`House "${newHouse.name}" added successfully!`);
      setHouseName('');
      
      if (onHouseAdded) {
        onHouseAdded(newHouse);
      }
    } catch (err) {
      setError('Failed to add house. Please try again.');
      console.error('Error adding house:', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '20px 0' }}>
      <h3>Add New House</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>House Name:</label>
          <input
            type="text"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add House</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddHouseForm;