import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Catalog() {
  const { API_URL, accessToken } = useAuth()
  const { addToCart } = useCart()
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        setLoading(true)
        setError(null)

        // Consumimos exclusivamente el endpoint de planes validado en el backend
        const response = await fetch(`${API_URL}/planes/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          }
        })

        if (!response.ok) {
          throw new Error('No se pudo cargar el catálogo de planes desde el servidor.')
        }

        const data = await response.json()
        const items = Array.isArray(data) ? data : data.results || []
        
        // Mapeamos los planes con estructura consistente para el catálogo
        const formattedPlanes = items.map(p => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion || 'Plan de entrenamiento y nutrición profesional.',
          precio: p.precio,
          duracion_dias: p.duracion_dias,
          imagen: p.imagen || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60'
        }))

        setPlanes(formattedPlanes)
      } catch (err) {
        console.error('Error fetching planes catalog:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlanes()
  }, [API_URL, accessToken])

  const handleAddToCart = (plan) => {
    addToCart(plan)
    setAddedId(plan.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5 container">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-6">Catálogo de Planes FitTech</h1>
          <p className="text-muted">Explora nuestros planes de entrenamiento y nutrición</p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2">Cargando planes...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && planes.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            No hay planes disponibles en este momento.
          </div>
        )}

        {!loading && !error && planes.length > 0 && (
          <div className="row g-4">
            {planes.map((plan) => (
              <div className="col-12 col-md-6 col-lg-4" key={plan.id}>
                <div className="card h-100 shadow-sm border-0">
                  {plan.imagen && (
                    <img 
                      src={plan.imagen} 
                      className="card-img-top" 
                      alt={plan.nombre} 
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column p-4">
                    <h3 className="card-title h5 fw-bold text-dark">{plan.nombre}</h3>
                    <p className="card-text text-muted small flex-grow-1">
                      {plan.descripcion ? `${plan.descripcion.substring(0, 90)}...` : 'Sin descripción.'}
                    </p>
                    <div className="mb-2">
                      <span className="badge bg-secondary">Duración: {plan.duracion_dias} días</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <span className="fw-bold fs-5 text-primary">${plan.precio}</span>
                      <div className="d-flex gap-2">
                        <Link to={`/producto/${plan.id}`} className="btn btn-outline-primary btn-sm px-2">
                          Detalle
                        </Link>
                        <button 
                          className={`btn btn-sm px-2 ${addedId === plan.id ? 'btn-success' : 'btn-primary'}`}
                          onClick={() => handleAddToCart(plan)}
                        >
                          {addedId === plan.id ? '¡Agregado!' : 'Añadir'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Catalog
