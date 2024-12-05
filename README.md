﻿# khaatabook-with-database
<pre>
const express = require('express'); <br>
const bodyParser = require('body-parser'); <br>
const path = require('path'); <br>
const db = require('./config/db'); // MongoDB connection <br>
const User = require('./models/User'); // Import the User model <br>

<br>

// Initialize Express <br>
const app = express(); <br>

<br>

// Middleware <br>
app.use(bodyParser.urlencoded({ extended: true })); <br>
app.set('view engine', 'ejs'); <br>
app.use(express.static(path.join(__dirname, 'public'))); <br>

<br>

// Routes <br>

// Render Sign-Up Page <br>
app.get('/signup', (req, res) => { <br>
  res.render('signup'); <br>
}); <br>

<br>

// Handle Sign-Up Form Submission <br>
app.post('/signup', async (req, res) => { <br>
  const { username, password } = req.body; <br>

  <br>

  // Check if the user already exists <br>
  const existingUser = await User.findOne({ username }); <br>
  
  if (existingUser) { <br>
    return res.send('Username already exists. Please choose another.'); <br>
  } <br>

  <br>

  // Create a new user and save to the database <br>
  const newUser = new User({ username, password }); <br>
  await newUser.save(); <br>
  res.redirect('/login'); <br>
}); <br>

<br>

// Render Login Page <br>
app.get('/login', (req, res) => { <br>
  res.render('login'); <br>
}); <br>

<br>

// Handle Login Form Submission <br>
app.post('/login', async (req, res) => { <br>
  const { username, password } = req.body; <br>

  <br>

  // Find user in the database <br>
  const user = await User.findOne({ username }); <br>
  
  if (!user || user.password !== password) { <br>
    return res.send('Invalid username or password. Please try again.'); <br>
  } <br>

  <br>

  // Redirect to home page with username <br>
  res.render('home', { username: user.username }); <br>
}); <br>

<br>

// Home Route (after login) <br>
app.get('/home', (req, res) => { <br>
  res.render('home'); <br>
}); <br>

<br>

// Logout Route <br>
app.get('/logout', (req, res) => { <br>
  res.redirect('/login'); <br>
}); <br>

<br>

// Start the server <br>
app.listen(3000, () => console.log('Server running on http://localhost:3000')); <br>
</pre>


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
