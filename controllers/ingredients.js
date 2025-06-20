const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');

// View all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.render('ingredients/index', { ingredients });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Add a new Ingredient
router.post('/', async (req, res) => {
  try {
    await Ingredient.create({ name: req.body.name });
    res.redirect('/ingredients');
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.redirect('/ingredients');
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    res.render('ingredients/edit', { ingredient });
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Ingredient.findByIdAndUpdate(req.params.id, { 
      name: req.body.name 
    });
    res.redirect('/ingredients');
  } catch (err) {
    console.error(err);
    res.redirect(`/ingredients/${req.params.id}/edit`);
  }
});

module.exports = router;