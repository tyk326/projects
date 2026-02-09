'use client';

// FRONTEND COMPONENT: Generation Limit Indicator

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GenerationLimitProps {
  onLimitUpdate?: (remaining: number) => void;
}

interface LimitData {
  dailyLimit: number;
  used: number;
  remaining: number;
  resetsAt?: string;
}

export default function GenerationLimit({ onLimitUpdate }: GenerationLimitProps) {
  const [limitData, setLimitData] = useState<LimitData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLimits();
  }, []);

  const fetchLimits = async () => {
    try {
      const response = await fetch('/api/limits');
      if (response.ok) {
        const data = await response.json();
        setLimitData(data);
        if (onLimitUpdate) {
          onLimitUpdate(data.remaining);
        }
      }
    } catch (error) {
      console.error('Error fetching limits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh limits when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLimits();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading || !limitData) {
    return null;
  }

  const percentage = (limitData.used / limitData.dailyLimit) * 100;
  const isNearLimit = limitData.remaining <= 1;
  const isAtLimit = limitData.remaining === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          rounded-xl p-4 border-2 transition-colors
          ${isAtLimit 
            ? 'bg-red-50 border-red-200' 
            : isNearLimit 
              ? 'bg-orange-50 border-orange-200'
              : 'bg-blue-50 border-blue-200'
          }
        `}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">
                {isAtLimit ? '🚫' : isNearLimit ? '⚠️' : '✨'}
              </span>
              <h4 className="font-semibold text-dark-900">
                {isAtLimit 
                  ? 'Daily Limit Reached' 
                  : `${limitData.remaining} Generation${limitData.remaining !== 1 ? 's' : ''} Left Today`
                }
              </h4>
            </div>
            
            <p className="text-sm text-dark-600 mb-3">
              {isAtLimit 
                ? 'You\'ve used all 5 daily generations. Resets at midnight.'
                : `You can generate ${limitData.remaining} more AI artwork${limitData.remaining !== 1 ? 's' : ''} today. This helps us manage costs while you perfect your creation.`
              }
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isAtLimit 
                    ? 'bg-red-500' 
                    : isNearLimit 
                      ? 'bg-orange-500'
                      : 'bg-blue-500'
                }`}
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-dark-500">
              <span>{limitData.used} / {limitData.dailyLimit} used</span>
              {limitData.resetsAt && (
                <span>
                  Resets {new Date(limitData.resetsAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {isAtLimit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-red-200"
          >
            <p className="text-sm text-dark-700 mb-2">
              <strong>💡 Tip:</strong> Want unlimited generations?
            </p>
            <ul className="text-sm text-dark-600 space-y-1 ml-4">
              <li>• Upgrade to Pro (coming soon!)</li>
              <li>• Or wait until midnight for your limit to reset</li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
