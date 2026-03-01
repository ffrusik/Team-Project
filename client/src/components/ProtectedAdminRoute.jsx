import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode' // ?

function ProtectedAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsAdmin(false)
      return
    }

    try {
      const decoded = jwtDecode(token)
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAdmin(false)
        return
      }

      // Check role
      setIsAdmin(decoded.role === 'ADMIN')
    } catch (error) {
      console.error('Invalid token', error)
      localStorage.removeItem('token')
      setIsAdmin(false)
    }
  }, []);

  // Show loading while checking
  if (isAdmin === null) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Checking access...</div>;
  }

  // Not admin or not logged in -> redirect
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Is admin -> render the child route (dashboard page)
  return <Outlet />;
}

export default ProtectedAdminRoute