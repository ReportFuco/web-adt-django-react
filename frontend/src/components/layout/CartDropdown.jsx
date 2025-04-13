// components/layout/CartDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CartDropdown = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, cartTotal } =
    useCart();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success("Producto eliminado del carrito");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del carrito */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Carrito de compras (${totalItems} items)`}
        aria-expanded={isOpen}
        className="relative p-2 group"
      >
        <svg
          className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
          absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-100
          ${
            window.innerWidth < 640
              ? "fixed bottom-0 left-0 w-full max-h-[70vh] rounded-b-none overflow-y-auto"
              : "max-h-[80vh] overflow-y-auto"
          }
        `}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Tu Carrito ({totalItems})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Cerrar carrito"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Tu carrito está vacío</p>
                <Link
                  to="/tienda"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  Ir a la tienda
                </Link>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={`${item.id}`} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          src={item.imagen || "/placeholder-product.jpg"}
                          alt={item.nombre}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <div className="ml-3 flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.nombre}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ${item.precio.toLocaleString("es-CL")} c/u
                        </p>

                        <div className="mt-1 flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center border rounded text-gray-500 disabled:opacity-50"
                            aria-label="Reducir cantidad"
                          >
                            −
                          </button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center border rounded text-gray-500"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="ml-2 flex flex-col items-end">
                        <span className="font-medium">
                          $
                          {(item.precio * item.quantity).toLocaleString(
                            "es-CL"
                          )}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="mt-1 text-gray-400 hover:text-red-500"
                          aria-label="Eliminar producto"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg mb-4">
                    <span>Total:</span>
                    <span>${cartTotal.toLocaleString("es-CL")}</span>
                  </div>

                  <Link
                    to="/carrito"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-neutral-900 hover:bg-black text-white text-center py-2 rounded-md transition-colors"
                  >
                    Ver carrito completo
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
