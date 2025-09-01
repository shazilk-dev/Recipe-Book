const express = require('express')
const {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipe.controller.js')
const { protect } = require('../middleware/auth.js')

const router = express.Router()

router.route('/').get(getAllRecipes).post(protect, createRecipe)
router
  .route('/:id')
  .get(getRecipe)
  .patch(protect, updateRecipe)
  .delete(protect, deleteRecipe)

module.exports = router
