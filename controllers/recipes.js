const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');

// show all user recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients');
    res.render('recipes/index', { recipes });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// new Recipe form
router.get('/new', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.render('recipes/new', { ingredients });
  } catch (err) {
    console.error(err);
    res.redirect('/recipes');
  }
});

// create new Recipe
router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe({
      name: req.body.name,
      instructions: req.body.instructions,
      owner: req.session.user._id,
      ingredients: req.body.ingredients
    });
    await newRecipe.save();
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.redirect('/recipes/new');
  }
});

//View recipe details
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('ingredients')
      .populate('owner');
    res.render('recipes/show', { recipe });
  } catch (err) {
    console.error(err);
    res.redirect('/recipes');
  }
});

// recipe edit Form
router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    const ingredients = await Ingredient.find();
    res.render('recipes/edit', { recipe, ingredients });
  } catch (err) {
    console.error(err);
    res.redirect('/recipes');
  }
});

// recipe update
router.put('/:recipeId', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      {
        name: req.body.name,
        instructions: req.body.instructions,
        ingredients: req.body.ingredients
      },
      { new: true }
    );
    res.redirect(`/recipes/${req.params.recipeId}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/recipes/${req.params.recipeId}/edit`);
  }
});

// recipe delete
router.delete('/:recipeId', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.redirect(`/recipes/${req.params.recipeId}`);
  }
});

module.exports = router;