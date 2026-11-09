import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const res = register({ name, email, password })
    if (res.success) {
      navigate('/')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="text-center mb-4 fw-bold text-dark">Registro</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted">Nombre y Apellido</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: tu@email.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2 mt-2">
            Registrarse
          </button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </small>
        </div>
      </div>
    </div>
  )
}

export default Register
