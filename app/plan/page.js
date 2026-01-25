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
    // Phase 1 - qualifying questions to find advisor
    zipCode: '',
    retireTimeline: '',
    ownsHome: '',
    ownsBusiness: '',
    hasAdvisor: '',
    whySwitching: '', // follow-up if hasAdvisor = yes
    localPreference: '',
    portfolioSize: '',
    income: '',
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
          portfolioSize: formData.portfolioSize,
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

    // Determine next step
    let nextStep = currentStep + 1;

    // If user says they DON'T have an advisor, skip the whySwitching question
    if (field === 'hasAdvisor' && value === 'no') {
      // Skip the whySwitching question (which is the next one)
      nextStep = currentStep + 2;
    }

    // Check if we've answered the last question (income) - fetch advisor
    const lastQuestionStep = totalPhase1;
    if (currentStep === lastQuestionStep || nextStep > lastQuestionStep) {
      setTimeout(() => fetchAdvisor(), 300);
    } else {
      setTimeout(() => setCurrentStep(nextStep), 250);
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
          income: formData.income,
          retireTimeline: formData.retireTimeline,
          ownsHome: formData.ownsHome,
          ownsBusiness: formData.ownsBusiness,
          portfolioSize: formData.portfolioSize,
          hasAdvisor: formData.hasAdvisor,
          whySwitching: formData.whySwitching,
          localPreference: formData.localPreference,
          meetingGoals: formData.meetingGoals,
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

  // Phase 1: Qualifying questions to find the right advisor
  // Non-money questions first, then money questions at the end
  const phase1Questions = [
    {
      key: 'retireTimeline',
      title: 'When do you plan to retire?',
      options: [
        { value: '1-5', label: '1-5 years' },
        { value: '5-10', label: '5-10 years' },
        { value: '10+', label: '10+ years' },
        { value: 'retired', label: 'Already retired' },
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
      key: 'ownsBusiness',
      title: 'Do you own a business?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]
    },
    {
      key: 'hasAdvisor',
      title: 'Do you currently have a financial advisor?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]
    },
    {
      key: 'whySwitching',
      title: 'What has you considering a change?',
      subtitle: 'This helps us understand your needs better',
      conditional: true, // only show if hasAdvisor = yes
      options: [
        { value: 'not-responsive', label: 'My advisor isn\'t responsive' },
        { value: 'poor-performance', label: 'Not happy with performance' },
        { value: 'high-fees', label: 'Fees are too high' },
        { value: 'need-more-services', label: 'Need more comprehensive planning' },
        { value: 'second-opinion', label: 'Just want a second opinion' },
        { value: 'other', label: 'Other reasons' },
      ]
    },
    {
      key: 'localPreference',
      title: 'Does your advisor need to be local?',
      subtitle: 'All advisors can meet via phone or video',
      options: [
        { value: 'yes', label: 'Yes, I prefer local' },
        { value: 'no', label: 'No, remote is fine' },
        { value: 'flexible', label: 'No preference' },
      ]
    },
    // Money questions at the end
    {
      key: 'portfolioSize',
      title: 'What are your total investable assets?',
      subtitle: 'Include retirement accounts, savings, and investments',
      options: [
        { value: 'under-100k', label: 'Under $100,000' },
        { value: '100k-250k', label: '$100,000 - $250,000' },
        { value: '250k-500k', label: '$250,000 - $500,000' },
        { value: '500k-1m', label: '$500,000 - $1,000,000' },
        { value: '1m-5m', label: '$1,000,000 - $5,000,000' },
        { value: '5m+', label: '$5,000,000+' },
      ]
    },
    {
      key: 'income',
      title: 'What is your household income?',
      options: [
        { value: 'under-40k', label: 'Less than $40,000' },
        { value: '40k-75k', label: '$40,000 - $74,999' },
        { value: '75k-100k', label: '$75,000 - $99,999' },
        { value: '100k-150k', label: '$100,000 - $149,999' },
        { value: '150k-250k', label: '$150,000 - $249,999' },
        { value: '250k+', label: '$250,000+' },
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
    currentQuestion.key === 'whySwitching' && formData.hasAdvisor !== 'yes';

  // Auto-skip conditional questions that don't apply
  useEffect(() => {
    if (shouldSkipCurrentQuestion && !showAdvisorReveal) {
      setCurrentStep(prev => prev + 1);
    }
  }, [shouldSkipCurrentQuestion, showAdvisorReveal]);

  // ZIP Code step (step 1)
  if (isZipStep && !showAdvisorReveal) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <nav className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Image src="/logo.png" alt="AssetPlanly" width={150} height={36} className="h-8 w-auto" />
            <div className="text-sm text-gray-400">1 of {totalSteps}</div>
          </div>
        </nav>

        <div className="h-1 bg-gray-200">
          <div className="h-1 transition-all duration-500 bg-[#1e3a5f]" style={{ width: `${(1 / totalSteps) * 100}%` }} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              What is your ZIP code?
            </h2>
            <p className="text-gray-500 text-center mb-10">This helps us find advisors in your area</p>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                placeholder="Enter ZIP code"
                className="w-full px-6 py-4 text-2xl text-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tracking-widest"
                maxLength={5}
              />

              <button
                onClick={() => setCurrentStep(2)}
                disabled={formData.zipCode.length !== 5}
                className="w-full mt-6 py-4 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50 bg-[#1e3a5f]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="py-4 px-6 bg-[#1e3a5f]">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
            <span>Complimentary Consultation</span>
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
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        `}</style>
      </div>
    );
  }

  // Advisor Reveal Screen
  if (showAdvisorReveal) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="px-8 py-6">
          <Image src="/logo.png" alt="AssetPlanly" width={150} height={36} className="h-8 w-auto" />
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="max-w-2xl w-full">
            {/* Elegant card */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor || primaryColor})` }} />

              <div className="p-10 md:p-14">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 text-sm font-medium mb-4" style={{ color: primaryColor }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ADVISOR SELECTED
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    Your Dedicated Fiduciary
                  </h1>
                  <p className="text-slate-500 text-lg max-w-md mx-auto">
                    Based on your profile, we've selected the ideal advisor for your financial goals.
                  </p>
                </div>

                {/* Advisor card */}
                <div className="rounded-xl p-6 md:p-8 mb-10" style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}20` }}>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Photo */}
                    <div className="shrink-0">
                      {advisor?.photo_url ? (
                        <img
                          src={advisor.photo_url}
                          alt=""
                          className="w-28 h-28 rounded-xl object-cover shadow-lg"
                          style={{ boxShadow: `0 8px 30px ${primaryColor}30` }}
                        />
                      ) : (
                        <div
                          className="w-28 h-28 rounded-xl flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                          style={{ backgroundColor: primaryColor, boxShadow: `0 8px 30px ${primaryColor}30` }}
                        >
                          {advisor?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        {advisor?.name || 'Your Advisor'}
                      </h2>
                      {advisor?.firm_name && (
                        <p className="text-slate-600 font-medium mb-3">{advisor.firm_name}</p>
                      )}
                      {advisor?.bio && (
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {advisor.bio}
                        </p>
                      )}
                      {!advisor?.bio && (
                        <p className="text-slate-500 text-sm leading-relaxed">
                          Certified fiduciary advisor specializing in personalized wealth management and retirement planning.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* What's next */}
                <div className="text-center mb-8">
                  <p className="text-slate-600">
                    A few more questions will help {advisor?.name?.split(' ')[0] || 'your advisor'} prepare a personalized plan for your complimentary consultation.
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={continueAfterReveal}
                  className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 4px 20px ${primaryColor}40`
                  }}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SEC Registered
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Fiduciary Duty
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Complimentary Consultation
              </span>
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
            <img src={advisor.logo_url} alt="" className="h-10" />
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
                  {/* Meeting Goals - required 150 chars */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are you hoping to get out of this meeting?
                    </label>
                    <textarea
                      name="meetingGoals"
                      value={formData.meetingGoals}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none resize-none"
                      placeholder="Tell us about your financial goals, questions you have, or what you'd like to discuss..."
                    />
                    <div className="flex justify-between mt-2 text-xs">
                      <span className={formData.meetingGoals.length < 150 ? 'text-amber-600' : 'text-green-600'}>
                        {formData.meetingGoals.length < 150
                          ? `${150 - formData.meetingGoals.length} more characters needed`
                          : 'Looks good!'}
                      </span>
                      <span className="text-gray-400">{formData.meetingGoals.length}/150 min</span>
                    </div>
                  </div>

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

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.firstName || !formData.email || !formData.phone || formData.meetingGoals.length < 150}
                    className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50"
                    style={{ backgroundColor: brandColor }}
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule My Consultation'}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                  By submitting, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </form>

              <button
                onClick={() => setCurrentStep(totalPhase1)}
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
          <span>Complimentary Consultation</span>
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
