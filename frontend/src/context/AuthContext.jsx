import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // Usuarios hardcodeados iniciales para pruebas del TP7
  const [mockUsers, setMockUsers] = useState([
    { id: 1, email: 'admin@fittech.com', password: '123', name: 'Administrador', rol: 'admin' },
    { id: 2, email: 'cliente@fittech.com', password: '123', name: 'Cliente Fit', rol: 'cliente' }
  ])

  // Intentar cargar usuario guardado en localStorage si existe
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fittech_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email, password) => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    )
    if (found) {
      setUser(found)
      localStorage.setItem('fittech_user', JSON.stringify(found))
      return { success: true }
    }
    return { success: false, message: 'Credenciales inválidas (ej: admin@fittech.com / 123)' }
  }

  const register = (userData) => {
    // Verificar si ya existe
    const exists = mockUsers.find((u) => u.email === userData.email)
    if (exists) {
      return { success: false, message: 'El correo electrónico ya está registrado.' }
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      rol: userData.rol || 'cliente'
    }

    setMockUsers([...mockUsers, newUser])
    setUser(newUser)
    localStorage.setItem('fittech_user', JSON.stringify(newUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fittech_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
