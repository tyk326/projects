// BACKEND API ROUTE: Create Printful order after payment

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase-server';
import { createPrintfulOrder, confirmPrintfulOrder } from '@/lib/printful';
import { CANVAS_PRODUCTS } from '@/lib/stripe';
import type { ShippingAddress } from '@/types';

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

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, generated_images(*)')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is already sent to Printful
    if (order.printful_order_id) {
      return NextResponse.json(
        { error: 'Order already sent to Printful' },
        { status: 400 }
      );
    }

    // Check if order is paid
    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Order is not paid' },
        { status: 400 }
      );
    }

    // Get product details
    const product = CANVAS_PRODUCTS.find(p => p.id === order.product_id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create Printful order
    const printfulOrder = await createPrintfulOrder(
      order.generated_images.generated_url,
      product.printful_variant_id,
      order.shipping_address as ShippingAddress,
      order.amount
    );

    // Confirm the order (this charges your Printful account and starts production)
    await confirmPrintfulOrder(printfulOrder.id);

    // Update order with Printful ID
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        printful_order_id: printfulOrder.id.toString(),
        status: 'processing',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      printful_order_id: printfulOrder.id,
      status: printfulOrder.status,
    });

  } catch (error) {
    console.error('Printful order error:', error);
    return NextResponse.json(
      { error: 'Failed to create Printful order' },
      { status: 500 }
    );
  }
}