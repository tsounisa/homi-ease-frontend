import React, { useState } from 'react';
import { createAutomation } from '../api/automation';

const AutomationPage = () => {
  const [ruleName, setRuleName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const newAutomation = await createAutomation({
        name: ruleName,
        trigger,
        action,
        deviceId,
      });
      setMessage(`Automation "${newAutomation.name}" created successfully!`);
      setRuleName('');
      setTrigger('');
      setAction('');
      setDeviceId('');
    } catch (err) {
      setError('Failed to create automation. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create New Automation Rule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rule Name:</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Trigger (e.g., "time:08:00", "device:on"):</label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Action (e.g., "turnOn", "turnOff", "setBrightness:50"):</label>
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Device ID:</label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            required
          />
        </div>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Create Rule</button>
      </form>
    </div>
  );
};

export default AutomationPage;
