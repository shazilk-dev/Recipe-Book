import React from 'react'
import { Link } from 'react-router'
import Button from './Button'

interface Recipe {
  id: string
  name: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  category?: string
  favorite?: boolean
}

interface RecipeCardProps {
  recipe: Recipe
  onEdit: (recipe: Recipe) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  disabled?: boolean
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onEdit,
  onDelete,
  onToggleFavorite,
  disabled = false,
}) => {
  const { imageUrl, category, ingredients, instructions, name, id } = recipe

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200  hover:shadow-xl">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Link to={`/recipes/${id}`} className="flex-1">
            <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
              {name}
            </h2>
          </Link>
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            aria-label={
              recipe.favorite ? 'Remove from favorites' : 'Add to favorites'
            }
            aria-pressed={recipe.favorite}
            className={`shrink-0 -m-1 p-1 transition-colors focus:outline-none ${
              recipe.favorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-gray-400 hover:text-amber-500'
            }`}
          >
            {recipe.favorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path d="M12 21s-1-.75-2.2-1.9C5.4 15.2 2 12.1 2 8.3 2 5.5 4.3 3 7.2 3c1.7 0 3.3.9 4.3 2.1C12.5 3.9 14.1 3 15.8 3 18.7 3 21 5.5 21 8.3c0 3.8-3.4 6.9-7.8 10.8C13 20.2 12 21 12 21z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s-1-.75-2.2-1.9C5.4 15.2 2 12.1 2 8.3 2 5.5 4.3 3 7.2 3c1.7 0 3.3.9 4.3 2.1C12.5 3.9 14.1 3 15.8 3 18.7 3 21 5.5 21 8.3c0 3.8-3.4 6.9-7.8 10.8C13 20.2 12 21 12 21z" />
              </svg>
            )}
          </button>
        </div>

        <div className="mb-3">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Ingredients
          </h3>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-gray-700">
            {ingredients.slice(0, 6).map((ing) => (
              <li key={ing} className="leading-snug">
                {ing}
              </li>
            ))}
            {ingredients.length > 6 && (
              <li className="text-xs text-gray-500">
                +{ingredients.length - 6} more
              </li>
            )}
          </ul>
        </div>

        {/* Instructions (truncated) */}
        <div className="mb-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Instructions
          </h3>
          <p className="line-clamp-4 text-sm leading-snug text-gray-700">
            {instructions}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            disabled={disabled}
            onClick={() => onEdit(recipe)}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            disabled={disabled}
            onClick={() => {
              if (confirm('Delete this recipe?')) onDelete(id)
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
