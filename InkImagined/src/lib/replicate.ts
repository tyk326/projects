// FLUX-OPTIMIZED - Best quality image-to-image transformation
// Much better at preserving subjects (people, buildings, landscapes)

import Replicate from 'replicate';
import type { ThemeStyle } from '@/types';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// FLUX.1 Dev - Best model for preserving subjects while applying style
export const THEME_CONFIG: Record<ThemeStyle, {
  prompt: string;
  model: string;
  strength: number;
  guidance: number; // FLUX uses 'guidance' not 'guidance_scale'
}> = {
  'studio-ghibli': {
    prompt: 'Studio Ghibli hand-drawn anime style, soft watercolor aesthetic, gentle pastel colors, painterly backgrounds, whimsical atmosphere, cel animation',
    model: 'black-forest-labs/flux-dev',
    strength: 0.68,
    guidance: 4.3, // FLUX uses lower guidance values (3-4 range is optimal)
  },
  'pixar': {
    prompt: 'Pixar 3D animation style, high-quality CGI rendering, smooth textures, vibrant saturated colors, soft cinematic lighting, rounded character design',
    model: 'black-forest-labs/flux-dev',
    strength: 0.68,
    guidance: 4.4,
  },
  'lofi': {
    prompt: 'Lofi hip hop aesthetic, chill nostalgic vibes, muted pastel color palette, soft gradients, cozy warm atmosphere, retro 90s anime style',
    model: 'black-forest-labs/flux-dev',
    strength: 0.68,
    guidance: 5.0,
  },
  'cowboy-bebop': {
    prompt: 'Cowboy Bebop 1990s anime style, hand-drawn cel animation, jazz noir atmosphere, bold ink outlines, cinematic composition, retro-futuristic aesthetic',
    model: 'black-forest-labs/flux-dev',
    strength: 0.65,
    guidance: 4.3,
  },
  'spider-verse': {
    prompt: 'Spider-Verse movie style, comic book illustration, halftone dot patterns, bold pop art colors, dynamic composition, stylized urban aesthetic, printed comic texture',
    model: 'black-forest-labs/flux-dev',
    strength: 0.68,
    guidance: 5.0, // Higher guidance for more dramatic comic book effect
  },
};

export async function generateImage(
  imageUrl: string,
  theme: ThemeStyle,
  customPrompt?: string
): Promise<string> {
  const config = THEME_CONFIG[theme];

  const prompt = customPrompt
    ? `${customPrompt}, ${config.prompt}`
    : config.prompt;

  try {
    const output = await replicate.run(
      config.model as `${string}/${string}`,
      {
        input: {
          image: imageUrl,
          prompt: prompt,
          // FLUX uses different parameter names than SDXL
          guidance: config.guidance,
          num_inference_steps: 28,          // FLUX is faster, needs fewer steps
          output_format: 'png',
          output_quality: 90,
          prompt_strength: config.strength, // How much to transform
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