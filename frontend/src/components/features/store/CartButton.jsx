import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartButton = ({
  cart,
  updateQuantity,
  handleRemoveItem,
  mobileVersion,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  // Calcular total de items
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + (item.precio || 0) * item.quantity,
      0
    );
  };

  // Alternar visibilidad del carrito
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Cerrar carrito al navegar
  const navigateAndClose = (path) => {
    navigate(path);
    setIsCartOpen(false);
  };

  // Cerrar el carrito al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={cartRef}>
      {/* Botón del carrito - Versión adaptada para móvil */}
      <button
        onClick={toggleCart}
        aria-label={`Carrito (${totalItems} items)`}
        aria-expanded={isCartOpen}
        className={`
          p-2 relative group hover:text-purple-400 transition-colors
          ${
            mobileVersion
              ? "w-full flex items-center justify-between px-4 py-3"
              : ""
          }
        `}
      >
        <div className="flex items-center">
          <svg
            className="w-6 h-6"
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
          {mobileVersion && (
            <span className="ml-2 text-white">Carrito ({totalItems})</span>
          )}
        </div>

        {!mobileVersion && totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}

        {mobileVersion && (
          <span className="text-white">
            ${calculateTotal().toLocaleString("es-CL")}
          </span>
        )}
      </button>

      {/* Dropdown del carrito - Versión adaptada para móvil */}
      {isCartOpen && (
        <div
          className={`
            bg-neutral-900 rounded-lg shadow-xl z-50 border border-gray-700
            ${
              mobileVersion
                ? "fixed inset-x-0 bottom-0 w-full max-h-[60vh] rounded-b-none overflow-y-auto"
                : "absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto"
            }
          `}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Tu Carrito ({totalItems})
              </h3>
              <button
                onClick={toggleCart}
                className="text-gray-400 hover:text-white"
                aria-label="Cerrar carrito"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400">Tu carrito está vacío</p>
                <button
                  onClick={() => navigateAndClose("/tienda")}
                  className="mt-4 inline-block text-white hover:underline"
                >
                  Ir a la tienda
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-700">
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
                        <h4 className="font-medium text-white">
                          {item.nombre}
                        </h4>
                        <p className="text-sm text-gray-400">
                          ${item.precio.toLocaleString("es-CL")} c/u
                        </p>

                        <div className="mt-1 flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center border border-white rounded text-gray-300 disabled:opacity-30 hover:bg-gray-700"
                            aria-label="Reducir cantidad"
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center border border-white rounded text-gray-300 hover:bg-gray-700"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="ml-2 flex flex-col items-end">
                        <span className="text-white">
                          $
                          {(item.precio
                            ? item.precio * item.quantity
                            : 0
                          ).toLocaleString("es-CL")}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="mt-1 text-gray-400 hover:text-red-400"
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

                <div className="border-t border-white pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg mb-4 text-white">
                    <span>Total:</span>
                    <span>${calculateTotal().toLocaleString("es-CL")}</span>
                  </div>

                  <button
                    onClick={() => navigateAndClose("/carrito")}
                    className="w-full bg-neutral-600 hover:bg-neutral-700 text-white py-2 rounded-md transition-colors"
                  >
                    Ver carrito completo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartButton;
