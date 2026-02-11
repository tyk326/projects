'use client';

// FRONTEND COMPONENT: Canvas Size Selector
// Step 2 in the flow - choose size before theme

import { motion } from 'framer-motion';
import { CANVAS_PRODUCTS } from '@/lib/stripe';

interface CanvasSizeSelectorProps {
    selected: string | null;
    onSelect: (sizeId: string) => void;
    disabled?: boolean;
}

export default function CanvasSizeSelector({
    selected,
    onSelect,
    disabled = false,
}: CanvasSizeSelectorProps) {
    return (
        <div className="space-y-4">
            <p className="text-dark-600 text-center">
                Select your canvas size first - we'll generate your artwork to fit perfectly!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CANVAS_PRODUCTS.map((product, index) => (
                    <motion.button
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(product.id)}
                        disabled={disabled}
                        className={`
              relative p-6 rounded-xl border-2 transition-all
              ${selected === product.id
                                ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                                : 'border-dark-200 bg-white hover:border-primary-300 hover:shadow-md'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        {/* Popular badge for middle option */}
                        {index === 1 && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                MOST POPULAR
                            </div>
                        )}

                        <div className="text-center">
                            {/* Canvas icon */}
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <h3 className="font-bold text-xl text-dark-900 mb-2">
                                {product.name}
                            </h3>

                            <p className="text-sm text-dark-600 mb-3">
                                {product.size === '9x12' && 'Perfect for desks'}
                                {product.size === '12x16' && 'Great for any wall'}
                                {product.size === '16x20' && 'Statement piece'}
                            </p>

                            <p className="text-3xl font-bold text-primary-600">
                                ${(product.price / 100).toFixed(2)}
                            </p>

                            <p className="text-xs text-dark-500 mt-2">
                                {product.size === '9x12' && '3:4 ratio'}
                                {product.size === '12x16' && '3:4 ratio'}
                                {product.size === '16x20' && '4:5 ratio'}
                            </p>
                        </div>

                        {/* Checkmark when selected */}
                        {selected === product.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {selected && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4 text-center"
                >
                    <p className="text-primary-900 font-semibold">
                        ✓ Your artwork will be generated in {CANVAS_PRODUCTS.find(p => p.id === selected)?.name} format
                    </p>
                </motion.div>
            )}
        </div>
    );
}