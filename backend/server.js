const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});