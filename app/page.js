'use client';

import Link from "next/link";

export default function AdvisorSalesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--slate-200)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-[var(--slate-900)]">
              AssetPlanly
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-[var(--slate-600)] hover:text-[var(--slate-900)] transition text-sm">How It Works</a>
              <a href="#exclusivity" className="text-[var(--slate-600)] hover:text-[var(--slate-900)] transition text-sm">Exclusivity</a>
              <a href="#platform" className="text-[var(--slate-600)] hover:text-[var(--slate-900)] transition text-sm">Platform</a>
              <Link href="/login" className="text-[var(--slate-600)] hover:text-[var(--slate-900)] transition text-sm">Login</Link>
              <Link href="/book" className="bg-[var(--slate-900)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--slate-800)] transition">
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--slate-50)] via-white to-[var(--emerald-600)]/5 -z-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-40 right-10 w-72 h-72 bg-[var(--emerald-600)]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--slate-200)]/50 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--emerald-600)]/10 text-[var(--emerald-600)] text-sm font-medium mb-8 border border-[var(--emerald-600)]/20">
            <span className="w-2 h-2 bg-[var(--emerald-600)] rounded-full mr-2 animate-pulse"></span>
            Exclusive leads for financial advisors
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--slate-900)] leading-tight mb-6">
            We send you leads that no other advisor will ever see.
          </h1>

          <p className="text-xl text-[var(--slate-600)] mb-10 max-w-2xl mx-auto leading-relaxed">
            When someone comes through our platform looking for a wealth advisor, we match them with one person. Not five. Not whoever pays the most. One.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/book" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
              Book a Call
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-[var(--slate-200)]">
            <div>
              <div className="text-3xl font-bold text-[var(--slate-900)]">100%</div>
              <div className="text-sm text-[var(--slate-500)]">Exclusive leads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--slate-900)]">1:1</div>
              <div className="text-sm text-[var(--slate-500)]">Advisor matching</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--slate-900)]">24hr</div>
              <div className="text-sm text-[var(--slate-500)]">Average delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div className="max-w-xl">
              <div className="text-sm font-medium text-[var(--emerald-600)] mb-3">HOW IT WORKS</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-4">
                Here&apos;s what we do differently.
              </h2>
              <p className="text-[var(--slate-600)] text-lg">
                Most lead platforms sell the same lead to multiple advisors. You&apos;re paying to compete. We flipped it.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[var(--slate-50)] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--slate-200)] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              <div className="relative">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium mb-4">
                  THE OLD WAY
                </div>
                <h3 className="text-xl font-semibold text-[var(--slate-900)] mb-4">Race to the bottom</h3>
                <p className="text-[var(--slate-600)] mb-6">
                  Lead comes in. Gets blasted to 5+ advisors. Everyone calls at once. Prospect is overwhelmed. You&apos;re competing on speed, not fit.
                </p>
                <div className="flex items-center gap-3 text-[var(--slate-400)]">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-[var(--slate-300)] border-2 border-[var(--slate-50)] flex items-center justify-center text-xs">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm">5+ advisors per lead</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--emerald-600)] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--emerald-500)] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              <div className="relative">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4">
                  OUR WAY
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Intentional matching</h3>
                <p className="text-white/90 mb-6">
                  Lead comes in. We look at what they need. We match them with one advisor. They already know your name when you call.
                </p>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">1 advisor per lead</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[var(--slate-900)] rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--emerald-600)]/20 to-transparent"></div>
            <p className="text-xl text-white text-center max-w-3xl mx-auto relative">
              &quot;The prospect already knows who you are when you call. They picked you. That&apos;s a different conversation than cold-dialing someone who requested a generic callback.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Exclusivity */}
      <section id="exclusivity" className="py-24 px-6 bg-[var(--slate-50)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm font-medium text-[var(--emerald-600)] mb-3">EXCLUSIVITY</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-6">
                When we say exclusive, we mean it.
              </h2>
              <p className="text-[var(--slate-600)] text-lg mb-6">
                The lead goes to you. Only you. We don&apos;t sell it again tomorrow. We don&apos;t have tiers. Every single lead goes to one advisor.
              </p>
              <p className="text-[var(--slate-600)] mb-8">
                We also don&apos;t put our brand in front of yours. The prospect sees your name, your credentials, your photo. They&apos;re choosing to talk to you specifically.
              </p>
              <Link href="/book" className="inline-flex items-center text-[var(--emerald-600)] font-medium hover:underline">
                Learn more about our matching
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { text: "The prospect sees your name", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { text: "They see your credentials and background", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { text: "They see your photo", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { text: "They're choosing to talk to you specifically", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
                { text: "By the time you call, the relationship has started", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
              ].map((item, index) => (
                <div key={index} className="flex items-center bg-white rounded-xl p-5 shadow-sm border border-[var(--slate-100)] hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-[var(--emerald-600)]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-[var(--emerald-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-[var(--slate-700)] font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform / Control */}
      <section id="platform" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-medium text-[var(--emerald-600)] mb-3">PLATFORM</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-4">
              Control lead flow. Scale your team.
            </h2>
            <p className="text-[var(--slate-600)] text-lg max-w-2xl mx-auto">
              Set exactly how many leads you want per day, route them to specific team members, and scale up or down with a click.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-[var(--slate-200)] rounded-2xl p-6 hover:shadow-lg hover:border-[var(--emerald-600)]/30 transition">
              <div className="w-12 h-12 rounded-xl bg-[var(--emerald-600)]/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[var(--emerald-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--slate-900)] mb-2">Set Daily Volume</h3>
              <p className="text-[var(--slate-600)] text-sm">
                Choose exactly how many leads you want per day. Need 5 on Monday and 10 on Friday? Done. Adjust anytime.
              </p>
            </div>

            <div className="bg-white border border-[var(--slate-200)] rounded-2xl p-6 hover:shadow-lg hover:border-[var(--emerald-600)]/30 transition">
              <div className="w-12 h-12 rounded-xl bg-[var(--emerald-600)]/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[var(--emerald-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--slate-900)] mb-2">Route to Team Members</h3>
              <p className="text-[var(--slate-600)] text-sm">
                Assign leads to specific advisors on your team. Round-robin, weighted distribution, or manual assignment.
              </p>
            </div>

            <div className="bg-white border border-[var(--slate-200)] rounded-2xl p-6 hover:shadow-lg hover:border-[var(--emerald-600)]/30 transition">
              <div className="w-12 h-12 rounded-xl bg-[var(--emerald-600)]/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[var(--emerald-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--slate-900)] mb-2">Scale Instantly</h3>
              <p className="text-[var(--slate-600)] text-sm">
                Hiring more advisors? Scale your lead volume up with a click. No renegotiations, no new contracts.
              </p>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="bg-[var(--slate-900)] rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--emerald-600)]/10 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Lead Distribution Dashboard</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-white/60 text-xs mb-1">TODAY&apos;S LEADS</div>
                  <div className="text-2xl font-bold text-white">12</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-white/60 text-xs mb-1">TEAM MEMBERS</div>
                  <div className="text-2xl font-bold text-white">4</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-white/60 text-xs mb-1">AVG RESPONSE</div>
                  <div className="text-2xl font-bold text-white">8min</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Sarah M.", leads: 4, status: "active" },
                  { name: "James K.", leads: 3, status: "active" },
                  { name: "Michael R.", leads: 3, status: "active" },
                  { name: "Lisa T.", leads: 2, status: "paused" }
                ].map((member, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--emerald-600)]/30 flex items-center justify-center text-white text-sm font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{member.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/60 text-sm">{member.leads} leads today</span>
                      <div className={`px-2 py-1 rounded text-xs ${member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {member.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CRM mention */}
          <div className="mt-8 flex items-center justify-center gap-3 text-[var(--slate-500)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>Built-in CRM included — track every lead from first touch to close</span>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-24 px-6 bg-[var(--slate-50)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-sm font-medium text-[var(--emerald-600)] mb-3 text-center">WHO WE WORK WITH</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-8 text-center">
            We don&apos;t accept every advisor.
          </h2>
          <div className="space-y-6 text-[var(--slate-600)] text-lg">
            <p>
              The math only works if we keep the ratio tight. More advisors means fewer leads per person or pressure to sacrifice quality. We&apos;d rather have forty advisors getting good leads than four hundred fighting over scraps.
            </p>
            <p>
              We want advisors who actually follow up. Who care about the client relationship, not just the close. And honestly, people we like working with. This is a small operation.
            </p>
            <p className="text-[var(--slate-400)]">
              If that sounds like more commitment than you&apos;re looking for, no hard feelings. There are plenty of platforms that sell leads with no questions asked. We&apos;re just not one of them.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Stuff */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-sm font-medium text-[var(--emerald-600)] mb-3 text-center">TRANSPARENCY</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-8 text-center">
            A few things we should be upfront about.
          </h2>
          <div className="space-y-6 text-[var(--slate-600)] text-lg">
            <p>
              We&apos;re newer. We don&apos;t have a testimonials page full of headshots. We&apos;re building a track record one advisor at a time. If you need a wall of social proof, come back in a year.
            </p>
            <p>
              We&apos;re also not the cheapest option. Exclusivity and curation take more work. If you&apos;re optimizing purely for cost-per-lead, the numbers won&apos;t look as good on paper.
            </p>
            <p className="font-medium text-[var(--slate-900)]">
              What we can tell you is that we give a damn about this working. Our business only grows if you&apos;re closing and want to keep working with us. We need you to succeed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[var(--slate-900)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--emerald-600)]/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--emerald-600)]/10 rounded-full blur-3xl"></div>

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            If you&apos;re interested, let&apos;s talk.
          </h2>
          <p className="text-[var(--slate-400)] text-lg mb-8">
            Fifteen minutes. You tell us about your practice. We explain how matching works and what leads cost. If it&apos;s a fit, we&apos;ll get you set up. If not, we&apos;ll tell you honestly.
          </p>
          <Link href="/book" className="inline-flex items-center gap-2 bg-white text-[var(--slate-900)] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[var(--slate-100)] transition">
            Book a Call
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-[var(--slate-600)] text-sm mt-4">
            No pressure. No follow-up sequence. Just a conversation.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 px-6 border-t border-[var(--slate-200)]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--slate-500)] text-center">
            We started this because lead generation for financial advisors has been broken for a long time. We&apos;re betting that doing it right can be profitable too. We&apos;d like to prove it with advisors who want to be part of something better.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--slate-200)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--slate-400)]">
            &copy; 2026 AssetPlanly
          </p>
          <div className="flex gap-6 text-sm text-[var(--slate-400)]">
            <Link href="/privacy" className="hover:text-[var(--slate-600)] transition">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--slate-600)] transition">Terms</Link>
            <Link href="/login" className="hover:text-[var(--slate-600)] transition">Advisor Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
