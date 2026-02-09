# InkImagined Print - MVP

Transform photos into AI-generated artwork and order premium canvas prints.

## 🎨 Features

- **AI Image Generation**: 5 artistic styles (Studio Ghibli, Pixar, Lo-Fi, Cowboy Bebop, Spider-Verse)
- **Daily Generation Limits**: 5 free generations per day to prevent token abuse (resets at midnight)
- **Supabase Authentication**: Easy Google OAuth login
- **Image Upload & Storage**: Secure file handling with Supabase Storage
- **Stripe Payments**: Secure checkout with multiple canvas sizes
- **Printful Integration**: Automated print-on-demand fulfillment
- **Email Notifications**: Order confirmations and shipping updates via Resend
- **User Dashboard**: View generated images and track orders

## 📁 Project Structure

```
BACKEND (API & Server-side):
├── src/app/api/              # API Routes
│   ├── upload/               # Image upload endpoint
│   ├── generate/             # AI generation endpoint (with daily limits)
│   ├── limits/               # Check remaining generations
│   ├── checkout/             # Stripe checkout creation
│   ├── webhook/              # Stripe payment webhooks
│   └── order/                # Printful order creation
├── src/lib/                  # Backend Utilities
│   ├── supabase.ts          # Database client
│   ├── replicate.ts         # AI generation
│   ├── stripe.ts            # Payment processing
│   ├── printful.ts          # Print fulfillment
│   └── resend.ts            # Email service
└── supabase/migrations/     # Database schema

FRONTEND (UI & Client-side):
├── src/app/                  # Pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/upload page
│   ├── dashboard/           # User gallery
│   └── success/             # Payment success
└── src/components/           # React Components
    ├── AuthButton.tsx
    ├── ImageUpload.tsx
    ├── ThemeSelector.tsx
    ├── PreviewGallery.tsx
    ├── GenerationLimit.tsx   # Daily limit indicator
    └── CheckoutButton.tsx
```

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Accounts for: Supabase, Replicate, Stripe, Printful, Resend

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file (copy from `.env.local.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Replicate
REPLICATE_API_TOKEN=your_replicate_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Printful
PRINTFUL_API_KEY=your_printful_api_key

# Resend
RESEND_API_KEY=your_resend_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Supabase Setup

#### A. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your Project URL and API keys

#### B. Run Migration
1. Go to SQL Editor in Supabase Dashboard
2. Copy and paste the contents of `supabase/migrations/001_initial.sql`
3. Run the migration

#### C. Create Storage Buckets
1. Go to Storage in Supabase Dashboard
2. Create two buckets:
   - `originals` (for uploaded images)
   - `generated` (for AI-generated images)
3. Set both buckets to **public** access

#### D. Setup Authentication
1. Go to Authentication → Providers
2. Enable Google OAuth
3. Add redirect URL: `http://localhost:3000/auth/callback`
4. For production, add your production URL

### 5. Replicate Setup

1. Go to [replicate.com](https://replicate.com)
2. Sign up and get API token
3. Add token to `.env.local`

### 6. Stripe Setup

#### A. Get API Keys
1. Go to [stripe.com](https://stripe.com)
2. Get Publishable and Secret keys
3. Add to `.env.local`

#### B. Setup Webhook
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward events to local:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
4. Copy webhook secret to `.env.local`

For production:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`
4. Copy signing secret

### 7. Printful Setup

1. Go to [printful.com](https://printful.com)
2. Sign up for account
3. Go to Settings → API
4. Generate API key
5. Add to `.env.local`

#### Update Product IDs
In `src/lib/stripe.ts`, update `printful_variant_id` with actual Printful product variant IDs:
- Browse Printful catalog
- Find canvas products you want to offer
- Copy variant IDs for each size

### 8. Resend Setup

1. Go to [resend.com](https://resend.com)
2. Sign up and verify domain (or use resend.dev for testing)
3. Get API key
4. Add to `.env.local`
5. Update `from` email in `src/lib/resend.ts` with your verified domain

### 9. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔄 Complete Flow

### User Journey
1. **Upload**: User uploads a photo
2. **Select**: User chooses an art style (Ghibli, Pixar, etc.)
3. **Generate**: AI creates styled image (via Replicate)
4. **Preview**: User sees original vs AI-generated comparison
5. **Checkout**: User selects canvas size and pays (via Stripe)
6. **Fulfill**: Order sent to Printful for printing
7. **Ship**: User receives tracking info via email
8. **Dashboard**: User can view all images and orders

### Technical Flow

**BACKEND Flow:**
1. `POST /api/upload` → Upload to Supabase Storage
2. `POST /api/generate` → Replicate AI → Save to database
3. `POST /api/checkout` → Create Stripe session
4. `POST /api/webhook` → Stripe confirms payment → Save order → Send email
5. `POST /api/order` → Create Printful order → Update status

**FRONTEND Flow:**
1. User visits homepage (`page.tsx`)
2. Signs in via `AuthButton` component
3. Uploads via `ImageUpload` component
4. Selects theme via `ThemeSelector`
5. Views result in `PreviewGallery`
6. Checks out via `CheckoutButton`
7. Redirected to Stripe Checkout
8. Returns to success page
9. Views orders in dashboard

## 🧪 Testing

### Test the AI Generation
1. Sign in with Google
2. Upload any image (use a portrait photo for best results)
3. Select "Studio Ghibli" style
4. Click "Generate AI Art"
5. Wait ~30 seconds for generation

### Test Payment Flow
Use Stripe test card:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Test Webhooks
Make sure Stripe CLI is running:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## 📦 Deployment

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

### Update Environment Variables
1. Add all `.env.local` variables to Vercel
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Update Stripe webhook URL
4. Update Supabase redirect URLs

## 🎨 Customization

### Add More Art Styles
Edit `src/lib/replicate.ts` and add to `THEME_CONFIG`:

```typescript
'your-style': {
  prompt: 'your style description',
  model: 'model-id',
}
```

### Change Canvas Sizes
Edit `CANVAS_PRODUCTS` in `src/lib/stripe.ts`

### Customize Emails
Edit templates in `src/lib/resend.ts`

### Change Colors
Edit `tailwind.config.ts` to update the color scheme

## 🔐 Security Notes

- Never commit `.env.local`
- Use Supabase RLS policies (already configured)
- Validate all user inputs on backend
- Use Stripe webhook signatures
- Keep API keys secure

## 📝 TODO for Production

- [ ] Add error tracking (Sentry)
- [ ] Implement rate limiting
- [ ] Add image optimization
- [ ] Create admin dashboard
- [ ] Add order status webhooks from Printful
- [ ] Implement refund handling
- [ ] Add analytics (PostHog, Google Analytics)
- [ ] Create terms of service and privacy policy
- [ ] Set up CDN for images
- [ ] Add automated tests

## 🐛 Common Issues

**"Unauthorized" errors**: Check Supabase auth configuration
**Webhook not receiving events**: Ensure Stripe CLI is running
**Images not uploading**: Check Supabase storage bucket permissions
**Generation fails**: Verify Replicate API token and credits
**Payment not processing**: Check Stripe test mode is enabled

## 📚 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **AI**: Replicate (Stable Diffusion)
- **Payments**: Stripe Checkout
- **Fulfillment**: Printful API
- **Email**: Resend
- **Hosting**: Vercel

## 💡 Support

For issues or questions:
1. Check this README
2. Review environment variables
3. Check browser console for frontend errors
4. Check Vercel/terminal logs for backend errors

## 📄 License

MIT License - Feel free to use for your projects!
