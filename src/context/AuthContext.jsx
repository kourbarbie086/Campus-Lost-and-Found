import { createContext, useContext, useState, useEffect } from 'react'
import { api, getToken, setToken, getStoredUser, setStoredUser } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser())
  const [token, setTokenState] = useState(getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const existingToken = getToken()
    const existingUser = getStoredUser()
    if (existingToken && existingUser) {
      setUser(existingUser)
      setTokenState(existingToken)
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const data = await api.login(credentials)
    // data contains: { accessToken, firstname, lastname, email, role }
    if (data?.accessToken) {
      const authUser = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role: data.role,
      }
      setToken(data.accessToken)
      setStoredUser(authUser)
      setTokenState(data.accessToken)
      setUser(authUser)
      return authUser
    }
    throw new Error('Authentication failed: Missing access token.')
  }

  const signup = async (userData) => {
    return await api.signup(userData)
  }

  const logout = () => {
    setToken(null)
    setStoredUser(null)
    setTokenState('')
    setUser(null)
  }

  const updateCurrentUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser }
    setStoredUser(merged)
    setUser(merged)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
