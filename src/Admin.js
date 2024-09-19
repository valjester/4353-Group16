import React from 'react';
import './App.css';

import EventForm from './EventForm';
import MatchingForm from './MatchingForm';

function Admin() {
    return (
        <div>
            <EventForm />
            <MatchingForm />
        </div>
    );
  }
  
  export default Admin;