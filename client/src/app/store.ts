// import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit'
import recipeReducer from '../features/recipes/recipesSlice'
import authReducer from '../features/auth/authSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    auth: authReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// // Infer the type of `store`
// export type AppStore = typeof store
// // Infer the `AppDispatch` type from the store itself
// export type AppDispatch = typeof store.dispatch
// // Same for the `RootState` type
// export type RootState = ReturnType<typeof store.getState>
// // Export a reusable type for handwritten thunks
// export type AppThunk = ThunkAction<void, RootState, unknown, Action>
