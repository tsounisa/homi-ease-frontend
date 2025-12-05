import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // apiResponse is ALREADY { token: "...", user: {...} }
      const apiResponse = await loginApi({ email, password });
      
      console.log('Final Payload:', apiResponse); // Debug check

      const { token, user } = apiResponse; // <--- No .data, No .data.data

      if (!token) {
        throw new Error('Token not found in response');
      }

      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="login-page-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-cy="email-input" // <--- ADDED for E2E
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-cy="password-input" // <--- ADDED for E2E
          />
        </div>
        {error && <p className="error-message" data-cy="login-error-message">{error}</p>}
        <button type="submit" data-cy="login-button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
