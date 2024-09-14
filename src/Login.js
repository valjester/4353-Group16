import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    if (isRegister) {
      if (localStorage.getItem(username)) {
        alert(`The email ${username} is already registered.`);
      } else {
        localStorage.setItem(username, JSON.stringify({ password }));
        alert(`Registered as ${username}`);
      }
    } else {
      const user = JSON.parse(localStorage.getItem(username));
      if (user && user.password === password) {
        alert(`Logged in as ${username}`);
        navigate('/profile');
      } else {
        alert('Invalid credentials.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username (E-mail):</label>
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
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>

      <div>
        {/* Conditionally render only the button that makes sense */}
        {!isRegister && (
          <button type="button" onClick={() => setIsRegister(true)}>
          Click Here to Register
          </button>

        )}
        {isRegister && (
          <button type="button" onClick={() => setIsRegister(false)}>
            Click Here to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;