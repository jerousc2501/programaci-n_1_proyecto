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

  const login = async (email, password) => {
    try {
      // DRF SimpleJWT espera 'username' o 'email' dependiendo de la config. Aquí enviamos email y password.
      const response = await fetch(`${API_URL}/token/`, {
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

      // Guardar tokens
      localStorage.setItem('fittech_access_token', data.access)
      localStorage.setItem('fittech_refresh_token', data.refresh)
      setAccessToken(data.access)

      // Obtener datos del usuario autenticado si el backend lo provee, o simular perfil básico
      const userData = { email: email.trim().toLowerCase() }
      setUser(userData)
      localStorage.setItem('fittech_user', JSON.stringify(userData))

      return { success: true }
    } catch (err) {
      console.error('Error en login:', err)
      return { success: false, message: 'Error de conexión con el servidor.' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register/`, {
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
        // Formatear errores de DRF
        const errorMsg = Object.values(data).flat()[0] || 'Error al registrar usuario.'
        return { success: false, message: errorMsg }
      }

      // Una vez registrado exitosamente, hacer login automático
      return await login(userData.email, userData.password)
    } catch (err) {
      console.error('Error en registro:', err)
      return { success: false, message: 'Error de conexión con el servidor.' }
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem('fittech_user')
    localStorage.removeItem('fittech_access_token')
    localStorage.removeItem('fittech_refresh_token')
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, API_URL, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
