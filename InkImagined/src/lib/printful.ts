// BACKEND UTILITY: Printful API Integration
// UPDATED: With orientation support and DPI considerations

import type { ShippingAddress } from '@/types';

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!;

// Canvas size to required pixel dimensions for 300 DPI
// Formula: inches × 300 DPI = pixels needed
const CANVAS_DPI_REQUIREMENTS = {
  '9x12': { width: 2700, height: 3600 },   // 9" × 300 DPI = 2700px
  '12x16': { width: 3600, height: 4800 },  // 12" × 300 DPI = 3600px
  '16x20': { width: 4800, height: 6000 },  // 16" × 300 DPI = 4800px
};

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: Array<{
    url: string;
    type: 'default';
    options?: Array<{
      id: string;
      value: string;
    }>;
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
  orderValue: number,
  canvasSize: string // e.g., '12x16'
): Promise<{ id: number; status: string }> {
  
  // ✅ Determine orientation based on canvas size
  // All your canvases are portrait (height > width)
  const orientation = 'horizontal'; // or 'horizontal' if you switch to landscape
  
  console.log('📦 Creating Printful order:', {
    variantId,
    orientation,
    canvasSize,
  });

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
            // ✅ CRITICAL: Specify orientation
            options: [
              {
                id: 'print_orientation',
                value: orientation, // 'horizontal' or 'vertical'
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const response = await printfulRequest('/orders', 'POST', orderData);
    
    console.log('✅ Printful order created:', {
      id: response.result.id,
      status: response.result.status,
    });

    return {
      id: response.result.id,
      status: response.result.status,
    };
  } catch (error) {
    console.error('❌ Printful order creation error:', error);
    throw error;
  }
}

// Helper to calculate expected DPI
export function calculateImageDPI(
  imageWidth: number,
  imageHeight: number,
  canvasSize: string
): number {
  const requirements = CANVAS_DPI_REQUIREMENTS[canvasSize as keyof typeof CANVAS_DPI_REQUIREMENTS];
  
  if (!requirements) return 0;

  // Calculate DPI based on width (assuming portrait orientation)
  const dpi = (imageWidth / (requirements.width / 300));
  
  return Math.round(dpi);
}

// Helper to check if image meets quality requirements
export function checkImageQuality(
  imageWidth: number,
  imageHeight: number,
  canvasSize: string
): {
  meetsRequirement: boolean;
  currentDPI: number;
  recommendedDPI: number;
  message: string;
} {
  const requirements = CANVAS_DPI_REQUIREMENTS[canvasSize as keyof typeof CANVAS_DPI_REQUIREMENTS];
  
  if (!requirements) {
    return {
      meetsRequirement: false,
      currentDPI: 0,
      recommendedDPI: 300,
      message: 'Unknown canvas size',
    };
  }

  const currentDPI = calculateImageDPI(imageWidth, imageHeight, canvasSize);
  const meetsRequirement = currentDPI >= 150; // Minimum acceptable
  const isIdeal = currentDPI >= 300;

  let message = '';
  if (isIdeal) {
    message = `✅ Excellent quality (${currentDPI} DPI)`;
  } else if (meetsRequirement) {
    message = `⚠️ Acceptable quality (${currentDPI} DPI) - 300 DPI recommended`;
  } else {
    message = `❌ Low quality (${currentDPI} DPI) - Will appear pixelated`;
  }

  return {
    meetsRequirement,
    currentDPI,
    recommendedDPI: 300,
    message,
  };
}

export async function confirmPrintfulOrder(orderId: number): Promise<void> {
  try {
    await printfulRequest(`/orders/${orderId}/confirm`, 'POST');
    console.log('✅ Printful order confirmed:', orderId);
  } catch (error) {
    console.error('❌ Printful order confirmation error:', error);
    throw error;
  }
}

export async function getOrderStatus(orderId: number): Promise<any> {
  try {
    const response = await printfulRequest(`/orders/${orderId}`);
    return response.result;
  } catch (error) {
    console.error('❌ Printful order status error:', error);
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

    const rates = response.result;
    if (rates.length > 0) {
      return parseFloat(rates[0].rate);
    }
    return 0;
  } catch (error) {
    console.error('❌ Shipping calculation error:', error);
    return 0;
  }
}