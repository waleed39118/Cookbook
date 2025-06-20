require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pass user data to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Import controllers
const authController = require('./controllers/auth');
const recipesController = require('./controllers/recipes');
const ingredientsController = require('./controllers/ingredients');
const usersController = require('./controllers/users');

// Routes
app.use('/auth', authController);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);
app.use('/users', usersController);

// Home route
app.get('/', async (req, res) => {
  try {
    // Get ingredients to pass to the home view
    const Ingredient = require('./models/ingredient');
    const ingredients = await Ingredient.find();
    
    res.render('index', { 
      user: req.session.user,
      ingredients
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404', { 
    title: 'Page Not Found',
    url: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { 
    title: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});