import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function Notifications() {
  const [assignments, setAssignments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
        if (!token) {
          alert('User is not logged in');
          navigate('/login');
          return;
        }

    const fetchAllUserEvents = async () => {
      try {
        const response = await axios.get(`/api/users/notifications`);
        return response.data.events;
      } catch (error) {
        console.error('Error fetching all user events:', error);
        throw error;
      }
    };
    
    const fetchFutureUserEvents = async () => {
      try {
        const response = await axios.get(`/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Future events THIS ONE", response);
        return response.data.events;
      } catch (error) {
        console.error('Error fetching future user events:', error);
        throw error;
      }
    };

    fetchAllUserEvents()
      .then((futureEvents) => {
        const assignmentNotifications = futureEvents.map((event, index) => ({
          id: index + 1,
          message: `Event ${event.name} has been assigned to you.`,
        }));
        setAssignments(assignmentNotifications);
      })
      .catch((error) => {
        console.error('Error fetching assignments:', error);
      });

    fetchFutureUserEvents()
      .then((futureEventsInSevenDays) => {
        console.log("Future events in seven days:");
        console.log(futureEventsInSevenDays);

        const sortedEvents = futureEventsInSevenDays.sort((a, b) => 
          new Date(a.eventDate) - new Date(b.eventDate) //Sorting by date
        );

        const reminderNotifications = sortedEvents.map((event, index) => ({
          id: index + 1,
          message: [
            `${event.eventName} is coming up on ${new Date(event.eventDate).toLocaleDateString()}.</br>\tDescription: ${event.description}</br>\tLocation: ${event.location}</br></br>`
          ]
        }));
        setReminders(reminderNotifications);
      })
      .catch((error) => {
        console.error('Error fetching reminders:', error);
      });
  }, []);

  return (
    <div className="notifications-container">
      <h1>Notifications Center</h1>
      <div className="section">
        <h3>Reminders</h3>
        <div className="notifications-list">
          {reminders.length > 0 ? (
            reminders.map((notification) => (
              <div key={notification.id} className="notification-box">
                {/* Render message with HTML tags using dangerouslySetInnerHTML */}
                <div dangerouslySetInnerHTML={{ __html: notification.message }}>
                </div>
              </div>
            ))
          ) : (
            <div>No upcoming events within the next 7 days.</div>
          )}
        </div>
      </div>
    </div>
  );  
}

export default Notifications;
