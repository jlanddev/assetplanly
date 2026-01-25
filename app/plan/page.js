'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from "next/link";

function MatchFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [advisor, setAdvisor] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    income: '',
    retireTimeline: '',
    ownsHome: '',
    ownsBusiness: '',
    portfolioSize: '',
    hasAdvisor: '',
    localPreference: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: ''
  });

  // Pre-load advisor branding
  useEffect(() => {
    fetch('/api/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(r => r.json()).then(d => d.advisor && setAdvisor(d.advisor)).catch(() => {});
  }, []);

  const primaryColor = advisor?.primary_color || '#1e3a5f';
  const secondaryColor = advisor?.secondary_color || '#c9a227';

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTimeout(() => setCurrentStep(prev => prev + 1), 250);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length < 4) return phone;
    if (phone.length < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          zipCode: formData.zipCode,
          income: formData.income,
          retireTimeline: formData.retireTimeline,
          ownsHome: formData.ownsHome,
          ownsBusiness: formData.ownsBusiness,
          portfolioSize: formData.portfolioSize,
          hasAdvisor: formData.hasAdvisor,
          localPreference: formData.localPreference,
          matchedAdvisorId: advisor?.id,
          source: 'concierge'
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit');
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: primaryColor }}>
        <nav className="px-8 py-6">
          {advisor?.logo_url ? (
            <img src={advisor.logo_url} alt="" className="h-10 brightness-0 invert" />
          ) : (
            <span className="text-2xl font-bold text-white">AssetPlanly</span>
          )}
        </nav>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Plan is Being Prepared
            </h1>

            <p className="text-lg text-white/80 mb-8">
              {advisor?.name || 'Your dedicated advisor'} will contact you within 24 hours to review your personalized financial plan.
            </p>

            {advisor && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  {advisor.photo_url ? (
                    <img src={advisor.photo_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      {advisor.name?.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-white text-lg">{advisor.name}</div>
                    <div className="text-white/70">{advisor.firm_name}</div>
                  </div>
                </div>
              </div>
            )}

            <Link href="/" className="text-white/70 hover:text-white transition">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const questions = [
    {
      key: 'portfolioSize',
      title: 'What are your total investable assets?',
      subtitle: 'Include retirement accounts, savings, and investments',
      options: [
        { value: 'under-100k', label: 'Under $100K' },
        { value: '100k-250k', label: '$100K - $250K' },
        { value: '250k-500k', label: '$250K - $500K' },
        { value: '500k-1m', label: '$500K - $1M' },
        { value: '1m-5m', label: '$1M - $5M' },
        { value: '5m+', label: '$5M+' },
      ]
    },
    {
      key: 'retireTimeline',
      title: 'When do you plan to retire?',
      subtitle: 'Or when did you retire?',
      options: [
        { value: '1-5', label: 'Within 5 years' },
        { value: '5-10', label: '5-10 years' },
        { value: '10+', label: '10+ years' },
        { value: 'retired', label: 'Already retired' },
      ]
    },
    {
      key: 'income',
      title: 'What is your household income?',
      subtitle: 'Annual pre-tax income',
      options: [
        { value: 'under-75k', label: 'Under $75K' },
        { value: '75k-150k', label: '$75K - $150K' },
        { value: '150k-250k', label: '$150K - $250K' },
        { value: '250k-500k', label: '$250K - $500K' },
        { value: '500k+', label: '$500K+' },
      ]
    },
    {
      key: 'hasAdvisor',
      title: 'Do you currently work with a financial advisor?',
      options: [
        { value: 'yes', label: 'Yes, I have an advisor' },
        { value: 'no', label: 'No, not currently' },
        { value: 'looking', label: 'Looking to switch' },
      ]
    },
    {
      key: 'ownsHome',
      title: 'Do you own your home?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]
    },
  ];

  const totalSteps = questions.length + 1; // +1 for contact form
  const currentQuestion = questions[currentStep - 1];
  const isContactStep = currentStep > questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {advisor?.logo_url ? (
            <img src={advisor.logo_url} alt="" className="h-8" />
          ) : (
            <span className="text-xl font-bold" style={{ color: primaryColor }}>AssetPlanly</span>
          )}
          <div className="text-sm text-gray-400">
            {currentStep} of {totalSteps}
          </div>
        </div>
      </nav>

      {/* Progress */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: primaryColor }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">

          {/* Question Steps */}
          {currentQuestion && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-gray-500 text-center mb-10">{currentQuestion.subtitle}</p>
              )}

              <div className="space-y-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(currentQuestion.key, opt.value)}
                    className="w-full p-5 rounded-xl border-2 transition-all hover:shadow-md text-left flex items-center justify-between group"
                    style={{
                      borderColor: formData[currentQuestion.key] === opt.value ? primaryColor : '#e5e7eb',
                      backgroundColor: formData[currentQuestion.key] === opt.value ? `${primaryColor}08` : '#fff'
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900">{opt.label}</span>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="mt-8 text-gray-400 hover:text-gray-600 font-medium mx-auto block"
                >
                  ← Back
                </button>
              )}
            </div>
          )}

          {/* Contact Form */}
          {isContactStep && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Almost Done!
                </h2>
                <p className="text-gray-500">
                  Enter your details to receive your complimentary financial plan.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none"
                        style={{ '--tw-ring-color': primaryColor }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.firstName || !formData.email || !formData.phone}
                    className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isSubmitting ? 'Preparing Your Plan...' : 'Get My Free Plan'}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                  By submitting, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </form>

              <button
                onClick={() => setCurrentStep(questions.length)}
                className="mt-6 text-gray-400 hover:text-gray-600 font-medium mx-auto block"
              >
                ← Back
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
          <span>Free Consultation</span>
          <span>•</span>
          <span>Personalized Plan</span>
          <span>•</span>
          <span>No Obligation</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <MatchFlow />
    </Suspense>
  );
}
