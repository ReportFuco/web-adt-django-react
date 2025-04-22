import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductoBySlug } from "../../services/store.api";
import ProductImageGallery from "../../components/features/store/ProductImageGallery";
import ProductInfo from "../../components/features/store/ProductInfo";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Header from "../../components/layout/Header";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/layout/Footer";
import StoreSection from "./StoreSection";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Contexto del carrito
  const { cart, addToCart, isInCart } = useCart();

  // Obtener el item del carrito si existe
  const cartItem = cart.find((item) => item.id === producto?.id);

  // Calcular stock real (stock total - unidades en carrito)
  const realStock = producto ? producto.stock - (cartItem?.quantity || 0) : 0;

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await getProductoBySlug(slug);

        if (response.status === 200 && response.data) {
          setProducto(response.data);

          // Resetear cantidad seleccionada al cargar nuevo producto
          setSelectedQuantity(1);
        } else {
          setError("Producto no encontrado");
          navigate("/tienda", { replace: true });
        }
      } catch (err) {
        console.error("Error fetching producto:", err);
        setError(err.response?.data?.message || "Error al cargar el producto");
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (realStock <= 0) {
      toast.warning("No hay suficiente stock disponible");
      return;
    }

    // Limitar la cantidad al stock disponible
    const finalQuantity = Math.min(selectedQuantity, realStock);

    addToCart({
      ...producto,
      quantity: finalQuantity,
    });

    toast.success(
      `${finalQuantity} ${finalQuantity > 1 ? "unidades" : "unidad"} de ${
        producto.nombre
      } añadidas al carrito`
    );

    // Resetear cantidad después de agregar
    setSelectedQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/carrito");
  };

  // Render states
  if (loading) return <Loader className="min-h-[50vh]" />;
  if (error) return <ErrorMessage message={error} className="min-h-[50vh]" />;
  if (!producto) return <ErrorMessage message="Producto no disponible" />;

  return (
    <main>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        {/* Botón de volver */}
        <button
          onClick={() => navigate("/tienda")}
          className="mb-6 flex items-center text-neutral-900 hover:text-black transition-colors"
          aria-label="Volver a la tienda"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a la tienda
        </button>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery producto={producto} />

          <div className="flex flex-col">
            <ProductInfo
              producto={producto}
              realStock={realStock}
              cartItem={cartItem}
            />

            {/* Selector de cantidad y botones */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center mb-6">
                <label htmlFor="quantity" className="mr-4 font-medium">
                  Cantidad:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={realStock}
                  value={selectedQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setSelectedQuantity(
                      Math.min(Math.max(value, 1), realStock)
                    );
                  }}
                  className="w-20 px-3 py-2 border rounded-md"
                  disabled={realStock <= 0}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {realStock > 0 ? `${realStock} disponibles` : "Agotado"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={realStock <= 0}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    realStock <= 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : isInCart(producto.id)
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-neutral-900 hover:bg-black text-white"
                  }`}
                >
                  {realStock <= 0
                    ? "Agotado"
                    : isInCart(producto.id)
                    ? `Añadir más (${cartItem.quantity} en carrito)`
                    : "Añadir al carrito"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={realStock <= 0}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    realStock <= 0
                      ? "hidden"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Comprar ahora
                </button>
              </div>

              {/* Mensaje de stock */}
              {isInCart(producto.id) && realStock > 0 && (
                <p className="mt-4 text-sm text-orange-600">
                  Tienes {cartItem.quantity}{" "}
                  {cartItem.quantity > 1 ? "unidades" : "unidad"} en tu carrito.
                  Stock restante: {realStock}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección adicional */}
        <section className="mt-16">
          <StoreSection
            destacadas={true}
            limit={4}
            gridCols="md:grid-cols-4"
            cardHeight="h-80"
            marquee={true}
            marqueeDirection="right"
          />
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default ProductDetailPage;
