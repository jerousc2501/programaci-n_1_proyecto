import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const FEATURES = [
    { id: 'planes', icon: '🏋️‍♂️', title: 'Explorar Planes', desc: 'Descubrí planes personalizados para tus objetivos.', linkText: 'Ver más' },
    { id: 'pros', icon: '🥗', title: 'Profesionales', desc: 'Conectá con entrenadores y nutricionistas certificados.', linkText: 'Conocer más' },
    { id: 'ritmo', icon: '⚡', title: 'Tu Plan, Tu Ritmo', desc: 'Comprá y seguí tu progreso con total flexibilidad.', linkText: 'Empezar' }
  ]

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar con bienvenida y logout */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">FitTech</a>
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
              <li className="nav-item me-3 text-white-50">
                ¡Hola, <span className="text-white fw-bold">{user?.name || user?.email}</span>! ({user?.rol})
              </li>
              <li className="nav-item">
                <button 
                  onClick={logout} 
                  className="btn btn-outline-light btn-sm px-3"
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 my-5">
        <section className="container mb-5">
          <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border text-center">
            <div className="container-fluid py-5">
              <h1 className="display-5 fw-bold text-dark">Bienvenido a FitTech, {user?.name || 'Usuario'}</h1>
              <p className="col-md-8 fs-4 mx-auto text-muted my-3">
                Tu plataforma integral de Fitness y Nutrición. Conectamos profesionales con personas que buscan mejorar su estilo de vida.
              </p>
              <a className="btn btn-primary btn-lg px-4 gap-3 mt-2" href="#planes">Explorar Planes</a>
            </div>
          </div>
        </section>

        <section className="container" id="planes">
          <div className="row g-4">
            {FEATURES.map((item) => (
              <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center p-4">
                    <div className="mb-3 text-primary fs-1">{item.icon}</div>
                    <h3 className="card-title h5 fw-bold">{item.title}</h3>
                    <p className="card-text text-muted">{item.desc}</p>
                    <a href="#" className="btn btn-outline-primary btn-sm mt-3" onClick={(e) => e.preventDefault()}>{item.linkText}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-auto shadow-sm">
        <div className="container">
          <p className="mb-0 text-white-50">&copy; {new Date().getFullYear()} FitTech - Plataforma de Fitness y Nutrición. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
