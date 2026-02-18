// BACKEND API ROUTE: Stripe webhook handler
// UPDATED: With Printful integration for production orders

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendOrderConfirmationEmail } from '@/lib/resend';
import { createPrintfulOrder, confirmPrintfulOrder } from '@/lib/printful';
import { CANVAS_PRODUCTS } from '@/lib/stripe';
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
          address2: session.shipping_details?.address?.line2 ?? undefined,
          city: session.shipping_details?.address?.city || '',
          state: session.shipping_details?.address?.state || '',
          zip: session.shipping_details?.address?.postal_code || '',
          country: session.shipping_details?.address?.country || 'US',
          email: session.customer_details?.email || '',
          phone: session.customer_details?.phone || undefined,
        };

        // ========================================
        // ✅ TEST MODE: Skip Printful
        // ========================================
        if (IS_TEST_MODE) {
          console.log('🧪 TEST MODE DETECTED - Skipping Printful');
          console.log('Test order details:', {
            user_id,
            image_id,
            product_id,
            amount: session.amount_total,
          });

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
            console.error('Test order creation error:', orderError);
            throw orderError;
          }

          console.log('✅ Test order created in database:', order.id);
          console.log('❌ Skipped Printful order (test mode)');

          // Send email
          const { data: image } = await supabaseAdmin
            .from('generated_images')
            .select('generated_url')
            .eq('id', image_id)
            .single();

          if (shippingAddress.email && image) {
            await sendOrderConfirmationEmail(
              shippingAddress.email,
              order.id,
              image.generated_url,
              product_id,
              session.amount_total || 0
            );
            console.log('✅ TEST email sent to:', shippingAddress.email);
          }

          return NextResponse.json({
            received: true,
            testMode: true,
            orderId: order.id,
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

        console.log('✅ Order created in database:', order.id);

        // Get the image with canvas size
        const { data: image } = await supabaseAdmin
          .from('generated_images')
          .select('generated_url, canvas_size')
          .eq('id', image_id)
          .single();

        if (!image) {
          throw new Error('Image not found');
        }

        // Get product details
        const product = CANVAS_PRODUCTS.find(p => p.id === product_id);
        
        if (!product) {
          throw new Error('Product not found');
        }

        // ✅ CREATE PRINTFUL ORDER
        try {
          console.log('📦 Creating Printful order...');
          
          const printfulOrder = await createPrintfulOrder(
            image.generated_url,
            product.printful_variant_id,
            shippingAddress,
            session.amount_total || 0,
            image.canvas_size // ✅ Pass canvas size for orientation
          );

          console.log('✅ Printful order created:', printfulOrder.id);

          // Confirm Printful order (starts production)
          await confirmPrintfulOrder(printfulOrder.id);
          
          console.log('✅ Printful order confirmed:', printfulOrder.id);

          // Update order with Printful ID
          await supabaseAdmin
            .from('orders')
            .update({ 
              printful_order_id: printfulOrder.id.toString(),
              status: 'processing',
            })
            .eq('id', order.id);

          console.log('✅ Order updated with Printful ID');

        } catch (printfulError) {
          console.error('❌ Printful order failed:', printfulError);
          
          // Update order status to show Printful failed
          await supabaseAdmin
            .from('orders')
            .update({ 
              status: 'printful_failed',
              notes: `Printful error: ${String(printfulError)}`,
            })
            .eq('id', order.id);

          // Don't throw - order was paid, we'll handle manually
          console.log('⚠️ Order marked as printful_failed - will need manual fulfillment');
        }

        // Send confirmation email
        if (shippingAddress.email && image) {
          try {
            await sendOrderConfirmationEmail(
              shippingAddress.email,
              order.id,
              image.generated_url,
              product_id,
              session.amount_total || 0
            );
            console.log('✅ Confirmation email sent to:', shippingAddress.email);
          } catch (emailError) {
            console.error('❌ Email failed:', emailError);
          }
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
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'paid' })
          .eq('stripe_session_id', session.id);

        console.log('✅ Async payment succeeded - status updated');
      } catch (error) {
        console.error('Error processing async payment:', error);
      }
      break;
    }

    case 'checkout.session.async_payment_failed': {
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