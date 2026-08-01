import React, { createContext, useState, useEffect } from 'react'
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored && stored !== 'undefined') {
      try {
        setUser(JSON.parse(stored))
      } catch (err) {
        console.error('Failed to parse user from localStorage', err)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', jwt)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}