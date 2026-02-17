// BACKEND UTILITY: Printful API Integration
// UPDATED: With orientation support and DPI considerations

import type { ShippingAddress } from '@/types';

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!;

// and define the horizontal dimensions properly.
const CANVAS_PHYSICAL_SIZE = {
  '12x9': { width: 12, height: 9 },   // Landscape: 12" wide, 9" tall
  '16x12': { width: 16, height: 12 },
  '20x16': { width: 20, height: 16 },
};

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: Array<{
    url: string;
    type: 'default';
    position: {
      area_width: number;
      area_height: number;
      width: number;
      height: number;
      top: number;
      left: number;
    };
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

  const dimensions = CANVAS_PHYSICAL_SIZE[canvasSize as keyof typeof CANVAS_PHYSICAL_SIZE];

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
            // ✅ THIS defines the horizontal orientation
            position: {
              // ✅ Use INCHES here, not pixels
              area_width: dimensions.width,
              area_height: dimensions.height,
              width: dimensions.width,
              height: dimensions.height,
              top: 0,
              left: 0
            },
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
  const requirements = CANVAS_PHYSICAL_SIZE[canvasSize as keyof typeof CANVAS_PHYSICAL_SIZE];

  if (!requirements) return 0;

  // Calculate DPI based on width (assuming portrait orientation)
  const dpi = (imageWidth / (requirements.width));

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
  const requirements = CANVAS_PHYSICAL_SIZE[canvasSize as keyof typeof CANVAS_PHYSICAL_SIZE];

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