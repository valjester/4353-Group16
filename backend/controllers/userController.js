const asyncHandler = require('express-async-handler');

//Hardcoded user 123
const users = {
    123: {
      fullName: "John Doe",
      address1: "123 Main St",
      city: "Houston",
      state: "TX",
      zipCode: "77007",
      skills: ["skill1"],
      preferences: "None",
      availability: ["2024-12-01T00:00:00Z"]
    }
  };

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

    if (!fullName || fullName.length > 50) {
        res.status(400);
        throw new Error('Name is required.');
    }
    if (!address1 || address1.length > 100) {
        res.status(400);
        throw new Error('Address 1 is required.');
    }
    if (address2 && address2.length > 100) {
        res.status(400);
        throw new Error('Address 2 should not exceed 100 characters.');
    }
    if (!city || city.length > 100) {
        res.status(400);
        throw new Error('City is required.');
    }
    if (!state || state.length !== 2) {
        res.status(400);
        throw new Error('Please select your state.');
    }
    if (!zipCode || zipCode.length < 5 || zipCode.length > 9 || isNaN(zipCode)) {
        res.status(400);
        throw new Error('Zip Code must be a number with at least 5 digits.');
    }
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
        res.status(400);
        throw new Error('Please select at least one skill.');
    }
    if (!availability || !Array.isArray(availability) || availability.length === 0) {
        res.status(400);
        throw new Error('Please select your availability dates.');
    }

    
    const user = users[123]; 

    if (user) {
      user.fullName = fullName;
      user.address1 = address1;
      user.address2 = address2;
      user.city = city;
      user.state = state;
      user.zipCode = zipCode;
      user.skills = skills;
      user.preferences = preferences;
      user.availability = availability;

      res.json({
        message: 'Profile updated successfully',
        data: user,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
});

module.exports = {
    updateUserProfile,
};