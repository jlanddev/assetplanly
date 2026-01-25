'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";

function PlanFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [advisor, setAdvisor] = useState(null);
  const [error, setError] = useState('');
  const [showAdvisorReveal, setShowAdvisorReveal] = useState(false);

  const [formData, setFormData] = useState({
    portfolioSize: '',
    retireTimeline: '',
    income: '',
    hasAdvisor: '',
    ownsHome: '',
    primaryGoal: '',
    // Phase 2 questions (after advisor reveal)
    pastExperience: '',
    riskTolerance: '',
    meetingPreference: '',
    urgency: '',
    concerns: '',
    // Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: ''
  });

  // Pre-load advisor
  useEffect(() => {
    fetch('/api/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(r => r.json()).then(d => d.advisor && setAdvisor(d.advisor)).catch(() => {});
  }, []);

  const primaryColor = advisor?.primary_color || '#1e3a5f';
  const secondaryColor = advisor?.secondary_color || '#c9a227';

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // After question 6, show advisor reveal
    if (currentStep === 6) {
      setTimeout(() => setShowAdvisorReveal(true), 300);
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 250);
    }
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

  const continueAfterReveal = () => {
    setShowAdvisorReveal(false);
    setCurrentStep(7);
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
          portfolioSize: formData.portfolioSize,
          hasAdvisor: formData.hasAdvisor,
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

  // Phase 1 questions (AssetPlanly branding)
  const phase1Questions = [
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
        { value: '250k+', label: '$250K+' },
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
    {
      key: 'primaryGoal',
      title: 'What is your primary financial goal?',
      options: [
        { value: 'retirement', label: 'Retirement planning' },
        { value: 'wealth', label: 'Growing my wealth' },
        { value: 'preserve', label: 'Preserving what I have' },
        { value: 'estate', label: 'Estate planning' },
        { value: 'tax', label: 'Tax optimization' },
      ]
    },
  ];

  // Phase 2 questions (Advisor branding)
  const phase2Questions = [
    {
      key: 'pastExperience',
      title: 'How would you describe your experience with financial planning?',
      subtitle: 'This helps us tailor your session',
      options: [
        { value: 'new', label: 'New to financial planning' },
        { value: 'some', label: 'Some experience, looking for guidance' },
        { value: 'experienced', label: 'Experienced, seeking a second opinion' },
        { value: 'switching', label: 'Looking to improve my current situation' },
      ]
    },
    {
      key: 'riskTolerance',
      title: 'How would you describe your risk tolerance?',
      options: [
        { value: 'conservative', label: 'Conservative - Preserve capital' },
        { value: 'moderate', label: 'Moderate - Balanced approach' },
        { value: 'aggressive', label: 'Aggressive - Growth focused' },
      ]
    },
    {
      key: 'meetingPreference',
      title: 'How do you prefer to meet?',
      options: [
        { value: 'video', label: 'Video call' },
        { value: 'phone', label: 'Phone call' },
        { value: 'inperson', label: 'In person' },
        { value: 'flexible', label: 'I\'m flexible' },
      ]
    },
    {
      key: 'urgency',
      title: 'When would you like to get started?',
      options: [
        { value: 'asap', label: 'As soon as possible' },
        { value: 'week', label: 'Within a week' },
        { value: 'month', label: 'Within a month' },
        { value: 'exploring', label: 'Just exploring options' },
      ]
    },
    {
      key: 'concerns',
      title: 'What concerns you most about your finances?',
      options: [
        { value: 'outliving', label: 'Outliving my savings' },
        { value: 'market', label: 'Market volatility' },
        { value: 'taxes', label: 'Paying too much in taxes' },
        { value: 'legacy', label: 'Leaving a legacy' },
        { value: 'healthcare', label: 'Healthcare costs' },
      ]
    },
  ];

  const totalPhase1 = phase1Questions.length;
  const totalPhase2 = phase2Questions.length;
  const totalSteps = totalPhase1 + totalPhase2 + 1; // +1 for contact form

  const isPhase1 = currentStep <= totalPhase1;
  const isPhase2 = currentStep > totalPhase1 && currentStep <= totalPhase1 + totalPhase2;
  const isContactStep = currentStep > totalPhase1 + totalPhase2;

  const currentQuestion = isPhase1
    ? phase1Questions[currentStep - 1]
    : isPhase2
      ? phase2Questions[currentStep - totalPhase1 - 1]
      : null;

  // Advisor Reveal Screen
  if (showAdvisorReveal && advisor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <nav className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-5xl mx-auto">
            <Image src="/logo.png" alt="AssetPlanly" width={150} height={36} className="h-8 w-auto" />
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-5xl w-full">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Left - Advisor */}
                <div className="p-10 text-center" style={{ backgroundColor: primaryColor }}>
                  {advisor.photo_url ? (
                    <img src={advisor.photo_url} alt="" className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white/20" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                      {advisor.name?.charAt(0)}
                    </div>
                  )}

                  <h2 className="text-2xl font-bold text-white mb-1">{advisor.name}</h2>
                  <p className="text-white/80 mb-4">{advisor.firm_name}</p>

                  {advisor.bio && (
                    <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                      {advisor.bio}
                    </p>
                  )}

                  {advisor.phone && (
                    <p className="text-white/60 text-sm">{advisor.phone}</p>
                  )}
                </div>

                {/* Right - Message */}
                <div className="p-10 flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
                      Great News
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      We Found Your Advisor
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We work hard to cultivate relationships with the right fiduciaries. Based on your needs, <strong>{advisor.name}</strong> {advisor.firm_name && `and the team at ${advisor.firm_name}`} are an excellent fit for you.
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-6 mb-6">
                    <p className="text-gray-600 mb-6">
                      Let's answer a few more questions to prepare for your complimentary planning session.
                    </p>
                  </div>

                  <button
                    onClick={continueAfterReveal}
                    className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Continue to Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: primaryColor }}>
        <nav className="px-8 py-6">
          {advisor?.logo_url ? (
            <img src={advisor.logo_url} alt="" className="h-10 brightness-0 invert" />
          ) : (
            <span className="text-2xl font-bold text-white">{advisor?.firm_name || 'AssetPlanly'}</span>
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
              You're All Set!
            </h1>

            <p className="text-lg text-white/80 mb-8">
              {advisor?.name || 'Your advisor'} will contact you within 24 hours to schedule your complimentary planning session.
            </p>

            {advisor && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4 justify-center">
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

  // Determine branding for current phase
  const usesAdvisorBranding = isPhase2 || isContactStep;
  const brandColor = usesAdvisorBranding ? primaryColor : '#1e3a5f';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {usesAdvisorBranding && advisor?.logo_url ? (
            <img src={advisor.logo_url} alt="" className="h-8" />
          ) : (
            <Image src="/logo.png" alt="AssetPlanly" width={150} height={36} className="h-8 w-auto" />
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
          style={{ width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: brandColor }}
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
              {!currentQuestion.subtitle && <div className="mb-10" />}

              <div className="space-y-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(currentQuestion.key, opt.value)}
                    className="w-full p-5 rounded-xl border-2 transition-all hover:shadow-md text-left flex items-center justify-between group bg-white"
                    style={{
                      borderColor: formData[currentQuestion.key] === opt.value ? brandColor : '#e5e7eb',
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
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                  <svg className="w-8 h-8" style={{ color: brandColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Schedule Your Session
                </h2>
                <p className="text-gray-500">
                  Enter your details and {advisor?.name || 'your advisor'} will reach out to confirm your complimentary planning session.
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
                    style={{ backgroundColor: brandColor }}
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule My Free Session'}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                  By submitting, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </form>

              <button
                onClick={() => setCurrentStep(totalPhase1 + totalPhase2)}
                className="mt-6 text-gray-400 hover:text-gray-600 font-medium mx-auto block"
              >
                ← Back
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6" style={{ backgroundColor: brandColor }}>
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

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <PlanFlow />
    </Suspense>
  );
}
