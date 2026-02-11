'use client';

// FRONTEND PAGE: Pricing

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CANVAS_PRODUCTS } from '@/lib/stripe';

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl font-bold text-dark-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-dark-600 max-w-2xl mx-auto">
            Premium AI-generated canvas prints. Free shipping included.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {CANVAS_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                bg-white rounded-2xl shadow-xl p-8 relative
                ${index === 1 ? 'ring-2 ring-primary-500 scale-105' : ''}
              `}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-dark-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold text-primary-600">
                    ${(product.price / 100 - 1).toFixed(0)}
                  </span>
                  <span className="text-dark-500">.{(product.price % 100).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-dark-600">Premium canvas print</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-dark-600">AI-generated artwork</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-dark-600">Gallery-wrapped edges</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-dark-600">Mounting hardware included</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-dark-600">Free worldwide shipping</span>
                </li>
              </ul>

              <Link
                href="/"
                className={`
                  block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all
                  ${index === 1
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl'
                    : 'bg-dark-100 text-dark-900 hover:bg-dark-200'
                  }
                `}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">
            What's Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl text-dark-900 mb-4">Premium Quality</h3>
              <ul className="space-y-3 text-dark-600">
                <li className="flex items-start gap-3">
                  <span className="text-primary-500">•</span>
                  Printed on textured and fade-resistant canvas
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-500">•</span>
                  Hand-stretched on wooden frame
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-500">•</span>
                  Ready to hang out of the box (Mounting brackets included)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl text-dark-900 mb-4">Our Guarantee</h3>
              <ul className="space-y-3 text-dark-600">
                <li className="flex items-start gap-3">
                  <span className="text-primary-500">•</span>
                  100% satisfaction guarantee
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-500">•</span>
                  Free shipping worldwide
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-500">•</span>
                  6-10 business day delivery
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold text-dark-900 cursor-pointer">
                How does the AI generation work?
              </summary>
              <p className="mt-4 text-dark-600">
                Upload your photo, choose from 5 artistic styles (Studio Ghibli, Pixar, Lo-Fi, Cowboy Bebop, Spider-Verse), 
                and our AI transforms it into unique artwork. You get 5 free generations per day!
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold text-dark-900 cursor-pointer">
                What if I don't like the result?
              </summary>
              <p className="mt-4 text-dark-600">
                You can generate up to 5 variations per day for free before ordering.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold text-dark-900 cursor-pointer">
                How long does shipping take?
              </summary>
              <p className="mt-4 text-dark-600">
                Your canvas is printed on-demand and typically ships within 6-10 business days worldwide with free tracking included.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold text-dark-900 cursor-pointer">
                Can I order multiple sizes?
              </summary>
              <p className="mt-4 text-dark-600">
                Yes! Generate your artwork once, then order it in any size (or all sizes). 
                Each size is optimized for the best print quality.
              </p>
            </details>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Start Creating Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}