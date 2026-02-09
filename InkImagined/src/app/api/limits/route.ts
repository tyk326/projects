// BACKEND API ROUTE: Check user's remaining daily generations
// FIXED: Proper timezone handling

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase-server';

const DAILY_GENERATION_LIMIT = 5;

// Helper function to get date in user's timezone (US Eastern)
function getTodayInUserTimezone(): string {
  const now = new Date();
  const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function getNextMidnightEST(): string {
  const now = new Date();
  const estNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  // Get tomorrow at midnight EST
  const tomorrow = new Date(estNow);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return tomorrow.toISOString();
}

export async function GET(request: NextRequest) {
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

    // Get user's generation limits
    const { data: limitData, error: limitError } = await supabaseAdmin
      .from('user_generation_limits')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // If no limit record exists, user hasn't generated anything yet
    if (!limitData) {
      return NextResponse.json({
        dailyLimit: DAILY_GENERATION_LIMIT,
        used: 0,
        remaining: DAILY_GENERATION_LIMIT,
        resetsAt: getNextMidnightEST(),
      });
    }

    // Check if we need to reset for new day
    const today = getTodayInUserTimezone();
    const used = limitData.last_reset_date === today ? limitData.generations_today : 0;
    const remaining = Math.max(0, DAILY_GENERATION_LIMIT - used);

    return NextResponse.json({
      dailyLimit: DAILY_GENERATION_LIMIT,
      used,
      remaining,
      totalGenerations: limitData.total_generations,
      resetsAt: getNextMidnightEST(),
    });

  } catch (error) {
    console.error('Error checking limits:', error);
    return NextResponse.json(
      { error: 'Failed to check generation limits' },
      { status: 500 }
    );
  }
}