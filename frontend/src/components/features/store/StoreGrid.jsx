import React, { useState, useEffect } from "react";
import { getProductos, getCategorias } from "../../../services/store.api";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";
import useFilters from "../../../hooks/UseFilters";

const StoreGrid = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFilters, filterProducts } = useFilters();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productosRes, categoriasRes] = await Promise.all([
          getProductos(),
          getCategorias(),
        ]);

        setAllProducts(productosRes.data);
        setCategories(categoriasRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const processedProducts = allProducts.map((product) => ({
    ...product,
    categoria:
      categories.find((cat) => cat.id === product.categoria)?.slug || "",
  }));

  const filteredProducts = filterProducts(processedProducts);

  if (loading)
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron productos con estos filtros
        </div>
      )}
    </>
  );
};

export default StoreGrid;
