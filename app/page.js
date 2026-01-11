'use client';

import Image from "next/image";
import Link from "next/link";

export default function AdvisorSalesPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navy)]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Image src="/logo.png" alt="AssetPlanly" width={300} height={80} className="h-20 w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
              <a href="#exclusivity" className="text-gray-300 hover:text-white transition">Exclusivity</a>
              <a href="#control" className="text-gray-300 hover:text-white transition">Control</a>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link href="/book" className="btn-primary text-sm py-2 px-4">Book a Call</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              We send you leads that{" "}
              <span className="text-[var(--green)]">no other advisor will ever see.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              That&apos;s the whole thing. When someone comes through our platform looking for a wealth advisor, we match them with one person. Not five. Not whoever pays the most. One. We&apos;re not a lead marketplace. We&apos;re a matching service that happens to be small enough to actually work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary text-lg px-8 py-4">
                Book a Call
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-6">
              Here&apos;s what we do differently and why it matters.
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-[var(--navy)] mb-4">The Old Way</h3>
                <p className="text-gray-600">
                  Most lead platforms make money by selling the same lead to multiple advisors. That&apos;s the business model—volume on both sides, quality be damned. You&apos;re paying to compete, not to connect.
                </p>
              </div>
              <div className="bg-[var(--green)]/10 rounded-xl p-8 border-2 border-[var(--green)]">
                <h3 className="text-xl font-semibold text-[var(--navy)] mb-4">Our Way</h3>
                <p className="text-gray-600">
                  We work with a smaller group of advisors and a smaller pool of leads, and we match them intentionally. When a prospect comes in, we look at what they need and who on our roster is the best fit. Then we send them to that one advisor.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-[var(--navy)] rounded-xl p-8 text-center">
              <p className="text-xl text-gray-300">
                The prospect already knows who you are when you call. They picked you. That&apos;s a different conversation than cold-dialing someone who requested a generic callback.
              </p>
            </div>

            <p className="mt-8 text-gray-600 text-center max-w-2xl mx-auto">
              And because we&apos;re not trying to serve thousands of advisors, we can actually pay attention. We know your practice. We know what kind of clients you&apos;re looking for. We&apos;re not just dumping leads into a queue and hoping something sticks.
            </p>
          </div>
        </div>
      </section>

      {/* Exclusivity */}
      <section id="exclusivity" className="py-20 bg-[var(--navy)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                When we say exclusive, we mean it in the simplest possible way.
              </h2>
              <p className="text-xl text-gray-400 mb-6">
                The lead goes to you. Only you. We don&apos;t sell it again tomorrow. We don&apos;t have a &quot;standard&quot; tier where it&apos;s shared and a &quot;premium&quot; tier where it&apos;s exclusive. There&apos;s no tier.
              </p>
              <p className="text-gray-400">
                Every single lead on this platform goes to one advisor, and that&apos;s how it works whether you&apos;re paying us a little or a lot.
              </p>
            </div>

            <div className="bg-[var(--navy-light)] rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Your Brand, Front and Center</h3>
              <div className="space-y-4">
                {[
                  "The prospect sees your name",
                  "They see your credentials",
                  "They see your photo",
                  "They're choosing to talk to you specifically",
                  "By the time you pick up, the relationship has already started"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-[var(--green)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control */}
      <section id="control" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-6">
              Turn your leads on when you want them. Turn them off when you don&apos;t.
            </h2>
            <p className="text-xl text-gray-600">
              Going on vacation? Slammed with client work? Just closed a big account and need to catch your breath? You control the flow. Pause leads whenever you need to, turn them back on when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-4xl mb-4">🎛️</div>
              <h3 className="text-xl font-semibold text-[var(--navy)] mb-4">Complete Control</h3>
              <p className="text-gray-600">
                No penalties, no questions, no awkward conversations with an account manager trying to hit quota. This isn&apos;t a firehose you can&apos;t shut off. It&apos;s a faucet you control completely.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-[var(--navy)] mb-4">Built-in CRM</h3>
              <p className="text-gray-600">
                When leads come in, they land in a CRM we built specifically for this. Nothing bloated, nothing complicated—just a clean system to track your prospects. It&apos;s included. No extra tools needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-6 text-center">
              We don&apos;t accept every advisor who applies, and here&apos;s why.
            </h2>
            <p className="text-gray-600 mb-6">
              The math only works if we keep the ratio tight. More advisors means either fewer leads per person or pressure to grow lead volume in ways that sacrifice quality. We&apos;d rather have forty advisors who are all getting good leads than four hundred fighting over scraps.
            </p>
            <p className="text-gray-600 mb-6">
              So we&apos;re selective. We want advisors who actually follow up—not because we&apos;re being precious about it, but because it&apos;s a waste of everyone&apos;s time and money if a qualified lead sits in your inbox for a week. We want advisors who care about the client relationship, not just the close.
            </p>
            <p className="text-gray-600">
              If that sounds like more commitment than you&apos;re looking for, no hard feelings. There are plenty of platforms that will sell you leads with no questions asked. We&apos;re just not one of them.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Stuff */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-6 text-center">
              A few things we should be upfront about.
            </h2>

            <div className="space-y-6 text-gray-600">
              <p>
                We&apos;re newer. We don&apos;t have a testimonials page full of headshots and quotes about how we changed someone&apos;s life. We&apos;re building a track record one advisor at a time, and if you need a wall of social proof before you&apos;ll consider something, that&apos;s fair—come back in a year.
              </p>
              <p>
                We&apos;re also not the cheapest option. We can&apos;t be. Exclusivity and curation take more work than blasting leads to whoever&apos;s willing to pay. If you&apos;re optimizing purely for cost-per-lead, the numbers won&apos;t look as good on paper. They tend to look better when you calculate cost-per-client-acquired, but that takes trust we haven&apos;t earned yet.
              </p>
              <p className="font-medium text-[var(--navy)]">
                What we can tell you is that we give a damn about this working. Our business only grows if advisors are actually closing and want to keep working with us. We don&apos;t have the luxury of churn. We need you to succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--navy)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            If you&apos;re interested, let&apos;s just talk.
          </h2>
          <p className="text-xl text-gray-400 mb-4">
            We do a fifteen-minute call. You tell us about your practice—who you work with, what you&apos;re looking for, how you like to grow. We&apos;ll explain exactly how our matching works, what leads cost, and what the onboarding looks like.
          </p>
          <p className="text-gray-400 mb-8">
            If it seems like a fit, we&apos;ll get you set up. If it doesn&apos;t, we&apos;ll tell you honestly and that&apos;ll be that. No pressure, no follow-up sequence, no sales tactics.
          </p>
          <div className="flex flex-col items-center">
            <Link href="/book" className="btn-primary text-lg px-8 py-4 mb-4">
              Book a Call
            </Link>
            <p className="text-sm text-gray-500">
              We&apos;ll ask you some questions too. That&apos;s how we figure out if this is the right fit.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 bg-[var(--navy-light)] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            We started this because the way lead generation works for financial advisors has been broken for a long time, and it felt like nobody was willing to do it differently because the broken version is more profitable. We&apos;re betting that doing it right can be profitable too. So far, we&apos;re proving that out. We&apos;d like to keep proving it with advisors who want to be part of something better.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--navy)] py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <Image src="/logo.png" alt="AssetPlanly" width={200} height={50} className="h-12 w-auto" />
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/login" className="hover:text-white transition">Advisor Login</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>&copy; 2026 AssetPlanly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
