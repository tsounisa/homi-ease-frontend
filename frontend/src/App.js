import React from 'react';
import AppRouter from './router/Router';
import './App.css'; // Keep existing CSS
import logo from './logo.svg'; // Assuming a logo.svg exists

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>HomiEase Smart Home</h1>
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