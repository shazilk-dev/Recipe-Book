import { Loader2, Search, Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import Button from './Button'
import {
  fetchRecipes,
  deleteRecipe,
  updateRecipe,
  setSearch,
  setCategoryFilter,
  toggleFavoriteLocal,
  hydrateFromLocal,
} from '../features/recipes/recipesSlice'
import RecipeCard from './RecipeCard'
import RecipeDrawer from './RecipeDrawer'

const RecipesList: React.FC = () => {
  const {
    recipeList,
    error,
    loading,
    updateLoading,
    deleteLoading,
    search,
    categoryFilter,
  } = useSelector((state: RootState) => state.recipes)
  const dispatch = useDispatch<AppDispatch>()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<null | {
    id: string
    name: string
    ingredients: string[]
    instructions: string
    imageUrl?: string
    category?: string
  }>(null)

  useEffect(() => {
    dispatch(hydrateFromLocal())
    dispatch(fetchRecipes())
  }, [dispatch])

  const filtered = recipeList.filter((r) => {
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some((ing) =>
        ing.toLowerCase().includes(search.toLowerCase())
      )
    const matchesCategory =
      categoryFilter === 'all' ||
      !categoryFilter ||
      r.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    )
  }

  if (error)
    return (
      <p className="text-red-500 text-2xl min-h-screen flex justify-center items-center">
        Error: {error}
      </p>
    )

  const handleEdit = (recipe: {
    id: string
    name: string
    ingredients: string[]
    instructions: string
    imageUrl?: string
    category?: string
  }) => {
    setEditingRecipe(recipe)
    setEditMode(true)
    setDrawerOpen(true)
  }

  const handleDelete = (id: string) => {
    dispatch(deleteRecipe(id))
  }

  const handleUpdate = (updates: {
    id: string
    name: string
    ingredients: string[]
    instructions: string
    imageUrl?: string
    category?: string
  }) => {
    const { id, ...rest } = updates
    dispatch(updateRecipe({ id, updates: rest }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold text-gray-800">Recipes</h1>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name or ingredient..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <select
                value={categoryFilter}
                onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="all">All Categories</option>
                <option value="Dessert">Dessert</option>
                <option value="Main Course">Main Course</option>
                <option value="Snack">Snack</option>
                <option value="Salad">Salad</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Drink">Drink</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false)
                  setEditingRecipe(null)
                  setDrawerOpen(true)
                }}
                type="button"
              >
                Add New Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        Showing {filtered.length} of {recipeList.length}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={(id) => dispatch(toggleFavoriteLocal(id))}
            disabled={updateLoading || deleteLoading}
          />
        ))}
      </div>

      <RecipeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editMode={editMode}
        recipe={editingRecipe}
        onUpdate={handleUpdate}
      />
    </div>
  )
}

export default RecipesList
