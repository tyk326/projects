'use client';

// FRONTEND PAGE: Contact Us

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // For now, just create a mailto link
      // You can replace this with an actual email API later (Resend, SendGrid, etc.)
      const mailtoLink = `mailto:inkimagined1221@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`;
      
      window.location.href = mailtoLink;
      
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl font-bold text-dark-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-dark-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-dark-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-dark-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-dark-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-dark-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-dark-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-dark-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-dark-200 focus:border-primary-500 focus:outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="Order Question">Order Question</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Partnership">Partnership Inquiry</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-dark-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-dark-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`
                  w-full py-3 px-6 rounded-lg font-semibold transition-all
                  ${status === 'sending'
                    ? 'bg-dark-300 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Sent!' : 'Send Message'}
              </button>

              {status === 'error' && (
                <p className="text-sm text-red-600 text-center">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Email */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-dark-900 mb-1">Email Us</h3>
                  <p className="text-dark-600 text-sm mb-2">
                    We typically respond within 24 hours
                  </p>
                  <a 
                    href="mailto:inkimagined1221@gmail.com"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    inkimagined1221@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-dark-900 mb-1">Response Time</h3>
                  <p className="text-dark-600 text-sm">
                    Monday - Friday: Within 24 hours<br />
                    Weekends: Within 48 hours
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-primary-50 rounded-2xl border-2 border-primary-200 p-6">
              <h3 className="font-bold text-dark-900 mb-2">Before You Reach Out</h3>
              <p className="text-dark-600 text-sm mb-4">
                Check out our pricing page for common questions about canvas sizes, shipping, and our AI generation process.
              </p>
              <a
                href="/pricing"
                className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-sm"
              >
                View Pricing & FAQ
              </a>
            </div>

            {/* Social Proof */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-dark-900 mb-3">We're Here to Help</h3>
              <ul className="space-y-2 text-dark-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Order tracking and updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Technical support
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Custom requests
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Partnership inquiries
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}