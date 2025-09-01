import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { API_URI } from '../../config/api'

interface Recipe {
  id: string
  name: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  category?: string
  favorite?: boolean
}

export interface RecipesState {
  recipeList: Recipe[]
  singleRecipe: Recipe | null
  loading: boolean
  error: string
  addLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  search: string
  categoryFilter: string
}

const initialState: RecipesState = {
  recipeList: [],
  singleRecipe: null,
  loading: false,
  error: '',
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  search: '',
  categoryFilter: 'all',
}

export const fetchRecipes = createAsyncThunk(
  'fetchRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URI}/recipes`)
      if (!res.ok) {
        return rejectWithValue('Failed to fetch recipes')
      }
      const data = await res.json()
      return data.data.recipes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unexpected error')
    }
  }
)

export const addNewRecipe = createAsyncThunk(
  'addNewRecipe',
  async (recipe: Recipe, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URI}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(recipe),
      })

      if (!res.ok) {
        return rejectWithValue('Failed to add recipe')
      }

      const data = await res.json()
      console.log('data', data)

      return data.data.newRecipe
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unexpected error')
    }
  }
)

export const fetchRecipeById = createAsyncThunk(
  'fetchRecipeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URI}/recipes/${id}`)
      if (!res.ok) {
        return rejectWithValue('Failed to fetch recipe')
      }
      const data = await res.json()
      return data.data.recipe
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unexpected error')
    }
  }
)

// UPDATE recipe
export const updateRecipe = createAsyncThunk(
  'updateRecipe',
  async (
    { id, updates }: { id: string; updates: Partial<Recipe> },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URI}/recipes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      })
      if (!res.ok) return rejectWithValue('Failed to update recipe')
      const data = await res.json()
      return data.data.recipe as Recipe
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unexpected error')
    }
  }
)

// DELETE recipe
export const deleteRecipe = createAsyncThunk(
  'deleteRecipe',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URI}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) return rejectWithValue('Failed to delete recipe')
      return id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unexpected error')
    }
  }
)

const LS_KEY = 'kindKitchenRecipes'

const loadFromLS = (): Recipe[] | null => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const saveToLS = (recipes: Recipe[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(recipes))
  } catch {
    /* ignore */
  }
}

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.categoryFilter = action.payload
    },
    toggleFavoriteLocal(state, action: PayloadAction<string>) {
      const r = state.recipeList.find((rec) => rec.id === action.payload)
      if (r) {
        r.favorite = !r.favorite
        if (state.singleRecipe?.id === r.id) {
          state.singleRecipe.favorite = r.favorite
        }
        saveToLS(state.recipeList)
      }
    },
    hydrateFromLocal(state) {
      const persisted = loadFromLS()
      if (persisted) {
        state.recipeList = persisted
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(
        fetchRecipes.fulfilled,
        (state, action: PayloadAction<Recipe[]>) => {
          state.loading = false
          const existing = loadFromLS()
          if (existing) {
            const map = new Map(existing.map((r) => [r.id, r]))
            state.recipeList = action.payload.map((srv) => ({
              ...srv,
              ...(map.get(srv.id) || {}),
            }))
          } else {
            state.recipeList = action.payload
          }
          saveToLS(state.recipeList)
        }
      )
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Error in fetch data'
      })
      .addCase(addNewRecipe.pending, (state) => {
        state.addLoading = true
        state.error = ''
      })
      .addCase(
        addNewRecipe.fulfilled,
        (state, action: PayloadAction<Recipe>) => {
          console.log('addNewRecipe', action.payload)
          state.addLoading = false
          state.recipeList.push(action.payload)
          saveToLS(state.recipeList)
        }
      )
      .addCase(addNewRecipe.rejected, (state, action) => {
        state.addLoading = false
        state.error = (action.payload as string) || 'Error in post data'
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(
        fetchRecipeById.fulfilled,
        (state, action: PayloadAction<Recipe>) => {
          state.loading = false
          state.singleRecipe = action.payload
        }
      )
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || 'Error in fetch single recipe'
      })
      // UPDATE
      .addCase(updateRecipe.pending, (state) => {
        state.updateLoading = true
        state.error = ''
      })
      .addCase(
        updateRecipe.fulfilled,
        (state, action: PayloadAction<Recipe>) => {
          state.updateLoading = false
          const idx = state.recipeList.findIndex(
            (r) => r.id === action.payload.id
          )
          if (idx !== -1) state.recipeList[idx] = action.payload
          if (state.singleRecipe?.id === action.payload.id) {
            state.singleRecipe = action.payload
          }
          saveToLS(state.recipeList)
        }
      )
      .addCase(updateRecipe.rejected, (state, action) => {
        state.updateLoading = false
        state.error = (action.payload as string) || 'Error updating recipe'
      })
      // DELETE
      .addCase(deleteRecipe.pending, (state) => {
        state.deleteLoading = true
        state.error = ''
      })
      .addCase(
        deleteRecipe.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteLoading = false
          state.recipeList = state.recipeList.filter(
            (r) => r.id !== action.payload
          )
          if (state.singleRecipe?.id === action.payload) {
            state.singleRecipe = null
          }
          saveToLS(state.recipeList)
        }
      )
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = (action.payload as string) || 'Error deleting recipe'
      })
  },
})

export const {
  setSearch,
  setCategoryFilter,
  toggleFavoriteLocal,
  hydrateFromLocal,
} = recipeSlice.actions

export default recipeSlice.reducer
