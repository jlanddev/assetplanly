'use client';

import Link from "next/link";
import Image from "next/image";

export default function FindAdvisorPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
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
              <Link href="/plan" className="bg-[#e5b94e] text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d4a93d] transition-all shadow-sm">
                Get Started
              </Link>
            </div>
            <Link href="/plan" className="md:hidden bg-[#e5b94e] text-slate-900 px-5 py-2.5 rounded-lg font-semibold text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#1e3a5f] font-semibold mb-6 tracking-wide uppercase text-sm">Expert Financial Guidance</p>
              <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-slate-900 leading-[1.15] mb-6">
                You're in the right place for{' '}
                <span className="text-[#1e3a5f]">expert financial advice</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Getting started is easy, fast and free. Connect with a fiduciary advisor who puts your interests first.
              </p>

              <Link href="/plan" className="inline-flex items-center gap-3 bg-[#e5b94e] text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d4a93d] transition-all shadow-md hover:shadow-lg">
                Get My Free Plan
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-10">
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Fiduciary</div>
                    <div className="text-sm text-slate-500">Your interests first</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Fast</div>
                    <div className="text-sm text-slate-500">2 minutes to start</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Free</div>
                    <div className="text-sm text-slate-500">No cost to you</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero image/card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#1e3a5f]/10 to-[#e5b94e]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-14 h-14 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Your Complimentary Plan</h3>
                    <p className="text-slate-500 text-sm">Personalized to your goals</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">Retirement planning analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">Investment strategy review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">Tax optimization strategies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">Estate planning guidance</span>
                  </div>
                </div>

                <Link href="/plan" className="block w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-semibold text-center hover:bg-[#2d4a6f] transition-all">
                  Get Started — It's Free
                </Link>
                <p className="text-center text-sm text-slate-400 mt-4">Takes less than 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof - media logos */}
      <section className="py-12 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-slate-400 uppercase tracking-wider mb-8">As featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
            <svg className="h-6" viewBox="0 0 100 24" fill="currentColor">
              <text x="0" y="18" className="text-lg font-bold">Forbes</text>
            </svg>
            <svg className="h-6" viewBox="0 0 120 24" fill="currentColor">
              <text x="0" y="18" className="text-lg font-bold">MarketWatch</text>
            </svg>
            <svg className="h-6" viewBox="0 0 100 24" fill="currentColor">
              <text x="0" y="18" className="text-lg font-bold">Kiplinger</text>
            </svg>
            <svg className="h-6" viewBox="0 0 100 24" fill="currentColor">
              <text x="0" y="18" className="text-lg font-bold">Yahoo!</text>
            </svg>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#1e3a5f] font-semibold mb-3 tracking-wide uppercase text-sm">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three simple steps to your complimentary financial plan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#e5b94e] rounded-lg flex items-center justify-center text-slate-900 font-bold shadow-md">
                1
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Share Your Goals</h3>
                <p className="text-slate-600 leading-relaxed">
                  Answer a few questions about your financial situation and what you want to achieve.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#e5b94e] rounded-lg flex items-center justify-center text-slate-900 font-bold shadow-md">
                2
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Meet Your Advisor</h3>
                <p className="text-slate-600 leading-relaxed">
                  We connect you with a fiduciary advisor who specializes in your specific needs.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#e5b94e] rounded-lg flex items-center justify-center text-slate-900 font-bold shadow-md">
                3
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Get Your Plan</h3>
                <p className="text-slate-600 leading-relaxed">
                  Receive a personalized financial plan and consultation — completely free.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-14">
            <Link href="/plan" className="inline-flex items-center gap-3 bg-[#e5b94e] text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d4a93d] transition-all shadow-md">
              Get Started Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#1e3a5f] font-semibold mb-3 tracking-wide uppercase text-sm">Our Commitment</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're committed to connecting you with the right financial guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fiduciary Standard</h3>
              <p className="text-slate-600 leading-relaxed">
                Every advisor in our network is legally bound to act in your best interest — not theirs. That's the fiduciary difference.
              </p>
            </div>

            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Completely Free</h3>
              <p className="text-slate-600 leading-relaxed">
                Your consultation and financial plan cost you nothing. We're compensated by our advisor network, never by you.
              </p>
            </div>

            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Private & Secure</h3>
              <p className="text-slate-600 leading-relaxed">
                Your information is never sold. We only share what's necessary with your chosen advisor — nothing more.
              </p>
            </div>

            <div className="bg-[#faf9f7] rounded-2xl p-8 border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Response</h3>
              <p className="text-slate-600 leading-relaxed">
                Your advisor will reach out within 24 hours to schedule your complimentary consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#1e3a5f]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for your complimentary<br />financial plan?
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Takes less than 2 minutes. No cost, no obligation.
          </p>
          <Link href="/plan" className="inline-flex items-center gap-3 bg-[#e5b94e] text-slate-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-[#d4a93d] transition-all shadow-lg">
            Get My Free Plan
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Image src="/logo.png" alt="AssetPlanly" width={140} height={34} className="h-8 w-auto brightness-0 invert opacity-60" />
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
