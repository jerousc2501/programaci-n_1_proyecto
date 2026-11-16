import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function MisRutinas() {
  const { API_URL, accessToken } = useAuth()
  const [rutinas, setRutinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMisRutinas = async () => {
      const token = accessToken || localStorage.getItem('fittech_access_token')
      if (!token) {
        setError('Debés iniciar sesión para ver tus rutinas personalizadas.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/rutinas-personalizadas/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('No se pudieron cargar tus rutinas personalizadas.')
        }

        const data = await response.json()
        const lista = Array.isArray(data) ? data : data.results || []
        setRutinas(lista)
      } catch (err) {
        console.error('Error al obtener rutinas del cliente:', err)
        setError(err.message || 'Error de conexión con el servidor.')
      } finally {
        setLoading(false)
      }
    }

    fetchMisRutinas()
  }, [API_URL, accessToken])

  const formatPhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return ''
    return String(rawPhone).replace(/\D/g, '')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5 container">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-6">Mis Rutinas Personalizadas</h1>
          <p className="text-muted">
            Revisá los ejercicios e indicaciones asignados por tu profesional
          </p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2">Cargando tus rutinas...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && rutinas.length === 0 && (
          <div className="card shadow-sm border-0 p-5 text-center mx-auto" style={{ maxWidth: '550px' }}>
            <div className="fs-1 mb-3">📋</div>
            <h4 className="fw-bold text-dark mb-2">Aún no tenés rutinas asignadas</h4>
            <p className="text-muted mb-4">
              Cuando tu profesional te asigne una rutina personalizada, vas a poder consultar todos tus ejercicios e indicaciones acá.
            </p>
            <div>
              <Link to="/catalogo" className="btn btn-primary px-4">
                Explorar Planes
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && rutinas.length > 0 && (
          <div className="row g-4">
            {rutinas.map((rutina) => {
              const ejercicios = rutina.ejercicios_detalle || rutina.ejercicios || []
              const profe = rutina.profesional_detalle || {}
              const nombreProfe =
                profe.nombre ||
                profe.first_name ||
                profe.username ||
                'Tu Profesional'
              const telefonoLimpio = formatPhoneForWhatsApp(
                profe.telefono_contacto || profe.telefono
              )
              const fechaFormateada = rutina.creado_en
                ? new Date(rutina.creado_en).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Fecha reciente'

              const mensajeWhatsApp = encodeURIComponent(
                `Hola ${nombreProfe}, te escribo desde FitTech por una consulta sobre mi rutina personalizada (#${rutina.id}).`
              )
              const whatsappUrl = telefonoLimpio
                ? `https://wa.me/${telefonoLimpio}?text=${mensajeWhatsApp}`
                : `https://wa.me/?text=${mensajeWhatsApp}`

              return (
                <div className="col-12 col-lg-6" key={rutina.id}>
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3 px-4">
                      <div>
                        <span className="fw-bold">Rutina #{rutina.id}</span>
                        <small className="d-block text-white-50">
                          Profesional: {nombreProfe}
                          {profe.especialidad ? ` (${profe.especialidad})` : ''}
                        </small>
                      </div>
                      <span className="badge bg-primary">{fechaFormateada}</span>
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      {/* Observaciones */}
                      <div className="mb-4">
                        <h6 className="fw-bold text-uppercase text-muted small mb-2">
                          Observaciones e Indicaciones
                        </h6>
                        <div className="p-3 bg-light rounded border-start border-4 border-primary">
                          <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-line' }}>
                            {rutina.observaciones_texto || 'Sin observaciones adicionales.'}
                          </p>
                        </div>
                      </div>

                      {/* Lista de Ejercicios */}
                      <div className="mb-4 flex-grow-1">
                        <h6 className="fw-bold text-uppercase text-muted small mb-2">
                          Ejercicios Asignados ({ejercicios.length})
                        </h6>
                        {ejercicios.length === 0 ? (
                          <p className="text-muted small mb-0">
                            No se especificaron ejercicios individuales.
                          </p>
                        ) : (
                          <ul className="list-group list-group-flush border rounded">
                            {ejercicios.map((ej) => (
                              <li
                                key={ej.id}
                                className="list-group-item d-flex justify-content-between align-items-start py-2 px-3"
                              >
                                <div className="me-2">
                                  <div className="fw-semibold text-dark">{ej.nombre}</div>
                                  {ej.descripcion && (
                                    <small className="text-muted">{ej.descripcion}</small>
                                  )}
                                </div>
                                <span className="badge bg-secondary text-uppercase">
                                  {ej.grupo_muscular}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Botón de WhatsApp */}
                      <div className="mt-auto pt-3 border-top">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        >
                          <span>💬</span>
                          <span>Consultar a mi Profesional</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default MisRutinas
