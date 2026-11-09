import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // Recuperar usuarios mock de localStorage o usar los predeterminados
  const [mockUsers, setMockUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('fittech_users')
      if (savedUsers) {
        return JSON.parse(savedUsers)
      }
    } catch (e) {
      console.error('Error al parsear usuarios guardados:', e)
    }
    return [
      { id: 1, email: 'admin@fittech.com', password: '123456', name: 'Administrador', rol: 'admin' },
      { id: 2, email: 'cliente@fittech.com', password: '123456', name: 'Cliente Fit', rol: 'cliente' }
    ]
  })

  // Recuperar usuario autenticado de localStorage con manejo de errores seguro (try/catch)
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

  const login = (rawEmail, password) => {
    const email = rawEmail.trim().toLowerCase()
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    )
    if (found) {
      // Excluir la contraseña para que no quede expuesta en el objeto de sesión
      const { password: _, ...userWithoutPassword } = found
      setUser(userWithoutPassword)
      localStorage.setItem('fittech_user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, message: 'Credenciales inválidas (ej: admin@fittech.com / 123)' }
  }

  const register = (userData) => {
    const email = userData.email.trim().toLowerCase()
    
    // Verificar si ya existe
    const exists = mockUsers.find((u) => u.email === email)
    if (exists) {
      return { success: false, message: 'El correo electrónico ya está registrado.' }
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      email,
      rol: userData.rol || 'cliente'
    }

    const updatedUsers = [...mockUsers, newUser]
    setMockUsers(updatedUsers)
    localStorage.setItem('fittech_users', JSON.stringify(updatedUsers))

    // Excluir la contraseña del estado de sesión activa
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('fittech_user', JSON.stringify(userWithoutPassword))

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
