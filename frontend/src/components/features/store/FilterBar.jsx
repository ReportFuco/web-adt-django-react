import React, { useState } from "react";

const FilterBar = ({ filters, setFilters, categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Botón para móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full p-4 flex justify-between items-center font-medium text-gray-700"
      >
        <span>Filtros</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Contenido del filtro */}
      <div className={`${isOpen ? "block" : "hidden"} md:block p-4`}>
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
    </div>
  );
};

export default FilterBar;
