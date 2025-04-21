import { useEffect, useState } from "react";
import { getProductos } from "../../services/store.api";
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';

export default function StoreSection({
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  showExcerpt = true,
  cardHeight = "h-48",
  titleSize = destacadas ? "text-xl" : "text-lg",
}) {
  const navigate = useNavigate();
  const [producto, setProducto] = useState([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProductos();
        const filteredProduct = res.data
          .filter((product) => product.destacado === destacadas)
          .slice(0, limit);
          setProducto(filteredProduct);
      } catch (error) {
        console.error("Error cargando noticias:", error);
      }
    }
    loadProduct();
  }, [destacadas, limit]);

  return (
    <div className="max-w-6xl px-1 py-1">
      {/* Título condicional */}
      <h2 className={`flex items-center gap-2 font-bold mb-2 ${titleSize}`}>
        {destacadas ? "Productos destacados" : "Más productos"}
        <span className="flex-1 h-[1px] bg-black ml-2"></span>
      </h2>

      <div className={`grid grid-cols-1 ${gridCols} gap-1`}>
        {producto.map((product) => (
          <div
            key={product.id}
            className={`relative group overflow-hidden shadow-md shadow-neutral-700 cursor-pointer m-0.5 ${cardHeight} rounded-2xl`}
            onClick={() => navigate(`/tienda/productos/${product.slug}`)}
          >
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full text-white">
              <h3 className="text-xl text-center font-semibold leading-tight">
                {product.nombre}
              </h3>
              {showExcerpt && (
                <p className="text-xs text-center opacity-80 mt-1">
                  {parse(product.descripcion.slice(0, 100))}...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
