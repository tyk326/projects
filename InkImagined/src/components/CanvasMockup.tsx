'use client';

// FRONTEND COMPONENT: Canvas Mockup Preview - LANDSCAPE
// UPDATED: For landscape canvas orientation

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CANVAS_PRODUCTS } from '@/lib/stripe';

interface CanvasMockupProps {
  imageUrl: string;
  canvasSize?: string;
}

export default function CanvasMockup({ imageUrl, canvasSize }: CanvasMockupProps) {
  const [selectedSize, setSelectedSize] = useState(
    canvasSize || CANVAS_PRODUCTS[1].id // Default to middle size
  );

  const product = CANVAS_PRODUCTS.find(p => p.id === selectedSize);

  // Calculate aspect ratio for display - LANDSCAPE
  const getAspectRatio = (size: string) => {
    if (size === 'canvas-12x9' || size === 'canvas-16x12') {
      return 'aspect-[4/3]'; // 4:3 landscape
    }
    return 'aspect-[5/4]'; // 5:4 landscape for 20x16
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-dark-900 mb-2">
          Canvas Preview
        </h3>
        <p className="text-dark-600">
          See how your artwork will look on a premium gallery-wrapped canvas
        </p>
      </div>

      {/* Size Selector (if multiple sizes to preview) */}
      {!canvasSize && (
        <div className="flex justify-center gap-2">
          {CANVAS_PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              onClick={() => setSelectedSize(prod.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${selectedSize === prod.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-dark-600 border-2 border-dark-200 hover:border-primary-300'
                }
              `}
            >
              {prod.size.replace('x', '×')}"
            </button>
          ))}
        </div>
      )}

      {/* Canvas Mockup */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto"> {/* Wider for landscape */}
          {/* Shadow effect for depth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
            }}
          >
            {/* Canvas frame - outer border */}
            <div className="relative bg-white p-3 rounded-sm">
              {/* Inner frame */}
              <div className="relative bg-gray-800 p-1">
                {/* The actual image */}
                <div className={`relative ${getAspectRatio(selectedSize)} overflow-hidden bg-white`}>
                  <img
                    src={imageUrl}
                    alt="Canvas Preview"
                    className="w-full h-full object-contain" // ✅ Changed to object-contain
                  />
                  
                  {/* Gallery wrap edge effect (left) */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent"
                    style={{ pointerEvents: 'none' }}
                  />
                  
                  {/* Gallery wrap edge effect (right) */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-black/20 to-transparent"
                    style={{ pointerEvents: 'none' }}
                  />
                  
                  {/* Gallery wrap edge effect (top) */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-black/20 to-transparent"
                    style={{ pointerEvents: 'none' }}
                  />
                  
                  {/* Gallery wrap edge effect (bottom) */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/20 to-transparent"
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Wall shadow */}
            <div 
              className="absolute inset-0 -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
                transform: 'translateY(10px)',
              }}
            />
          </motion.div>

          {/* Size info */}
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-dark-900">
              {product?.name}
            </p>
            <p className="text-sm text-dark-600 mt-1">
              Gallery-wrapped landscape canvas with 1.25" thick frame
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-sm font-semibold text-dark-900">Gallery Wrapped</p>
          <p className="text-xs text-dark-600 mt-1">Image wraps around edges</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl mb-2">📏</div>
          <p className="text-sm font-semibold text-dark-900">1.25" Thick</p>
          <p className="text-xs text-dark-600 mt-1">Premium depth frame</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl mb-2">✨</div>
          <p className="text-sm font-semibold text-dark-900">Ready to Hang</p>
          <p className="text-xs text-dark-600 mt-1">Hardware included</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl mb-2">🎨</div>
          <p className="text-sm font-semibold text-dark-900">Fade Resistant</p>
          <p className="text-xs text-dark-600 mt-1">Archival quality inks</p>
        </div>
      </div>

      {/* Landscape info */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4 text-center">
        <p className="text-primary-900 font-semibold">
          ✓ Perfect for landscape photos from your phone or camera
        </p>
      </div>
    </div>
  );
}