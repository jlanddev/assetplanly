'use client';

import { useState } from 'react';
import Link from "next/link";

export default function BookCallPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    leadsPerMonth: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="sticky top-0 z-50 bg-white border-b border-[var(--gray-200)]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-semibold text-[var(--gray-900)]">
                AssetPlanly
              </Link>
            </div>
          </div>
        </nav>

        <section className="py-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 bg-[var(--green-100)] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[var(--green-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
              We got your request.
            </h1>
            <p className="text-[var(--gray-600)] mb-8">
              We&apos;ll reach out within 24 hours to schedule your call. Talk soon.
            </p>
            <Link href="/" className="btn-secondary inline-block">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-[var(--gray-900)]">
              AssetPlanly
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-semibold text-[var(--gray-900)] mb-2">
            Book a Call
          </h1>
          <p className="text-[var(--gray-600)] mb-8">
            Tell us about your practice and we&apos;ll reach out to schedule a 15-minute conversation.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent outline-none transition"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent outline-none transition"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent outline-none transition"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Company / Firm Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent outline-none transition"
                placeholder="Smith Wealth Advisors"
              />
            </div>

            <div>
              <label htmlFor="leadsPerMonth" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                How many leads are you looking for per month?
              </label>
              <select
                id="leadsPerMonth"
                name="leadsPerMonth"
                value={formData.leadsPerMonth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent outline-none transition bg-white"
              >
                <option value="">Select...</option>
                <option value="1-5">1-5 leads</option>
                <option value="5-10">5-10 leads</option>
                <option value="10-20">10-20 leads</option>
                <option value="20+">20+ leads</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Preferred time for a call
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent outline-none transition bg-white"
              >
                <option value="">Select...</option>
                <option value="morning">Morning (9am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 5pm)</option>
                <option value="evening">Evening (5pm - 7pm)</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Anything else we should know?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent outline-none transition resize-none"
                placeholder="Tell us about your practice, what kind of clients you're looking for, etc."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request a Call'}
            </button>

            <p className="text-sm text-[var(--gray-500)] text-center">
              We&apos;ll reach out within 24 hours to schedule your 15-minute call.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
