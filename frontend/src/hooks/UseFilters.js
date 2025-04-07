// hooks/useFilters.js
import { useState } from "react";

const useFilters = () => {
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    searchQuery: "",
  });

  const filterProducts = (products) => {
    return products.filter((product) => {
      const matchesCategory =
        filters.category === "all" || product.categoria === filters.category;
      const matchesPrice = product.precio >= filters.minPrice;
      const matchesSearch =
        product.nombre
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        (product.descripcion &&
          product.descripcion
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()));

      return matchesCategory && matchesPrice && matchesSearch;
    });
  };

  return { filters, setFilters, filterProducts };
};

export default useFilters;
