import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import type { RootState } from '../app/store'
import type { ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

export default PublicRoute
