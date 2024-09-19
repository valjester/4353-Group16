import React from "react";

const Home = ({ formData}) => {
    const profileData = JSON.parse(localStorage.getItem('userProfile'));
    const name = profileData ? profileData.fullName : 'Guest';

    return(
        <div>
            <h2>Home</h2>
            <p>Welcome, {name || "Guest"}!</p>
            <p>Current assigned events will be viewable here</p>
        </div>
    );
};

export default Home;