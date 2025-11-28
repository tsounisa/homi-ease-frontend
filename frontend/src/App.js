import React from 'react';
import AppRouter from './router/Router';
import { Link } from 'react-router-dom';
import './App.css'; 
import logo from './logo.svg'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link 
          to="/dashboard" 
          style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <img src={logo} className="App-logo" alt="logo" />
          <h1>HomiEase Smart Home</h1>
        </Link>
      </header>

      <main className="App-main">
        <AppRouter />
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 HomiEase. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;