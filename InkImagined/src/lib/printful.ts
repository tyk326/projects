// BACKEND UTILITY: Printful API for Print-on-Demand Fulfillment

import type { ShippingAddress } from '@/types';

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!;

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: Array<{
    url: string;
    type: 'default';
  }>;
}

interface PrintfulOrderRequest {
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    phone?: string;
    email: string;
  };
  items: PrintfulOrderItem[];
  retail_costs?: {
    currency: string;
    subtotal: string;
    shipping: string;
    tax: string;
  };
}

async function printfulRequest(endpoint: string, method: string = 'GET', body?: any) {
  const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API error: ${error.error?.message || 'Unknown error'}`);
  }

  return response.json();
}

export async function createPrintfulOrder(
  imageUrl: string,
  variantId: number,
  shippingAddress: ShippingAddress,
  orderValue: number
): Promise<{ id: number; status: string }> {
  const orderData: PrintfulOrderRequest = {
    recipient: {
      name: shippingAddress.name,
      address1: shippingAddress.address1,
      address2: shippingAddress.address2,
      city: shippingAddress.city,
      state_code: shippingAddress.state,
      country_code: shippingAddress.country,
      zip: shippingAddress.zip,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
    },
    items: [
      {
        variant_id: variantId,
        quantity: 1,
        files: [
          {
            url: imageUrl,
            type: 'default',
          },
        ],
      },
    ],
  };

  try {
    const response = await printfulRequest('/orders', 'POST', orderData);
    return {
      id: response.result.id,
      status: response.result.status,
    };
  } catch (error) {
    console.error('Printful order creation error:', error);
    throw error;
  }
}

export async function confirmPrintfulOrder(orderId: number): Promise<void> {
  try {
    await printfulRequest(`/orders/${orderId}/confirm`, 'POST');
  } catch (error) {
    console.error('Printful order confirmation error:', error);
    throw error;
  }
}

export async function getOrderStatus(orderId: number): Promise<any> {
  try {
    const response = await printfulRequest(`/orders/${orderId}`);
    return response.result;
  } catch (error) {
    console.error('Printful order status error:', error);
    throw error;
  }
}

export async function calculateShippingCost(
  variantId: number,
  address: ShippingAddress
): Promise<number> {
  try {
    const response = await printfulRequest('/shipping/rates', 'POST', {
      recipient: {
        country_code: address.country,
        state_code: address.state,
        zip: address.zip,
      },
      items: [
        {
          variant_id: variantId,
          quantity: 1,
        },
      ],
    });
    
    // Return the cheapest shipping option
    const rates = response.result;
    if (rates.length > 0) {
      return parseFloat(rates[0].rate);
    }
    
    return 0;
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return 0;
  }
}
