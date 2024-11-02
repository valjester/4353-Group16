const express = require('express');
const { registerUser, loginUser } = require('../controllers/loginController');
const router = express.Router();


router.post('/register', (req, res) => {
    // console.log(req.body);
    registerUser(req, res);
});

router.post('/login', loginUser);

module.exports = router;
