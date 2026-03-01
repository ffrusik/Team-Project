import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsAuthenticated(false)
      return
    }

    try {
      const decoded = jwtDecode(token)
      // Check if token expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error('Invalid token', error)
      localStorage.removeItem('token')
      setIsAuthenticated(false)
    }
  }, [])

  if (isAuthenticated === null) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Checking authentication...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}