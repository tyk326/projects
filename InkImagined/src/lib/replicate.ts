// OPTIMIZED FLUX PROMPTS - Best practices for style transfer
// Focus on art style, not content transformation

import Replicate from 'replicate';
import type { ThemeStyle } from '@/types';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const THEME_CONFIG: Record<ThemeStyle, { 
  prompt: string; 
  model: string; 
  strength: number;
  guidance: number;
}> = {
  'studio-ghibli': {
    // ✅ References iconic movies, focuses on technique not content
    prompt: 'Studio Ghibli hand-drawn anime style by Hayao Miyazaki, soft watercolor aesthetic inspired by Spirited Away and Howl\'s Moving Castle, gentle pastel colors, painterly backgrounds, whimsical atmosphere, traditional cel animation technique, maintain original subjects and composition',
    model: 'black-forest-labs/flux-dev',
    strength: 0.69,  // Slightly lower to preserve subjects better
    guidance: 5.0,   // Lower guidance for softer Ghibli aesthetic
  },
  'pixar': {
    // ✅ References style, specifies technique
    prompt: 'Pixar Animation Studios 3D CGI style like Coco, Up and Toy Story, high-quality rendering, smooth character textures, vibrant saturated colors, soft cinematic lighting, rounded friendly character design, maintain original subjects and poses',
    model: 'black-forest-labs/flux-dev',
    strength: 0.70,
    guidance: 5.5,
  },
  'lofi': {
    // ✅ Focuses on aesthetic/mood, no specific movies needed (it's a style)
    prompt: 'Lofi hip hop aesthetic, chill nostalgic vibes, muted pastel color palette, soft gradients, cozy warm atmosphere, retro 90s anime style, StudyGirl aesthetic, maintain original scene composition',
    model: 'black-forest-labs/flux-dev',
    strength: 0.68,  // Lower for subtle lofi effect
    guidance: 5.4,
  },
  'cowboy-bebop': {
    // ✅ References the series, focuses on visual technique
    prompt: 'Cowboy Bebop anime style by Shinichiro Watanabe, 1990s hand-drawn cel animation, jazz noir atmosphere, bold ink outlines, cinematic composition, retro-futuristic aesthetic, film grain texture, maintain original subjects',
    model: 'black-forest-labs/flux-dev',
    strength: 0.67,
    guidance: 4.9,
  },
  'spider-verse': {
    // ✅ References the movie, specifies comic book techniques
    prompt: 'Comic illustration inspired by Spider-Verse, hand-drawn cel animation with bold black ink outlines, vibrant pop art colors, dynamic composition, stylized non-realistic characters, painted backgrounds with halftone accents, maintain original subjects and poses',
    model: 'black-forest-labs/flux-dev',
    strength: 0.72,
    guidance: 5.3,  // Higher for bold comic effect
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
          guidance: config.guidance,
          num_inference_steps: 28,
          output_format: 'png',
          output_quality: 90,
          prompt_strength: config.strength,
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