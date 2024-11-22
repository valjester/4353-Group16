import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; //npm install jwt-decode
import EventForm from './EventForm';
import EventEditForm from './EventEditForm';
import MatchingForm from './MatchingForm';
import axios from 'axios';

function Admin() {
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            //navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== 'admin') {
                if (!hasRedirected.current) {
                    alert('Admin access needed.');
                    hasRedirected.current = true;
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error('Invalid token:', error);
            navigate('/login');
        }
    }, [navigate]);

    const handleGenerateVolunteerPDF = async () => {
        try {
            const response = await axios.get('/api/reports/volunteer-pdf', {
                responseType: 'blob', // Ensure the response is treated as a file
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Create a URL for the downloaded file
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Volunteer_Report.pdf');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove(); // Clean up the link after download
        } catch (error) {
            console.error('Error generating the report:', error);
            alert('Failed to generate the report.');
        }
    };

    const handleGenerateVolunteerCSV = async () => {
        try {
            const response = await axios.get('/api/reports/volunteer-csv', {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Volunteer_Report.csv');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
        } catch (error) {
            console.error('Error generating the volunteer CSV report:', error);
            alert('Failed to generate the volunteer CSV report.');
        }
    };

    const handleGenerateEventPDF = async () => {
        try {
            const response = await axios.get('/api/reports/event-pdf', {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Event_Report.pdf');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
        } catch (error) {
            console.error('Error generating the event PDF report:', error);
            alert('Failed to generate the event PDF report.');
        }
    };

    const handleGenerateEventCSV = async () => {
        try {
            const response = await axios.get('/api/reports/event-csv', {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Event_Report.csv');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
        } catch (error) {
            console.error('Error generating the event CSV report:', error);
            alert('Failed to generate the event CSV report.');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <button onClick={handleGenerateVolunteerPDF}>Generate Volunteer Report (.pdf)</button>
            <button onClick={handleGenerateVolunteerCSV}>Generate Volunteer Report (.csv)</button>
            <button onClick={handleGenerateEventPDF}>Generate Event Report (.pdf)</button>
            <button onClick={handleGenerateEventCSV}>Generate Event Report (.csv)</button>
            <EventForm />
            <EventEditForm />
            <MatchingForm />
        </div>
    );
}

export default Admin;
