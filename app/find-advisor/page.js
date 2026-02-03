'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";

// Email validation
const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return { valid: false, error: 'Invalid email' };
  const domain = email.split('@')[1].toLowerCase();
  const disposableDomains = ['tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];
  if (disposableDomains.includes(domain)) return { valid: false, error: 'Use a permanent email' };
  return { valid: true, error: null };
};

// Form Modal Component
function FormModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    whyNow: '', whyNowOther: '', whatYouWant: '', hasAdvisor: '', whyChanging: '',
    financialComplexity: '', investableAssets: '', zipCode: '',
    selectedSlot: null, // { date: 'Today'/'Tomorrow', time: '10:00 AM', datetime: Date }
  });

  const [availableSlots, setAvailableSlots] = useState({ today: [], tomorrow: [], upcoming: [] });
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch real availability from API
  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/availability?days=7');
      const data = await response.json();

      if (data.success && data.availableSlots) {
        const slots = { today: [], tomorrow: [], upcoming: [] };

        data.availableSlots.forEach(day => {
          const daySlots = day.slots.map(slot => ({
            time: slot.display,
            date: day.isToday ? 'Today' : day.isTomorrow ? 'Tomorrow' : day.displayDate,
            datetime: slot.datetime,
            dayName: day.dayName
          }));

          if (day.isToday) {
            slots.today = daySlots;
          } else if (day.isTomorrow) {
            slots.tomorrow = daySlots;
          } else {
            slots.upcoming.push(...daySlots);
          }
        });

        return slots;
      }
      return { today: [], tomorrow: [], upcoming: [] };
    } catch (error) {
      console.error('Error fetching availability:', error);
      return { today: [], tomorrow: [], upcoming: [] };
    }
  };

  // Load slots when reaching calendar step
  useEffect(() => {
    if (currentStep === 10) {
      setLoadingSlots(true);
      fetchAvailability().then(slots => {
        setAvailableSlots(slots);
        setLoadingSlots(false);
      });
    }
  }, [currentStep]);

  const brandColor = '#1e3a5f';

  const goToNext = () => setTimeout(() => setCurrentStep(prev => prev + 1), 200);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'hasAdvisor' && value === 'no-first-time') {
      setTimeout(() => setCurrentStep(prev => prev + 2), 200);
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
    }
  };

  const handleSkip = () => setCurrentStep(prev => prev + 1);

  const handleBack = () => {
    let prevStep = currentStep - 1;
    if (currentStep === 7 && formData.hasAdvisor === 'no-first-time') prevStep = 5;
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
          scheduledAt: formData.selectedSlot?.datetime || null,
          selectedSlot: formData.selectedSlot ? {
            date: formData.selectedSlot.date,
            time: formData.selectedSlot.time,
          } : null,
          source: 'consumer-find-advisor'
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit');

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17733369236/on9LCMmR4sAbEJT79odC',
          'value': 1.0, 'currency': 'USD'
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

  if (!isOpen) return null;

  const totalSteps = 10; // Added calendar booking step

  // Success screen
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#1e3a5f]">
        {/* Persistent header on success too */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3 bg-white">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="AssetPlanly" width={130} height={32} className="h-7 w-auto" />
          </div>
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-bold text-[#1e3a5f] mb-1">
              Schedule Your Complimentary Fiduciary Advisor Meeting
            </h1>
            <p className="text-sm text-gray-500">
              Clear next steps to protect and grow your wealth
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              You're All Set, {formData.firstName}!
            </h2>
            <p className="text-white/80 mb-8">
              {formData.selectedSlot
                ? `Your consultation is confirmed for ${formData.selectedSlot.date} at ${formData.selectedSlot.time}. A qualified fiduciary advisor will call you then.`
                : 'Our advisors are in high demand. A qualified fiduciary advisor will call you within 24 hours.'
              }
            </p>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-6">
              <h3 className="font-semibold text-white mb-3">What happens next?</h3>
              <ul className="text-white/70 text-sm text-left space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white/50 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Your advisor will call to introduce themselves
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white/50 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Schedule your free planning session
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white/50 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  No obligation - just helpful guidance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      {/* Blurred backdrop - the landing page shows through */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white sm:rounded-3xl shadow-2xl w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with logo and value prop */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="AssetPlanly" width={130} height={32} className="h-7 w-auto" />
          </div>
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-bold text-[#1e3a5f] mb-1">
              Schedule Your Complimentary Fiduciary Advisor Meeting
            </h1>
            <p className="text-sm text-gray-500">
              Clear next steps to protect and grow your wealth
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-shrink-0 h-1 bg-gray-100">
          <div className="h-1 transition-all duration-500 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: brandColor }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-8">

          {/* Step 1: Name */}
          {currentStep === 1 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Let's get started</h2>
                <p className="text-gray-500 text-sm">What's your name?</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Email + Phone */}
          {currentStep === 2 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Hi {formData.firstName}!</h2>
                <p className="text-gray-500 text-sm">How can we reach you?</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} placeholder="(555) 123-4567"
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: What brought you here? */}
          {currentStep === 3 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">What brought you here today?</h2>
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
                  <button key={opt.value}
                    onClick={() => opt.value === 'other' ? setFormData(prev => ({ ...prev, whyNow: 'other' })) : handleSelect('whyNow', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${formData.whyNow === opt.value ? 'border-[#1e3a5f] bg-[#1e3a5f]/10' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {formData.whyNow === 'other' && (
                <div className="mt-3">
                  <input type="text" value={formData.whyNowOther} onChange={(e) => setFormData(prev => ({ ...prev, whyNowOther: e.target.value }))}
                    placeholder="Please specify..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" autoFocus />
                  <button onClick={() => handleSelect('whyNow', 'other')} disabled={!formData.whyNowOther}
                    className="w-full mt-3 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 bg-[#1e3a5f]">Continue</button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: What's most important? */}
          {currentStep === 4 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">What's most important to you?</h2>
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
                  <button key={opt.value} onClick={() => handleSelect('whatYouWant', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${formData.whatYouWant === opt.value ? 'border-[#1e3a5f] bg-[#1e3a5f]/10' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Do you have an advisor? */}
          {currentStep === 5 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Do you have a financial advisor?</h2>
              </div>
              <div className="grid gap-2.5">
                {[
                  { value: 'no-first-time', label: 'No, this would be my first' },
                  { value: 'yes-considering-change', label: 'Yes, but considering a change' },
                  { value: 'yes-second-opinion', label: 'Yes, want a second opinion' },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => handleSelect('hasAdvisor', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${formData.hasAdvisor === opt.value ? 'border-[#1e3a5f] bg-[#1e3a5f]/10' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Why changing? */}
          {currentStep === 6 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">What's making you consider a change?</h2>
                <p className="text-gray-500 text-sm">Optional</p>
              </div>
              <textarea value={formData.whyChanging} onChange={(e) => setFormData(prev => ({ ...prev, whyChanging: e.target.value }))}
                placeholder="Share your thoughts..." rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none" />
            </div>
          )}

          {/* Step 7: Financial complexity */}
          {currentStep === 7 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">How complex is your financial situation?</h2>
              </div>
              <div className="grid gap-2.5">
                {[
                  { value: 'simple', label: 'Pretty straightforward' },
                  { value: 'moderate', label: 'Somewhat complex' },
                  { value: 'complex', label: 'Quite complex' },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => handleSelect('financialComplexity', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${formData.financialComplexity === opt.value ? 'border-[#1e3a5f] bg-[#1e3a5f]/10' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Investable assets */}
          {currentStep === 8 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">What are your total savings and investments?</h2>
                <p className="text-gray-500 text-sm">401(k), IRA, brokerage, savings. Not including your home.</p>
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
                  <button key={opt.value} onClick={() => handleSelect('investableAssets', opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium active:scale-[0.98] ${formData.investableAssets === opt.value ? 'border-[#1e3a5f] bg-[#1e3a5f]/10' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 9: ZIP Code */}
          {currentStep === 9 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Almost there!</h2>
                <p className="text-gray-500 text-sm">What's your ZIP code?</p>
              </div>
              <input type="text" inputMode="numeric" value={formData.zipCode} maxLength={5}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                placeholder="Enter ZIP" autoFocus
                className="w-full px-5 py-4 text-2xl text-center border-2 border-gray-200 rounded-2xl focus:border-blue-500 outline-none tracking-widest font-medium" />
            </div>
          )}

          {/* Step 10: Calendar Booking */}
          {currentStep === 10 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Pick a Time for Your Call</h2>
                <p className="text-gray-500 text-sm">Choose a time that works for you</p>
              </div>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (availableSlots.today.length === 0 && availableSlots.tomorrow.length === 0 && availableSlots.upcoming.length === 0) ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">Our advisors are in high demand!</p>
                  <p className="text-gray-500 text-sm">We'll call you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto">
                  {/* Today's slots */}
                  {availableSlots.today.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Today</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.today.map((slot, i) => (
                          <button
                            key={`today-${i}`}
                            onClick={() => setFormData(prev => ({ ...prev, selectedSlot: slot }))}
                            className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all active:scale-[0.98] ${
                              formData.selectedSlot?.datetime === slot.datetime
                                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tomorrow's slots */}
                  {availableSlots.tomorrow.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tomorrow</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.tomorrow.map((slot, i) => (
                          <button
                            key={`tomorrow-${i}`}
                            onClick={() => setFormData(prev => ({ ...prev, selectedSlot: slot }))}
                            className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all active:scale-[0.98] ${
                              formData.selectedSlot?.datetime === slot.datetime
                                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming days */}
                  {availableSlots.upcoming.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">More Times</h3>
                      <div className="space-y-3">
                        {/* Group by date */}
                        {Object.entries(
                          availableSlots.upcoming.reduce((acc, slot) => {
                            if (!acc[slot.date]) acc[slot.date] = [];
                            acc[slot.date].push(slot);
                            return acc;
                          }, {})
                        ).map(([date, slots]) => (
                          <div key={date}>
                            <p className="text-xs text-gray-500 mb-1.5">{date}</p>
                            <div className="grid grid-cols-3 gap-2">
                              {slots.map((slot, i) => (
                                <button
                                  key={`upcoming-${date}-${i}`}
                                  onClick={() => setFormData(prev => ({ ...prev, selectedSlot: slot }))}
                                  className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all active:scale-[0.98] ${
                                    formData.selectedSlot?.datetime === slot.datetime
                                      ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  {slot.time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="flex-shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-t border-gray-100 bg-white">
          {currentStep === 1 ? (
            <button onClick={goToNext} disabled={!formData.firstName || !formData.lastName}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]">Continue</button>
          ) : currentStep === 2 ? (
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Back</button>
              <button onClick={goToNext} disabled={!formData.email || !formData.phone || !validateEmail(formData.email).valid}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]">Continue</button>
            </div>
          ) : currentStep === 6 ? (
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Back</button>
              <button onClick={handleSkip} className="flex-1 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Skip</button>
              <button onClick={goToNext} disabled={!formData.whyChanging}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]">Continue</button>
            </div>
          ) : currentStep === 9 ? (
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Back</button>
              <button onClick={goToNext} disabled={formData.zipCode.length !== 5}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]">
                Continue
              </button>
            </div>
          ) : currentStep === 10 ? (
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Back</button>
              <button onClick={handleSubmit} disabled={isSubmitting || (!formData.selectedSlot && (availableSlots.today.length + availableSlots.tomorrow.length + availableSlots.upcoming.length) > 0)}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]">
                {isSubmitting ? 'Booking...' : formData.selectedSlot ? 'Confirm Booking' : 'Request Callback'}
              </button>
            </div>
          ) : currentStep > 1 && !(formData.whyNow === 'other' && currentStep === 3) ? (
            <button onClick={handleBack} className="w-full py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Back</button>
          ) : null}

          {currentStep === 1 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
            </p>
          )}
        </div>

        <style jsx>{`
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .animate-slideUp { animation: slideUp 0.3s ease-out; }
          .animate-slideLeft { animation: slideLeft 0.25s ease-out; }
        `}</style>
      </div>
    </div>
  );
}

// Main Page Component
export default function FindAdvisorPage() {
  const [showForm, setShowForm] = useState(false);

  const handleGetStarted = (e) => {
    e.preventDefault();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Form Modal */}
      <FormModal isOpen={showForm} onClose={() => setShowForm(false)} />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link href="/find-advisor">
              <Image src="/logo.png" alt="AssetPlanly" width={160} height={40} className="h-10 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-10">
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium transition">How It Works</a>
              <a href="#why-us" className="text-slate-600 hover:text-slate-900 font-medium transition">Why Us</a>
              <button onClick={handleGetStarted} className="bg-[#e5b94e] text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d4a93d] transition-all shadow-sm cursor-pointer">
                Get Started
              </button>
            </div>
            <button onClick={handleGetStarted} className="md:hidden bg-[#e5b94e] text-slate-900 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-white overflow-hidden pb-4 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:min-h-[550px] py-8 lg:py-12">
            <div className="max-w-xl relative z-10">
              <h1 className="text-3xl md:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.08] mb-4 lg:mb-6">
                You're in the right place for{' '}
                <span className="text-[#1e3a5f]">expert financial advice</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-600 mb-6 lg:mb-8">
                Getting started is easy and complimentary.
              </p>
              <button onClick={handleGetStarted} className="inline-block bg-[#e5b94e] text-slate-900 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:bg-[#d4a93d] transition-all cursor-pointer">
                Find my advisor
              </button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] hidden lg:flex items-center justify-end pointer-events-none">
              <img src="/couple-line-drawing.png" alt="Couple reviewing financial plans" className="w-full max-w-lg opacity-90"
                style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }} />
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 hidden lg:block z-10 pointer-events-none"
          style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)' }}>
          <img src="/paper-airplane.png" alt="" className="h-full w-auto object-contain object-bottom" style={{ transform: 'scaleY(-1)' }} />
        </div>
      </section>

      {/* As featured in */}
      <section className="py-6 px-6 bg-[#f5f3ef]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider">As featured in</span>
            <span className="text-slate-400 font-serif text-xl italic">yahoo!<span className="text-xs not-italic align-top">finance</span></span>
            <span className="text-slate-400 font-serif text-xl">Kiplinger</span>
            <span className="text-slate-400 font-serif text-xl italic">MarketWatch</span>
            <span className="text-slate-400 text-xs font-semibold tracking-tight leading-tight">GOOD<br/>HOUSEKEEPING</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="grid lg:grid-cols-2">
        <div className="bg-[#f5f3ef] min-h-[500px] lg:min-h-[600px] flex items-center justify-center p-12">
          <div className="border-4 border-[#1e3a5f] p-6 bg-white">
            <img src="/advisor-meeting.png" alt="Couple meeting with financial advisor" className="w-full max-w-sm object-contain" />
          </div>
        </div>
        <div className="bg-[#f5f3ef] px-8 lg:px-16 py-16 flex items-center relative">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">How it works</h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Answer a few questions</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Share some details about your financial situation. It only takes a few minutes.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Meet your advisor</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">We'll introduce you to a regulated fiduciary advisor based on your goals.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Book your consultation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Arrange your first meeting at a time that suits you. No obligation.</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button onClick={handleGetStarted} className="inline-block bg-[#e5b94e] text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-[#d4a93d] transition-all cursor-pointer">
                Find my advisor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-24 px-6 bg-white relative">
        <img src="/paper-airplane-2.png" alt="" className="absolute top-20 right-0 w-96 h-auto pointer-events-none hidden lg:block"
          style={{ transform: 'scaleX(-1) translateX(15%)', zIndex: 1 }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[#1e3a5f] font-semibold mb-3 tracking-wide uppercase text-sm">Our Commitment</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">We're committed to connecting you with the right financial guidance</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fiduciary Standard</h3>
              <p className="text-slate-600 leading-relaxed">Every advisor is legally bound to act in your best interest — not theirs.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Highly Qualified</h3>
              <p className="text-slate-600 leading-relaxed">Carefully vetted professionals with proven track records.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Private & Secure</h3>
              <p className="text-slate-600 leading-relaxed">Your information is never sold. Complete confidentiality.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Right Fit For You</h3>
              <p className="text-slate-600 leading-relaxed">Matched to your specific situation, goals, and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6 bg-[#1e3a5f] overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to meet the right<br />advisor for you?</h2>
          <p className="text-xl text-white/70 mb-10">Takes less than 2 minutes. No obligation.</p>
          <button onClick={handleGetStarted} className="inline-flex items-center gap-3 bg-[#e5b94e] text-slate-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-[#d4a93d] transition-all shadow-lg cursor-pointer">
            Find My Advisor
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="absolute -bottom-4 left-0 right-0 pointer-events-none overflow-hidden">
          <img src="/financial-icons.png" alt="" className="w-full h-auto opacity-10 translate-y-1/2"
            style={{ maskImage: 'linear-gradient(to top, black 0%, transparent 50%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 50%)' }} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Image src="/logo.png" alt="AssetPlanly" width={140} height={34} className="h-8 w-auto" />
            <div className="flex gap-8 text-sm">
              <Link href="/privacy" className="hover:text-slate-900 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-900 transition">Terms of Service</Link>
            </div>
            <div className="text-sm">© 2026 AssetPlanly. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
