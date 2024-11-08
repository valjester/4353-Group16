import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios to make API requests
import Modal from './components/Modal';
import './App.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    try {
      const response = await axios.post('/api/users/login', {
        email: username,
        password,
      });

      if (response.status === 200) {
        const { userId, token } = response.data;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userProfile', JSON.stringify(response.data)); /** */
        alert(`Logged in as ${username}`);
        onLogin();

        // Check if profile data exists
        const profileData = response.data.profileData;
        if (profileData) {
          navigate('/home', { state: { name: profileData.fullName } });
        } else {
          navigate('/profile');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Invalid credentials.');
    }
  };
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail:</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <div>
        <button type="button" onClick={openModal}>
          Click Here to Register
        </button>
      </div>
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
}

export default Login;
