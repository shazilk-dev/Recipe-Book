const Recipe = require('../models/recipe.model.js')

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

exports.getAllRecipes = asyncHandler(async (_req, res) => {
  const recipes = await Recipe.find().sort({ createdAt: -1 })
  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: { recipes },
  })
})

exports.getRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params
  const recipe = await Recipe.findById(id)
  if (!recipe) {
    return res.status(404).json({ status: 'fail', message: 'Recipe not found' })
  }
  res.status(200).json({ status: 'success', data: { recipe } })
})

exports.createRecipe = asyncHandler(async (req, res) => {
  const newRecipe = await Recipe.create(req.body)
  res.status(201).json({ status: 'success', data: { newRecipe } })
})

exports.updateRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params
  const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!recipe) {
    return res.status(404).json({ status: 'fail', message: 'Invalid Id' })
  }
  res.status(200).json({ status: 'success', data: { recipe } })
})

exports.deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params
  const recipe = await Recipe.findByIdAndDelete(id)
  if (!recipe) {
    return res.status(404).json({ status: 'fail', message: 'Invalid Id' })
  }
  res.status(204).json({ status: 'success', data: null })
})
