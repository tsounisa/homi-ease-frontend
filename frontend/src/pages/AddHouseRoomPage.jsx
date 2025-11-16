import React from 'react';
import AddHouseForm from '../components/AddHouseForm';
import AddRoomForm from '../components/AddRoomForm';
import { useNavigate } from 'react-router-dom';

const AddHouseRoomPage = () => {
  const navigate = useNavigate();

  const handleHouseAdded = () => {
    // Optionally navigate back to dashboard or show a success message
    navigate('/dashboard');
  };

  const handleRoomAdded = () => {
    // Optionally navigate back to dashboard or show a success message
    navigate('/dashboard');
  };

  return (
    <div className="add-house-room-page-container">
      <h2>Add New House or Room</h2>
      <div className="add-form-container">
        <AddHouseForm onHouseAdded={handleHouseAdded} />
      </div>
      <div className="add-form-container">
        <AddRoomForm onRoomAdded={handleRoomAdded} />
      </div>
    </div>
  );
};

export default AddHouseRoomPage;
