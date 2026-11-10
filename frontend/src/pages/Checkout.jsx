import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    tarjeta: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulando envío de pedido al backend
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      clearCart()
    }, 1500)
  }

  if (success) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 my-5 container text-center">
          <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-4 text-success fs-1">✅</div>
            <h2 className="fw-bold mb-3">¡Pedido realizado con éxito!</h2>
            <p className="text-muted mb-4">
              Gracias por tu compra en FitTech. Hemos procesado tu orden correctamente y los planes o productos ya se encuentran disponibles en tu cuenta.
            </p>
            <button className="btn btn-primary px-4 py-2" onClick={() => navigate('/catalogo')}>
              Volver al Catálogo
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cart.length === 0) {
    navigate('/carrito', { replace: true })
    return null
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5 container" style={{ maxWidth: '800px' }}>
        <h1 className="fw-bold mb-4 text-center">Finalizar Compra</h1>

        <div className="row g-5">
          <div className="col-md-7">
            <div className="card shadow-sm border-0 p-4">
              <h4 className="fw-bold mb-3">Datos de Envío y Pago</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Dirección de facturación</label>
                  <input
                    type="text"
                    className="form-control"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Av. Siempre Viva 123"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Número de Tarjeta</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tarjeta"
                    value={formData.tarjeta}
                    onChange={handleChange}
                    placeholder="**** **** **** 1234"
                    maxLength={16}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-success w-100 py-3 mt-3 shadow-sm fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Procesando pago...' : `Pagar $${totalPrice.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-sm border-0 p-4 bg-light">
              <h4 className="fw-bold mb-3">Tu Pedido</h4>
              <ul className="list-group list-group-flush mb-3 bg-transparent">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                    <div>
                      <h6 className="my-0">{item.nombre}</h6>
                      <small className="text-muted">Cant: {item.quantity}</small>
                    </div>
                    <span className="text-muted">${(item.precio * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Checkout
