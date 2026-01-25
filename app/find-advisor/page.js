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
      <section className="relative bg-white overflow-hidden pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center min-h-[500px] lg:min-h-[550px] py-12">
            {/* Content */}
            <div className="max-w-xl relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.08] mb-6">
                You're in the right place for{' '}
                <span className="text-[#1e3a5f]">expert financial advice</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Getting started is easy and complimentary.
              </p>

              <Link href="/plan" className="inline-block bg-[#e5b94e] text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#d4a93d] transition-all">
                Find my advisor
              </Link>
            </div>

            {/* Couple line drawing - large, fading on edges */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] hidden lg:flex items-center justify-end pointer-events-none">
              <img
                src="/couple-line-drawing.png"
                alt="Couple reviewing financial plans"
                className="w-full max-w-lg opacity-90"
                style={{
                  maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Paper airplane trail - spans from header down to next section */}
        <div
          className="absolute right-24 top-0 bottom-0 hidden lg:block z-10 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
          }}
        >
          <img
            src="/paper-airplane.png"
            alt=""
            className="h-full w-auto object-contain object-bottom"
            style={{ transform: 'scaleY(-1)' }}
          />
        </div>

        {/* Mobile illustration */}
        <div className="lg:hidden flex justify-center pb-8">
          <img
            src="/couple-line-drawing.png"
            alt="Couple reviewing financial plans"
            className="h-64 object-contain opacity-80"
          />
        </div>
      </section>

      {/* As featured in - flows from hero */}
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

      {/* How It Works - Split layout */}
      <section id="how-it-works" className="grid lg:grid-cols-2">
        {/* Image side */}
        <div className="bg-[#f5f3ef] min-h-[500px] lg:min-h-[600px] flex items-center justify-center p-12">
          {/* Navy rectangular frame */}
          <div className="border-4 border-[#1e3a5f] p-6 bg-white">
            <img
              src="/advisor-meeting.png"
              alt="Couple meeting with financial advisor"
              className="w-full max-w-sm object-contain"
            />
          </div>
        </div>

        {/* Content side */}
        <div className="bg-[#f5f3ef] px-8 lg:px-16 py-16 flex items-center relative">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">How it works</h2>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Answer a few questions</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Share some details about your financial situation. It only takes a few minutes. Your information is confidential and stored securely.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Meet your advisor</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We'll introduce you to a regulated fiduciary advisor based solely on your goals and needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Book your consultation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Arrange your first meeting at a time that suits you. Discover your financial opportunities, with no obligation to continue.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/plan" className="inline-block bg-[#e5b94e] text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-[#d4a93d] transition-all">
                Find my advisor
              </Link>
            </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Highly Qualified</h3>
              <p className="text-slate-600 leading-relaxed">
                Our advisors are carefully vetted professionals with proven track records in comprehensive financial planning.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Right Fit For You</h3>
              <p className="text-slate-600 leading-relaxed">
                We introduce you to the advisor best suited to your specific situation, goals, and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#1e3a5f]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to meet the right<br />advisor for you?
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Takes less than 2 minutes. No obligation.
          </p>
          <Link href="/plan" className="inline-flex items-center gap-3 bg-[#e5b94e] text-slate-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-[#d4a93d] transition-all shadow-lg">
            Find My Advisor
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
            <div className="text-sm">
              © 2026 AssetPlanly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
