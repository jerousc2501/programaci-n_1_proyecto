import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fittech_user')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.error('Error al parsear el usuario autenticado:', e)
      localStorage.removeItem('fittech_user')
      return null
    }
  })

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('fittech_access_token') || null
  })

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem('fittech_user', JSON.stringify(userData))
      }
    } catch (err) {
      console.error('Error al obtener el perfil de usuario:', err)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { 
          success: false, 
          message: data.detail || data.non_field_errors?.[0] || 'Credenciales inválidas.' 
        }
      }

      // Guardar access token
      const token = data.access || data.token
      localStorage.setItem('fittech_access_token', token)
      if (data.refresh) {
        localStorage.setItem('fittech_refresh_token', data.refresh)
      }
      setAccessToken(token)

      // Obtener el perfil completo del usuario (/auth/me/)
      await fetchUserProfile(token)

      return { success: true }
    } catch (err) {
      console.error('Error en login:', err)
      return { success: false, message: 'Error de conexión con el servidor.' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          email: userData.email.trim().toLowerCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = Object.values(data).flat()[0] || 'Error al registrar usuario.'
        return { success: false, message: errorMsg }
      }

      // Login automático post-registro
      return await login(userData.email, userData.password)
    } catch (err) {
      console.error('Error en registro:', err)
      return { success: false, message: 'Error de conexión con el servidor.' }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('fittech_refresh_token')
      if (accessToken && refreshToken) {
        await fetch(`${API_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ refresh: refreshToken })
        })
      }
    } catch (err) {
      console.error('Error al invalidar token en backend:', err)
    } finally {
      setUser(null)
      setAccessToken(null)
      localStorage.removeItem('fittech_user')
      localStorage.removeItem('fittech_access_token')
      localStorage.removeItem('fittech_refresh_token')
    }
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, API_URL, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
