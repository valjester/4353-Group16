import React from "react";

const Home = ({ formData}) => {
    return(
        <div>
            <h2>Home</h2>
            <p>Welcome, {formData.fullName || "Guest"}!</p>
        </div>
    );
};

export default Home;