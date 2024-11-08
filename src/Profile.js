import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function Profile({ setFormData }) {
  const skillSelection = [
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'dataentry', label: 'Data Entry' },
    { value: 'outreach', label: 'Community Outreach' }
  ];

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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {

        const token = localStorage.getItem('token');
        if (!token) {
          alert('User is not logged in');
          navigate('/login');
          return;
        }

        const response = await axios.get(`/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data)
        const profileData = response.data.data;

        // Populate with data from backend
        setFullName(profileData.fullName || '');
        setAddress1(profileData.address1 || '');
        setAddress2(profileData.address2 || '');
        setCity(profileData.city || '');
        setState(profileData.state || null);
        setZipcode(profileData.zipcode || '');
        console.log('Profile Skills:', profileData.skills);
        setSkills(profileData.skills.map((skill) => ({
          value: skill,
          label: skillSelection.find(s => s.value === skill)?.label || skill
        })));
        setPreferences(profileData.preferences || '');
        setStartDate(profileData.availability?.[0] ? new Date(profileData.availability[0]) : null);
        setEndDate(profileData.availability?.[1] ? new Date(profileData.availability[1]) : null);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userProfile');
          navigate('/login');
        } else {
          alert('There was an error fetching your profile data. Please try again later.');
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const availability = [];
    if (startDate) availability.push(startDate);
    if (endDate) availability.push(endDate);

    if (zipcode.length < 5 || !/^\d+$/.test(zipcode)) {
        alert('Please enter a valid zipcode (5-9 digits)');
        return;
    }

    const profileData = {
        fullName,
        address1,
        address2,
        city,
        state,
        zipcode,
        skills: skills.map((skill) => skill.value), // Use skill.value instead of skill.label
        preferences,
        availability: availability.map((date) => date.toISOString()),
    };
    
    console.log("Profile Data JSON Output:", JSON.stringify(profileData, null, 2));


    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData), // Make sure this is a valid JSON string
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile updated successfully');
            navigate('/home');
        } else {
            throw new Error(data.error || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message);
    }
};


  const handleZipcodeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 9) {
      setZipcode(value);
    } else if (value.length > 9) {
      alert('Zip code cannot exceed 9 digits.');
    } else if (value.length < 5 && value.length > 0) {
      alert('Zip code must be at least 5 digits.');
    }
  };

  return (
    <div>
      <h2 className="profile-title">Welcome to your profile!</h2>

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
            <select value={state} onChange={(e) => setState(e.target.value)} required>
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
              onChange={handleZipcodeChange}
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
              required
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
