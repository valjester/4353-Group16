import React, { useState } from 'react';
import './Modal.css';

function Modal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('volunteer');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (localStorage.getItem(email)) {
      alert(`The email ${email} is already registered.`);
    } 
    else {
      localStorage.setItem(email, JSON.stringify({ password }));
      alert(`Registered successfully as ${email}. You may now log in.`);
      onClose();
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