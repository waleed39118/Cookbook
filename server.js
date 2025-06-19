// server.js
const dotenv = require("dotenv"); // to read the data from env file 
dotenv.config(); // to use express
const express = require("express");
const app = express();

// Middlewares
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // used for updating and deleting
const morgan = require("morgan"); // used for logs 
const session = require("express-session"); // used for authentication
const isSignedIn = require('./middleware/is-signed-in');
const passUserToView = require('./middleware/pass-user-to-view');



// Set the port from environment variable or default to 3000 to conact to database
const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI); // DB connection 
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false })); // parse the data sa a form data

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));

// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Session Configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

// GET for the main page
app.get("/", async(req, res) => {
  res.render("index.ejs");
});

// Require Controller
const authController = require('./controllers/auth.js');
const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');


// server.js

// below middleware
// Routes conection
app.use('/auth', authController);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);


// Route - Just for testing purpose
// VIP-lounge
app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party`);
});

const usersController = require('./controllers/users');
app.use('/', usersController);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
