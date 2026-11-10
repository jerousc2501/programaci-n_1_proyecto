import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 my-5 container">
        <h1 className="fw-bold mb-4">Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <h3 className="text-muted mb-3">Tu carrito está vacío</h3>
            <p className="text-muted mb-4">Explora nuestro catálogo y añade planes o productos a tu carrito.</p>
            <Link to="/catalogo" className="btn btn-primary px-4">
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="list-group shadow-sm">
                {cart.map((item) => (
                  <div key={item.id} className="list-group-item d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center gap-3">
                      {item.imagen && (
                        <img 
                          src={item.imagen} 
                          alt={item.nombre} 
                          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      )}
                      <div>
                        <h5 className="mb-1 fw-bold">{item.nombre}</h5>
                        <p className="mb-0 text-muted small">${item.precio} c/u</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="input-group input-group-sm" style={{ width: '110px' }}>
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          className="form-control text-center" 
                          value={item.quantity} 
                          readOnly 
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <span className="fw-bold text-primary" style={{ minWidth: '80px', textAlign: 'right' }}>
                        ${(item.precio * item.quantity).toFixed(2)}
                      </span>

                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={clearCart}>
                  Vaciar Carrito
                </button>
                <Link to="/catalogo" className="btn btn-outline-primary btn-sm">
                  Seguir Comprando
                </Link>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 p-4">
                <h4 className="fw-bold mb-3">Resumen del Pedido</h4>
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Envío / Activación</span>
                  <span>Gratis</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 fs-5 fw-bold text-dark">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="btn btn-success btn-lg w-100 py-3 shadow-sm">
                  Proceder al Pago
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Cart
