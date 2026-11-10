import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function ProductDetail() {
  const { id } = useParams()
  const { API_URL, accessToken } = useAuth()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true)
        let response = await fetch(`${API_URL}/productos/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          }
        })

        if (!response.ok) {
          // Fallback a planes si el ID corresponde a un plan
          response = await fetch(`${API_URL}/planes/${id}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            }
          })
          if (!response.ok) {
            throw new Error('No se pudo encontrar el detalle del producto o plan solicitado.')
          }
          const planData = await response.json()
          setProducto({
            id: planData.id,
            nombre: planData.nombre,
            descripcion: planData.descripcion || 'Plan de entrenamiento y nutrición profesional adaptado a tus metas.',
            precio: planData.precio,
            stock: planData.stock !== undefined ? planData.stock : 10,
            duracion_dias: planData.duracion_dias,
            imagen: planData.imagen || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'
          })
          setLoading(false)
          return
        }

        const data = await response.json()
        setProducto(data)
      } catch (err) {
        console.error('Error fetching product detail:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetail()
  }, [API_URL, id, accessToken])

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
            <p className="text-muted mt-2">Cargando detalle del producto...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && producto && (
          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <img 
                src={producto.imagen || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'} 
                alt={producto.nombre} 
                className="img-fluid rounded shadow-sm w-100"
                style={{ maxHeight: '450px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-6">
              <h1 className="fw-bold mb-3">{producto.nombre}</h1>
              <h3 className="text-primary fw-bold mb-4">${producto.precio}</h3>
              
              <div className="mb-4">
                <h5 className="fw-bold text-secondary">Descripción</h5>
                <p className="text-muted">{producto.descripcion || 'Sin descripción disponible.'}</p>
              </div>

              <div className="mb-4">
                <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2`}>
                  {producto.stock !== undefined ? (producto.stock > 0 ? `Stock disponible: ${producto.stock}` : 'Sin stock') : 'Disponible'}
                </span>
                {producto.duracion_dias && (
                  <span className="badge bg-info text-dark fs-6 px-3 py-2 ms-2">
                    Duración: {producto.duracion_dias} días
                  </span>
                )}
              </div>

              <button 
                className="btn btn-dark btn-lg w-100 py-3 mt-2 shadow-sm" 
                disabled
              >
                Agregar al carrito (Próximamente)
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
