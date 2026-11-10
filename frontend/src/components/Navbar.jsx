import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const isStaffOrAdminOrVendor = user && (user.is_staff || ['admin', 'vendedor'].includes(user?.rol?.toLowerCase()))

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">FitTech</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse justify-content-end ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/catalogo">Catálogo</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/carrito">
                    Carrito
                    {totalItems > 0 && <span className="badge bg-primary ms-1">{totalItems}</span>}
                  </Link>
                </li>
                {isStaffOrAdminOrVendor && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning" to="/admin">Admin</Link>
                  </li>
                )}
                <li className="nav-item me-3 text-white-50 ms-lg-3">
                  ¡Hola, <span className="text-white fw-bold">{user.name || user.email}</span>!
                </li>
                <li className="nav-item">
                  <button 
                    onClick={logout} 
                    className="btn btn-outline-light btn-sm px-3"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">Registro</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
