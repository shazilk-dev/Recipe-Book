import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import Button from './Button'
import Drawer from './Drawer'
import Input from './Input'
import { addNewRecipe } from '../features/recipes/recipesSlice'

interface RecipeDrawerProps {
  open: boolean
  onClose: () => void
  editMode?: boolean
  // partial recipe for editing
  recipe?: {
    id: string
    name: string
    ingredients: string[]
    instructions: string
    imageUrl?: string
    category?: string
  } | null
  onUpdate?: (recipe: {
    id: string
    name: string
    ingredients: string[]
    instructions: string
    imageUrl?: string
    category?: string
  }) => void
}

const RecipeDrawer: React.FC<RecipeDrawerProps> = ({
  open,
  onClose,
  editMode = false,
  recipe,
  onUpdate,
}) => {
  const { addLoading } = useSelector((state: RootState) => state.recipes)
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    ingredients: recipe?.ingredients || [''],
    instructions: recipe?.instructions || '',
    imageUrl: recipe?.imageUrl || '',
    category: recipe?.category || '',
  })

  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  // Reset / prefill when recipe changes or drawer opens

  useEffect(() => {
    if (open) {
      setFormData({
        name: recipe?.name || '',
        ingredients: recipe?.ingredients || [''],
        instructions: recipe?.instructions || '',
        imageUrl: recipe?.imageUrl || '',
        category: recipe?.category || '',
      })
      setErrors({})
    }
  }, [recipe, open])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleIngredientChange = (idx: number, value: string) => {
    setFormData((f) => {
      const clone = [...f.ingredients]
      clone[idx] = value
      return { ...f, ingredients: clone }
    })
  }

  const addIngredient = () => {
    setFormData((f) => ({ ...f, ingredients: [...f.ingredients, ''] }))
  }

  const removeIngredient = (idx: number) => {
    setFormData((f) => ({
      ...f,
      ingredients: f.ingredients.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors: { [k: string]: string } = {}
    if (!formData.name.trim()) validationErrors.name = 'Name is required'
    const cleanedIngredients = formData.ingredients
      .map((i) => i.trim())
      .filter(Boolean)
    if (cleanedIngredients.length === 0)
      validationErrors.ingredients = 'At least one ingredient'
    if (!formData.instructions.trim())
      validationErrors.instructions = 'Instructions required'

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    const base = {
      name: formData.name.trim(),
      ingredients: cleanedIngredients,
      instructions: formData.instructions.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
      category: formData.category.trim() || undefined,
    }

    if (editMode && recipe && onUpdate) {
      onUpdate({ id: recipe.id, ...base })
    } else {
      const newRecipe = { id: crypto.randomUUID(), ...base }
      dispatch(addNewRecipe(newRecipe))
    }
    onClose()
    setFormData({
      name: '',
      ingredients: [''],
      instructions: '',
      imageUrl: '',
      category: '',
    })
  }

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      title={editMode ? 'Edit Recipe' : 'Add New Recipe'}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <Input
            label="Recipe Name *"
            name="name"
            placeholder="Enter recipe name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Ingredients dynamic */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Ingredients *
          </label>
          <div className="space-y-2">
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Ingredient ${idx + 1}`}
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="rounded-md border border-red-300 p-2 text-red-500 hover:bg-red-50"
                    aria-label="Remove ingredient"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              <Plus size={14} /> Add Ingredient
            </button>
          </div>
          {errors.ingredients && (
            <p className="mt-1 text-xs text-red-500">{errors.ingredients}</p>
          )}
        </div>

        {/* Instructions */}
        <div>
          <label
            htmlFor="instructions"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Cooking Instructions *
          </label>
          <textarea
            id="instructions"
            name="instructions"
            rows={4}
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Describe the steps..."
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.instructions && (
            <p className="mt-1 text-xs text-red-500">{errors.instructions}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <Input
            label="Image URL"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {formData.imageUrl && (
            <div className="mt-2 overflow-hidden rounded-lg border">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="max-h-40 w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Dessert">Dessert</option>
            <option value="Main Course">Main Course</option>
            <option value="Snack">Snack</option>
            <option value="Salad">Salad</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Drink">Drink</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={addLoading}>
            {addLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editMode ? (
              'Update'
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

export default RecipeDrawer
