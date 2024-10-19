import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [assignments, setAssignments] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const userId = "123";

    const fetchAllUserEvents = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/events`);
        return response.data.events;
      } catch (error) {
        console.error('Error fetching all user events:', error);
        throw error;
      }
    };

    const fetchFutureUserEvents = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/events`);
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
        const reminderNotifications = futureEventsInSevenDays.map((event, index) => ({
          id: index + 1,
          message: `Reminder: Event ${event.name} is coming up on ${new Date(event.date).toLocaleDateString()}.`,
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
      <h2>Event assignments, updates, and reminders will be viewed here.</h2>

      <div className="section">
        <h3>New Assignments</h3>
        <div className="notifications-list">
          {assignments.length > 0 ? (
            assignments.map((notification) => (
              <div key={notification.id} className="notification-box">
                {notification.message}
              </div>
            ))
          ) : (
            <div>No new assignments.</div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>Reminders</h3>
        <div className="notifications-list">
          {reminders.length > 0 ? (
            reminders.map((notification) => (
              <div key={notification.id} className="notification-box">
                {notification.message}
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
