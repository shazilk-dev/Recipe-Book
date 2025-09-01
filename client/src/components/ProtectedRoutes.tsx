import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'
import type { RootState } from '../app/store'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return children
}

export default ProtectedRoute
