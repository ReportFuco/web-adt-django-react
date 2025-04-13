import { useCart } from "../../../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ producto }) => {
  const { addToCart, isInCart, cart } = useCart();
  const currentItem = cart.find((item) => item.id === producto.id);
  const alreadyInCart = isInCart(producto.id);
  const outOfStock = producto.stock <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!outOfStock) {
      addToCart(producto);
    }
  };

  return (
    <Link
      to={`/tienda/productos/${producto.slug}`}
      className="block h-full"
      aria-label={`Ver detalles de ${producto.nombre}`}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col group">
        {/* Imagen del producto */}
        <div className="relative pt-[100%] bg-gray-100">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="absolute top-0 left-0 w-full h-full object-cover p-2"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span>Sin imagen</span>
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 flex-grow">
          {/* Categoría */}
          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
            {producto.categoria_nombre}
          </span>

          {/* Nombre y descripción */}
          <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">
            {producto.nombre}
          </h2>

          {producto.descripcion && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {producto.descripcion}
            </p>
          )}

          {/* Precio y botón */}
          <div className="mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-black">
                ${producto.precio.toLocaleString("es-CL")}
              </span>

              <button
                onClick={handleAddToCart}
                disabled={
                  outOfStock ||
                  (alreadyInCart && currentItem?.quantity >= producto.stock)
                }
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  outOfStock
                    ? "bg-gray-300 cursor-not-allowed"
                    : alreadyInCart
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-neutral-900 text-white hover:bg-black"
                }`}
                aria-label={
                  outOfStock
                    ? "Producto agotado"
                    : alreadyInCart
                    ? `Añadir más unidades de ${producto.nombre}`
                    : `Añadir ${producto.nombre} al carrito`
                }
              >
                {outOfStock
                  ? "Agotado"
                  : alreadyInCart
                  ? `(${currentItem.quantity}) +Añadir`
                  : "Añadir"}
              </button>
            </div>

            {/* Stock */}
            {!outOfStock && (
              <p className="text-xs mt-1">
                <span
                  className={
                    alreadyInCart ? "text-orange-600" : "text-green-600"
                  }
                >
                  {alreadyInCart
                    ? `${producto.stock - currentItem.quantity} disponibles`
                    : `${producto.stock} disponibles`}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
