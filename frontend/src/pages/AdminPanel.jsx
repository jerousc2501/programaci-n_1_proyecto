import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function AdminPanel() {
  const { API_URL, accessToken, user } = useAuth()
  const [activeTab, setActiveTab] = useState('productos')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        setError(null)
        const endpoint = activeTab === 'productos' ? 'planes' : 'usuarios'
        
        const response = await fetch(`${API_URL}/${endpoint}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          }
        })

        if (!response.ok) {
          throw new Error(`No se pudieron cargar los datos de ${endpoint}.`)
        }

        const data = await response.json()
        setItems(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error('Error in AdminPanel:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [activeTab, API_URL, accessToken])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5 container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold">Panel de Administración</h1>
            <p className="text-muted">Bienvenido, {user?.email || 'Administrador'} (Rol: {user?.rol})</p>
          </div>
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn ${activeTab === 'productos' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('productos')}
            >
              Gestionar Planes / Productos
            </button>
            <button 
              type="button" 
              className={`btn ${activeTab === 'usuarios' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('usuarios')}
            >
              Gestionar Usuarios
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="card shadow-sm border-0 p-4">
            <h3 className="h5 fw-bold mb-3 text-capitalize">Listado de {activeTab}</h3>
            {items.length === 0 ? (
              <p className="text-muted">No hay registros disponibles en esta sección.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre / Email</th>
                      <th>Detalle / Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td className="fw-bold">{item.nombre || item.username || item.email}</td>
                        <td>{item.tipo ? `Tipo: ${item.tipo}` : item.rol ? `Rol: ${item.rol}` : '-'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary me-2">Editar</button>
                          <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default AdminPanel
