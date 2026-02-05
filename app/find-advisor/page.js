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
  const [matchedAdvisor, setMatchedAdvisor] = useState(null);
  const [matchingPhase, setMatchingPhase] = useState(0); // 0=not started, 1-4=cycling advisors, 5=matched
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
  });

  // Sample advisors for matching animation
  const sampleAdvisors = [
    { name: 'Michael Chen, CFP®', firm: 'Wealth Partners Group', specialty: 'Retirement Planning' },
    { name: 'Sarah Williams, CFA', firm: 'Legacy Financial', specialty: 'Tax Optimization' },
    { name: 'David Thompson, CFP®', firm: 'Pinnacle Advisors', specialty: 'Estate Planning' },
    { name: 'Jennifer Martinez, ChFC', firm: 'Summit Wealth', specialty: 'Investment Management' },
  ];

  // The matched advisor (would come from API in production)
  const finalAdvisor = {
    name: 'Robert Anderson, CFP®',
    firm: 'Cornerstone Financial Planning',
    specialty: 'Retirement & Wealth Management',
    photo: '/advisor-photo.jpg',
    bookingUrl: 'https://calendly.com/cornerstone-advisor',
    bio: 'With 15+ years helping clients achieve financial independence, Robert specializes in comprehensive retirement planning and tax-efficient wealth strategies.',
  };

  const goToNext = () => setTimeout(() => setCurrentStep(prev => prev + 1), 200);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'hasAdvisor' && value === 'no-first-time') {
      // Skip "why changing" question
      setTimeout(() => setCurrentStep(prev => prev + 2), 200);
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
    }
  };

  const handleSkip = () => setCurrentStep(prev => prev + 1);

  const handleBack = () => {
    let prevStep = currentStep - 1;
    // Skip back over "why changing" if user has no advisor
    if (currentStep === 5 && formData.hasAdvisor === 'no-first-time') prevStep = 3;
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

  // Start matching animation and submit
  const startMatching = async () => {
    setCurrentStep(8); // Go to matching screen
    setMatchingPhase(1);

    // Submit form data
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

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17733369236/on9LCMmR4sAbEJT79odC',
          'value': 1.0, 'currency': 'USD'
        });
      }
    } catch (err) {
      console.error('Submit error:', err);
    }

    // Cycle through advisors for animation
    setTimeout(() => setMatchingPhase(2), 800);
    setTimeout(() => setMatchingPhase(3), 1600);
    setTimeout(() => setMatchingPhase(4), 2400);
    setTimeout(() => {
      setMatchedAdvisor(finalAdvisor);
      setMatchingPhase(5);
      setCurrentStep(9);
    }, 3500);
  };

  // Auto-skip whyChanging if user selected no-first-time
  useEffect(() => {
    if (currentStep === 4 && formData.hasAdvisor === 'no-first-time') {
      setCurrentStep(5);
    }
  }, [currentStep, formData.hasAdvisor]);

  if (!isOpen) return null;

  const totalSteps = 7; // Value questions (1-6) + contact info (7)
  const brandColor = '#1e3a5f';

  // Matching animation screen (step 8)
  if (currentStep === 8) {
    const currentAdvisor = sampleAdvisors[matchingPhase - 1] || sampleAdvisors[0];
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#1e3a5f]">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-8" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Finding Your Perfect Match...</h2>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-4 min-w-[280px] animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3" />
            <p className="text-white font-semibold text-lg">{currentAdvisor.name}</p>
            <p className="text-white/70 text-sm">{currentAdvisor.firm}</p>
            <p className="text-white/50 text-xs mt-1">{currentAdvisor.specialty}</p>
          </div>
          <p className="text-white/60 text-sm">Analyzing your needs and preferences...</p>
        </div>
      </div>
    );
  }

  // Advisor result screen (step 9)
  if (currentStep === 9 && matchedAdvisor) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#1e3a5f]">
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
            Great News, {formData.firstName}!
          </h2>
          <p className="text-white/80 mb-8 text-center">We found the perfect advisor for you.</p>

          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{matchedAdvisor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{matchedAdvisor.name}</h3>
            <p className="text-[#1e3a5f] font-medium mb-2">{matchedAdvisor.firm}</p>
            <p className="text-gray-500 text-sm mb-4">{matchedAdvisor.specialty}</p>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{matchedAdvisor.bio}</p>

            <a
              href={matchedAdvisor.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-[#e5b94e] text-slate-900 font-bold text-lg rounded-xl hover:bg-[#d4a93d] transition-all"
            >
              Book Your Free Call
            </a>
            <p className="text-gray-400 text-xs mt-3">You'll be taken to {matchedAdvisor.name.split(',')[0]}'s calendar</p>
          </div>

          <p className="text-white/60 text-sm mt-6 text-center">
            We've also sent {matchedAdvisor.name.split(',')[0]}'s info to {formData.email}
          </p>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white sm:rounded-3xl shadow-2xl w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="AssetPlanly" width={130} height={32} className="h-7 w-auto" />
          </div>
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-bold text-[#1e3a5f] mb-1">Find Your Perfect Advisor Match</h1>
            <p className="text-sm text-gray-500">Free, no-pressure consultation packed with real advice</p>
          </div>
        </div>

        <div className="flex-shrink-0 h-1 bg-gray-100">
          <div className="h-1 transition-all duration-500 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: brandColor }} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-8">

          {/* Step 1: What brought you here? */}
          {currentStep === 1 && (
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

          {/* Step 2: What's most important? */}
          {currentStep === 2 && (
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

          {/* Step 3: Do you have an advisor? */}
          {currentStep === 3 && (
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

          {/* Step 4: Why changing? (skipped if no advisor) */}
          {currentStep === 4 && (
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

          {/* Step 5: Financial complexity */}
          {currentStep === 5 && (
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

          {/* Step 6: Investable assets */}
          {currentStep === 6 && (
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

          {/* Step 7: Contact Info */}
          {currentStep === 7 && (
            <div className="animate-slideLeft">
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Almost there! Let's get your info</h2>
                <p className="text-gray-500 text-sm">Only shared with your matched advisor</p>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="Where we'll send your advisor match"
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} placeholder="(555) 123-4567"
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input type="text" inputMode="numeric" value={formData.zipCode} maxLength={5}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                    placeholder="To find advisors near you"
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-700 text-center">
                  <span className="font-semibold">Your privacy matters.</span> Your info is only shared with your matched advisor and used to send your match results.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="flex-shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-t border-gray-100 bg-white">
          {currentStep === 4 ? (
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Back</button>
              <button onClick={handleSkip} className="flex-1 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Skip</button>
              <button onClick={goToNext} disabled={!formData.whyChanging}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#1e3a5f]">Continue</button>
            </div>
          ) : currentStep === 7 ? (
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 transition-all active:scale-[0.98]">Back</button>
              <button onClick={startMatching}
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || formData.zipCode.length !== 5 || !validateEmail(formData.email).valid}
                className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 active:scale-[0.98] bg-[#e5b94e] text-slate-900">
                Get matched with an advisor
              </button>
            </div>
          ) : currentStep > 1 && !(formData.whyNow === 'other' && currentStep === 1) ? (
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
      <FormModal isOpen={showForm} onClose={() => setShowForm(false)} />

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
                Get matched with an advisor
              </button>
            </div>
            <button onClick={handleGetStarted} className="md:hidden bg-[#e5b94e] text-slate-900 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer">
              Get matched with an advisor
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-white overflow-hidden pb-4 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:min-h-[550px] py-8 lg:py-12">
            <div className="max-w-xl relative z-10">
              <h1 className="text-3xl md:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.08] mb-4 lg:mb-6">Get Matched With a Top <span className="text-[#1e3a5f]">Financial Advisor</span> for Your Goals</h1>
              <p className="text-base lg:text-lg text-slate-600 mb-6 lg:mb-8">Get a free, no-pressure consultation packed with real, helpful advice.</p>
              <button onClick={handleGetStarted} className="inline-block bg-[#e5b94e] text-slate-900 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:bg-[#d4a93d] transition-all cursor-pointer">Get matched with an advisor</button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] hidden lg:flex items-center justify-end pointer-events-none">
              <img src="/couple-line-drawing.png" alt="Couple reviewing financial plans" className="w-full max-w-lg opacity-90"
                style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }} />
            </div>
          </div>
        </div>
        <div className="absolute left-[45%] top-0 bottom-0 hidden lg:block z-0 pointer-events-none"
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">How to Find a Financial Advisor</h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Tell Us Your Goals</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">A few quick questions about your financial situation - retirement planning, wealth management, or other goals.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Get Your Advisor Match</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">We pair you with a vetted fiduciary advisor - like a certified financial planner - who fits your needs.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Free Consultation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Your advisor reaches out to discuss your goals. No pressure, no obligation.</p>
                </div>
              </div>
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
            <p className="text-[#1e3a5f] font-semibold mb-3 tracking-wide uppercase text-sm">Financial Planning Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why AssetPlanly</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">We connect you with top fiduciary advisors for retirement planning and wealth management</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Fiduciary-Only Advisors</h3>
              <p className="text-slate-600 text-sm">Every certified financial planner in our network is legally required to put your interests first. Always.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Personalized Matching</h3>
              <p className="text-slate-600 text-sm">We match you with a wealth management expert who specializes in your specific financial goals.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">No Cost to You</h3>
              <p className="text-slate-600 text-sm">Our service and your consultation are completely free. Get expert retirement planning advice at no charge.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Fast & Simple</h3>
              <p className="text-slate-600 text-sm">Answer a few questions, get matched with a financial advisor, and receive your free consultation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-[#1e3a5f] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control of Your Financial Future?</h2>
          <p className="text-lg text-white/80 mb-8">Get matched with a top fiduciary advisor today. It's free, fast, and could change your life.</p>
          <button onClick={handleGetStarted} className="bg-[#e5b94e] text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#d4a93d] transition-all cursor-pointer">
            Get matched with an advisor
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Image src="/logo-white.png" alt="AssetPlanly" width={140} height={35} className="h-8 w-auto opacity-80" />
            <div className="flex gap-8 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>AssetPlanly connects consumers with financial advisors. We are not a financial advisor. Always consult with qualified professionals.</p>
            <p className="mt-2">&copy; 2025 AssetPlanly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
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
              Find Your Perfect Advisor Match
            </h1>
            <p className="text-sm text-gray-500">
              Free, no-pressure consultation packed with real advice
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
                Get matched with an advisor
              </button>
            </div>
            <button onClick={handleGetStarted} className="md:hidden bg-[#e5b94e] text-slate-900 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer">
              Get matched with an advisor
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
                Get Matched With a Top <span className="text-[#1e3a5f]">Financial Advisor</span> for Your Goals
              </h1>
              <p className="text-base lg:text-lg text-slate-600 mb-6 lg:mb-8">
                Get a free, no-pressure consultation packed with real, helpful advice.
              </p>
              <button onClick={handleGetStarted} className="inline-block bg-[#e5b94e] text-slate-900 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:bg-[#d4a93d] transition-all cursor-pointer">
                Get matched with an advisor
              </button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] hidden lg:flex items-center justify-end pointer-events-none">
              <img src="/couple-line-drawing.png" alt="Couple reviewing financial plans" className="w-full max-w-lg opacity-90"
                style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }} />
            </div>
          </div>
        </div>
        <div className="absolute left-[45%] top-0 bottom-0 hidden lg:block z-0 pointer-events-none"
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">How to Find a Financial Advisor</h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Tell Us Your Goals</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">A few quick questions about your financial situation - retirement planning, wealth management, or other goals.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Get Your Advisor Match</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">We pair you with a vetted fiduciary advisor - like a certified financial planner - who fits your needs.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Free Consultation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Your advisor reaches out to discuss your goals. No pressure, no obligation.</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button onClick={handleGetStarted} className="inline-block bg-[#e5b94e] text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-[#d4a93d] transition-all cursor-pointer">
                Get Started
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
            <p className="text-[#1e3a5f] font-semibold mb-3 tracking-wide uppercase text-sm">Financial Planning Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why AssetPlanly</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">We connect you with top fiduciary advisors for retirement planning and wealth management</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fiduciary Advisors Only</h3>
              <p className="text-slate-600 leading-relaxed">Every advisor is legally required to act in your best interest. That's the fiduciary standard.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Personally Matched</h3>
              <p className="text-slate-600 leading-relaxed">One certified financial planner selected for you, not a random list.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Free</h3>
              <p className="text-slate-600 leading-relaxed">No cost to you. No hidden fees. Many advisors are fee-only financial advisors.</p>
            </div>
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Your Info Stays Private</h3>
              <p className="text-slate-600 leading-relaxed">Only shared with your matched advisor. Never sold.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6 bg-[#1e3a5f] overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Ready to Find Your Advisor?</h2>
          <button onClick={handleGetStarted} className="inline-flex items-center gap-3 bg-[#e5b94e] text-slate-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-[#d4a93d] transition-all shadow-lg cursor-pointer">
            Get My Match
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
          <p className="text-center text-slate-500 text-sm mb-8">
            Your information is secure and only shared with your personally matched advisor.
          </p>
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
