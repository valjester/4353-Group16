import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        alert(`Logged in as ${username}`);
        onLogin();
  
        navigate('/home');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
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