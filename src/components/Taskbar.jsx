import React from 'react';
import { useNavigate } from 'react-router-dom';

const Taskbar = () => {
    const navigate = useNavigate();

  // Basic styles
    const styles = {
        taskbar: {
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#282c34',
        padding: '10px',
        position: 'fixed',
        top: 0, 
        width: '100%',
        },
        button: {
        backgroundColor: '#282c34',
        border: 'none',
        padding: '10px 20px',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        }
    };

    return (
        <div style={styles.taskbar}>
        <button style={styles.button} onClick={() => navigate('/home')}>Home</button>
        <button style={styles.button} onClick={() => navigate('/history')}>History</button>
        <button style={styles.button} onClick={() => navigate('/notifications')}>Notifications</button>
        </div>
    );
};

export default Taskbar;
