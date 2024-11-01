const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, maxlength: 50 },
  address1: { type: String, required: true, maxlength: 100 },
  address2: { type: String, maxlength: 100 },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, maxlength: 2 },
  zipcode: { type: String, required: true, minlength: 5, maxlength: 9 },
  skills: { type: [String], required: true },
  preferences: { type: String, default: "None" },
  availability: { type: [Date], required: true },
  history: { type: [Number], default: [] }
});

module.exports = mongoose.model('User', userSchema);
