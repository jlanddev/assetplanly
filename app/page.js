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
              <a href="#control" className="text-[var(--slate-600)] hover:text-[var(--slate-900)] transition text-sm">Control</a>
              <Link href="/login" className="text-[var(--slate-600)] hover:text-[var(--slate-900)] transition text-sm">Login</Link>
              <Link href="/book" className="bg-[var(--slate-900)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--slate-800)] transition">
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--emerald-600)]/10 text-[var(--emerald-600)] text-sm font-medium mb-6">
            Exclusive leads for financial advisors
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--slate-900)] leading-tight mb-6">
            We send you leads that no other advisor will ever see.
          </h1>

          <p className="text-xl text-[var(--slate-600)] mb-10 max-w-2xl mx-auto leading-relaxed">
            When someone comes through our platform looking for a wealth advisor, we match them with one person. Not five. Not whoever pays the most. One.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-primary text-lg px-8 py-4">
              Book a Call
            </Link>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-[var(--slate-200)]"></div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-4">
              Here&apos;s what we do differently.
            </h2>
            <p className="text-[var(--slate-600)] text-lg">
              Most lead platforms sell the same lead to multiple advisors. You&apos;re paying to compete, not to connect. We flipped it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[var(--slate-50)] rounded-2xl p-8">
              <div className="text-sm font-medium text-[var(--slate-400)] mb-2">THE OLD WAY</div>
              <h3 className="text-xl font-semibold text-[var(--slate-900)] mb-4">Race to the bottom</h3>
              <p className="text-[var(--slate-600)]">
                Lead comes in. Gets blasted to 5+ advisors. Everyone calls at once. Prospect is overwhelmed. You&apos;re competing on speed, not fit. Conversion rates are terrible.
              </p>
            </div>
            <div className="bg-[var(--emerald-600)] rounded-2xl p-8">
              <div className="text-sm font-medium text-white/70 mb-2">OUR WAY</div>
              <h3 className="text-xl font-semibold text-white mb-4">Intentional matching</h3>
              <p className="text-white/90">
                Lead comes in. We look at what they need. We match them with one advisor. They already know your name when you call. That&apos;s a different conversation entirely.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-[var(--slate-900)] rounded-2xl">
            <p className="text-xl text-white text-center max-w-3xl mx-auto">
              &quot;The prospect already knows who you are when you call. They picked you. That&apos;s a different conversation than cold-dialing someone who requested a generic callback.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Exclusivity */}
      <section id="exclusivity" className="py-20 px-6 bg-[var(--slate-50)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-6">
                When we say exclusive, we mean it.
              </h2>
              <p className="text-[var(--slate-600)] text-lg mb-6">
                The lead goes to you. Only you. We don&apos;t sell it again tomorrow. We don&apos;t have tiers. Every single lead goes to one advisor.
              </p>
              <p className="text-[var(--slate-600)]">
                We also don&apos;t put our brand in front of yours. The prospect sees your name, your credentials, your photo. They&apos;re choosing to talk to you specifically.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "The prospect sees your name",
                "They see your credentials and background",
                "They see your photo",
                "They're choosing to talk to you specifically",
                "By the time you call, the relationship has started"
              ].map((item, index) => (
                <div key={index} className="flex items-center bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[var(--emerald-600)] flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[var(--slate-700)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Control */}
      <section id="control" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-4">
              You control the flow.
            </h2>
            <p className="text-[var(--slate-600)] text-lg">
              Going on vacation? Pause leads. Slammed with work? Turn them off. Ready for more? Turn them back on. No penalties, no questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-[var(--slate-200)] rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--slate-100)] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--slate-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--slate-900)] mb-3">Complete Control</h3>
              <p className="text-[var(--slate-600)]">
                This isn&apos;t a firehose you can&apos;t shut off. It&apos;s a faucet you control completely. No awkward conversations with account managers trying to hit quota.
              </p>
            </div>
            <div className="border border-[var(--slate-200)] rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--slate-100)] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--slate-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--slate-900)] mb-3">Built-in CRM</h3>
              <p className="text-[var(--slate-600)]">
                Leads land in a CRM we built specifically for this. Nothing bloated—just a clean system to track your prospects. It&apos;s included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 px-6 bg-[var(--slate-50)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-6">
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
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--slate-900)] mb-6">
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
      <section className="py-20 px-6 bg-[var(--slate-900)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            If you&apos;re interested, let&apos;s talk.
          </h2>
          <p className="text-[var(--slate-400)] text-lg mb-8">
            Fifteen minutes. You tell us about your practice. We explain how matching works and what leads cost. If it&apos;s a fit, we&apos;ll get you set up. If not, we&apos;ll tell you honestly.
          </p>
          <Link href="/book" className="inline-block bg-white text-[var(--slate-900)] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[var(--slate-100)] transition">
            Book a Call
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
