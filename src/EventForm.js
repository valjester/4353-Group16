/* 

Event Management Form:
(Administrators can create and manage events). 
The form should include:
- Event Name (100 characters, required)
- Event Description (Text area, required)
- Location (Text area, required)
- Required Skills (Multi-select dropdown, required)
- Urgency (Drop down, selection required)
- Event Date (Calendar, date picker)

*/



import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState } from 'react';


function EventForm() {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [location, setLocation] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [eventDate, setEventDate] = useState(null);

  const skillOptions = [
    { value: 'skill1', label: 'Skill 1' },
    { value: 'skill2', label: 'Skill 2' },
    { value: 'skill3', label: 'Skill 3' }
  ];

  const urgencyOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventData = {
      eventName,
      eventDescription,
      location,
      requiredSkills,
      urgency,
      eventDate
    };

    console.log('Event data submitted:', eventData);
  };

  return (
    <div className="form-container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            maxLength="100"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Event Description</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Required Skills</label>
          <Select
            isMulti
            value={requiredSkills}
            onChange={(selectedOptions) => setRequiredSkills(selectedOptions)}
            options={skillOptions}
            required
            className="form-select"
          />
        </div>

        <div className="form-group">
          <label>Urgency</label>
          <Select
            value={urgency}
            onChange={(selectedOption) => setUrgency(selectedOption)}
            options={urgencyOptions}
            required
            className="form-select"
          />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <DatePicker
            selected={eventDate}
            onChange={(date) => setEventDate(date)}
            dateFormat="yyyy-MM-dd"
            required
            className="form-datepicker"
          />
        </div>

        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
}

export default EventForm;
