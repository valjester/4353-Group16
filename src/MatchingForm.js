import React, { useState } from 'react';
import Select from 'react-select';
import './App.css';

function MatchingForm () {

  const eventOptions = [
    { value: 'event1', label: 'Event 1' },
    { value: 'event2', label: 'Event 2' },
    { value: 'event3', label: 'Event 3' },
  ];

  const eventList = {
    event1: 'Event 1\nEvent 1 Info',
    event2: 'Event 2\nEvent 2 Info',
    event3: 'Event 3\nEvent 3 Info',
  };

  const volunteerList = [
    { value: 'volunteer1', label: 'Volunteer 1' },
    { value: 'volunteer2', label: 'Volunteer 2' },
    { value: 'volunteer3', label: 'Volunteer 3' },
    { value: 'volunteer4', label: 'Volunteer 4' },
    { value: 'volunteer5', label: 'Volunteer 5' },
  ];

  const [selectedEventOption, setSelectedEventOption] = useState('');
  const [selectedVolunteerOptions, setSelectedVolunteerOptions] = useState([]);

  const handleEventChange = (change) => {
    setSelectedEventOption(change.target.value);
  };

  const handleVolunteerChange = (selectedEventOptions) => {
    setSelectedVolunteerOptions(selectedEventOptions || []);
  };

  const renderEventContent = () => {
    if (selectedEventOption) {
      return <p>{eventList[selectedEventOption]}</p>;
    }
    return <p>Please select an event.</p>;
  };

  const renderVolunteerContent = () => {
    if (selectedVolunteerOptions.length > 0) {
      return (
        <div>
          <ul>
            {selectedVolunteerOptions.map(option => (
              <li key={option.value}>{option.label}</li>
            ))}
          </ul>
        </div>
      );
    }
    return <p>Please select one or more volunteers.</p>;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const data = {
      selectedEventOption,
      selectedVolunteerOptions,
    };
    
    console.log('Event Volunteers Selection submitted:', data);
  };

  return (
    <div className="matching-container">
      <h1>Manage Volunteers</h1>
      <form onSubmit={handleSubmit}>
        <label>
            Select Event:
            <select value={selectedEventOption} onChange={handleEventChange}>
              <option value="">-- Select an Event --</option>
              {eventOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
        </label>
      
        <div className="matching-content-container" style={{ whiteSpace: 'pre-line' }}>
            {/* Left Column */}
            <div className="matching-column">
            <div>
                {renderEventContent()}
            </div>
            </div>

            {/* Right Column */}
            <div className="matching-column">
            <label>
                Select Volunteers:
                <Select
                isMulti
                value={selectedVolunteerOptions}
                onChange={handleVolunteerChange}
                options={volunteerList}
                isSearchable
                //Following are inline styles to make dropdown menu more readable
                styles={{
                  control: (base) => ({
                    ...base,
                    
                    color: "white",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#34495e",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected
                      ? "#1abc9c"
                      : isFocused
                      ? "#16a085"
                      : "#34495e",
                    color: "white",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#003535",
                    color: "white",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    backgroundColor: "#003535",
                    color: "white",
                    ":hover": {
                      backgroundColor: "#006969",
                      color: "white",
                    },
                  }),
                }}
              />
            
            </label>

            <div>
                {renderVolunteerContent()}
            </div>
            </div>
        </div>
      <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
};

export default MatchingForm;
