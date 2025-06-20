const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// singn-in form
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in', { error: null });
});

// singn-in form prosses
router.post('/sign-in', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.render('auth/sign-in', { 
        error: 'Invalid username' 
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.render('auth/sign-in', { 
        error: 'Incorrect password' 
      });
    }
    
    req.session.user = user;
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.render('auth/sign-in', { 
      error: 'error while logging in' 
    });
  }
});

// new account form
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up', { error: null });
});

// Account creation processing
router.post('/sign-up', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  try {
    // Verify password matches
    if (password !== confirmPassword) {
      return res.render('auth/sign-up', { 
        error: 'The passwords do not match' 
      });
    }
    
    // Check that there is no user with the same name
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.render('auth/sign-up', { 
        error: 'Username already exists'
      });
    }
    
    // Password bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const newUser = new User({ 
      username, 
      password: hashedPassword 
    });
    
    await newUser.save();
    
    // Log in automatically after creating an account
    req.session.user = newUser;
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.render('auth/sign-up', { 
      error: 'error while creating the account'
    });
  }
});

// Sign out
router.post('/sign-out', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/recipes');
    }
    res.redirect('/');
  });
});

module.exports = router;