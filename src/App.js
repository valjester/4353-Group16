import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Profile from './Profile';
import Home from './Home';
import Taskbar from './components/Taskbar';
import EventForm from './EventForm';
import EventEditForm from './EventEditForm';
import MatchingForm from './MatchingForm';
import Notifications from './Notifications';
import Admin from './Admin';
import History from './History';

function App() {
  const [formData, setFormData] = useState({
    fullname: ""
  });

  const[isLoggedIn, setIsLoggedIn] = useState(false); //Initialize login status to false

  return (
    <Router>
      <Taskbar />
    <div className="App">
      <header className="App-header">
        {isLoggedIn && <Taskbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/profile" element={<Profile setFormData={setFormData} />} />
          <Route path="/home" element={<Home formData={formData} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/eventform" element={<EventForm />} />
          <Route path="/eventeditform" element={<EventEditForm />} />
          <Route path="/matchingform" element={<MatchingForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;