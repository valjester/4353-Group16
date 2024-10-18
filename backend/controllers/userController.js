const asyncHandler = require('express-async-handler');

//Hardcoded user 123
const users = {
    123: {
      fullName: "John Doe",
      address1: "123 Main St",
      city: "Houston",
      state: "TX",
      zipcode: "77007",
      skills: ["dataentry"],
      preferences: "None",
      availability: ["2024-12-01T00:00:00Z"]
    }
  };

  const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = users[userId];
  
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
  
    res.status(200).json({ data: user });
  });

const updateUserProfile = asyncHandler(async (req, res) => {

    const {id} = req.params;
    const user = users[id];
    if (!user){
        return res.status(404).json({error: 'User not found.'});
    }
    
    try{
    const { fullName, address1, address2, city, state, zipcode, skills, preferences, availability } = req.body;

    if (!fullName || fullName.length > 50) {
        return res.status(400).json({ error: 'Full Name must be between 1 and 50 characters.' });
    }
    if (!address1 || address1.length > 100) {
        return res.status(400).json({ error: 'Address 1 is required.' });
    }
    if (address2 && address2.length > 100) {
        return res.status(400).json({ error: 'Address 2 exceeded character limit.' });
    }
    if (!city || city.length > 100) {
        return res.status(400).json({ error: 'City required.' });
    }
    if (!state || state.length !== 2) {
        return res.status(400).json({ error: 'State required.' });
    }
    if (!zipcode || zipcode.length < 5 || zipcode.length > 9 || isNaN(zipcode)) {
        return res.status(400).json({ error: 'Invalid zipcode.' });
    }
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ error: 'No skills selected.' });
    }
    if (!availability || !Array.isArray(availability) || availability.length === 0) {
        return res.status(400).json({ error: 'No availability selected.' });
    }

    const user = users[123]; 

    if (user) {
      user.fullName = fullName;
      user.address1 = address1;
      user.address2 = address2;
      user.city = city;
      user.state = state;
      user.zipcode = zipcode;
      user.skills = skills;
      user.preferences = preferences;
      user.availability = availability;

      res.json({
        message: 'Profile updated successfully',
        data: user,
      });
    } else {
        return res.status(404).json({ error: 'User not found.' });
    }
} catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error. Please try again.' });
}
});

module.exports = {
    getUserProfile,
    updateUserProfile,
};




  /*
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (savedProfile) {
      setFullName(savedProfile.fullName || '');
      setAddress1(savedProfile.address1 || '');
      setAddress2(savedProfile.address2 || '');
      setCity(savedProfile.city || '');
      setState(savedProfile.state || null);
      setZipcode(savedProfile.zipcode || '');
      setSkills(savedProfile.skills ? savedProfile.skills.map((skill) => ({ label: skill, value: skill })) : []);
      setPreferences(savedProfile.preferences || '');
      if (savedProfile.availability && savedProfile.availability.length >= 2) {
        setStartDate(new Date(savedProfile.availability[0]));
        setEndDate(new Date(savedProfile.availability[1]));
      }
    }
  }, []);
  */