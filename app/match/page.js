'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";

function MatchFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [matchedAdvisor, setMatchedAdvisor] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Quiz answers
    income: '',
    retireTimeline: '',
    ownsHome: '',
    ownsBusiness: '',
    portfolioSize: '',
    hasAdvisor: '',
    localPreference: '',
    // Contact info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: ''
  });

  const totalSteps = 9;

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-advance after selection
    setTimeout(() => setCurrentStep(prev => prev + 1), 300);
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

  const handlePhoneChange = (e) => {
    setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }));
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const findMatch = async () => {
    setIsMatching(true);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.advisor) {
        setMatchedAdvisor(data.advisor);
      }
    } catch (err) {
      console.error('Error finding match:', err);
    }
    setIsMatching(false);
    setCurrentStep(currentStep + 1);
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
          matchedAdvisorId: matchedAdvisor?.id,
          source: 'consumer_match'
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

  const primaryColor = matchedAdvisor?.primary_color || '#1e3a5f';
  const secondaryColor = matchedAdvisor?.secondary_color || '#22c55e';

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {matchedAdvisor?.logo_url ? (
              <img src={matchedAdvisor.logo_url} alt="" className="h-8 w-auto" />
            ) : (
              <Image src="/logo.png" alt="AssetPlanly" width={150} height={36} className="h-8 w-auto" />
            )}
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">You&apos;re All Set!</h1>
            <p className="text-lg text-gray-600 mb-8">
              {matchedAdvisor
                ? `${matchedAdvisor.name} will reach out to you shortly to schedule your free consultation.`
                : 'A vetted financial advisor will reach out to you shortly to schedule your free consultation.'}
            </p>
            {matchedAdvisor && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-4">
                  {matchedAdvisor.photo_url ? (
                    <img src={matchedAdvisor.photo_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                      {matchedAdvisor.name?.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{matchedAdvisor.name}</div>
                    <div className="text-gray-600 text-sm">{matchedAdvisor.firm_name}</div>
                  </div>
                </div>
              </div>
            )}
            <Link href="/find-advisor" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/find-advisor">
            <Image src="/logo.png" alt="AssetPlanly" width={150} height={36} className="h-8 w-auto" />
          </Link>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="h-1 bg-gray-200">
            <div
              className="h-1 bg-green-500 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">

          {/* Step 1: Income */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                My current household income:
              </h2>
              <p className="text-gray-500 text-center mb-8">Select one</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'under-40k', label: 'LESS THAN', sublabel: '$40,000' },
                  { value: '40k-75k', label: '$40,000 to', sublabel: '$74,999' },
                  { value: '75k-100k', label: '$75,000 to', sublabel: '$99,999' },
                  { value: '100k-150k', label: '$100,000 to', sublabel: '$149,999' },
                  { value: '150k-250k', label: '$150,000 to', sublabel: '$249,999' },
                  { value: '250k+', label: 'MORE THAN', sublabel: '$250,000' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('income', opt.value)}
                    className={`p-6 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md ${
                      formData.income === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{opt.label}</div>
                    <div className="text-lg font-bold text-gray-900">{opt.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Retirement Timeline */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                I would like to retire in:
              </h2>
              <p className="text-gray-500 text-center mb-8">Select one</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: '1-5', label: '1-5 YRS' },
                  { value: '5-10', label: '5-10 YRS' },
                  { value: '10+', label: '10+ YRS' },
                  { value: 'retired', label: 'RETIRED' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('retireTimeline', opt.value)}
                    className={`p-6 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md ${
                      formData.retireTimeline === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-lg font-bold text-gray-900">{opt.label}</div>
                  </button>
                ))}
              </div>

              <button onClick={handleBack} className="mt-8 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* Step 3: Own a home */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                I own a home:
              </h2>
              <p className="text-gray-500 text-center mb-8">Select one</p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {[
                  { value: 'yes', label: 'YES' },
                  { value: 'no', label: 'NO' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('ownsHome', opt.value)}
                    className={`p-8 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md ${
                      formData.ownsHome === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-xl font-bold text-gray-900">{opt.label}</div>
                  </button>
                ))}
              </div>

              <button onClick={handleBack} className="mt-8 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* Step 4: Own a business */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                I own a business:
              </h2>
              <p className="text-gray-500 text-center mb-8">Select one</p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {[
                  { value: 'yes', label: 'YES' },
                  { value: 'no', label: 'NO' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('ownsBusiness', opt.value)}
                    className={`p-8 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md ${
                      formData.ownsBusiness === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-xl font-bold text-gray-900">{opt.label}</div>
                  </button>
                ))}
              </div>

              <button onClick={handleBack} className="mt-8 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* Step 5: Portfolio Size */}
          {currentStep === 5 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                My investable assets are:
              </h2>
              <p className="text-gray-500 text-center mb-8">Include 401(k), IRA, savings, investments (not your home)</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'under-100k', label: 'LESS THAN', sublabel: '$100,000' },
                  { value: '100k-250k', label: '$100,000 to', sublabel: '$249,999' },
                  { value: '250k-500k', label: '$250,000 to', sublabel: '$499,999' },
                  { value: '500k-1m', label: '$500,000 to', sublabel: '$999,999' },
                  { value: '1m-5m', label: '$1M to', sublabel: '$5M' },
                  { value: '5m+', label: 'MORE THAN', sublabel: '$5M' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('portfolioSize', opt.value)}
                    className={`p-6 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md ${
                      formData.portfolioSize === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{opt.label}</div>
                    <div className="text-lg font-bold text-gray-900">{opt.sublabel}</div>
                  </button>
                ))}
              </div>

              <button onClick={handleBack} className="mt-8 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* Step 6: Has Advisor */}
          {currentStep === 6 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                Do you currently have a financial advisor?
              </h2>
              <p className="text-gray-500 text-center mb-8">Select one</p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {[
                  { value: 'yes', label: 'YES' },
                  { value: 'no', label: 'NO' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('hasAdvisor', opt.value)}
                    className={`p-8 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md ${
                      formData.hasAdvisor === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-xl font-bold text-gray-900">{opt.label}</div>
                  </button>
                ))}
              </div>

              <button onClick={handleBack} className="mt-8 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* Step 7: Local Preference */}
          {currentStep === 7 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                Does your advisor need to be local?
              </h2>
              <p className="text-gray-500 text-center mb-8 max-w-md mx-auto">
                Note: All advisors can work via phone or video conferencing.
              </p>

              <div className="grid gap-3 max-w-lg mx-auto">
                {[
                  { value: 'local', label: 'YES, I NEED', sublabel: 'A LOCAL ADVISOR' },
                  { value: 'best-match', label: 'NON-LOCAL OK', sublabel: 'IF BEST MATCH FOR ME' },
                  { value: 'no-preference', label: 'NO PREFERENCE', sublabel: '' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('localPreference', opt.value)}
                    className={`p-6 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md text-left ${
                      formData.localPreference === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-sm text-gray-500 uppercase tracking-wide">{opt.label}</div>
                    {opt.sublabel && <div className="text-lg font-bold text-gray-900">{opt.sublabel}</div>}
                  </button>
                ))}
              </div>

              <button onClick={handleBack} className="mt-8 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* Step 8: Contact Info */}
          {currentStep === 8 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Schedule Your Complimentary Review
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter your info below to schedule your free consultation with a vetted financial advisor.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="90210"
                    />
                  </div>

                  <button
                    onClick={findMatch}
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || isMatching}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold text-lg transition-colors mt-4"
                  >
                    {isMatching ? 'Scheduling...' : 'Schedule My Free Review →'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By clicking above, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </div>

              <button onClick={handleBack} className="mt-6 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* Step 9: Results / Matched Advisor */}
          {currentStep === 9 && (
            <div className="animate-fadeIn">
              {matchedAdvisor ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Your Complimentary Review
                    </h2>
                    <p className="text-gray-500">
                      You&apos;ve been connected with:
                    </p>
                  </div>

                  <div
                    className="rounded-2xl p-8 text-center mb-6"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {matchedAdvisor.logo_url && (
                      <img src={matchedAdvisor.logo_url} alt="" className="h-10 mx-auto mb-6 brightness-0 invert" />
                    )}

                    {matchedAdvisor.photo_url ? (
                      <img src={matchedAdvisor.photo_url} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/30" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                        {matchedAdvisor.name?.charAt(0)}
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-white">{matchedAdvisor.name}</h3>
                    <p className="text-white/80 mb-4">{matchedAdvisor.firm_name}</p>

                    {matchedAdvisor.bio && (
                      <p className="text-white/70 text-sm max-w-sm mx-auto mb-6">
                        {matchedAdvisor.bio}
                      </p>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full max-w-xs mx-auto block py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
                      style={{ backgroundColor: secondaryColor, color: '#fff' }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Free Consultation'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Thanks! We&apos;re finding your match.
                    </h2>
                    <p className="text-gray-500 mb-6">
                      Click below to complete your request and a vetted advisor will reach out shortly.
                    </p>

                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete My Request →'}
                    </button>
                  </div>
                </>
              )}

              <button onClick={handleBack} className="mt-6 text-gray-500 hover:text-gray-700 font-medium mx-auto block">
                ← Back
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Trust footer */}
      <div className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% Free Service
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Vetted Advisors
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No Spam Calls
          </div>
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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <MatchFlow />
    </Suspense>
  );
}
