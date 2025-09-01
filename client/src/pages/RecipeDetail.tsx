import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router'
import type { AppDispatch, RootState } from '../app/store'
import { fetchRecipeById } from '../features/recipes/recipesSlice'

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()

  const { singleRecipe, loading, error } = useSelector(
    (state: RootState) => state.recipes
  )

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id))
    }
  }, [id, dispatch])

  const steps = useMemo(() => {
    if (!singleRecipe) return []
    const raw = singleRecipe.instructions || ''
    return raw
      .split(/\n|\.|=>/)
      .map((s) => s.trim())
      .filter(Boolean)
  }, [singleRecipe])

  if (loading)
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-600">
        <p className="text-lg animate-pulse">Loading recipe details...</p>
      </div>
    )

  if (error)
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-red-500 font-medium">
        {error}
      </div>
    )

  if (!singleRecipe)
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-700">
        No recipe found.
      </div>
    )

  return (
    <div className="mx-auto mb-16 mt-8 max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-72 w-full bg-gray-100">
        {singleRecipe.imageUrl ? (
          <img
            src={singleRecipe.imageUrl}
            alt={singleRecipe.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Image Provided
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">
            {singleRecipe.name}
          </h1>
          <div className="flex items-center gap-2">
            {singleRecipe.category && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 backdrop-blur">
                {singleRecipe.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-10 p-8 md:grid-cols-5">
        <aside className="md:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Ingredients
          </h2>
          <ul className="space-y-2">
            {singleRecipe.ingredients.map((ing) => (
              <li
                key={ing}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
              >
                {ing}
              </li>
            ))}
          </ul>
        </aside>

        <section className="md:col-span-3">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Cooking Instructions
          </h2>
          {steps.length > 1 ? (
            <ol className="list-inside list-decimal space-y-3 text-gray-800">
              {steps.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-800 leading-relaxed">
              {singleRecipe.instructions}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-gray-500">
            {singleRecipe.favorite && (
              <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                Favorite
              </span>
            )}
            {singleRecipe.category && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700">
                {singleRecipe.category}
              </span>
            )}
          </div>

          <div className="mt-10">
            <Link
              to="/"
              className="inline-block rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              ← Back to Recipes
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RecipeDetail
