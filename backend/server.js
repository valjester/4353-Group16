const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const MONGO_UI = "redacted";
require('dotenv').config();


mongoose.connect(MONGO_UI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log(error);
  })
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { generateVolunteerPDF, generateVolunteerCSV, generateEventPDF, generateEventCSV } = require('./controllers/reportController');//

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/api/reports/volunteer-pdf', generateVolunteerPDF);
app.get('/api/reports/volunteer-csv', generateVolunteerCSV);
app.get('/api/reports/event-pdf', generateEventPDF);
app.get('api/reports/event-csv', generateEventCSV);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
