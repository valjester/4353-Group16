import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; //npm install jwt-decode
import EventForm from './EventForm';
import EventEditForm from './EventEditForm';
import MatchingForm from './MatchingForm';
import axios from 'axios'; // Import axios to make HTTP requests

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

    const handleGenerateReport = async () => {
        try {
            const response = await axios.get('/api/reports/volunteer-pdf', {
                responseType: 'blob', // Ensure the response is treated as a file
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if needed
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

    return (
        <div>
            <h1>Admin Panel</h1>
            <button onClick={handleGenerateReport}>Generate Volunteer Report</button>
            <EventForm />
            <EventEditForm />
            <MatchingForm />
        </div>
    );
}

export default Admin;
