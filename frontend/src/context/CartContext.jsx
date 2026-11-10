import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('fittech_cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (e) {
      console.error('Error al cargar el carrito:', e)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('fittech_cart', JSON.stringify(cart))
    } catch (e) {
      console.error('Error al guardar el carrito:', e)
    }
  }, [cart])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id)
      if (existingIndex > -1) {
        const updated = [...prevCart]
        updated[existingIndex].quantity += (product.quantity || 1)
        return updated
      } else {
        return [...prevCart, { ...product, quantity: product.quantity || 1 }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.precio || 0) * item.quantity), 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
