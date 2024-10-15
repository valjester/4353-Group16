const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});