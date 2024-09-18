import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import {useNavigate} from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';

function Profile({ setFormData }) {
  

  const stateSelection = [
    {value:'AL', label:'Alabama'},
    {value:'AK', label:'Alaska'},
    {value:'AZ', label:'Arizona'},
    {value:'AR', label:'Arkansas'},
    {value:'CA', label:'California'},
    {value:'CO', label:'Colorado'},
    {value:'CT', label:'Connecticut'},
    {value:'DE', label:'Delaware'},
    {value:'FL', label:'Florida'},
    {value:'GA', label:'Georgia'},
    {value:'HI', label:'Hawaii'},
    {value:'ID', label:'Idaho'},
    {value:'IL', label:'Illinois'},
    {value:'IN', label:'Indiana'},
    {value:'IA', label:'Iowa'},
    {value:'KS', label:'Kansas'},
    {value:'KY', label:'Kentucky'},
    {value:'LA', label:'Louisiana'},
    {value:'ME', label:'Maine'},
    {value:'MD', label:'Maryland'},
    {value:'MA', label:'Massachusetts'},
    {value:'MI', label:'Michigan'},
    {value:'MN', label:'Minnesota'},
    {value:'MS', label:'Mississippi'},
    {value:'MO', label:'Missouri'},
    {value:'MT', label:'Montana'},
    {value:'NE', label:'Nebraska'},
    {value:'NV', label:'Nevada'},
    {value:'NH', label:'New Hampshire'},
    {value:'NJ', label:'New Jersey'},
    {value:'NM', label:'New Mexico'},
    {value:'NY', label:'New York'},
    {value:'NC', label:'North Carolina'},
    {value:'ND', label:'North Dakota'},
    {value:'OH', label:'Ohio'},
    {value:'OK', label:'Oklahoma'},
    {value:'OR', label:'Oregon'},
    {value:'PA', label:'Pennsylvania'},
    {value:'RI', label:'Rhode Island'},
    {value:'SC', label:'South Carolina'},
    {value:'SD', label:'South Dakota'},
    {value:'TN', label:'Tennessee'},
    {value:'TX', label:'Texas'},
    {value:'UT', label:'Utah'},
    {value:'VT', label:'Vermont'},
    {value:'VA', label:'Virginia'},
    {value:'WA', label:'Washington'},
    {value:'WV', label:'West Virginia'},
    {value:'WI', label:'Wisconsin'},
    {value:'WY', label:'Wyoming'}
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
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      fullName
    };

    setFormData(data);
    navigate("/home");
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