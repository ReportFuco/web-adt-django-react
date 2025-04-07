// src/pages/store/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductoBySlug } from "../../services/store.api";
import ProductImageGallery from "../../components/features/store/ProductImageGallery";
import ProductInfo from "../../components/features/store/ProductInfo";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Header from "../../components/layout/Header";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await getProductoBySlug(slug);

        if (response.status === 200 && response.data) {
          setProducto(response.data);
        } else {
          setError("Producto no encontrado");
          navigate("/tienda", { replace: true }); // Redirige si no existe
        }
      } catch (err) {
        console.error("Error fetching producto:", err);
        setError(err.response?.data?.message || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [slug, navigate]);

  // Render states
  if (loading) return <Loader className="min-h-[50vh]" />;
  if (error) return <ErrorMessage message={error} className="min-h-[50vh]" />;
  if (!producto) return <ErrorMessage message="Producto no disponible" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Header/>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-neutral-900 hover:text-black"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductImageGallery producto={producto} />
        <ProductInfo producto={producto} />
      </div>

      {/* Sección adicional (productos relacionados, reviews, etc.) */}
    </div>
  );
};

export default ProductDetailPage;
