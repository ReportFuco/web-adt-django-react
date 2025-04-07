const ProductInfo = ({ producto }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
      <div className="flex items-center space-x-2">
        <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
          {producto.categoria_nombre}
        </span>
        <span
          className={`text-sm ${
            producto.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
        </span>
      </div>

      <p className="text-2xl font-bold text-black">
        ${producto.precio.toLocaleString("es-CL")}
      </p>

      {producto.descripcion && (
        <p className="text-gray-700">{producto.descripcion}</p>
      )}

      <div className="pt-4">
        <button
          disabled={producto.stock <= 0}
          className={`px-6 py-3 rounded-md font-medium ${
            producto.stock > 0
              ? "bg-neutral-900 text-white hover:bg-black"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {producto.stock > 0 ? "Añadir al carrito" : "Sin stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
