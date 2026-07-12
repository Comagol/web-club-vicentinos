import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOUTIQUE_PRODUCTS } from '../../constants/mockData';
import { ShoppingBag } from 'lucide-react';

export const BoutiquePreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-600 text-navy-900 mb-2">
              Boutique Oficial
            </h2>
            <p className="text-sm md:text-base font-400 text-gray-600">
              Equipamiento y merchandising oficial
            </p>
          </div>
          <button
            onClick={() => navigate('/boutique')}
            className="mt-4 md:mt-0 text-sm md:text-base font-500 text-gold-500 hover:text-gold-700"
          >
            Ver todo →
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MOCK_BOUTIQUE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 rounded-xl overflow-hidden hover:scale-105 transition-transform"
            >
              {/* Product Image Placeholder */}
              <div className="w-full h-32 md:h-48 bg-gray-200 flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>

              {/* Product Info */}
              <div className="p-3 md:p-4">
                {/* Category Badge */}
                <span className="inline-block text-xs font-500 px-2 py-1 rounded-full bg-navy-50 text-navy-800 mb-2">
                  {product.category}
                </span>

                {/* Product Name */}
                <h4 className="text-xs md:text-sm font-600 text-navy-900 line-clamp-1 mb-2">
                  {product.name}
                </h4>

                {/* Price */}
                <p className="text-sm md:text-base font-700 text-gold-500">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
