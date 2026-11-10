import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function Catalog() {
  const { API_URL, accessToken } = useAuth()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        // Intentamos consumir el endpoint de productos o planes según el backend
        const response = await fetch(`${API_URL}/productos/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          }
        })

        if (!response.ok) {
          // Fallback a planes si productos no está disponible en este módulo
          const fallbackResponse = await fetch(`${API_URL}/planes/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            }
          })
          if (!fallbackResponse.ok) {
            throw new Error('No se pudo cargar el catálogo desde el servidor.')
          }
          const fallbackData = await fallbackResponse.json()
          // Adaptamos los planes como productos para el catálogo si es necesario
          const adapted = (Array.isArray(fallbackData) ? fallbackData : fallbackData.results || []).map(p => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion || 'Plan de entrenamiento y nutrición profesional.',
            precio: p.precio,
            imagen: p.imagen || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60'
          }))
          setProductos(adapted)
          setLoading(false)
          return
        }

        const data = await response.json()
        setProductos(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error('Error fetching catalog:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [API_URL, accessToken])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5 container">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-6">Catálogo de Productos y Planes</h1>
          <p className="text-muted">Explora nuestra selección para potenciar tu rendimiento</p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2">Cargando catálogo...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && productos.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            No hay productos disponibles en este momento.
          </div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div className="row g-4">
            {productos.map((prod) => (
              <div className="col-12 col-md-6 col-lg-4" key={prod.id}>
                <div className="card h-100 shadow-sm border-0">
                  {prod.imagen && (
                    <img 
                      src={prod.imagen} 
                      className="card-img-top" 
                      alt={prod.nombre} 
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column p-4">
                    <h3 className="card-title h5 fw-bold text-dark">{prod.nombre}</h3>
                    <p className="card-text text-muted small flex-grow-1">
                      {prod.descripcion ? `${prod.descripcion.substring(0, 90)}...` : 'Sin descripción.'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <span className="fw-bold fs-5 text-primary">${prod.precio}</span>
                      <Link to={`/producto/${prod.id}`} className="btn btn-outline-primary btn-sm px-3">
                        Ver detalle
                      </Link>
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
