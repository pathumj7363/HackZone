import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth()
  
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Wrong role -> redirect to that role's home
    if (user.role === 'participant') return <Navigate to="/dashboard" replace />
    if (user.role === 'organizer') return <Navigate to="/organizer" replace />
    if (user.role === 'judge') return <Navigate to="/judge" replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to="/" replace />
  }

  return children
}