'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";

// Email validation
const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  const domain = email.split('@')[1].toLowerCase();
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com',
    'yopmail.com', 'sharklasers.com', 'getnada.com', 'tempail.com',
    'emailondeck.com', 'mohmal.com', 'dispostable.com', 'maildrop.cc'
  ];
  if (disposableDomains.includes(domain)) {
    return { valid: false, error: 'Please use a permanent email address' };
  }
  return { valid: true, error: null };
};

function PlanFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [slideDirection, setSlideDirection] = useState('forward');

  const [formData, setFormData] = useState({
    // Contact info (collected first)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Value-add questions (what do you need)
    whyNow: '',
    whyNowOther: '',
    whatYouWant: '',
    hasAdvisor: '',
    whyChanging: '',
    // Qualifying questions (last)
    financialComplexity: '',
    investableAssets: '',
    zipCode: '',
  });

  const brandColor = '#1e3a5f';

  const goToNext = () => {
    setSlideDirection('forward');
    setTimeout(() => setCurrentStep(prev => prev + 1), 200);
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSlideDirection('forward');

    // Handle conditional skip for whyChanging
    if (field === 'hasAdvisor' && value === 'no-first-time') {
      // Skip whyChanging, go to next question
      setTimeout(() => setCurrentStep(prev => prev + 2), 200);
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
    }
  };

  const handleSkip = () => {
    setSlideDirection('forward');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setSlideDirection('back');
    let prevStep = currentStep - 1;

    // Skip whyChanging when going back if user said no-first-time
    if (currentStep === 7 && formData.hasAdvisor === 'no-first-time') {
      prevStep = 5; // Skip back over whyChanging
    }

    setTimeout(() => setCurrentStep(prevStep), 50);
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
    if (e) e.preventDefault();
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
          whyNow: formData.whyNow,
          whyNowOther: formData.whyNowOther,
          whatYouWant: formData.whatYouWant,
          hasAdvisor: formData.hasAdvisor,
          whyChanging: formData.whyChanging,
          financialComplexity: formData.financialComplexity,
          investableAssets: formData.investableAssets,
          source: 'consumer-find-advisor'
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit');

      // Fire Google Ads conversion
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17733369236/on9LCMmR4sAbEJT79odC',
          'value': 1.0,
          'currency': 'USD'
        });
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-skip whyChanging if user selected no-first-time
  useEffect(() => {
    if (currentStep === 6 && formData.hasAdvisor === 'no-first-time') {
      setCurrentStep(7);
    }
  }, [currentStep, formData.hasAdvisor]);

  /*
    NEW FLOW ORDER:
    1. Contact info (name)
    2. Contact info (email + phone)
    3. What brought you here? (value-add)
    4. What's most important to you? (value-add)
    5. Do you have an advisor? (value-add)
    6. Why changing? (conditional, optional)
    7. How complex is your situation? (qualifying)
    8. How much to invest? (qualifying)
    9. ZIP code (qualifying - last)
    -> Submit
  */

  const totalSteps = 9;
  const isContactStep1 = currentStep === 1;
  const isContactStep2 = currentStep === 2;
  const isWhyNowStep = currentStep === 3;
  const isWhatYouWantStep = currentStep === 4;
  const isHasAdvisorStep = currentStep === 5;
  const isWhyChangingStep = currentStep === 6;
  const isComplexityStep = currentStep === 7;
  const isAssetsStep = currentStep === 8;
  const isZipStep = currentStep === 9;

  // Success screen
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#1e3a5f]">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            You're All Set, {formData.firstName}!
          </h1>

          <p className="text-white/80 mb-8">
            A qualified fiduciary advisor will reach out within 24 hours to schedule your complimentary consultation.
          </p>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-white mb-3">What happens next?</h3>
            <ul className="text-white/70 text-sm text-left space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-white/50 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your advisor will call to introduce themselves
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-white/50 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Schedule your free planning session
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-white/50 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No obligation - just helpful guidance
              </li>
            </ul>
          </div>

          <Image src="/logo.png" alt="AssetPlanly" width={120} height={30} className="mx-auto opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-100 sm:bg-slate-900/60 sm:backdrop-blur-sm flex items-center justify-center sm:p-4">
      <div className="bg-white sm:rounded-3xl shadow-2xl w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">

        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 flex items-center justify-center">
          <Image src="/logo.png" alt="AssetPlanly" width={130} height={32} className="h-7 w-auto" />
        </div>

        {/* Progress bar */}
        <div className="flex-shrink-0 h-1 bg-gray-100">
          <div
            className="h-1 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: brandColor }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-8">

          {/* Step 1: Name */}
          {isContactStep1 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Let's get started
                </h2>
                <p className="text-gray-500 text-sm">What's your name?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Email + Phone */}
          {isContactStep2 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Hi {formData.firstName}!
                </h2>
                <p className="text-gray-500 text-sm">How can we reach you?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: What brought you here? */}
          {isWhyNowStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  What brought you here today?
                </h2>
              </div>

              <div className="grid gap-2.5">
                {[
                  { value: 'closer-to-retirement', label: 'Getting closer to retirement' },
                  { value: 'recently-retired', label: 'Recently retired' },
                  { value: 'rollover', label: 'Rolling over a 401k or pension' },
                  { value: 'windfall', label: 'Came into money' },
                  { value: 'market-concerns', label: 'Concerned about the market' },
                  { value: 'need-plan', label: 'Want a clearer plan' },
                  { value: 'other', label: 'Other' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (opt.value === 'other') {
                        setFormData(prev => ({ ...prev, whyNow: 'other' }));
                      } else {
                        handleSelect('whyNow', opt.value);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${
                      formData.whyNow === opt.value
                        ? 'border-[#1e3a5f] bg-[#1e3a5f]/10'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {formData.whyNow === 'other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.whyNowOther}
                    onChange={(e) => setFormData(prev => ({ ...prev, whyNowOther: e.target.value }))}
                    placeholder="Please specify..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSelect('whyNow', 'other')}
                    disabled={!formData.whyNowOther}
                    className="w-full mt-3 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 bg-[#1e3a5f]"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: What's most important? */}
          {isWhatYouWantStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  What's most important to you?
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'retirement-confidence', label: 'Retirement confidence' },
                  { value: 'grow-wealth', label: 'Grow wealth' },
                  { value: 'protect-wealth', label: 'Protect wealth' },
                  { value: 'reduce-taxes', label: 'Reduce taxes' },
                  { value: 'family-legacy', label: 'Family & legacy' },
                  { value: 'everything', label: 'All of the above' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('whatYouWant', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${
                      formData.whatYouWant === opt.value
                        ? 'border-[#1e3a5f] bg-[#1e3a5f]/10'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Do you have an advisor? */}
          {isHasAdvisorStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Do you have a financial advisor?
                </h2>
              </div>

              <div className="grid gap-2.5">
                {[
                  { value: 'no-first-time', label: 'No, this would be my first' },
                  { value: 'yes-considering-change', label: 'Yes, but considering a change' },
                  { value: 'yes-second-opinion', label: 'Yes, want a second opinion' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('hasAdvisor', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${
                      formData.hasAdvisor === opt.value
                        ? 'border-[#1e3a5f] bg-[#1e3a5f]/10'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Why changing? (conditional) */}
          {isWhyChangingStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  What's making you consider a change?
                </h2>
                <p className="text-gray-500 text-sm">Optional</p>
              </div>

              <textarea
                value={formData.whyChanging}
                onChange={(e) => setFormData(prev => ({ ...prev, whyChanging: e.target.value }))}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none"
              />
            </div>
          )}

          {/* Step 7: Financial complexity */}
          {isComplexityStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  How complex is your financial situation?
                </h2>
              </div>

              <div className="grid gap-2.5">
                {[
                  { value: 'simple', label: 'Pretty straightforward' },
                  { value: 'moderate', label: 'Somewhat complex' },
                  { value: 'complex', label: 'Quite complex' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('financialComplexity', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${
                      formData.financialComplexity === opt.value
                        ? 'border-[#1e3a5f] bg-[#1e3a5f]/10'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Investable assets */}
          {isAssetsStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Roughly how much do you have to invest?
                </h2>
                <p className="text-gray-500 text-sm">Not including your home</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'under-50k', label: 'Under $50k' },
                  { value: '50k-150k', label: '$50k - $150k' },
                  { value: '150k-500k', label: '$150k - $500k' },
                  { value: '500k-1m', label: '$500k - $1M' },
                  { value: '1m-5m', label: '$1M - $5M' },
                  { value: '5m+', label: '$5M+' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect('investableAssets', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${
                      formData.investableAssets === opt.value
                        ? 'border-[#1e3a5f] bg-[#1e3a5f]/10'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 9: ZIP Code */}
          {isZipStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Last step!
                </h2>
                <p className="text-gray-500 text-sm">What's your ZIP code?</p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={formData.zipCode}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                placeholder="Enter ZIP"
                className="w-full px-5 py-4 text-2xl text-center border-2 border-gray-200 rounded-2xl focus:border-blue-500 outline-none tracking-widest font-medium"
                maxLength={5}
                autoFocus
              />
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="flex-shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-t border-gray-100 bg-white">
          {isContactStep1 ? (
            <button
              onClick={goToNext}
              disabled={!formData.firstName || !formData.lastName}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]"
            >
              Continue
            </button>
          ) : isContactStep2 ? (
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]"
              >
                Back
              </button>
              <button
                onClick={goToNext}
                disabled={!formData.email || !formData.phone || !validateEmail(formData.email).valid}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]"
              >
                Continue
              </button>
            </div>
          ) : isWhyChangingStep ? (
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]"
              >
                Back
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]"
              >
                Skip
              </button>
              <button
                onClick={goToNext}
                disabled={!formData.whyChanging}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]"
              >
                Continue
              </button>
            </div>
          ) : isZipStep ? (
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || formData.zipCode.length !== 5}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]"
              >
                {isSubmitting ? 'Submitting...' : 'Get My Advisor'}
              </button>
            </div>
          ) : currentStep > 1 && !(formData.whyNow === 'other' && isWhyNowStep) ? (
            <button
              onClick={handleBack}
              className="w-full py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]"
            >
              Back
            </button>
          ) : null}

          {currentStep === 1 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
            </p>
          )}
        </div>

        <style jsx>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideLeft {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideRight {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-slideUp { animation: slideUp 0.3s ease-out; }
          .animate-slideLeft { animation: slideLeft 0.25s ease-out; }
          .animate-slideRight { animation: slideRight 0.25s ease-out; }
        `}</style>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-slate-100 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <PlanFlow />
    </Suspense>
  );
}
