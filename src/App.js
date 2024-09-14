import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Profile from './Profile';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <h1>My React App</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;