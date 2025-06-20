const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Recipe = require('../models/recipe');

// show all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users/index', { users });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// show a specific user's recipes
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const recipes = await Recipe.find({ owner: req.params.userId });
    res.render('users/show', { user, recipes });
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
});

module.exports = router;