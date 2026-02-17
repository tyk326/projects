// BACKEND UTILITY: Replicate API for AI Image Generation
// UPDATED: LANDSCAPE orientation (horizontal) with high DPI

import Replicate from 'replicate';
import type { ThemeStyle } from '@/types';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// Canvas dimensions for HIGH QUALITY PRINTING - LANDSCAPE ORIENTATION
// Target: 200 DPI minimum for good print quality
// Landscape = wider than tall (horizontal on wall)
export const CANVAS_DIMENSIONS = {
  'canvas-9x12': { 
    width: 2400,   // 12" × 200 DPI (LANDSCAPE: wider dimension)
    height: 1800,  // 9" × 200 DPI
    aspectRatio: '4:3',
    orientation: 'landscape'
  },
  'canvas-12x16': { 
    width: 3200,   // 16" × 200 DPI (LANDSCAPE: wider dimension)
    height: 2400,  // 12" × 200 DPI
    aspectRatio: '4:3',
    orientation: 'landscape'
  },
  'canvas-16x20': { 
    width: 4000,   // 20" × 200 DPI (LANDSCAPE: wider dimension)
    height: 3200,  // 16" × 200 DPI
    aspectRatio: '5:4',
    orientation: 'landscape'
  },
};

// Theme-specific prompts and models
export const THEME_CONFIG: Record<ThemeStyle, { 
  prompt: string; 
  model: string;
  strength?: number;
  guidance?: number;
}> = {
  'studio-ghibli': {
    prompt: 'Studio Ghibli hand-drawn anime style by Hayao Miyazaki, soft watercolor aesthetic inspired by Spirited Away and Howl\'s Moving Castle, gentle pastel colors, painterly backgrounds, whimsical atmosphere, traditional cel animation technique, maintain original subjects and composition',
    model: 'black-forest-labs/flux-dev',
    strength: 0.69,
    guidance: 5.1,
  },
  'pixar': {
    prompt: 'Pixar Animation Studios 3D CGI style like Coco, Up and Toy Story, high-quality rendering, smooth character textures, vibrant saturated colors, soft cinematic lighting, rounded friendly character design, maintain original subjects and poses',
    model: 'black-forest-labs/flux-dev',
    strength: 0.70,
    guidance: 5.5,
  },
  'lofi': {
    prompt: 'Lofi hip hop aesthetic, chill nostalgic vibes, muted pastel color palette, soft gradients, cozy warm atmosphere, retro 90s anime style, StudyGirl aesthetic, maintain original scene composition',
    model: 'black-forest-labs/flux-dev',
    strength: 0.63,
    guidance: 5.0,
  },
  'cowboy-bebop': {
    prompt: 'Cowboy Bebop anime style by Shinichiro Watanabe, 1990s hand-drawn cel animation, jazz noir atmosphere, bold ink outlines, cinematic composition, retro-futuristic aesthetic, film grain texture, maintain original subjects',
    model: 'black-forest-labs/flux-dev',
    strength: 0.67,
    guidance: 4.9,
  },
  'spider-verse': {
    prompt: 'Spider-Verse comic book style, stylized not realistic, hand-drawn cel animation with bold black ink outlines, vibrant pop art colors, dynamic composition, painted backgrounds with halftone accents, maintain original subjects and poses',
    model: 'black-forest-labs/flux-dev',
    strength: 0.72,
    guidance: 5.3,
  },
};

export async function generateImage(
  imageUrl: string,
  theme: ThemeStyle,
  canvasSize?: string, // e.g., 'canvas-12x16'
  customPrompt?: string
): Promise<string> {
  const config = THEME_CONFIG[theme];
  
  const prompt = customPrompt 
    ? `${customPrompt}, ${config.prompt}` 
    : config.prompt;

  // ✅ Get LANDSCAPE dimensions based on canvas size (with high DPI)
  const dimensions = canvasSize && CANVAS_DIMENSIONS[canvasSize as keyof typeof CANVAS_DIMENSIONS]
    ? CANVAS_DIMENSIONS[canvasSize as keyof typeof CANVAS_DIMENSIONS]
    : { width: 3200, height: 2400, aspectRatio: '4:3', orientation: 'landscape' }; // Default 16×12 landscape

  console.log('🎨 Generating HIGH-RES LANDSCAPE image:', {
    theme,
    canvasSize: canvasSize || 'default (16x12)',
    dimensions: `${dimensions.width}×${dimensions.height}`,
    aspectRatio: dimensions.aspectRatio,
    orientation: dimensions.orientation,
    estimatedDPI: Math.round(dimensions.width / parseInt(canvasSize?.split('x')[1] || '16')), // Landscape uses height as reference
  });

  try {
    const output = await replicate.run(
      config.model as `${string}/${string}:${string}`,
      {
        input: {
          image: imageUrl,
          prompt: prompt,
          negative_prompt: 'blurry, low quality, distorted, ugly, watermark, text, jpeg artifacts, low resolution',
          num_inference_steps: 35,
          guidance_scale: config.guidance || 7.5,
          // ✅ CRITICAL: High resolution LANDSCAPE (wider than tall)
          width: dimensions.width,
          height: dimensions.height,
          // SDXL will automatically crop/fit the input image to this aspect ratio
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      console.log('✅ High-resolution LANDSCAPE image generated successfully');
      console.log(`   Size: ${dimensions.width}×${dimensions.height} pixels (landscape)`);
      console.log(`   DPI: ~${Math.round(dimensions.width / parseInt(canvasSize?.split('x')[1] || '16'))} (for print)`);
      return output[0];
    }
    
    throw new Error('No image generated');
  } catch (error) {
    console.error('❌ Replicate generation error:', error);
    throw new Error('Failed to generate image');
  }
}

// Helper: Calculate actual DPI of generated image for LANDSCAPE
export function calculateDPI(canvasSize: string): number {
  const dimensions = CANVAS_DIMENSIONS[canvasSize as keyof typeof CANVAS_DIMENSIONS];
  if (!dimensions) return 0;
  
  // Extract canvas dimensions (e.g., '12x16' → width=12, height=16)
  const [w, h] = canvasSize.replace('canvas-', '').split('x').map(Number);
  
  // For landscape: width is the larger dimension
  const canvasWidthInches = Math.max(w, h);
  
  // Calculate DPI: pixels / inches
  return Math.round(dimensions.width / canvasWidthInches);
}

// Helper: Get print quality assessment
export function getPrintQuality(canvasSize: string): {
  dpi: number;
  quality: 'excellent' | 'good' | 'acceptable' | 'poor';
  message: string;
} {
  const dpi = calculateDPI(canvasSize);
  
  if (dpi >= 250) {
    return {
      dpi,
      quality: 'excellent',
      message: '✅ Professional print quality',
    };
  } else if (dpi >= 180) {
    return {
      dpi,
      quality: 'good',
      message: '✅ High quality print',
    };
  } else if (dpi >= 150) {
    return {
      dpi,
      quality: 'acceptable',
      message: '⚠️ Acceptable print quality',
    };
  } else {
    return {
      dpi,
      quality: 'poor',
      message: '❌ May appear pixelated when printed',
    };
  }
}

export async function checkGenerationStatus(predictionId: string) {
  try {
    const prediction = await replicate.predictions.get(predictionId);
    return prediction;
  } catch (error) {
    console.error('Error checking prediction status:', error);
    throw error;
  }
}