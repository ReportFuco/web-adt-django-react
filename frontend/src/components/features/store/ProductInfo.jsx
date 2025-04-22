import { useCart } from "../../../context/CartContext";

const ProductInfo = ({ producto }) => {
  const { cart, isInCart } = useCart();
  const cartItem = cart.find((item) => item.id === producto.id);

  // Calcula el stock real (stock total - unidades en carrito)
  const realStock = producto.stock - (cartItem?.quantity || 0);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>

      <div className="flex items-center space-x-2">
        <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
          {producto.categoria_nombre}
        </span>
      </div>

      <p className="text-2xl font-bold text-black">
        ${producto.precio.toLocaleString("es-CL")}
      </p>

      {producto.descripcion && (
        <p className="text-gray-700">{producto.descripcion}</p>
      )}

      {/* Sección de estado del carrito */}
      {isInCart(producto.id) && (
        <div className="bg-blue-50 text-blue-800 p-3 rounded-md">
          <p>
            Tienes {cartItem.quantity}{" "}
            {cartItem.quantity > 1 ? "unidades" : "unidad"} en tu carrito
          </p>
          {realStock > 0 && (
            <p className="text-sm mt-1">Stock restante: {realStock}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
