// BACKEND API ROUTE: Stripe webhook handler

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendOrderConfirmationEmail } from '@/lib/resend';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Extract metadata
        const { image_id, user_id, product_id } = session.metadata!;
        
        // Get shipping address
        const shippingAddress = {
          name: session.shipping_details?.name || '',
          address1: session.shipping_details?.address?.line1 || '',
          address2: session.shipping_details?.address?.line2,
          city: session.shipping_details?.address?.city || '',
          state: session.shipping_details?.address?.state || '',
          zip: session.shipping_details?.address?.postal_code || '',
          country: session.shipping_details?.address?.country || 'US',
          email: session.customer_details?.email || '',
          phone: session.customer_details?.phone || undefined,
        };

        // Create order in database
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: user_id,
            image_id: image_id,
            stripe_session_id: session.id,
            status: 'paid',
            amount: session.amount_total || 0,
            product_id: product_id,
            shipping_address: shippingAddress,
          })
          .select()
          .single();

        if (orderError) {
          console.error('Order creation error:', orderError);
          throw orderError;
        }

        // Get the image for email
        const { data: image } = await supabaseAdmin
          .from('generated_images')
          .select('generated_url')
          .eq('id', image_id)
          .single();

        // Send confirmation email
        if (shippingAddress.email && image) {
          await sendOrderConfirmationEmail(
            shippingAddress.email,
            order.id,
            image.generated_url,
            product_id,
            session.amount_total || 0
          );
        }

        console.log('Order created successfully:', order.id);
      } catch (error) {
        console.error('Error processing checkout.session.completed:', error);
        // Return 200 so Stripe doesn't retry
        return NextResponse.json({ received: true });
      }
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      // Handle async payment success (e.g., bank transfers)
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Update order status
        await supabaseAdmin
          .from('orders')
          .update({ status: 'paid' })
          .eq('stripe_session_id', session.id);
      } catch (error) {
        console.error('Error processing async payment:', error);
      }
      break;
    }

    case 'checkout.session.async_payment_failed': {
      // Handle async payment failure
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Update order status
        await supabaseAdmin
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', session.id);
      } catch (error) {
        console.error('Error processing failed payment:', error);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
