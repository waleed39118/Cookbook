const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");


//sign-up page
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  const userInDatabase = await User.findOne({ username });
  if (userInDatabase) {
    return res.send("Username already taken");
  }

  if (password !== confirmPassword) {
    return res.send("Password and confirm password must match");
  }
  
  // Register a User
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Create a User
  const user = await User.create({
    username,
    password: hashedPassword
  }); 
  //singn-in page
    res.render("auth/sign-in.ejs");
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

//sign-in prossess
router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;
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
})


router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/")
});


module.exports = router;
