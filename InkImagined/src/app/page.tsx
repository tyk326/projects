'use client';

// FRONTEND PAGE: Home / Main Upload & Generation Page

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase-client';
import ImageUpload from '@/components/ImageUpload';
import ThemeSelector from '@/components/ThemeSelector';
import PreviewGallery from '@/components/PreviewGallery';
import CheckoutButton from '@/components/CheckoutButton';
import GenerationLimit from '@/components/GenerationLimit';
import type { ThemeStyle } from '@/types';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeStyle | null>(null);
  const [generatedImage, setGeneratedImage] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState<number | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!uploadedUrl || !selectedTheme) {
      alert('Please upload an image and select a theme');
      return;
    }

    if (!user) {
      alert('Please sign in to generate images');
      return;
    }

    setGenerating(true);
    setGeneratedImage(null);
    setLimitError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadedUrl,
          theme: selectedTheme,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle limit error specifically
        if (response.status === 429) {
          setLimitError(data.message || 'Daily generation limit reached');
          // Scroll to limit message
          setTimeout(() => {
            const limitElement = document.getElementById('limit-error');
            if (limitElement) {
              limitElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        } else {
          throw new Error(data.error || 'Generation failed');
        }
        return;
      }

      setGeneratedImage(data.image);
      setGenerationsRemaining(data.generationsRemaining);
    } catch (error) {
      console.error('Generation error:', error);
      if (!limitError) {
        alert('Failed to generate image. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const canGenerate = uploadedUrl && selectedTheme && user && !generating;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-dark-900 mb-6 leading-tight">
              Transform Photos into
              <span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                AI Art Masterpieces
              </span>
            </h1>
            <p className="text-xl text-dark-600 mb-8 max-w-2xl mx-auto">
              Upload any photo, choose your favorite artistic style, and get a stunning canvas print delivered to your door
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Step 1: Upload */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h2 className="text-3xl font-bold text-dark-900">Upload Your Photo</h2>
            </div>
            <ImageUpload 
              onUpload={setUploadedUrl} 
              disabled={generating}
            />
          </motion.div>

          {/* Step 2: Select Theme */}
          {uploadedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <h2 className="text-3xl font-bold text-dark-900">Pick an Art Style</h2>
              </div>

              {/* Generation Limit Display */}
              {user && (
                <div className="mb-6">
                  <GenerationLimit 
                    onLimitUpdate={(remaining) => setGenerationsRemaining(remaining)}
                  />
                </div>
              )}

              {/* Limit Error Message */}
              {limitError && (
                <motion.div
                  id="limit-error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">
                        Generation Limit Reached
                      </h4>
                      <p className="text-sm text-red-700">
                        {limitError}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <ThemeSelector
                selected={selectedTheme}
                onSelect={setSelectedTheme}
                disabled={generating}
              />
              
              <div className="mt-8">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || generationsRemaining === 0}
                  className={`
                    w-full py-4 px-8 rounded-xl font-bold text-lg transition-all
                    ${canGenerate && generationsRemaining !== 0
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-dark-200 text-dark-500 cursor-not-allowed'
                    }
                  `}
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : !user ? (
                    'Sign In to Generate'
                  ) : generationsRemaining === 0 ? (
                    '🚫 Daily Limit Reached'
                  ) : (
                    '✨ Generate AI Art'
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview & Checkout */}
          {(generating || generatedImage) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <h2 className="text-3xl font-bold text-dark-900">Preview & Order</h2>
              </div>
              
              <PreviewGallery
                originalUrl={uploadedUrl}
                generatedUrl={generatedImage?.generated_url}
                generating={generating}
              />

              {generatedImage && !generating && (
                <div className="mt-8">
                  <CheckoutButton imageId={generatedImage.id} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {!uploadedUrl && (
        <section className="py-20 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-dark-900 mb-12">
              Why Choose AI Canvas?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="font-bold text-xl text-dark-900 mb-2">AI-Powered Art</h3>
                <p className="text-dark-600">
                  Advanced AI transforms your photos into stunning artwork in multiple styles
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🖼️</span>
                </div>
                <h3 className="font-bold text-xl text-dark-900 mb-2">Premium Quality</h3>
                <p className="text-dark-600">
                  Museum-grade canvas prints with gallery-wrapped edges and mounting hardware
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="font-bold text-xl text-dark-900 mb-2">Fast Shipping</h3>
                <p className="text-dark-600">
                  Free worldwide shipping with tracking. Arrives in 7-10 business days
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}