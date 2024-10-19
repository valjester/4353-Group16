import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './App.css';

function MatchingForm() {
  const [eventOptions, setEventOptions] = useState([]);
  const [volunteerList, setVolunteerList] = useState([]);
  const [selectedEventOption, setSelectedEventOption] = useState(null);
  const [selectedVolunteerOptions, setSelectedVolunteerOptions] = useState([]);

  
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/volunteers');
        const data = await response.json();
        const formattedVolunteers = data.map(volunteer => ({
          value: volunteer.id,
          label: volunteer.name,
        }));
        setVolunteerList(formattedVolunteers);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/saved');
        const data = await response.json();
        const formattedEvents = data.map(event => ({
          value: event.id,
          label: event.eventName,
          description: event.eventDescription,
          date: event.eventDate,
          location: event.location,
        }));
        setEventOptions(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchVolunteers();
    fetchEvents();
  }, []);

  const handleEventChange = (selectedOption) => {
    setSelectedEventOption(selectedOption);
  };

  const handleVolunteerChange = (selectedOptions) => {
    setSelectedVolunteerOptions(selectedOptions || []);
  };

  const renderEventContent = () => {
    if (selectedEventOption) {
      return (
        <div>
          <p><strong>Description:</strong> {selectedEventOption.description}</p>
          <p><strong>Date:</strong> {new Date(selectedEventOption.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {selectedEventOption.location}</p>
        </div>
      );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = 123;
    const data = {
        userId, 
        selectedEvent: selectedEventOption,
        selectedVolunteers: selectedVolunteerOptions.map(vol => vol.value),
    };

    try {
        const response = await fetch('/api/saveSelection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error saving selection:', errorData.error);
            return;
        }
        const assignResponse = await fetch(`/api/users/${userId}/assign-event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId: selectedEventOption }),
        });

        if (assignResponse.ok) {
            console.log('Event assigned successfully');
        } else {
            const errorData = await assignResponse.json();
            console.error('Error assigning event:', errorData.error);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};


  return (
    <div className="matching-container">
      <h1>Manage Volunteers</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Event:
          <Select
            value={selectedEventOption}
            onChange={handleEventChange}
            options={eventOptions}
            placeholder="-- Select an Event --"
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
                backgroundColor: isSelected ? "#1abc9c" : isFocused ? "#16a085" : "#34495e",
                color: "white",
              }),
            }}
          />
        </label>
        
        <div className="matching-content-container" style={{ whiteSpace: 'pre-line' }}>
          <div className="matching-column">
            <div>{renderEventContent()}</div>
          </div>

          <div className="matching-column">
            <label>
              Select Volunteers:
              <Select
                isMulti
                value={selectedVolunteerOptions}
                onChange={handleVolunteerChange}
                options={volunteerList}
                isSearchable
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
                    backgroundColor: isSelected ? "#1abc9c" : isFocused ? "#16a085" : "#34495e",
                    color: "white",
                  }),
                }}
              />
            </label>
            
            <div>{renderVolunteerContent()}</div>
          </div>
        </div>
        
        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
}

export default MatchingForm;
