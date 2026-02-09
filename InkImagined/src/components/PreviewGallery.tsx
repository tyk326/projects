'use client';

// FRONTEND COMPONENT: Preview Gallery

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PreviewGalleryProps {
  originalUrl: string;
  generatedUrl: string | null;
  generating: boolean;
}

export default function PreviewGallery({ 
  originalUrl, 
  generatedUrl, 
  generating 
}: PreviewGalleryProps) {
  const [showComparison, setShowComparison] = useState(false);

  if (!originalUrl && !generatedUrl) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-dark-900">
          {generating ? 'Generating Your Masterpiece...' : 'Your AI Creation'}
        </h3>
        
        {generatedUrl && !generating && (
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-4 py-2 rounded-lg bg-dark-100 text-dark-800 hover:bg-dark-200 transition-colors font-medium text-sm"
          >
            {showComparison ? 'Hide Original' : 'Compare'}
          </button>
        )}
      </div>

      {generating ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full aspect-[4/3] bg-gradient-to-br from-primary-100 via-primary-50 to-orange-50 rounded-2xl overflow-hidden flex items-center justify-center"
        >
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-primary-200 border-t-primary-500 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-4 border-primary-100 border-t-primary-400 rounded-full"
              />
            </div>
            <p className="text-lg font-semibold text-dark-800 mb-2">
              Creating your artwork...
            </p>
            <p className="text-sm text-dark-600">
              This usually takes 20-40 seconds
            </p>
          </div>
        </motion.div>
      ) : (
        <div className={`grid ${showComparison ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold text-dark-600 uppercase tracking-wider">
                Original
              </p>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={originalUrl}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}
          
          {generatedUrl && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              {showComparison && (
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                  AI Generated
                </p>
              )}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={generatedUrl}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
                
                {/* Sparkle effect overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                  style={{
                    backgroundSize: '200% 200%',
                    backgroundPosition: '0% 0%',
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {generatedUrl && !generating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-sm text-green-800 font-medium">
            ✨ Your artwork is ready! Select a canvas size below to order your print.
          </p>
        </motion.div>
      )}
    </div>
  );
}
