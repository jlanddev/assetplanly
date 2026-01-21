'use client';

import Link from "next/link";
import Image from "next/image";

export default function AdvisorSalesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-[#1e3a5f] text-white py-3 px-6 text-center text-sm">
        <span>Ready to grow your practice with exclusive leads? </span>
        <Link href="/book" className="underline font-semibold hover:text-orange-300">
          Book a call →
        </Link>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <Image src="/logo.png" alt="AssetPlanly" width={180} height={44} className="h-11 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-[#1e3a5f] font-medium">How It Works</a>
              <a href="#solutions" className="text-gray-600 hover:text-[#1e3a5f] font-medium">Solutions</a>
              <a href="#results" className="text-gray-600 hover:text-[#1e3a5f] font-medium">Results</a>
              <Link href="/login" className="text-gray-600 hover:text-[#1e3a5f] font-medium">Login</Link>
              <Link href="/book" className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-all">
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#f0f6ff] to-white py-16 lg:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#1e3a5f] leading-tight mb-6">
                At AssetPlanly, only ONE advisor gets the lead. Make sure it&apos;s you.
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Get matched with high-net-worth prospects looking for wealth management. 100% exclusive. Never shared.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/book" className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all inline-flex items-center justify-center gap-2">
                  Book a Call
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="#how-it-works" className="text-[#1e3a5f] px-8 py-4 rounded-full font-bold text-lg border-2 border-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-all text-center">
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-orange-400 rounded-full blur-3xl opacity-20 scale-110"></div>
              <Image
                src="/mascot.png"
                alt="AssetPlanly"
                width={400}
                height={400}
                className="relative drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-12 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f0f6ff] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-bold text-gray-900">Budget-Based Billing</div>
              <div className="text-sm text-gray-500">Control your spend</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f0f6ff] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="font-bold text-gray-900">Leads or Appointments</div>
              <div className="text-sm text-gray-500">Choose delivery format</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f0f6ff] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="font-bold text-gray-900">Pre-Qualified Prospects</div>
              <div className="text-sm text-gray-500">Vetted for investable assets</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="font-bold text-gray-900">Exclusive - Never Shared</div>
              <div className="text-sm text-gray-500">One lead, one advisor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 px-6 bg-[#1e3a5f]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white">500+</div>
              <div className="text-blue-200 text-sm mt-1">Weekly prospect inquiries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white">$2B+</div>
              <div className="text-blue-200 text-sm mt-1">Investable assets matched</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white">100%</div>
              <div className="text-blue-200 text-sm mt-1">Exclusive leads</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Solutions */}
      <section id="solutions" className="py-20 px-6 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Three Ways to Grow Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the solution that fits your practice. All leads are 100% exclusive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1e3a5f] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Generation</h3>
              <p className="text-gray-600 mb-6">
                Get access to 100% exclusive leads from prospects actively seeking wealth management. We never share your opportunities with anyone else.
              </p>
              <Link href="/book" className="text-orange-500 font-semibold hover:text-orange-600 inline-flex items-center gap-1">
                Learn more <span>→</span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1e3a5f] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Appointment Setting</h3>
              <p className="text-gray-600 mb-6">
                We schedule qualified consultations directly on your calendar. Pay only when we deliver the appointment. If we don&apos;t book, you don&apos;t pay.
              </p>
              <Link href="/book" className="text-orange-500 font-semibold hover:text-orange-600 inline-flex items-center gap-1">
                Learn more <span>→</span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1e3a5f] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Transfer</h3>
              <p className="text-gray-600 mb-6">
                Speak with prospects the moment they express interest. Our team qualifies them live and transfers the call directly to you or your team.
              </p>
              <Link href="/book" className="text-orange-500 font-semibold hover:text-orange-600 inline-flex items-center gap-1">
                Learn more <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Prospects Request Advice</h3>
              <p className="text-gray-600">
                Individuals seeking wealth management fill out our questionnaire. We verify their investable assets and financial planning needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Get Matched</h3>
              <p className="text-gray-600">
                Based on your criteria, we match the prospect exclusively to you. No other advisor sees this lead. Ever.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Close the Client</h3>
              <p className="text-gray-600">
                Connect with the prospect, conduct your consultation, and bring on a new client. They already know who you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Types */}
      <section className="py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-4">
              Prospects Looking For
            </h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              "Retirement Planning",
              "Wealth Management",
              "Estate Planning",
              "Tax Strategy",
              "401(k) Rollover",
              "Investment Advice",
              "College Savings",
              "Insurance Review",
              "Social Security",
              "Annuities",
              "Portfolio Review",
              "Financial Planning"
            ].map((service, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all">
                <div className="text-sm font-medium text-gray-700">{service}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-8">
                Why Advisors Choose AssetPlanly
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">ROI-Driven Optimization</div>
                    <div className="text-gray-600">Track your revenue and cost per acquisition. We use shared data to refine your campaigns.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Dedicated Partnership Manager</div>
                    <div className="text-gray-600">Your personal account manager monitors your results and optimizes your lead flow.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Plug-and-Play System</div>
                    <div className="text-gray-600">Manage budgets online, receive leads in your CRM, scale up or pause anytime.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">SEC/FINRA Compliant</div>
                    <div className="text-gray-600">Consent-based, compliant prospect outreach. We handle compliance so you don&apos;t have to.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e3a5f] rounded-3xl p-10">
              <div className="text-5xl text-orange-400 mb-4">&ldquo;</div>
              <p className="text-xl text-white leading-relaxed mb-6">
                We brought in $4.2 million in new AUM in the first quarter after partnering with AssetPlanly. The leads are exclusive and the prospects are actually qualified.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                <div>
                  <div className="text-white font-semibold">Partner Advisor</div>
                  <div className="text-blue-200 text-sm">Wealth Management Practice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-12 text-center">
            What Advisors Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;I was skeptical at first, but the first lead turned into a $1.2M rollover. These aren&apos;t tire-kickers — they&apos;re serious about their retirement.&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="font-semibold text-gray-900">Michael R.</div>
                <div className="text-sm text-gray-500">CFP, San Diego</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;With shared leads, I was always fourth or fifth to call. Now I&apos;m the only one calling. Closed 3 new clients in my first month.&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="font-semibold text-gray-900">Jennifer T.</div>
                <div className="text-sm text-gray-500">Wealth Advisor, Austin</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;The prospects actually pick up when I call because they requested the consultation. That alone changed my entire approach to prospecting.&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="font-semibold text-gray-900">David K.</div>
                <div className="text-sm text-gray-500">RIA, Miami</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1e3a5f]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: '#ffffff'}}>
            Ready to grow with exclusive leads?
          </h2>
          <p className="text-xl mb-10" style={{color: '#bfdbfe'}}>
            Book a 15-minute call. We&apos;ll show you how it works and see if we&apos;re a fit.
          </p>
          <Link href="/book" className="inline-block bg-orange-500 px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-600 transition-all" style={{color: '#ffffff'}}>
            Book a Call Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-xs text-gray-500 leading-relaxed">
            <p className="mb-3">
              AssetPlanly&apos;s services are limited to referring users to third-party financial advisors who have elected to participate in our matching platform based on information gathered from users. AssetPlanly receives compensation from advisors for our services. AssetPlanly does not review the ongoing performance of any advisor, participate in the management of any user&apos;s account by an advisor, or provide advice regarding specific investments.
            </p>
            <p className="mb-3">
              We do not manage client funds or hold custody of assets. We help users connect with relevant financial advisors.
            </p>
            <p>
              This is not an offer to buy or sell any security or interest. All investing involves risk, including loss of principal. Working with an advisor may come with potential downsides, such as payment of fees (which will reduce returns). Past performance is not a guarantee of future results.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              &copy; 2026 AssetPlanly. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/advisor" className="hover:text-white transition-colors">Advisor Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
