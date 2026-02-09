'use client';

// FRONTEND COMPONENT: Image Upload with Auth Check

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase-client';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onUpload, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setCheckingAuth(false);
    };

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFile = async (file: File) => {
    // Clear previous errors
    setError(null);

    // Check authentication FIRST
    if (!isAuthenticated) {
      setError('Please sign in to upload images');
      // Scroll to show the error
      setTimeout(() => {
        const errorElement = document.getElementById('upload-error');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to upload images');
        }
        throw new Error(data.error || 'Upload failed');
      }

      onUpload(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [disabled, isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Show loading state while checking auth
  if (checkingAuth) {
    return (
      <div className="w-full p-12 border-2 border-dashed border-dark-200 rounded-xl bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-dark-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Auth Warning (if not logged in) */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h4 className="font-bold text-orange-900 mb-1">
                Sign In Required
              </h4>
              <p className="text-sm text-orange-700">
                Please sign in with Google to upload and generate AI artwork.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            id="upload-error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-bold text-red-900 mb-1">Upload Error</h4>
                <p className="text-sm text-red-700">{error}</p>
                {!isAuthenticated && (
                  <p className="text-sm text-red-700 mt-2">
                    👉 Click "Sign In with Google" at the top right to get started.
                  </p>
                )}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative w-full p-12 border-2 border-dashed rounded-xl transition-all
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-dark-300 bg-white hover:border-primary-400 hover:bg-primary-50/50'
          }
          ${disabled || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || uploading || !isAuthenticated}
          className="hidden"
        />

        {preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-lg">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  onClick={() => {
                    setPreview(null);
                    setError(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-sm text-dark-600">
              ✓ Image uploaded successfully
            </p>
          </motion.div>
        ) : (
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center gap-4 ${
              disabled || !isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {uploading ? (
              <>
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-lg font-semibold text-dark-700">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-dark-900 mb-1">
                    {!isAuthenticated ? '🔒 Sign in to upload' : 'Click to upload or drag and drop'}
                  </p>
                  {isAuthenticated && (
                    <p className="text-sm text-dark-600">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  )}
                </div>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}