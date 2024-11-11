import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState } from 'react';
import axios from 'axios';

function EventForm() {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [reqSkills, setReqSkills] = useState([]);
    const [urgency, setUrgency] = useState('');
    const [eventDate, setEventDate] = useState('');

    const skillOptions = [
        { value: 'fundraising', label: 'Fundraising' },
        { value: 'dataentry', label: 'Data Entry' },
        { value: 'outreach', label: 'Community Outreach' }
      ];

    const urgencyOptions = [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!urgency || !eventDate) {
            alert('Please fill out all required fields.');
            return;
        }

        const eventData = {
            eventName,
            description,
            location,
            reqSkills: reqSkills.map(skill => skill.value), // Convert to array of skill values
            urgency: urgency.value, // Get the value from the selected urgency option
            eventDate: eventDate.toISOString(), // Convert date to ISO string
        };
        console.log(eventData);

        try {
            const response = await axios.post('/api/events', eventData);

            if (response.status === 201) {
                console.log('Event created:', response.data);
                alert('Event created successfully!');
                // Reset form or show success message if needed
                setEventName('');
                setDescription('');
                setLocation('');
                setReqSkills([]);
                setUrgency('');
                setEventDate(null);
            } else {
                console.error('Error creating event:', response.data);
                alert('Failed to create event. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        value={reqSkills}
                        onChange={(selectedOptions) => setReqSkills(selectedOptions)}
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
