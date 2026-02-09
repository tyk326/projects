// SHARED TYPES for Frontend & Backend

export type ThemeStyle = 
  | 'studio-ghibli'
  | 'pixar'
  | 'lofi'
  | 'cowboy-bebop'
  | 'spider-verse';

export interface Theme {
  id: ThemeStyle;
  name: string;
  description: string;
  prompt: string;
  model: string;
}

export interface GeneratedImage {
  id: string;
  original_url: string;
  generated_url: string;
  theme: ThemeStyle;
  created_at: string;
  user_id: string;
}

export interface Order {
  id: string;
  user_id: string;
  image_id: string;
  stripe_session_id: string;
  printful_order_id?: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered';
  amount: number;
  shipping_address: ShippingAddress;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone?: string;
}

export interface CanvasProduct {
  id: string;
  name: string;
  size: string;
  price: number;
  printful_variant_id: number;
}
