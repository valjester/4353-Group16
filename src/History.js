import React, { useEffect, useState } from 'react';

const History = ({ userId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`/api/users/${userId}/history`); // Call the backend endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }
                const data = await response.json();
                setHistory(data.history);
            } catch (err) {
                setError('Failed to load history.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Volunteer History</h2>
            {history.length === 0 ? (
                <p>No volunteer history found.</p>
            ) : (
                <ul>
                    {history.map((event, index) => (
                        <li key={index}>
                            <h3>{event.eventName}</h3>
                            <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                            <p>Location: {event.location}</p>
                            <p>Description: {event.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
