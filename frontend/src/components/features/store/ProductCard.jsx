import { Link } from "react-router-dom";

const ProductCard = ({ producto }) => {
  return (
    <Link
      to={`/tienda/productos/${producto.slug}`}
      className="block h-full" // Hace toda la card clickeable
      aria-label={`Ver ${producto.nombre}`} // Accesibilidad
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Contenedor de imagen con placeholder si no hay imagen */}
        <div className="relative pt-[100%] bg-gray-100">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="absolute top-0 left-0 w-full h-full object-cover p-2"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span>Sin imagen</span>
            </div>
          )}
        </div>

        <div className="p-4 flex-grow">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
            {producto.categoria_nombre}
          </span>

          <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">
            {producto.nombre}
          </h2>

          {producto.descripcion && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {producto.descripcion}
            </p>
          )}

          <div className="mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-black">
                ${producto.precio.toLocaleString("es-CL")}
              </span>
              <button className="px-3 py-1 bg-neutral-900 text-white text-sm rounded-md hover:bg-black transition-colors">
                Añadir
              </button>
            </div>
            {producto.stock > 0 ? (
              <p className="text-xs text-green-600 mt-1">
                {producto.stock} disponibles
              </p>
            ) : (
              <p className="text-xs text-red-600 mt-1">Agotado</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
