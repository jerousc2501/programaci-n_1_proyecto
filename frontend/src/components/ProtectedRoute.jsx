import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    const rolesAllowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const userRole = user.rol ? user.rol.toLowerCase() : ''
    const isStaff = user.is_staff || false

    const hasPermission = isStaff || rolesAllowed.some((r) => r.toLowerCase() === userRole)

    if (!hasPermission) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
