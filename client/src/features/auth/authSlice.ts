import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URI } from '../../config/api'

const storedAuth = localStorage.getItem('isAuthenticated') === 'true'
const storedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null

interface UserPayload {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

interface AuthResponse {
  user: UserPayload
  token: string
}

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URI}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Signup failed')
      return { user: data.data.user, token: data.token } as AuthResponse
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Signup failed'
      return rejectWithValue(msg)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URI}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Login failed')
      return { user: data.data.user, token: data.token } as AuthResponse
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed'
      return rejectWithValue(msg)
    }
  }
)

interface AuthState {
  isAuthenticated: boolean
  user: UserPayload | null
  loading: boolean
  error: string | null
  token: string | null
}

const storedToken = localStorage.getItem('token')

const initialState: AuthState = {
  isAuthenticated: storedAuth,
  user: storedUser,
  loading: false,
  error: null,
  token: storedToken || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Signup failed'
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Login failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
