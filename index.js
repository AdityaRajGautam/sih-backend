const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const sessionRoutes = require('./routes/sessionRoutes');
// const authRoutes = require('./routes/authRoutes'); // Add this line
const config = require('./config/config');

const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(config.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// API Routes with Version and Prefix
// app.use('/api/v1/sessions', sessionRoutes);
// app.use('/api/v1/auth', authRoutes); // Add this line

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
