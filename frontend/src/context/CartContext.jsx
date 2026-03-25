import { createContext, useContext, useState, useEffect } from "react";

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
      const requestedQuantity = Math.max(1, Number(product.quantity) || 1);
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          console.warn("No hay suficiente stock disponible");
          return prevCart;
        }

        const nextQuantity = Math.min(
          existingItem.quantity + requestedQuantity,
          product.stock
        );

        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        );
      }

      if (product.stock <= 0) {
        console.warn("Producto sin stock");
        return prevCart;
      }

      return [
        ...prevCart,
        { ...product, quantity: Math.min(requestedQuantity, product.stock) },
      ];
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

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.precio ?? item.price ?? 0) * item.quantity,
    0
  );

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
