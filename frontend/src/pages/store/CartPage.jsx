import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { crearPreferenciaPago } from "../../services/store.api";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePago = async () => {
    try {
      setLoading(true);

      const carritoFormateado = cart.map((item) => ({
        producto_id: item.id,
        cantidad: item.quantity,
      }));

      const data = await crearPreferenciaPago(carritoFormateado);
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setPaymentStatus("error");
      }
    } catch (err) {
      console.error("Error en el pago:", err);
      setPaymentStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <XCircleIcon className="w-16 h-16 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            Carrito Vacío
          </h1>
          <p className="mt-2 text-gray-600">Agrega productos para continuar</p>
          <button
            onClick={() => navigate("/tienda")}
            className="mt-6 bg-neutral-800 hover:bg-neutral-900 text-white px-6 py-2 rounded-md transition-colors"
          >
            Ir a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Confirmación de Compra
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sección de Productos */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center text-gray-700">
            <svg
              className="w-5 h-5 mr-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Tus Productos ({cart.length})
          </h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 gap-4"
              >
                <div className="relative w-full sm:w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={item.imagen || "/placeholder-product.jpg"}
                    alt={item.nombre}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <div className="flex-1 w-full">
                  <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.precio.toLocaleString("es-CL")} x {item.quantity}
                  </p>

                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 disabled:opacity-30 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="mx-2 text-sm text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-medium text-gray-800">
                    ${(item.precio * item.quantity).toLocaleString("es-CL")}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Pago */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <svg
              className="w-5 h-5 mr-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Resumen de Pago
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Envío:</span>
              <span
                className={shipping === 0 ? "text-green-600 font-medium" : ""}
              >
                {shipping === 0
                  ? "¡Gratis!"
                  : `$${shipping.toLocaleString("es-CL")}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 font-bold text-lg text-gray-800">
              <span>Total:</span>
              <span>${total.toLocaleString("es-CL")}</span>
            </div>
          </div>

          {paymentStatus === "error" && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
              Error al procesar el pago. Intenta nuevamente.
            </div>
          )}

          <button
            onClick={handlePago}
            disabled={loading}
            className={`w-full bg-neutral-800 hover:bg-neutral-900 text-white py-3 rounded-md font-medium transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </span>
            ) : (
              "Continuar al Pago"
            )}
          </button>

          <button
            onClick={() => navigate("/tienda")}
            className="mt-3 w-full bg-white text-neutral-800 py-2 rounded-md font-medium border border-neutral-300 hover:bg-gray-50 transition-colors"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
