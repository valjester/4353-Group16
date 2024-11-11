import React, { useState } from 'react';
import axios from 'axios'; //Make sure to install axios
import './Modal.css';

function Modal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('volunteer');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('/api/users/register', {
        email,
        password,
        role,
      });

      if (response.status === 201) {
        const userId = response.data.data._id;
        console.log("MAYBE ID?", userId);
        localStorage.setItem('userId', userId); //Store user ID in localStorage
        alert(`Registered successfully as ${email}. You may now log in.`);
        onClose();
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred during registration.';
      alert(errorMessage);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <p>
            Email:{' '}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </p>
          <p>
            Password:{' '}
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </p>
          <p>
            Re-enter password:{' '}
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </p>
          <p>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </p>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
