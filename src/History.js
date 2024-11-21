import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Adjust the path according to your file structure

const History = ({ userId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('User is not logged in');
            navigate('/login');
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await axios.get(`/api/notifications/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Response:", response);
                // Assuming the response contains an array of events
                const userHistory = response.data.events;
                console.log("User history: ", userHistory);

                setHistory(userHistory); // Update the state with fetched history
            } catch (error) {
                console.error("Error fetching history: ", error);
                setError('Failed to load history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div class="history">
            <h2>Volunteer History</h2>
            {history.length === 0 ? (
                <p>No volunteer history found.</p>
            ) : (
                <ul>
                    {history.map((event, index) => (
                        <li key={index}>
                            <h3>{event.eventName}</h3>
                            <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Description:</strong> {event.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
