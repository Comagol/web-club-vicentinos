import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  categorias: string[];
  filtroCategoria: string[];
  filtroPrecio: { min: number; max: number };
  precioRango: { min: number; max: number };
  busqueda: string;
  onFiltroCategoria: (categorias: string[]) => void;
  onFiltroPrecio: (rango: { min: number; max: number }) => void;
  onBusqueda: (texto: string) => void;
  onLimpiarFiltros: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categorias,
  filtroCategoria,
  filtroPrecio,
  precioRango,
  busqueda,
  onFiltroCategoria,
  onFiltroPrecio,
  onBusqueda,
  onLimpiarFiltros,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    busqueda: true,
    categorias: true,
    precio: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategoria = (categoria: string) => {
    const updated = filtroCategoria.includes(categoria)
      ? filtroCategoria.filter((c) => c !== categoria)
      : [...filtroCategoria, categoria];
    onFiltroCategoria(updated);
  };

  const hasActiveFilters =
    busqueda.length > 0 || filtroCategoria.length > 0 || 
    filtroPrecio.min > precioRango.min || filtroPrecio.max < precioRango.max;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection('categorias')}
          className="w-full flex justify-between items-center text-lg font-semibold text-navy-900 mb-3"
        >
          Categorías
          <span>{expandedSections.categorias ? '−' : '+'}</span>
        </button>
        {expandedSections.categorias && (
          <div className="space-y-2">
            {categorias.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay categorías disponibles</p>
            ) : (
              categorias.map((categoria) => (
                <label key={categoria} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtroCategoria.includes(categoria)}
                    onChange={() => toggleCategoria(categoria)}
                    className="w-4 h-4 text-navy-900 rounded focus:ring-2 focus:ring-navy-900"
                  />
                  <span className="text-gray-700">{categoria}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection('precio')}
          className="w-full flex justify-between items-center text-lg font-semibold text-navy-900 mb-3"
        >
          Rango de precios
          <span>{expandedSections.precio ? '−' : '+'}</span>
        </button>
        {expandedSections.precio && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mínimo: ${filtroPrecio.min.toLocaleString('es-AR')}
              </label>
              <input
                type="range"
                min={precioRango.min}
                max={precioRango.max}
                value={filtroPrecio.min}
                onChange={(e) =>
                  onFiltroPrecio({
                    min: parseInt(e.target.value),
                    max: filtroPrecio.max,
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Máximo: ${filtroPrecio.max.toLocaleString('es-AR')}
              </label>
              <input
                type="range"
                min={precioRango.min}
                max={precioRango.max}
                value={filtroPrecio.max}
                onChange={(e) =>
                  onFiltroPrecio({
                    min: filtroPrecio.min,
                    max: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onLimpiarFiltros}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          <X size={18} />
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
