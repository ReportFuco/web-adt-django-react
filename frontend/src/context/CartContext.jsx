import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Verifica si un producto está en el carrito
  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  // Agregar al carrito con validación de stock
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      // Si el producto ya está en el carrito
      if (existingItem) {
        // Validar stock
        if (existingItem.quantity >= product.stock) {
          console.warn("No hay suficiente stock disponible");
          return prevCart; // No hacer cambios
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Si es un producto nuevo en el carrito
      if (product.stock <= 0) {
        console.warn("Producto sin stock");
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Eliminar producto
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Actualizar cantidad con validación de stock
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          // Validar que no exceda el stock
          const maxQuantity = item.stock;
          const finalQuantity = Math.min(newQuantity, maxQuantity);

          if (newQuantity > maxQuantity) {
            console.warn(`No puedes agregar más de ${maxQuantity} unidades`);
          }

          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };

  // Total de items (suma de cantidades)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Total a pagar (precio * cantidad)
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
