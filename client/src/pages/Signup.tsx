import { LoaderCircle } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../features/auth/authSlice'
import type { AppDispatch, RootState } from '../app/store'

function Signup() {
  const [user, setUser] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({ name: '', email: '', password: '' })
  const [showLoader, setShowLoader] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const authError = useSelector((s: RootState) => s.auth.error)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const newErrors = { name: '', email: '', password: '' }

    if (!user.name.trim()) {
      newErrors.name = 'Please enter your name.'
    }

    if (!user.email.trim()) {
      newErrors.email = 'Please enter a valid email.'
    }

    if (!user.password.trim()) {
      newErrors.password = 'Password cannot be empty.'
    }

    if (newErrors.name || newErrors.email || newErrors.password) {
      setErrors(newErrors)
      return
    }

    setShowLoader(true)
    dispatch(signupUser(user))
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch(() => {})
      .finally(() => setShowLoader(false))
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-10">
      <div className="w-full max-w-[480px] rounded-2xl border border-orange-200 bg-white/95 backdrop-blur-sm shadow-sm p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 h-20 w-20 overflow-hidden rounded-full  flex items-center justify-center bg-white">
            <img
              src="/recipe-logo.png"
              alt="Kind Kitchen"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Join <span className="font-medium">Kind Kitchen</span> and start
            saving recipes.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              label="Full Name"
              name="name"
              placeholder="Shazil Khan"
              value={user.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="you@example.com"
              value={user.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              label="Password"
              name="password"
              placeholder="••••••••"
              value={user.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          {authError && (
            <p className="text-sm text-red-600 -mt-2">{authError}</p>
          )}
          <Button disabled={showLoader} type="submit">
            {showLoader ? (
              <LoaderCircle className="animate-spin" color="#fff" />
            ) : (
              'Create account'
            )}
          </Button>
        </form>
        <div className="mt-8 flex items-center justify-center gap-1 text-sm text-slate-600">
          <span>Already cooking with us?</span>
          <Link
            to="/login"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
