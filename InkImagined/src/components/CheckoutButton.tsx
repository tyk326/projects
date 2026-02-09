'use client';

// FRONTEND COMPONENT: Checkout Button with Product Selection

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CANVAS_PRODUCTS } from '@/lib/stripe';

interface CheckoutButtonProps {
  imageId: string;
  disabled?: boolean;
}

export default function CheckoutButton({ imageId, disabled }: CheckoutButtonProps) {
  const [selectedProduct, setSelectedProduct] = useState(CANVAS_PRODUCTS[0].id);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          productId: selectedProduct,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-dark-900 mb-4">
          Choose Canvas Size
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CANVAS_PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              disabled={disabled || loading}
              className={`
                p-6 rounded-xl border-2 transition-all text-left
                ${selectedProduct === product.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                  : 'border-dark-200 bg-white hover:border-primary-300 hover:shadow-md'
                }
                ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-dark-900 text-lg">
                  {product.name}
                </h4>
                <p className="text-sm text-dark-600">
                  Premium canvas print
                </p>
                <p className="text-2xl font-bold text-primary-600 mt-2">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
              
              {selectedProduct === product.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-dark-50 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-dark-900 mb-1">What's Included</h4>
            <ul className="text-sm text-dark-600 space-y-2">
              <li>• Premium gallery-wrapped canvas</li>
              <li>• High-resolution AI artwork print</li>
              <li>• Ready to hang with mounting hardware</li>
              <li>• Free shipping to US, CA, UK, AU</li>
              <li>• 100% satisfaction guarantee</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={`
          w-full py-4 px-8 rounded-xl font-bold text-lg transition-all
          ${disabled || loading
            ? 'bg-dark-200 text-dark-500 cursor-not-allowed'
            : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Order Canvas Print • $${(CANVAS_PRODUCTS.find(p => p.id === selectedProduct)!.price / 100).toFixed(2)}`
        )}
      </button>

      <p className="text-xs text-center text-dark-500">
        Secure checkout powered by Stripe • Ships in 7-10 business days
      </p>
    </motion.div>
  );
}
