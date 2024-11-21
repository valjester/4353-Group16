import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; //npm install jwt-decode

import EventForm from './EventForm';
import EventEditForm from './EventEditForm';
import MatchingForm from './MatchingForm';

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
                    alert("Admin access needed.");
                    hasRedirected.current = true;
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error('Invalid token:', error);
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>
            <EventForm />
            <EventEditForm />
            <MatchingForm />
        </div>
    );
}

export default Admin;
