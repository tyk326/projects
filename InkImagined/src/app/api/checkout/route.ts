// BACKEND API ROUTE: Create Stripe checkout session
// FIXED: Correct import path for supabase-server

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server'; // ← FIXED!
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient(); // ← FIXED: Added await
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { imageId, productId } = body;

    console.log('🛒 Checkout request:', {
      imageId,
      productId,
      userId: user.id,
    });

    if (!imageId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the image belongs to the user
    const { data: image, error: imageError } = await supabase
      .from('generated_images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single();

    if (imageError || !image) {
      console.error('Image not found:', imageError);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    console.log('✅ Image verified, creating checkout session...');

    // Create Stripe checkout session (metadata is passed inside createCheckoutSession)
    const session = await createCheckoutSession(
      imageId,
      productId,
      user.id,
      image.generated_url
    );

    console.log('✅ Checkout session created:', session.id);
    console.log('📋 Metadata:', session.metadata);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}