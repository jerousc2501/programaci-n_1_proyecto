import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user, accessToken, API_URL } = useAuth()
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/planes/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          }
        })

        if (!response.ok) {
          throw new Error('No se pudo obtener la información de los planes desde la API.')
        }

        const data = await response.json()
        setPlanes(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error('Error fetching planes:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlanes()
  }, [API_URL, accessToken])

  const FEATURES = [
    { id: 'planes', icon: '🏋️‍♂️', title: 'Explorar Planes', desc: 'Descubrí planes personalizados para tus objetivos.', linkText: 'Ver más' },
    { id: 'pros', icon: '🥗', title: 'Profesionales', desc: 'Conectá con entrenadores y nutricionistas certificados.', linkText: 'Conocer más' },
    { id: 'ritmo', icon: '⚡', title: 'Tu Plan, Tu Ritmo', desc: 'Comprá y seguí tu progreso con total flexibilidad.', linkText: 'Empezar' }
  ]

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5">
        <section className="container mb-5">
          <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border text-center">
            <div className="container-fluid py-5">
              <h1 className="display-5 fw-bold text-dark">Bienvenido a FitTech, {user?.email || 'Usuario'}</h1>
              <p className="col-md-8 fs-4 mx-auto text-muted my-3">
                Tu plataforma integral de Fitness y Nutrición conectada con Django REST Framework.
              </p>
              <a className="btn btn-primary btn-lg px-4 gap-3 mt-2" href="#catalogo">Ver Planes Disponibles</a>
            </div>
          </div>
        </section>

        {/* Sección de Datos Protegidos desde la API (Django) */}
        <section className="container mb-5" id="catalogo">
          <h2 className="mb-4 text-center fw-bold">Planes de la API (Backend Django)</h2>
          
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-2">Cargando planes desde el servidor...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && planes.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              No hay planes registrados en el backend actualmente.
            </div>
          )}

          {!loading && !error && planes.length > 0 && (
            <div className="row g-4">
              {planes.map((plan) => (
                <div className="col-12 col-md-6 col-lg-4" key={plan.id}>
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body p-4 d-flex flex-column">
                      <h3 className="card-title h5 fw-bold text-primary">{plan.nombre}</h3>
                      <p className="card-text text-muted small mb-2">Tipo: {plan.tipo}</p>
                      <p className="card-text flex-grow-1">{plan.descripcion || 'Sin descripción detallada.'}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <span className="fw-bold fs-5 text-dark">${plan.precio}</span>
                        <span className="badge bg-secondary">{plan.duracion_dias} días</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Static Features Section */}
        <section className="container">
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

      <Footer />
    </div>
  )
}

export default Home
