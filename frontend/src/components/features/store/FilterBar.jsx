import React from "react";

const FilterBar = ({ filters, setFilters, categories }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 sticky top-0 z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buscador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nombre o descripción..."
          />
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Todas</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio mínimo: ${filters.minPrice.toLocaleString("es-CL")}
          </label>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
