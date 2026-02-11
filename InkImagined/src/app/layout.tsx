// FRONTEND: Root Layout
// UPDATED: Clean footer with only Pricing and Contact Us

import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InkImagined - Transform Photos into Art',
  description: 'Turn your photos into stunning AI-generated artwork on premium canvas prints',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen">
        <nav className="border-b border-dark-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎨</span>
                </div>
                <span className="font-display font-bold text-xl text-dark-900">
                  InkImagined
                </span>
              </Link>

              <div className="flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-dark-700 hover:text-dark-900 font-medium transition-colors"
                >
                  My Gallery
                </Link>
                <AuthButton />
              </div>
            </div>
          </div>
        </nav>

        <main>
          {children}
        </main>

        {/* UPDATED FOOTER - Removed Help Center and Shipping Info */}
        <footer className="border-t border-dark-100 mt-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                  <span className="font-display font-bold text-lg">InkImagined</span>
                </div>
                <p className="text-sm text-dark-600">
                  Transform your photos into stunning AI-generated artwork on premium canvas prints.
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="font-semibold text-dark-900 mb-3">Product</h3>
                <ul className="space-y-2 text-sm text-dark-600">
                  <li><Link href="/" className="hover:text-dark-900 transition-colors">Create</Link></li>
                  <li><Link href="/dashboard" className="hover:text-dark-900 transition-colors">My Gallery</Link></li>
                  <li><Link href="/pricing" className="hover:text-dark-900 transition-colors">Pricing</Link></li>
                </ul>
              </div>

              {/* Support - Only Contact Us */}
              <div>
                <h3 className="font-semibold text-dark-900 mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-dark-600">
                  {/* <li><Link href="/contact" className="hover:text-dark-900 transition-colors">Contact Us</Link></li> */}
                  <li>
                    <a
                      href="mailto:inkimagined1221@gmail.com"
                      className="hover:text-dark-900 transition-colors"
                    >
                      inkimagined1221@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-dark-100 mt-8 pt-8 text-center text-sm text-dark-500">
              © 2026 InkImagined. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}