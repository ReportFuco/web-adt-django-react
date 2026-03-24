import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getProductos } from "../../services/store.api";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import Marquee from "react-fast-marquee";

const productShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  slug: PropTypes.string.isRequired,
  imagen: PropTypes.string,
  nombre: PropTypes.string,
  descripcion: PropTypes.string,
  destacado: PropTypes.bool,
});

export default function StoreSection({
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  showExcerpt = true,
  cardHeight = "h-48",
  titleSize,
  marquee = false,
  marqueeSpeed = 50,
  marqueeDirection = "left",
}) {
  const navigate = useNavigate();
  const [producto, setProducto] = useState([]);
  const resolvedTitleSize = titleSize ?? (destacadas ? "text-xl" : "text-lg");

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

  // Componente de producto para reutilizar
  // eslint-disable-next-line react/prop-types
  const ProductCard = ({ product }) => (
    <div
      key={product.id}
      className={`relative group overflow-hidden shadow-md shadow-neutral-700 cursor-pointer m-0.5 ${cardHeight} rounded-2xl`}
      onClick={() => {
        navigate(`/tienda/productos/${product.slug}`);
        window.scrollTo(0, 0);
      }}
    >
      <img
        src={product.imagen}
        alt={product.nombre}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full text-white">
        <h3 className="text-lg text-center font-semibold leading-tight">
          {product.nombre}
        </h3>
        {showExcerpt && product.descripcion && (
          <p className="text-xs text-center opacity-80 mt-1">
            {parse(product.descripcion.slice(0, 100))}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl px-1 py-1">
      {/* Título condicional */}
      <h2 className={`flex items-center gap-2 font-bold mb-2 ${resolvedTitleSize}`}>
        {destacadas ? "Productos destacados" : "Más productos"}
        <span className="flex-1 h-[1px] bg-black ml-2"></span>
      </h2>

      {marquee ? (
        <Marquee speed={marqueeSpeed} direction={marqueeDirection} pauseOnHover>
          {producto.map((product) => (
            <div key={product.id} className="mx-2">
              <ProductCard product={product} />
            </div>
          ))}
        </Marquee>
      ) : (
        <div className={`grid ${gridCols} gap-1`}>
          {producto.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

StoreSection.propTypes = {
  destacadas: PropTypes.bool,
  limit: PropTypes.number,
  gridCols: PropTypes.string,
  showExcerpt: PropTypes.bool,
  cardHeight: PropTypes.string,
  titleSize: PropTypes.string,
  marquee: PropTypes.bool,
  marqueeSpeed: PropTypes.number,
  marqueeDirection: PropTypes.oneOf(["left", "right", "up", "down"]),
};

StoreSection.ProductCardPropTypes = {
  product: productShape.isRequired,
};
