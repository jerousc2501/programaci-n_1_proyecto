import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function CrearRutina() {
  const { API_URL, accessToken } = useAuth()

  const [clientes, setClientes] = useState([])
  const [ejercicios, setEjercicios] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([])
  const [observaciones, setObservaciones] = useState('')

  const [loadingData, setLoadingData] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = accessToken || localStorage.getItem('fittech_access_token')
      if (!token) {
        setError('No se encontró un token de autenticación válido.')
        setLoadingData(false)
        return
      }

      try {
        setLoadingData(true)
        setError(null)

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }

        const [resUsuarios, resEjercicios] = await Promise.all([
          fetch(`${API_URL}/usuarios/`, { method: 'GET', headers }),
          fetch(`${API_URL}/ejercicios/`, { method: 'GET', headers }),
        ])

        if (!resUsuarios.ok) {
          throw new Error('No se pudo obtener el listado de clientes.')
        }
        if (!resEjercicios.ok) {
          throw new Error('No se pudo obtener el catálogo de ejercicios.')
        }

        const dataUsuarios = await resUsuarios.json()
        const dataEjercicios = await resEjercicios.json()

        const listaUsuarios = Array.isArray(dataUsuarios) ? dataUsuarios : dataUsuarios.results || []
        const listaEjercicios = Array.isArray(dataEjercicios) ? dataEjercicios : dataEjercicios.results || []

        // Filtrar únicamente usuarios con rol 'cliente'
        const soloClientes = listaUsuarios.filter(
          (u) => u.rol && u.rol.toLowerCase() === 'cliente'
        )

        setClientes(soloClientes)
        setEjercicios(listaEjercicios)
      } catch (err) {
        console.error('Error cargando datos para CrearRutina:', err)
        setError(err.message || 'Error al cargar los datos iniciales.')
      } finally {
        setLoadingData(false)
      }
    }

    fetchInitialData()
  }, [API_URL, accessToken])

  const handleToggleEjercicio = (id) => {
    setEjerciciosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg('')

    if (!clienteId) {
      setError('Por favor, seleccioná un cliente.')
      return
    }

    if (ejerciciosSeleccionados.length === 0) {
      setError('Por favor, seleccioná al menos un ejercicio para la rutina.')
      return
    }

    const token = accessToken || localStorage.getItem('fittech_access_token')
    setSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/rutinas-personalizadas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cliente: Number(clienteId),
          ejercicios: ejerciciosSeleccionados,
          observaciones_texto: observaciones.trim(),
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        const msg =
          errData.detail ||
          Object.values(errData).flat()[0] ||
          'No se pudo guardar la rutina personalizada.'
        throw new Error(msg)
      }

      setSuccessMsg('¡Rutina personalizada creada y asignada con éxito!')
      setClienteId('')
      setEjerciciosSeleccionados([])
      setObservaciones('')
    } catch (err) {
      console.error('Error al crear rutina personalizada:', err)
      setError(err.message || 'Ocurrió un error al guardar la rutina.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingData) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando clientes y ejercicios...</p>
      </div>
    )
  }

  return (
    <div className="card shadow-sm border-0 p-4">
      <h3 className="h5 fw-bold mb-4 text-dark">Crear y Asignar Rutina Personalizada</h3>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success py-2" role="alert">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Selección de Cliente */}
        <div className="mb-4">
          <label htmlFor="selectCliente" className="form-label fw-semibold">
            Seleccionar Cliente
          </label>
          <select
            id="selectCliente"
            className="form-select"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          >
            <option value="">-- Elegí un cliente --</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.first_name || cliente.username} ({cliente.email})
              </option>
            ))}
          </select>
          {clientes.length === 0 && (
            <small className="text-muted d-block mt-1">
              No se encontraron usuarios registrados con el rol de cliente.
            </small>
          )}
        </div>

        {/* Selección de Ejercicios */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label fw-semibold mb-0">
              Seleccionar Ejercicios
            </label>
            <span className="badge bg-primary">
              {ejerciciosSeleccionados.length} seleccionado(s)
            </span>
          </div>

          {ejercicios.length === 0 ? (
            <div className="alert alert-info py-2 mb-0">
              No hay ejercicios cargados en el sistema todavía.
            </div>
          ) : (
            <div className="row g-2" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {ejercicios.map((ejercicio) => {
                const isSelected = ejerciciosSeleccionados.includes(ejercicio.id)
                return (
                  <div className="col-12 col-md-6" key={ejercicio.id}>
                    <div
                      onClick={() => handleToggleEjercicio(ejercicio.id)}
                      className={`p-3 rounded border d-flex align-items-start gap-2 ${
                        isSelected ? 'border-primary bg-primary bg-opacity-10' : 'bg-light'
                      }`}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input mt-1"
                        checked={isSelected}
                        onChange={() => {}}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-dark">{ejercicio.nombre}</span>
                          <span className="badge bg-secondary text-uppercase">
                            {ejercicio.grupo_muscular}
                          </span>
                        </div>
                        {ejercicio.descripcion && (
                          <small className="text-muted d-block mt-1">
                            {ejercicio.descripcion}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Observaciones de la Rutina */}
        <div className="mb-4">
          <label htmlFor="textareaObservaciones" className="form-label fw-semibold">
            Observaciones e Indicaciones
          </label>
          <textarea
            id="textareaObservaciones"
            className="form-control"
            rows={4}
            placeholder="Ej: Realizar 4 series de 12 repeticiones por ejercicio. Descanso de 90 segundos entre series..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-bold"
          disabled={submitting}
        >
          {submitting ? 'Guardando rutina...' : 'Asignar Rutina Personalizada'}
        </button>
      </form>
    </div>
  )
}

export default CrearRutina
