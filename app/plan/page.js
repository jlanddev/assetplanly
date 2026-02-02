'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
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
  const [advisor, setAdvisor] = useState(null);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showAdvisorReveal, setShowAdvisorReveal] = useState(false);
  const [slideDirection, setSlideDirection] = useState('forward');

  const [formData, setFormData] = useState({
    // Phase 1 - qualifying questions to find advisor
    zipCode: '',
    whyNow: '',
    whyNowOther: '', // if whyNow = 'other'
    whatYouWant: '',
    hasAdvisor: '',
    whyChanging: '', // optional follow-up
    financialComplexity: '',
    investableAssets: '',
    netWorth: '',
    // Phase 2 - scheduling (after advisor found)
    meetingGoals: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const primaryColor = advisor?.primary_color || '#1e3a5f';
  const secondaryColor = advisor?.secondary_color || '#c9a227';

  // Fetch advisor after we have assets and zip
  const fetchAdvisor = async () => {
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investableAssets: formData.investableAssets,
          zipCode: formData.zipCode
        })
      });
      const data = await response.json();
      if (data.advisor) {
        setAdvisor(data.advisor);
      }
    } catch (err) {
      console.error('Error fetching advisor:', err);
    }
    setShowAdvisorReveal(true);
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSlideDirection('forward');

    // Determine next step
    let nextStep = currentStep + 1;

    // If user selects "no first time" for advisor, skip the whyChanging question
    if (field === 'hasAdvisor' && value === 'no-first-time') {
      nextStep = currentStep + 2; // Skip whyChanging
    }

    // Check if we've answered the last question - fetch advisor
    const lastQuestionStep = totalPhase1;
    if (currentStep === lastQuestionStep || nextStep > lastQuestionStep) {
      setTimeout(() => fetchAdvisor(), 300);
    } else {
      setTimeout(() => setCurrentStep(nextStep), 200);
    }
  };

  const handleSkip = () => {
    setSlideDirection('forward');
    const nextStep = currentStep + 1;
    const lastQuestionStep = totalPhase1;
    if (nextStep > lastQuestionStep) {
      setTimeout(() => fetchAdvisor(), 300);
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    setSlideDirection('back');
    // Handle going back and skipping conditional questions
    let prevStep = currentStep - 1;

    // If we're going back from step after whyChanging and user selected no-first-time, skip whyChanging
    if (prevStep === 5 && formData.hasAdvisor === 'no-first-time') {
      prevStep = 4; // Skip to hasAdvisor question
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

  const continueAfterReveal = () => {
    setShowAdvisorReveal(false);
    setSlideDirection('forward');
    setCurrentStep(totalPhase1 + 1); // Go to contact/scheduling step
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
          meetingGoals: formData.meetingGoals,
          matchedAdvisorId: advisor?.id,
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

  // Phase 1: Qualifying questions to find the right advisor
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
  const totalSteps = totalPhase1 + 1; // +1 for contact/scheduling

  const isZipStep = currentStep === 1;
  const isQuestionStep = currentStep > 1 && currentStep <= totalPhase1;
  const isContactStep = currentStep > totalPhase1;

  const currentQuestion = isQuestionStep
    ? phase1Questions[currentStep - 2] // -2 because step 1 is zip
    : null;

  // Skip conditional questions that don't apply
  const shouldSkipCurrentQuestion = currentQuestion?.conditional &&
    currentQuestion.key === 'whyChanging' && formData.hasAdvisor === 'no-first-time';

  // Auto-skip conditional questions that don't apply
  useEffect(() => {
    if (shouldSkipCurrentQuestion && !showAdvisorReveal) {
      setCurrentStep(prev => prev + 1);
    }
  }, [shouldSkipCurrentQuestion, showAdvisorReveal]);

  // Determine branding for current phase
  const usesAdvisorBranding = isContactStep;
  const brandColor = usesAdvisorBranding ? primaryColor : '#1e3a5f';

  // Advisor Reveal Screen
  if (showAdvisorReveal) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scaleIn">
          {/* Top accent bar */}
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor || primaryColor})` }} />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold mb-3 px-3 py-1 rounded-full" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Match Found
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Meet Your Advisor
              </h1>
            </div>

            {/* Advisor card */}
            <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}15` }}>
              <div className="flex items-center gap-4">
                {/* Photo */}
                <div className="shrink-0">
                  {advisor?.photo_url ? (
                    <img
                      src={advisor.photo_url}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {advisor?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 truncate">
                    {advisor?.name || 'Your Advisor'}{advisor?.credentials && `, ${advisor.credentials}`}
                  </h2>
                  {advisor?.firm_name && (
                    <p className="text-slate-600 text-sm truncate">{advisor.firm_name}</p>
                  )}
                  <p className="text-slate-500 text-xs mt-1">Fiduciary Advisor</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mb-6 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SEC Registered
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Fiduciary
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free Consultation
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={continueAfterReveal}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: primaryColor }}
            >
              Continue
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        `}</style>
      </div>
    );
  }

  // Success screen
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            You're All Set!
          </h1>

          <p className="text-white/80 mb-6">
            {advisor?.nickname || advisor?.name?.split(' ')[0] || 'Your advisor'} will contact you within 24 hours to schedule your free consultation.
          </p>

          {advisor && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 justify-center">
                {advisor.photo_url ? (
                  <img src={advisor.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                    {advisor.name?.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {advisor.name}
                  </div>
                  <div className="text-white/70 text-sm">{advisor.firm_name}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Modal Form Layout
  return (
    <div className="fixed inset-0 bg-slate-100 sm:bg-slate-900/60 sm:backdrop-blur-sm flex items-center justify-center sm:p-4">
      <div className="bg-white sm:rounded-3xl shadow-2xl w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">

        {/* Header with logo */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 flex items-center justify-center">
          {usesAdvisorBranding && advisor?.logo_url ? (
            <img src={advisor.logo_url} alt="" className="max-h-8 max-w-[140px] object-contain" />
          ) : (
            <Image src="/logo.png" alt="AssetPlanly" width={130} height={32} className="h-7 w-auto" />
          )}
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
                  Enter your details to schedule a free consultation
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Meeting Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    What do you want to discuss?
                  </label>
                  <textarea
                    name="meetingGoals"
                    value={formData.meetingGoals}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none text-sm"
                    placeholder="Your goals, questions, or topics..."
                  />
                  <div className="mt-1 text-xs text-gray-400">
                    {formData.meetingGoals.length < 150
                      ? `${150 - formData.meetingGoals.length} more characters needed`
                      : '✓'}
                  </div>
                </div>

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
                disabled={isSubmitting || !formData.firstName || !formData.email || !formData.phone || formData.meetingGoals.length < 150 || !validateEmail(formData.email).valid}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98]"
                style={{ backgroundColor: brandColor }}
              >
                {isSubmitting ? 'Submitting...' : 'Schedule Consultation'}
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
