'use client';

// FRONTEND COMPONENT: Theme Selector

import { motion } from 'framer-motion';
import type { ThemeStyle } from '@/types';

interface Theme {
  id: ThemeStyle;
  name: string;
  description: string;
  emoji: string;
}

const THEMES: Theme[] = [
  {
    id: 'studio-ghibli',
    name: 'Studio Ghibli',
    description: 'Whimsical hand-drawn animation',
    emoji: '🌸',
  },
  {
    id: 'pixar',
    name: 'Pixar 3D',
    description: 'Vibrant CGI character style',
    emoji: '🎬',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Aesthetic',
    description: 'Chill, nostalgic vibes',
    emoji: '🎧',
  },
  {
    id: 'cowboy-bebop',
    name: 'Cowboy Bebop',
    description: 'Jazz noir anime aesthetic',
    emoji: '🎷',
  },
  {
    id: 'spider-verse',
    name: 'Spider-Verse',
    description: 'Comic book pop art',
    emoji: '🕸️',
  },
];

interface ThemeSelectorProps {
  selected: ThemeStyle | null;
  onSelect: (theme: ThemeStyle) => void;
  disabled?: boolean;
}

export default function ThemeSelector({ selected, onSelect, disabled }: ThemeSelectorProps) {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-dark-900 mb-4">
        Choose Your Style
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {THEMES.map((theme, index) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(theme.id)}
            disabled={disabled}
            className={`
              relative p-6 rounded-xl border-2 transition-all text-left
              ${selected === theme.id
                ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                : 'border-dark-200 bg-white hover:border-primary-300 hover:shadow-md'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex flex-col items-start gap-3">
              <span className="text-4xl">{theme.emoji}</span>
              <div>
                <h4 className="font-bold text-dark-900 mb-1">
                  {theme.name}
                </h4>
                <p className="text-sm text-dark-600 leading-snug">
                  {theme.description}
                </p>
              </div>
            </div>
            
            {selected === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
