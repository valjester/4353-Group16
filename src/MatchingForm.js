import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './App.css';

function MatchingForm() {
  const [eventOptions, setEventOptions] = useState([]);
  const [volunteerList, setVolunteerList] = useState([]);
  const [selectedEventOption, setSelectedEventOption] = useState(null);
  const [selectedVolunteerOptions, setSelectedVolunteerOptions] = useState([]);

  const fetchMatchingVolunteers = async (eventId) => {
    console.log('Event ID being passed to backend:', eventId);
    try {
      const response = await fetch(`/api/events/matching-volunteers?eventId=${eventId}`);
      const volunteers = await response.json();
      console.log('Received matching volunteers:', volunteers);

      const formattedVolunteers = volunteers.map(volunteer => ({
        value: volunteer._id,
        label: volunteer.fullName,
        isAssigned: volunteer.history.some(
          (eventIdInHistory) => eventIdInHistory === eventId
        ),
        }));

        setVolunteerList(formattedVolunteers);
        
      const assignedVolunteers = formattedVolunteers.filter(v => v.isAssigned);
      setSelectedVolunteerOptions(assignedVolunteers);
    } catch (error) {
        console.error('Error fetching matching volunteers:', error);
    }
};

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/saved');
        const data = await response.json();
        const currentDate = new Date();
        const futureEvents = data.filter(event => new Date(event.eventDate) > currentDate);

        const formattedEvents = futureEvents.map(event => ({
          value: event._id,
          label: event.eventName,
          description: event.description,
          date: event.eventDate,
          location: event.location,
        }));
        console.log(formattedEvents);
        setEventOptions(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (selectedOption) => {
    console.log('Selected event option:', selectedOption);
    setSelectedEventOption(selectedOption);
    fetchMatchingVolunteers(selectedOption.value);
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
    if (!selectedEventOption || selectedVolunteerOptions.length === 0) {
      alert('Please select an event and at least one volunteer.');
      return;
    }
  
    const volunteerIds = selectedVolunteerOptions.map(volunteer => volunteer.value);
  
    try {
      const response = await fetch('/api/events/assign-volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEventOption.value,
          volunteerIds: volunteerIds,
        }),
      });
      console.log('Event ID being passed to assign:', selectedEventOption.value);
      const result = await response.json();
  
      if (response.ok) {
        alert('Volunteers successfully matched to the event!');
        setSelectedEventOption(null);
        setSelectedVolunteerOptions([]);
      } else {
        alert(`Failed to match volunteers: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting match:', error);
      alert('An error occurred while matching volunteers. Please try again later.');
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
