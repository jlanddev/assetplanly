'use client';

import Link from "next/link";
import Image from "next/image";

export default function FindAdvisorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link href="/find-advisor">
              <Image src="/logo.png" alt="AssetPlanly" width={180} height={44} className="h-11 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-[#1e3a5f] font-medium">How It Works</a>
              <a href="#why-us" className="text-gray-600 hover:text-[#1e3a5f] font-medium">Why Us</a>
              <Link href="/plan" className="bg-[#1e3a5f] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2d4a6f] transition-all">
                Get My Free Plan
              </Link>
            </div>
            <Link href="/plan" className="md:hidden bg-[#1e3a5f] text-white px-5 py-2.5 rounded-full font-semibold text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Complimentary Financial Review
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#1e3a5f] leading-tight mb-6">
                Your Personal Financial Plan, On Us
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Answer a few questions and receive a complimentary financial plan from a dedicated fiduciary advisor. No cost, no obligation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/plan" className="bg-[#1e3a5f] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d4a6f] transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                  Get My Free Plan
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="#how-it-works" className="text-[#1e3a5f] px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 hover:border-[#1e3a5f] transition-all text-center">
                  See How It Works
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Free
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No Spam Calls
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fiduciary Advisors
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 scale-110"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Get Your Free Plan</h3>
                  <p className="text-gray-500 text-sm mt-1">Takes less than 2 minutes</p>
                </div>
                <Link href="/plan" className="block w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-semibold text-center hover:bg-[#2d4a6f] transition-all">
                  Start Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1e3a5f]">500+</div>
            <div className="text-gray-500 mt-1">Fiduciary Advisors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1e3a5f]">50 States</div>
            <div className="text-gray-500 mt-1">Nationwide Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1e3a5f]">100%</div>
            <div className="text-gray-500 mt-1">Free Service</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1e3a5f]">4.9/5</div>
            <div className="text-gray-500 mt-1">Client Rating</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting your complimentary financial plan is simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#1e3a5f]">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tell Us Your Goals</h3>
              <p className="text-gray-600">
                Answer a few simple questions about your financial situation and what you want to achieve.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#1e3a5f]">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Find Your Advisor</h3>
              <p className="text-gray-600">
                We connect you with a fiduciary advisor who specializes in your specific needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#1e3a5f]">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Free Plan</h3>
              <p className="text-gray-600">
                Receive a personalized financial plan and consultation — completely free, no strings attached.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/plan" className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d4a6f] transition-all">
              Get Started Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-20 px-6 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to connecting you with the right financial guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fiduciary Standard</h3>
              <p className="text-gray-600">
                Every advisor in our network is legally bound to act in your best interest — not theirs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Completely Free</h3>
              <p className="text-gray-600">
                Your consultation and financial plan cost you nothing. We're compensated by our advisor network.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Private & Secure</h3>
              <p className="text-gray-600">
                Your information is never sold. We only share what's needed with your chosen advisor.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Response</h3>
              <p className="text-gray-600">
                Your advisor will reach out within 24 hours to schedule your complimentary consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1e3a5f]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Your Complimentary Financial Plan?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Takes less than 2 minutes. No cost, no obligation, no spam.
          </p>
          <Link href="/plan" className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
            Get My Free Plan
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Image src="/logo.png" alt="AssetPlanly" width={140} height={34} className="h-8 w-auto brightness-0 invert opacity-70" />
            <div className="flex gap-8 text-sm">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            </div>
            <div className="text-sm">
              © 2026 AssetPlanly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
