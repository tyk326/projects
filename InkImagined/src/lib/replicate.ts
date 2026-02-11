// FLUX IMAGE GENERATION WITH CANVAS ASPECT RATIOS
// Generates images that perfectly fit canvas sizes

import Replicate from 'replicate';
import type { ThemeStyle } from '@/types';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// ✅ UPDATED: Map canvas sizes directly to valid FLUX aspect ratios
export const CANVAS_ASPECT_RATIOS = {
  'canvas-9x12': '3:4',   // 9x12 inches → 3:4 ratio
  'canvas-12x16': '3:4',  // 12x16 inches → 3:4 ratio
  'canvas-16x20': '4:5',  // 16x20 inches → 4:5 ratio
} as const;

export const THEME_CONFIG: Record<ThemeStyle, {
  prompt: string;
  model: string;
  strength: number;
  guidance: number;
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
    strength: 0.68,
    guidance: 5.4,
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
  canvasSize?: string,
  customPrompt?: string
): Promise<string> {
  const config = THEME_CONFIG[theme];

  const prompt = customPrompt
    ? `${customPrompt}, ${config.prompt}`
    : config.prompt;

  // ✅ FIXED: Get aspect ratio string instead of dimensions
  const validAspectRatios = [
    "1:1", "16:9", "21:9", "3:2", "2:3", 
    "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"
  ];

  let aspectRatio = '4:5'; // Default aspect ratio

  if (canvasSize && CANVAS_ASPECT_RATIOS[canvasSize as keyof typeof CANVAS_ASPECT_RATIOS]) {
    aspectRatio = CANVAS_ASPECT_RATIOS[canvasSize as keyof typeof CANVAS_ASPECT_RATIOS];
  }

  // Validate aspect ratio
  if (!validAspectRatios.includes(aspectRatio)) {
    console.warn(`Invalid aspect ratio ${aspectRatio}, using default 4:5`);
    aspectRatio = '4:5';
  }

  console.log('🎨 Generating with aspect ratio:', aspectRatio);

  try {
    const output = await replicate.run(
      config.model as `${string}/${string}`,
      {
        input: {
          image: imageUrl,
          prompt: prompt,
          guidance: config.guidance,
          num_inference_steps: 28,
          output_format: 'png',
          output_quality: 90,
          prompt_strength: config.strength,
          aspect_ratio: aspectRatio, // ✅ FIXED: Use string like "4:5" instead of "custom"
          // ❌ REMOVED: width and height (not supported with aspect_ratio)
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[0];
    } else if (typeof output === 'string') {
      return output;
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Replicate generation error:', error);
    throw new Error('Failed to generate image');
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