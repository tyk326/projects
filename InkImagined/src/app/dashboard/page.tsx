'use client';

// FRONTEND PAGE: User Dashboard

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase-client';
import GenerationLimit from '@/components/GenerationLimit';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'images' | 'orders'>('images');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const supabase = createClient();
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/';
        return;
      }

      setUser(user);

      // Load images
      const { data: imagesData, error: imagesError } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!imagesError && imagesData) {
        setImages(imagesData);
      }

      // Load orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, generated_images(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!ordersError && ordersData) {
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-600">Loading your gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-900 mb-2">
            My Gallery
          </h1>
          <p className="text-dark-600 mb-6">
            Your AI-generated artworks and orders
          </p>

          {/* Generation Limit Display */}
          <div className="max-w-2xl">
            <GenerationLimit />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-dark-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('images')}
              className={`
                pb-4 px-2 font-semibold border-b-2 transition-colors
                ${activeTab === 'images'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-dark-600 hover:text-dark-900'
                }
              `}
            >
              Generated Images ({images.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`
                pb-4 px-2 font-semibold border-b-2 transition-colors
                ${activeTab === 'orders'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-dark-600 hover:text-dark-900'
                }
              `}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'images' ? (
          <div>
            {images.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-dark-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🎨</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-2">
                  No images yet
                </h3>
                <p className="text-dark-600 mb-6">
                  Start creating AI art from your photos!
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  Create Your First Artwork
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-[4/3] relative">
                      <img
                        src={image.generated_url}
                        alt="AI Generated"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-primary-600 capitalize">
                          {image.theme.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-dark-500">
                          {new Date(image.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        href={`/?imageId=${image.id}`}
                        className="block w-full text-center py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm"
                      >
                        Order Print
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-dark-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">📦</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-dark-600 mb-6">
                  Order a canvas print to see your order history here
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  Browse Artwork
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-48 flex-shrink-0">
                        <img
                          src={order.generated_images.generated_url}
                          alt="Order"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-xl text-dark-900 mb-1">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-dark-600">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`
                            px-3 py-1 rounded-full text-sm font-semibold
                            ${order.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                            ${order.status === 'delivered' ? 'bg-gray-100 text-gray-800' : ''}
                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          `}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-dark-600 mb-1">Product</p>
                            <p className="font-semibold text-dark-900">{order.product_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-dark-600 mb-1">Amount</p>
                            <p className="font-semibold text-dark-900">
                              ${(order.amount / 100).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {order.tracking_number && (
                          <div className="bg-primary-50 rounded-lg p-4">
                            <p className="text-sm text-dark-600 mb-1">Tracking Number</p>
                            <p className="font-mono text-sm text-dark-900 mb-2">
                              {order.tracking_number}
                            </p>
                            {order.tracking_url && (
                              <a
                                href={order.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                              >
                                Track Package →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}