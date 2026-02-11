// BACKEND API ROUTE: Generate AI-styled image using Replicate
// UPDATED: Added canvas size parameter for aspect ratio control

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase-server';
import { generateImage } from '@/lib/replicate';
import type { ThemeStyle } from '@/types';

const DAILY_GENERATION_LIMIT = 5;

// Helper function to get date in user's timezone (US Eastern)
function getTodayInUserTimezone(): string {
  // Get current time in US Eastern timezone
  const now = new Date();
  const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  // Format as YYYY-MM-DD
  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check daily generation limit
    const { data: limitData, error: limitError } = await supabaseAdmin
      .from('user_generation_limits')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    let currentLimits = limitData;

    // If no limit record exists, create one
    if (!limitData) {
      const today = getTodayInUserTimezone();
      
      const { data: newLimit, error: createError } = await supabaseAdmin
        .from('user_generation_limits')
        .insert({
          user_id: user.id,
          generations_today: 0,
          last_reset_date: today,
          total_generations: 0,
        })
        .select()
        .maybeSingle();

      if (createError) {
        console.error('Error creating limit record:', createError);
        return NextResponse.json(
          { error: 'Failed to initialize generation limits' },
          { status: 500 }
        );
      }

      currentLimits = newLimit;
    }

    // Check if we need to reset daily counter
    const today = getTodayInUserTimezone();
    
    console.log('=== RESET CHECK ===');
    console.log('Last reset date:', currentLimits?.last_reset_date);
    console.log('Today:', today);
    console.log('Need reset?', currentLimits?.last_reset_date !== today);
    console.log('===================');
    
    if (currentLimits && currentLimits.last_reset_date !== today) {
      // Reset daily counter for new day
      const { data: resetData, error: resetError } = await supabaseAdmin
        .from('user_generation_limits')
        .update({
          generations_today: 0,
          last_reset_date: today,
        })
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (resetError) {
        console.error('Error resetting daily limit:', resetError);
      } else {
        console.log('✅ Daily limit reset successfully!');
        currentLimits = resetData;
      }
    }

    // Check if user has exceeded daily limit
    if (currentLimits && currentLimits.generations_today >= DAILY_GENERATION_LIMIT) {
      return NextResponse.json(
        { 
          error: 'Daily generation limit reached',
          message: `You've used all ${DAILY_GENERATION_LIMIT} generations today. Resets at midnight EST.`,
          limit: DAILY_GENERATION_LIMIT,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { imageUrl, theme, customPrompt, canvasSize } = body; // ✅ ADDED: canvasSize

    if (!imageUrl || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate theme
    const validThemes: ThemeStyle[] = ['studio-ghibli', 'pixar', 'lofi', 'cowboy-bebop', 'spider-verse'];
    if (!validThemes.includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      );
    }

    console.log('🎨 Generating image:', {
      theme,
      canvasSize: canvasSize || 'default (4:5)',
      userId: user.id,
    });

    // ✅ UPDATED: Pass canvas size to generateImage
    const generatedUrl = await generateImage(imageUrl, theme, canvasSize, customPrompt);

    // Download the generated image
    const imageResponse = await fetch(generatedUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${theme}.png`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('generated')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to save generated image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('generated')
      .getPublicUrl(fileName);

    // ✅ UPDATED: Save canvas_size to database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('generated_images')
      .insert({
        user_id: user.id,
        original_url: imageUrl,
        generated_url: publicUrl,
        theme: theme,
        custom_prompt: customPrompt || null,
        canvas_size: canvasSize || null, // ✅ ADDED: Store canvas size
      })
      .select()
      .maybeSingle();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save image record' },
        { status: 500 }
      );
    }

    // Increment generation counter
    const generationsToday = (currentLimits?.generations_today || 0) + 1;
    const totalGenerations = (currentLimits?.total_generations || 0) + 1;

    const { error: updateError } = await supabaseAdmin
      .from('user_generation_limits')
      .upsert({
        user_id: user.id,
        generations_today: generationsToday,
        total_generations: totalGenerations,
        last_reset_date: today,
      });

    if (updateError) {
      console.error('Error updating generation count:', updateError);
    }

    const remaining = DAILY_GENERATION_LIMIT - generationsToday;

    console.log('✅ Image generated successfully!');
    console.log(`📊 Generations: ${generationsToday}/${DAILY_GENERATION_LIMIT} (${remaining} remaining)`);

    return NextResponse.json({
      success: true,
      image: dbData,
      generationsRemaining: remaining,
      dailyLimit: DAILY_GENERATION_LIMIT,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}