// BACKEND UTILITY: Stripe Payment Processing

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Canvas product pricing
export const CANVAS_PRODUCTS = [
  {
    id: 'canvas-9x12', // printful cost is $16.32
    name: '9" × 12" Canvas',
    size: '9x12',
    price: 3899, // $38.99 in cents
    printful_variant_id: 4438, // Replace with actual Printful variant ID
  },
  {
    id: 'canvas-12x16', // printful cost is $23.41
    name: '12" × 16" Canvas',
    size: '12x16',
    price: 5099, // $50.99 in cents
    printful_variant_id: 4440, // Replace with actual Printful variant ID
  },
  {
    id: 'canvas-16x20', // printful cost is $28.56
    name: '16" × 20" Canvas',
    size: '16x20',
    price: 6799, // $67.99 in cents
    printful_variant_id: 4442, // Replace with actual Printful variant ID
  },
];

export async function createCheckoutSession(
  imageId: string,
  productId: string,
  userId: string,
  imageUrl: string
): Promise<Stripe.Checkout.Session> {
  const product = CANVAS_PRODUCTS.find(p => p.id === productId);
  
  if (!product) {
    throw new Error('Invalid product');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: 'AI-Generated Canvas Print',
            images: [imageUrl],
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    metadata: {
      image_id: imageId,
      user_id: userId,
      product_id: productId,
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU'],
    },
  });

  return session;
}

export async function retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer'],
  });
}
