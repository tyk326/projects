// BACKEND API ROUTE: Stripe webhook handler
// FIXED: Correct imports + Test mode protection

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server'; // ← FIXED: Changed from @/lib/supabase
import { sendOrderConfirmationEmail } from '@/lib/resend';
import Stripe from 'stripe';

// ✅ AUTO-DETECT TEST MODE FROM STRIPE KEY
const IS_TEST_MODE = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');

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

  console.log(`📨 Webhook received: ${event.type}`, IS_TEST_MODE ? '(TEST MODE)' : '(PRODUCTION)');

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

        // ========================================
        // ✅ TEST MODE: Skip external services
        // ========================================
        if (IS_TEST_MODE) {
          console.log('🧪 TEST MODE DETECTED - Skipping Printful and Resend');
          console.log('Test order details:', {
            user_id,
            image_id,
            product_id,
            amount: session.amount_total,
          });

          // Still create order in database (for testing the flow)
          const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
              user_id: user_id,
              image_id: image_id,
              stripe_session_id: session.id,
              status: 'paid', // ← Same for both test and production
              amount: session.amount_total || 0,
              product_id: product_id,
              shipping_address: shippingAddress,
            })
            .select()
            .single();

          if (orderError) {
            console.error('Test order creation error:', orderError);
            throw orderError;
          }

          console.log('✅ Test order created in database:', order.id);
          console.log('❌ Skipped Printful order (test mode)');
          console.log('❌ Skipped confirmation email (test mode)');

          return NextResponse.json({
            received: true,
            testMode: true,
            orderId: order.id,
            message: 'Test payment processed - no real order/email sent'
          });
        }

        // ========================================
        // 🚀 PRODUCTION MODE: Full processing
        // ========================================
        console.log('🚀 PRODUCTION MODE - Creating real order');

        // Create order in database
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: user_id,
            image_id: image_id,
            stripe_session_id: session.id,
            status: 'paid', // ← Production status
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

        console.log('✅ Order created in database:', order.id);

        // Get the image for email
        const { data: image } = await supabaseAdmin
          .from('generated_images')
          .select('generated_url')
          .eq('id', image_id)
          .single();

        // TODO: Create Printful order here
        // This is where you'd call Printful API to create the physical order
        // Example:
        // const printfulOrder = await createPrintfulOrder({
        //   imageUrl: image.generated_url,
        //   productId: product_id,
        //   shippingAddress: shippingAddress,
        // });
        // 
        // await supabaseAdmin
        //   .from('orders')
        //   .update({ printful_order_id: printfulOrder.id })
        //   .eq('id', order.id);

        console.log('✅ Would create Printful order here (not implemented yet)');

        // Send confirmation email
        if (shippingAddress.email && image) {
          await sendOrderConfirmationEmail(
            shippingAddress.email,
            order.id,
            image.generated_url,
            product_id,
            session.amount_total || 0
          );
          console.log('✅ Confirmation email sent to:', shippingAddress.email);
        }

        console.log('✅ Production order processed successfully:', order.id);

      } catch (error) {
        console.error('Error processing checkout.session.completed:', error);
        // Return 200 so Stripe doesn't retry
        return NextResponse.json({ received: true, error: String(error) });
      }
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      // Handle async payment success (e.g., bank transfers)
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const status = 'paid';

        await supabaseAdmin
          .from('orders')
          .update({ status })
          .eq('stripe_session_id', session.id);

        console.log(`✅ Async payment succeeded - status updated to: ${status}`);
      } catch (error) {
        console.error('Error processing async payment:', error);
      }
      break;
    }

    case 'checkout.session.async_payment_failed': {
      // Handle async payment failure
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', session.id);

        console.log('❌ Async payment failed - order cancelled');
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