import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';

function EventEditForm() {
    const [eventOptions, setEventOptions] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events/saved');
                const data = await response.json();
                const formattedEvents = data.map(event => ({
                    value: event._id,
                    label: event.eventName,
                    description: event.description,
                    date: event.eventDate,
                    location: event.location,
                    requiredSkills: event.requiredSkills || [],
                    urgency: event.urgency || '',
                }));
                setEventOptions(formattedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setEventName(event.label);
        setEventDescription(event.description || '');
        setLocation(event.location || '');
        setRequiredSkills(
            event.requiredSkills.map(skill => ({ value: skill, label: skill })) || []
        );
        setUrgency(
            urgencyOptions.find(option => option.value === event.urgency) || ''
        );
        setEventDate(event.date ? new Date(event.date) : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedEvent = {
            eventName,
            eventDescription,
            location,
            requiredSkills: requiredSkills.map(skill => skill.value),
            urgency: urgency.value,
            eventDate: eventDate.toISOString(),
        };

        try {
            const response = await fetch(`/api/events/${selectedEvent.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEvent),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Event updated successfully:', result);
                alert('Event updated successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error updating event:', errorData);
                alert('Failed to update the event. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while updating the event.');
        }
    };

    return (
        <div className="form-container">
            <h2>Edit Event</h2>

            {/*Dropdown*/}
            <div className="form-group">
                <label>Select Event</label>
                <Select
                    value={selectedEvent}
                    onChange={handleEventSelect}
                    options={eventOptions}
                    placeholder="-- Select an Event --"
                    className="form-select"
                />
            </div>

            {selectedEvent && (
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
                            className="form-select"
                        />
                    </div>

                    <div className="form-group">
                        <label>Urgency</label>
                        <Select
                            value={urgency}
                            onChange={(selectedOption) => setUrgency(selectedOption)}
                            options={urgencyOptions}
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
            )}
        </div>
    );
}

export default EventEditForm;
