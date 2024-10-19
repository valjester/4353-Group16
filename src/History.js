import React, { useEffect, useState } from 'react';

const History = ({ userId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userData = {
                    123: {
                        history: [
                            {
                                eventName: 'Community Cleanup',
                                eventDate: '2024-10-01',
                                location: 'Central Park',
                                description: 'Participated in a community cleanup event.',
                            },
                        ],
                    },
                };

                const userHistory = userData[userId]?.history || [];
                setHistory(userHistory);
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
                            <p>Date: {event.eventDate}</p>
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
