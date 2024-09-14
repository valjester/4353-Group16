import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Profile() {

  const stateSelection = [
    {value:'AL', label:'Alabama'},
    {value:'AK', label:'Alaska'}
  ];

  const skillSelection = [
    {value:'skill1', label:'Skill 1'}
  ];

  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState(null);
  const [zipcode, setZipcode] = useState('');
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Welcome to your profile!</h2>

      <div className="profile-container">
        <h3>Profile Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-profile">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength="50"
              required
            />
          </div>

          <div className="form-profile">
            <label>Address 1</label>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              maxLength="100"
              required
            />
          </div>

          <div className="form-profile">
            <label>Address 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              maxLength="100"
            />
          </div>

          <div className="form-profile">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength="100"
              required
            />
          </div>

          <div className="form-profile">
            <label>State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">Select a state</option>
              {stateSelection.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-profile">
            <label>Zip Code</label>
            <input
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              maxLength="9"
              required
            />
          </div>

          <div className="form-profile">
            <label>Skills</label>
            <Select
              id="skills"
              isMulti
              value={skills}
              onChange={(selectedOptions) => setSkills(selectedOptions)}
              options={skillSelection}
            />
          </div>

          <div className="form-profile">
            <label>Preferences</label>
            <textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
          </div>

          <div className="form-profile">
            <label>Availability</label>
            <DatePicker
              id="availability"
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
              }}
              dateFormat="MM/dd/yyyy"
              isClearable
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;