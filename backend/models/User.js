const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, 
  role: { type: String, enum: ['admin', 'volunteer'], default: 'volunteer' },
  fullName: { type: String, maxlength: 50 },
  address1: { type: String, maxlength: 100 },
  address2: { type: String, maxlength: 100 },
  city: { type: String, maxlength: 100 },
  state: { type: String, maxlength: 2 },
  zipcode: { type: String, minlength: 5, maxlength: 9 },
  skills: { type: [String], default: [] },
  preferences: { type: String, default: "None" },
  availability: { type: [Date], default: [] },
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('User', userSchema);
