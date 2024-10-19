import React from 'react';

function Notifications() {
    const assignments = [
      { id: 1, message: "Event 1 has been assigned to you." },
      { id: 2, message: "Event 2 has been assigned to you." },
    ];
  
    const reminders = [
      { id: 1, message: "Reminder: Event 1 is coming up on 09/27." },
    ];
  
    return (
      <div className="notifications-container">
        <h1>Notifications Center</h1>
        <h2>Event assignments, updates, and reminders will be viewed here.</h2>
  
        <div className="section">
          <h3>New Assignments</h3>
          <div className="notifications-list">
            {assignments.map(notification => (
              <div key={notification.id} className="notification-box">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
  
        <div className="section">
          <h3>Reminders</h3>
          <div className="notifications-list">
            {reminders.map(notification => (
              <div key={notification.id} className="notification-box">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default Notifications;