const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipes.js');

router.get("/sign-up", (req, res) => {
    res.render("Cookbook/sign-up.ejs");
});

// Finding the username inside the database, if exist then it will say username is already taken 
router.post("/sign-up", async (req, res )=>{
  const userInDatabase = await User.findOne({ username: req.body.username});
  if(userInDatabase) {
    return res.send("Username already taken");
  }
  // if first condition is true then check the password if it matches or not
  if(req.body.password !== req.body.confirmPassword){
    return res.send("Password and confirm password must match")
  }
  // Register a User
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); // 10 refers to encrpt it 10 times to make it more secure 
  req.body.password = hashedPassword; // once we have the hashPassword then we are replacing it with the password
  // Create a User
  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}`);
});

router.get("/sign-in", (req, res) => {
    res.render("Cookbook/sign-in.ejs");
});



router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username});
  if(!userInDatabase){
    return res.send("Login Failed. Please try again later");
  }
  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
  if(!validPassword){
    return res.send("Login Failed. Please try again later");
  }
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };
  res.redirect("/");
});

// For sign out
router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;


/*
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});
router.post("/sign-up", async (req, res )=>{
  const userInDatabase = await User.findOne({ username: req.body.username});
  if(userInDatabase) {
    return res.send("Username already taken");
  }
  if(req.body.password !== req.body.confirmPassword){
    return res.send("Password and confirm password must match")
  }
  // Register a User
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  // Create a User
  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}`);
});
module.exports = router;
*/
