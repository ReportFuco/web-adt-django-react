// components/features/store/ProductImageGallery.jsx
const ProductImageGallery = ({ producto }) => {
    return (
      <div className="space-y-4">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full rounded-lg shadow-md object-cover h-[500px]"
          />
        ) : (
          <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center h-[500px] text-gray-400">
            Imagen no disponible
          </div>
        )}
      </div>
    );
  };
  
  export default ProductImageGallery;