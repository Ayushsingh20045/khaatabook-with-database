# khaatabook-with-database
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/db'); // MongoDB connection
const User = require('./models/User'); // Import the User model

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Render Sign-Up Page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle Sign-Up Form Submission
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send('Username already exists. Please choose another.');
  }

  // Create a new user and save to the database
  const newUser = new User({ username, password });
  await newUser.save();
  res.redirect('/login');
});

// Render Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle Login Form Submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user in the database
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.send('Invalid username or password. Please try again.');
  }

  // Redirect to home page with username
  res.render('home', { username: user.username });
});

// Home Route (after login)
app.get('/home', (req, res) => {
  res.render('home');
});

// Logout Route
app.get('/logout', (req, res) => {
  res.redirect('/login');
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
