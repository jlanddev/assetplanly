'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function BookCallPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    crdNumber: '',
    firmName: '',
    firmCity: '',
    firmState: '',
    verified: false,
    name: '',
    email: '',
    phone: '',
    leadsPerMonth: '',
    scheduledAt: '',
    scheduledDisplay: '',
    message: ''
  });

  const totalSteps = 6;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length < 4) return phone;
    if (phone.length < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const searchAdvisors = async () => {
    if (!formData.lastName) return;

    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const response = await fetch(
        `/api/verify-advisor?lastName=${encodeURIComponent(formData.lastName)}&firstName=${encodeURIComponent(formData.firstName || '')}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchError('No advisors found. You can still continue with manual entry.');
      }
    } catch (err) {
      setSearchError('Unable to search SEC database. You can continue with manual entry.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectAdvisor = (advisor) => {
    setFormData({
      ...formData,
      name: advisor.name || `${advisor.firstName || ''} ${advisor.lastName || ''}`.trim(),
      crdNumber: advisor.crdNumber || '',
      firmName: advisor.firmName || '',
      firmCity: advisor.city || '',
      firmState: advisor.state || '',
      verified: true
    });
    setCurrentStep(3);
  };

  const skipVerification = () => {
    setFormData({
      ...formData,
      verified: false,
      name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
    });
    setCurrentStep(3);
  };

  // Get next 14 days for calendar
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          fullDisplay: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        });
      }
    }
    return dates;
  };

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true);
    try {
      const response = await fetch(`/api/availability?date=${date}`);
      const data = await response.json();

      if (data.slots) {
        setAvailableSlots(data.slots.filter(s => s.available));
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const selectTimeSlot = (slot) => {
    const dateObj = getAvailableDates().find(d => d.date === selectedDate);
    setFormData({
      ...formData,
      scheduledAt: slot.datetime,
      scheduledDisplay: `${dateObj?.fullDisplay} at ${slot.display}`
    });
    handleNext();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');
      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--blue-50)] to-white">
        <nav className="bg-white border-b border-[var(--gray-200)]">
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
            <div className="w-20 h-20 bg-[var(--green-100)] rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-[var(--green-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
              You&apos;re all set!
            </h1>
            <p className="text-lg text-[var(--gray-600)] mb-2">
              Your call is scheduled for:
            </p>
            <p className="text-xl font-semibold text-[var(--blue-600)] mb-8">
              {formData.scheduledDisplay}
            </p>
            <p className="text-[var(--gray-600)] mb-8">
              We&apos;ll send you a calendar invite and reminder before the call.
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
    <div className="min-h-screen bg-gradient-to-b from-[var(--blue-50)] to-white">
      <nav className="bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-[var(--gray-900)]">
              AssetPlanly
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-[var(--blue-600)]">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm font-medium text-[var(--blue-600)]">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-[var(--gray-200)] rounded-full h-2">
                <div
                  className="bg-[var(--blue-600)] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Step 1: Enter Name for Verification */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[var(--gray-900)] mb-2">
                  Let&apos;s verify your advisor profile
                </h3>
                <p className="text-[var(--gray-600)] mb-6">
                  We&apos;ll search the SEC database to find your registration.
                </p>

                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-5 py-4 text-lg border-2 border-[var(--gray-200)] rounded-xl focus:border-[var(--blue-600)] focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    First Name (optional)
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full px-5 py-4 text-lg border-2 border-[var(--gray-200)] rounded-xl focus:border-[var(--blue-600)] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => { searchAdvisors(); handleNext(); }}
                  disabled={!formData.lastName}
                  className="w-full bg-[var(--blue-600)] text-white px-8 py-4 text-lg font-medium hover:bg-[var(--blue-700)] transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify My Profile →
                </button>
              </div>
            )}

            {/* Step 2: Select from Search Results */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[var(--gray-900)] mb-2">
                  Select your profile
                </h3>
                <p className="text-[var(--gray-600)] mb-6">
                  {isSearching ? 'Searching SEC database...' : 'Choose your registration from the results below.'}
                </p>

                {isSearching && (
                  <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[var(--blue-600)] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {searchError && (
                  <div className="p-4 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl text-[var(--gray-600)]">
                    {searchError}
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {searchResults.map((advisor, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectAdvisor(advisor)}
                        className="w-full p-5 border-2 border-[var(--gray-200)] rounded-xl text-left transition-all hover:border-[var(--blue-600)] hover:bg-[var(--blue-50)]"
                      >
                        <div className="font-semibold text-[var(--gray-900)]">{advisor.name}</div>
                        {advisor.firmName && (
                          <div className="text-[var(--gray-600)] mt-1">{advisor.firmName}</div>
                        )}
                        <div className="text-sm text-[var(--gray-500)] mt-1">
                          {advisor.city && advisor.state && `${advisor.city}, ${advisor.state}`}
                          {advisor.crdNumber && ` • CRD #${advisor.crdNumber}`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-white border-2 border-[var(--gray-300)] text-[var(--gray-700)] px-6 py-4 text-lg font-medium hover:bg-[var(--gray-50)] transition-all duration-300 rounded-xl"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={skipVerification}
                    className="flex-1 bg-[var(--gray-100)] text-[var(--gray-700)] px-6 py-4 text-lg font-medium hover:bg-[var(--gray-200)] transition-all duration-300 rounded-xl"
                  >
                    Skip / Enter Manually
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[var(--gray-900)] mb-2">
                  How can we reach you?
                </h3>

                {formData.verified && (
                  <div className="p-4 bg-[var(--green-50)] border border-[var(--green-100)] rounded-xl mb-6">
                    <div className="flex items-center gap-2 text-[var(--green-600)] font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified: {formData.name}
                    </div>
                    {formData.firmName && (
                      <div className="text-sm text-[var(--gray-600)] mt-1">{formData.firmName}</div>
                    )}
                  </div>
                )}

                {!formData.verified && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full px-5 py-4 text-lg border-2 border-[var(--gray-200)] rounded-xl focus:border-[var(--blue-600)] focus:outline-none transition-colors mb-4"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 text-lg border-2 border-[var(--gray-200)] rounded-xl focus:border-[var(--blue-600)] focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    className="w-full px-5 py-4 text-lg border-2 border-[var(--gray-200)] rounded-xl focus:border-[var(--blue-600)] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-white border-2 border-[var(--gray-300)] text-[var(--gray-700)] px-6 py-4 text-lg font-medium hover:bg-[var(--gray-50)] transition-all duration-300 rounded-xl"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.email || !formData.phone}
                    className="flex-1 bg-[var(--blue-600)] text-white px-6 py-4 text-lg font-medium hover:bg-[var(--blue-700)] transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Leads Per Month */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[var(--gray-900)] mb-2">
                  How many leads are you looking for each month?
                </h3>

                <div className="grid gap-3">
                  {[
                    { value: '1-5', label: '1-5 leads' },
                    { value: '5-10', label: '5-10 leads' },
                    { value: '10-20', label: '10-20 leads' },
                    { value: '20+', label: '20+ leads' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => { setFormData({ ...formData, leadsPerMonth: option.value }); handleNext(); }}
                      className={`w-full p-5 border-2 rounded-xl text-left transition-all hover:scale-[1.02] ${
                        formData.leadsPerMonth === option.value
                          ? 'border-[var(--blue-600)] bg-[var(--blue-50)] text-[var(--blue-700)] font-semibold shadow-lg'
                          : 'border-[var(--gray-200)] hover:border-[var(--blue-600)] text-[var(--gray-700)] hover:bg-[var(--blue-50)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full bg-white border-2 border-[var(--gray-300)] text-[var(--gray-700)] px-6 py-4 text-lg font-medium hover:bg-[var(--gray-50)] transition-all duration-300 rounded-xl mt-4"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Step 5: Schedule Call - Calendar */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[var(--gray-900)] mb-2">
                  Pick a time for your call
                </h3>
                <p className="text-[var(--gray-600)] mb-6">
                  Select a date, then choose an available time slot.
                </p>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
                    Select a Date
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {getAvailableDates().map((dateOption) => (
                      <button
                        key={dateOption.date}
                        type="button"
                        onClick={() => setSelectedDate(dateOption.date)}
                        className={`p-3 border-2 rounded-xl text-center transition-all ${
                          selectedDate === dateOption.date
                            ? 'border-[var(--blue-600)] bg-[var(--blue-50)] text-[var(--blue-700)] font-semibold'
                            : 'border-[var(--gray-200)] hover:border-[var(--blue-600)] text-[var(--gray-700)]'
                        }`}
                      >
                        <div className="text-xs text-[var(--gray-500)]">{dateOption.dayName}</div>
                        <div className="font-medium">{dateOption.display.split(', ')[1]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
                      Select a Time
                    </label>

                    {loadingSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[var(--blue-600)] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => selectTimeSlot(slot)}
                            className="p-3 border-2 border-[var(--gray-200)] rounded-xl text-center transition-all hover:border-[var(--blue-600)] hover:bg-[var(--blue-50)] text-[var(--gray-700)] font-medium"
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-[var(--gray-50)] rounded-xl text-center text-[var(--gray-600)]">
                        No available slots for this date. Please select another date.
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full bg-white border-2 border-[var(--gray-300)] text-[var(--gray-700)] px-6 py-4 text-lg font-medium hover:bg-[var(--gray-50)] transition-all duration-300 rounded-xl mt-4"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Step 6: Optional Message + Submit */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[var(--gray-900)] mb-2">
                  Almost done!
                </h3>

                {/* Show scheduled time */}
                <div className="p-4 bg-[var(--blue-50)] border border-[var(--blue-100)] rounded-xl">
                  <div className="flex items-center gap-2 text-[var(--blue-700)] font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formData.scheduledDisplay}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Anything else we should know? (optional)
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your practice, what kind of clients you're looking for, etc."
                    className="w-full px-5 py-4 text-lg border-2 border-[var(--gray-200)] rounded-xl focus:border-[var(--blue-600)] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-white border-2 border-[var(--gray-300)] text-[var(--gray-700)] px-6 py-4 text-lg font-medium hover:bg-[var(--gray-50)] transition-all duration-300 rounded-xl"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[var(--blue-600)] text-white px-6 py-4 text-lg font-medium hover:bg-[var(--blue-700)] transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking →'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

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
