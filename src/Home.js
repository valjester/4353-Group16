import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ formData }) => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName');
  const name = fullName ? fullName.fullName : 'Guest';

  console.log("Full name:", fullName);
  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    navigate('/login');
  };

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome, {fullName}!</p>
      <p>Current assigned events will be viewable here</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
