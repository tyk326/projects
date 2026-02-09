// FIXED PROMPTS - Preserves original subjects, only changes art style
// Focus on style, not on changing people's features

import Replicate from 'replicate';
import type { ThemeStyle } from '@/types';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const THEME_CONFIG: Record<ThemeStyle, { prompt: string; model: string; negativePrompt: string, strength: number, guidance_scale: number }> = {
  'studio-ghibli': {
    // Focus on clean lines and natural lighting rather than heavy watercolor washes
    prompt: 'Studio Ghibli hand-drawn anime style, high-definition cel-shaded animation, clean ink lines, soft natural lighting, vibrant but flat colors. Re-render the exact subjects and background of the original image in this animation style.',
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    negativePrompt: 'watercolor, messy paint, landscape, house, room, different person, distorted face, changing the background, blurry, low resolution, 3D render.',
    strength: 0.50, // Low strength keeps the performer/stage layout identical
    guidance_scale: 8.5, // High guidance forces the Ghibli colors into the existing shapes
  },
  'pixar': {
    // Focus on surface textures and cinematic lighting for a "toy-like" or high-end 3D feel
    prompt: 'Cinematic 3D render, stylized digital art, soft global illumination, tactile textures, vibrant but balanced color palette. Re-render the original scene with high-end animated feature film quality, preserving all original shapes and subjects.',
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    negativePrompt: 'flat 2D, sketch, photorealistic, uncanny valley, distorted proportions, scary, grainy.',
    strength: 0.58, // 3D styles need a slightly higher strength to create the "round" lighting effect
    guidance_scale: 7.5,
  },
  'lofi': {
    // Keeps the vibe but prevents it from becoming a blurry mess
    prompt: 'Lofi aesthetic, nostalgic retro film vibe, warm evening lighting, muted pastel tones, clean anime-inspired gradients. Preserve the original details and architecture while applying a cozy, chill atmosphere.',
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    negativePrompt: 'high contrast, sharp digital neon, messy textures, over-saturated, chaotic, modern photorealism.',
    strength: 0.45, // Keep it very low so it doesn't try to build a "bedroom" around your performer
    guidance_scale: 7.0,
  },
  'cowboy-bebop': {
    // Focus on "Cel-shading" and "Jazz Noir" lighting
    prompt: '1990s retro anime style, clean cel-shading, high-contrast shadows, jazz noir cinematic lighting. Apply a bold hand-drawn look to the original scene, maintaining all original structures and features with a vintage film finish.',
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    negativePrompt: '3D render, CGI, soft focus, rounded features, modern digital art, blurry, pastel.',
    strength: 0.52,
    guidance_scale: 8.0,
  },
  'spider-verse': {
    // Uses the "Comic" style as an accent rather than a total distortion
    prompt: 'Spider-Verse stylized illustration, comic book ink lines, subtle halftone patterns, vibrant street-art color accents. Enhances the original image with rhythmic line-work and artistic chromatic aberration while keeping subjects recognizable.',
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    negativePrompt: 'photorealistic, smooth surfaces, oil painting, traditional, dull colors, simplified shapes.',
    strength: 0.55,
    guidance_scale: 9.0, // High guidance is critical here to "force" the halftone dots to appear
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
      config.model as `${string}/${string}:${string}`,
      {
        input: {
          image: imageUrl,
          prompt: prompt,
          negative_prompt: config.negativePrompt,
          num_inference_steps: 35, // Higher steps for better details
          guidance_scale: config.guidance_scale, // Higher guidance keeps it closer to the prompt
          strength: config.strength, // REDUCED from 0.75 - less transformation, more preservation
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[0];
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