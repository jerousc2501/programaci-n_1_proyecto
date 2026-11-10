import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id } = useParams()
  const { API_URL, accessToken } = useAuth()
  const { addToCart } = useCart()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        // Petición GET exclusiva al endpoint /api/planes/${id}/ con el token JWT de autorización
        const response = await fetch(`${API_URL}/planes/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          }
        })

        if (!response.ok) {
          throw new Error('No se pudo encontrar el detalle del plan solicitado.')
        }

        const data = await response.json()
        setPlan({
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion || 'Plan de entrenamiento y nutrición profesional adaptado a tus metas.',
          precio: data.precio,
          duracion_dias: data.duracion_dias,
          estado: data.estado || 'activo',
          imagen: data.imagen || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'
        })
      } catch (err) {
        console.error('Error fetching plan detail:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlanDetail()
  }, [API_URL, id, accessToken])

  const handleAddToCart = () => {
    if (plan) {
      addToCart(plan)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5 container">
        <div className="mb-4">
          <Link to="/catalogo" className="text-decoration-none text-muted">
            &larr; Volver al catálogo
          </Link>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2">Cargando detalle del plan...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && plan && (
          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <img 
                src={plan.imagen} 
                alt={plan.nombre} 
                className="img-fluid rounded shadow-sm w-100"
                style={{ maxHeight: '450px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-6">
              <h1 className="fw-bold mb-3">{plan.nombre}</h1>
              <h3 className="text-primary fw-bold mb-4">${plan.precio}</h3>
              
              <div className="mb-4">
                <h5 className="fw-bold text-secondary">Descripción</h5>
                <p className="text-muted">{plan.descripcion}</p>
              </div>

              <div className="mb-4">
                <span className="badge bg-info text-dark fs-6 px-3 py-2 me-2">
                  Duración: {plan.duracion_dias} días
                </span>
                <span className={`badge ${plan.estado === 'activo' ? 'bg-success' : 'bg-secondary'} fs-6 px-3 py-2`}>
                  Estado: {plan.estado}
                </span>
              </div>

              <button 
                className={`btn btn-lg w-100 py-3 mt-2 shadow-sm ${added ? 'btn-success' : 'btn-primary'}`}
                onClick={handleAddToCart}
              >
                {added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetail
