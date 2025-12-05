import React, { useState } from 'react';
import { createAutomation } from '../api/automation';

const AutomationPage = () => {
  const [ruleName, setRuleName] = useState('');
  
  // Trigger State
  const [triggerType, setTriggerType] = useState('Time'); // Default to valid Enum
  const [triggerValue, setTriggerValue] = useState('');
  
  // Action State
  const [deviceId, setDeviceId] = useState('');
  const [commandKey, setCommandKey] = useState('isOn');
  const [commandValue, setCommandValue] = useState('true'); // Simple toggle for demo

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // STRICT SWAGGER ALIGNMENT: Construct nested payload
    // Schema: 
    // {
    //   "name": string,
    //   "trigger": { "type": "Time"|"Sensor"|"Manual", "value": string },
    //   "action": { "deviceId": string, "command": object }
    // }
    const payload = {
      name: ruleName,
      trigger: {
        type: triggerType,
        value: triggerValue
      },
      action: {
        deviceId: deviceId,
        command: { [commandKey]: commandValue === 'true' } // e.g., { "isOn": true }
      }
    };

    try {
      const newAutomation = await createAutomation(payload);
      setMessage(`Automation "${newAutomation.name}" created successfully!`);
      // Reset form
      setRuleName('');
      setTriggerValue('');
      setDeviceId('');
    } catch (err) {
      setError('Failed to create automation. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h2>Create New Automation Rule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rule Name:</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="e.g. Evening Lights"
            required
          />
        </div>

        <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <h4>Trigger</h4>
          <label>Type:</label>
          <select value={triggerType} onChange={(e) => setTriggerType(e.target.value)}>
             {/* API Enums: Time, Sensor, Manual */}
            <option value="Time">Time</option>
            <option value="Sensor">Sensor</option>
            <option value="Manual">Manual</option>
          </select>

          <label style={{ marginLeft: '10px' }}>Value:</label>
          <input
            type="text"
            value={triggerValue}
            onChange={(e) => setTriggerValue(e.target.value)}
            placeholder='e.g. "08:00 AM" or "Motion Detected"'
            required
          />
        </div>

        <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <h4>Action</h4>
          <label>Target Device ID:</label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Device ID"
            required
          />
          
          <div style={{ marginTop: '5px' }}>
            <label>Command:</label>
            {/* Simplified command builder for demo */}
            <select value={commandKey} onChange={(e) => setCommandKey(e.target.value)}>
              <option value="isOn">Power (isOn)</option>
              <option value="brightness">Brightness</option>
            </select>
            <select value={commandValue} onChange={(e) => setCommandValue(e.target.value)} style={{ marginLeft: '5px' }}>
              <option value="true">True / On</option>
              <option value="false">False / Off</option>
            </select>
          </div>
        </div>

        <button type="submit" style={{ marginTop: '20px' }}>Create Rule</button>
      </form>
      
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AutomationPage;