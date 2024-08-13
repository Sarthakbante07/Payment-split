// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Create an instance of the Express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://Sarthak07:Sarthak789@tracking.gcit4ry.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define your routes here
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);



// Serve history page
app.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/history.html'));
  });

  
// Serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
