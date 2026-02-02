'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";

// Email validation - checks format and blocks fake/disposable domains
const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };

  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  const domain = email.split('@')[1].toLowerCase();

  // Block disposable/temporary email domains
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com',
    'yopmail.com', 'sharklasers.com', 'getnada.com', 'tempail.com',
    'emailondeck.com', 'mohmal.com', 'dispostable.com', 'maildrop.cc',
    'getairmail.com', 'temp-mail.io', 'burnermail.io', 'spamgourmet.com'
  ];

  if (disposableDomains.includes(domain)) {
    return { valid: false, error: 'Please use a permanent email address' };
  }

  // Check for obviously fake domains (no dot, too short, etc.)
  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts[0].length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { valid: false, error: 'Please enter a valid email domain' };
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
    // Phase 1 - qualifying questions
    zipCode: '',
    whyNow: '',
    whyNowOther: '',
    whatYouWant: '',
    hasAdvisor: '',
    whyChanging: '',
    financialComplexity: '',
    investableAssets: '',
    netWorth: '',
    // Phase 2 - contact info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const brandColor = '#1e3a5f';

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSlideDirection('forward');

    // Determine next step
    let nextStep = currentStep + 1;

    // If user selects "no first time" for advisor, skip the whyChanging question
    if (field === 'hasAdvisor' && value === 'no-first-time') {
      nextStep = currentStep + 2;
    }

    // Check if we've answered the last question - go to contact form
    const lastQuestionStep = totalPhase1;
    if (currentStep === lastQuestionStep || nextStep > lastQuestionStep) {
      setTimeout(() => setCurrentStep(totalPhase1 + 1), 200);
    } else {
      setTimeout(() => setCurrentStep(nextStep), 200);
    }
  };

  const handleSkip = () => {
    setSlideDirection('forward');
    const nextStep = currentStep + 1;
    const lastQuestionStep = totalPhase1;
    if (nextStep > lastQuestionStep) {
      setCurrentStep(totalPhase1 + 1);
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    setSlideDirection('back');
    let prevStep = currentStep - 1;

    // If going back and user selected no-first-time, skip whyChanging
    if (prevStep === 5 && formData.hasAdvisor === 'no-first-time') {
      prevStep = 4;
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
          whyNow: formData.whyNow,
          whyNowOther: formData.whyNowOther,
          whatYouWant: formData.whatYouWant,
          hasAdvisor: formData.hasAdvisor,
          whyChanging: formData.whyChanging,
          financialComplexity: formData.financialComplexity,
          investableAssets: formData.investableAssets,
          netWorth: formData.netWorth,
          source: 'consumer-find-advisor'
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit');

      // Fire Google Ads lead conversion
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

  // Phase 1: Qualifying questions
  const phase1Questions = [
    {
      key: 'whyNow',
      title: "What brought you here today?",
      hasOther: true,
      gridCols: 1,
      options: [
        { value: 'closer-to-retirement', label: 'Getting closer to retirement' },
        { value: 'recently-retired', label: 'Recently retired' },
        { value: 'rollover', label: 'Rolling over a 401k or pension' },
        { value: 'windfall', label: 'Came into money' },
        { value: 'market-concerns', label: 'Concerned about the market' },
        { value: 'need-plan', label: 'Want a clearer plan' },
        { value: 'other', label: 'Other' },
      ]
    },
    {
      key: 'whatYouWant',
      title: "What's most important to you?",
      gridCols: 2,
      options: [
        { value: 'retirement-confidence', label: 'Retirement confidence' },
        { value: 'grow-wealth', label: 'Grow wealth' },
        { value: 'protect-wealth', label: 'Protect wealth' },
        { value: 'reduce-taxes', label: 'Reduce taxes' },
        { value: 'family-legacy', label: 'Family & legacy' },
        { value: 'everything', label: 'All of the above' },
      ]
    },
    {
      key: 'hasAdvisor',
      title: "Do you have a financial advisor?",
      gridCols: 1,
      hasFollowUp: true,
      options: [
        { value: 'no-first-time', label: 'No, this would be my first' },
        { value: 'yes-considering-change', label: 'Yes, but considering a change' },
        { value: 'yes-second-opinion', label: 'Yes, want a second opinion' },
      ]
    },
    {
      key: 'whyChanging',
      title: "What's making you consider a change?",
      subtitle: 'Optional',
      conditional: true,
      isTextArea: true,
      optional: true,
    },
    {
      key: 'financialComplexity',
      title: "How complex is your financial situation?",
      gridCols: 1,
      options: [
        { value: 'simple', label: 'Pretty straightforward' },
        { value: 'moderate', label: 'Somewhat complex' },
        { value: 'complex', label: 'Quite complex' },
      ]
    },
    {
      key: 'investableAssets',
      title: "Roughly how much do you have to invest?",
      subtitle: 'Not including your home',
      gridCols: 2,
      options: [
        { value: 'under-50k', label: 'Under $50k' },
        { value: '50k-150k', label: '$50k - $150k' },
        { value: '150k-500k', label: '$150k - $500k' },
        { value: '500k-1m', label: '$500k - $1M' },
        { value: '1m-5m', label: '$1M - $5M' },
        { value: '5m+', label: '$5M+' },
      ]
    },
    {
      key: 'netWorth',
      title: "What's your approximate net worth?",
      subtitle: 'Optional - including real estate',
      optional: true,
      gridCols: 2,
      options: [
        { value: 'under-500k', label: 'Under $500k' },
        { value: '500k-1m', label: '$500k - $1M' },
        { value: '1m-5m', label: '$1M - $5M' },
        { value: '5m-10m', label: '$5M - $10M' },
        { value: '10m+', label: '$10M+' },
        { value: 'prefer-not', label: 'Prefer not to say' },
      ]
    },
  ];

  const totalPhase1 = 1 + phase1Questions.length; // zip + questions
  const totalSteps = totalPhase1 + 1; // +1 for contact

  const isZipStep = currentStep === 1;
  const isQuestionStep = currentStep > 1 && currentStep <= totalPhase1;
  const isContactStep = currentStep > totalPhase1;

  const currentQuestion = isQuestionStep
    ? phase1Questions[currentStep - 2]
    : null;

  // Skip conditional questions that don't apply
  const shouldSkipCurrentQuestion = currentQuestion?.conditional &&
    currentQuestion.key === 'whyChanging' && formData.hasAdvisor === 'no-first-time';

  // Auto-skip conditional questions
  useEffect(() => {
    if (shouldSkipCurrentQuestion) {
      setCurrentStep(prev => prev + 1);
    }
  }, [shouldSkipCurrentQuestion]);

  // Success screen - generic messaging, AssetPlanly branding only
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
            You're All Set!
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
                Your advisor will call you to introduce themselves
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-white/50 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Schedule a time for your free planning session
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

  // Modal Form Layout - AssetPlanly branding only throughout
  return (
    <div className="fixed inset-0 bg-slate-100 sm:bg-slate-900/60 sm:backdrop-blur-sm flex items-center justify-center sm:p-4">
      <div className="bg-white sm:rounded-3xl shadow-2xl w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">

        {/* Header - always AssetPlanly branding */}
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

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-8">

          {/* ZIP Code Step */}
          {isZipStep && (
            <div className={`animate-${slideDirection === 'forward' ? 'slideLeft' : 'slideRight'}`}>
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  What's your ZIP code?
                </h2>
                <p className="text-gray-500 text-sm">Helps us find advisors near you</p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={formData.zipCode}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                placeholder="Enter ZIP"
                className="w-full px-5 py-4 text-2xl text-center border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none tracking-widest font-medium"
                maxLength={5}
                autoFocus
              />
            </div>
          )}

          {/* Question Steps */}
          {currentQuestion && !currentQuestion.isTextArea && (
            <div key={currentStep} className={`animate-${slideDirection === 'forward' ? 'slideLeft' : 'slideRight'}`}>
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
                )}
              </div>

              {/* Options grid */}
              <div className={`grid gap-2.5 ${currentQuestion.gridCols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {currentQuestion.options?.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (opt.value === 'other' && currentQuestion.hasOther) {
                        setFormData(prev => ({ ...prev, [currentQuestion.key]: 'other' }));
                      } else {
                        handleSelect(currentQuestion.key, opt.value);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${
                      formData[currentQuestion.key] === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                    style={formData[currentQuestion.key] === opt.value ? { borderColor: brandColor, backgroundColor: `${brandColor}10` } : {}}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* "Other" text input */}
              {currentQuestion.hasOther && formData[currentQuestion.key] === 'other' && (
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
                    onClick={() => handleSelect(currentQuestion.key, 'other')}
                    disabled={!formData.whyNowOther}
                    className="w-full mt-3 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
                    style={{ backgroundColor: brandColor }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Text area question (whyChanging) */}
          {currentQuestion?.isTextArea && (
            <div className={`animate-${slideDirection === 'forward' ? 'slideLeft' : 'slideRight'}`}>
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
                )}
              </div>

              <textarea
                value={formData[currentQuestion.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none"
              />
            </div>
          )}

          {/* Contact Form */}
          {isContactStep && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Almost there!
                </h2>
                <p className="text-gray-500 text-sm">
                  Enter your details and a qualified advisor will reach out
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Fixed bottom buttons */}
        <div className="flex-shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-t border-gray-100 bg-white">
          {isZipStep ? (
            <button
              onClick={() => { setSlideDirection('forward'); setCurrentStep(2); }}
              disabled={formData.zipCode.length !== 5}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98]"
              style={{ backgroundColor: brandColor }}
            >
              Continue
            </button>
          ) : isContactStep ? (
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.firstName || !formData.email || !formData.phone || !validateEmail(formData.email).valid}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98]"
                style={{ backgroundColor: brandColor }}
              >
                {isSubmitting ? 'Submitting...' : 'Get My Advisor'}
              </button>
            </div>
          ) : currentQuestion?.isTextArea ? (
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
                onClick={() => handleSelect(currentQuestion.key, formData[currentQuestion.key])}
                disabled={!formData[currentQuestion.key]}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98]"
                style={{ backgroundColor: brandColor }}
              >
                Continue
              </button>
            </div>
          ) : currentQuestion?.optional && !currentQuestion.hasOther ? (
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
            </div>
          ) : currentStep > 1 && !(currentQuestion?.hasOther && formData[currentQuestion?.key] === 'other') ? (
            <button
              onClick={handleBack}
              className="w-full py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]"
            >
              Back
            </button>
          ) : null}

          {/* Terms footer on contact step */}
          {isContactStep && (
            <p className="text-xs text-gray-400 text-center mt-3">
              By submitting, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
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
