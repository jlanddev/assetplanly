'use client';

import Link from "next/link";
import Image from "next/image";

export default function AdvisorSalesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-[var(--gray-900)]">
              AssetPlanly
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-[var(--gray-600)] hover:text-[var(--gray-900)] transition text-sm">How It Works</a>
              <a href="#platform" className="text-[var(--gray-600)] hover:text-[var(--gray-900)] transition text-sm">Platform</a>
              <Link href="/login" className="text-[var(--gray-600)] hover:text-[var(--gray-900)] transition text-sm">Login</Link>
              <Link href="/book" className="btn-primary">Book a Call</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-[var(--blue-50)] to-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--gray-900)] leading-tight mb-6">
                We send you leads that no other advisor will ever see.
              </h1>

              <p className="text-lg text-[var(--gray-600)] mb-8 leading-relaxed">
                That&apos;s the whole thing. When someone comes through our platform looking for a wealth advisor, we match them with one person. Not five. Not whoever pays the most. One. We&apos;re not a lead marketplace. We&apos;re a matching service that happens to be small enough to actually work.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/book" className="btn-primary">
                  Book a Call
                </Link>
                <a href="#how-it-works" className="btn-secondary">
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/mascot.png"
                alt="AssetPlanly Mascot"
                width={320}
                height={320}
                className="drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
            Here&apos;s what we do differently and why it matters.
          </h2>

          <div className="space-y-6 text-[var(--gray-600)]">
            <p>
              Most lead platforms make money by selling the same lead to multiple advisors. That&apos;s the business model—volume on both sides, quality be damned. You&apos;re paying to compete, not to connect.
            </p>
            <p>
              We flipped it. We work with a smaller group of advisors and a smaller pool of leads, and we match them intentionally. When a prospect comes in, we look at what they need and who on our roster is the best fit. Then we send them to that one advisor with a warm introduction and context about why we think it&apos;s a match.
            </p>
          </div>

          <div className="mt-10 p-6 bg-[var(--blue-50)] rounded-lg border border-[var(--blue-100)]">
            <p className="text-[var(--gray-700)] text-lg">
              The prospect already knows who you are when you call. They picked you. That&apos;s a different conversation than cold-dialing someone who requested a generic callback.
            </p>
          </div>

          <p className="mt-8 text-[var(--gray-600)]">
            And because we&apos;re not trying to serve thousands of advisors, we can actually pay attention. We know your practice. We know what kind of clients you&apos;re looking for. We&apos;re not just dumping leads into a queue and hoping something sticks.
          </p>
        </div>
      </section>

      {/* Exclusivity */}
      <section className="py-20 px-6 bg-[var(--gray-50)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
            When we say exclusive, we mean it in the simplest possible way.
          </h2>

          <div className="space-y-6 text-[var(--gray-600)]">
            <p>
              The lead goes to you. Only you. We don&apos;t sell it again tomorrow. We don&apos;t have a &quot;standard&quot; tier where it&apos;s shared and a &quot;premium&quot; tier where it&apos;s exclusive. There&apos;s no tier. Every single lead on this platform goes to one advisor, and that&apos;s how it works whether you&apos;re paying us a little or a lot.
            </p>
            <p>
              We also don&apos;t put our brand in front of yours. The prospect sees your name, your credentials, your photo. They&apos;re not &quot;requesting an advisor&quot;—they&apos;re choosing to talk to you specifically. By the time you pick up the phone, the relationship has already started.
            </p>
          </div>
        </div>
      </section>

      {/* Platform / Control */}
      <section id="platform" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
            Control lead flow. Scale your team.
          </h2>

          <div className="space-y-6 text-[var(--gray-600)]">
            <p>
              Set exactly how many leads you want per day. Route them to specific team members. Round-robin, weighted distribution, or manual assignment—whatever works for your practice.
            </p>
            <p>
              Hiring more advisors? Scale your lead volume up with a click. No renegotiations, no new contracts. Need to pause? Turn leads off whenever you want, turn them back on when you&apos;re ready. No penalties, no questions.
            </p>
          </div>

          {/* Simple feature list */}
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {[
              "Set daily lead volume",
              "Route to team members",
              "Pause anytime",
              "Scale instantly",
              "Built-in CRM included",
              "Track every conversation"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[var(--gray-50)] rounded-lg">
                <svg className="w-5 h-5 text-[var(--green-600)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--gray-700)]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 px-6 bg-[var(--gray-50)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
            We don&apos;t accept every advisor who applies.
          </h2>

          <div className="space-y-6 text-[var(--gray-600)]">
            <p>
              The math only works if we keep the ratio tight. More advisors means either fewer leads per person or pressure to grow lead volume in ways that sacrifice quality. We&apos;d rather have forty advisors who are all getting good leads than four hundred fighting over scraps.
            </p>
            <p>
              So we&apos;re selective. We want advisors who actually follow up—not because we&apos;re being precious about it, but because it&apos;s a waste of everyone&apos;s time and money if a qualified lead sits in your inbox for a week. We want advisors who care about the client relationship, not just the close. And honestly, we want people we like working with. This is a small operation. We talk to our advisors. We&apos;re building something together.
            </p>
            <p className="text-[var(--gray-500)]">
              If that sounds like more commitment than you&apos;re looking for, no hard feelings. There are plenty of platforms that will sell you leads with no questions asked. We&apos;re just not one of them.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Stuff */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
            A few things we should be upfront about.
          </h2>

          <div className="space-y-6 text-[var(--gray-600)]">
            <p>
              We&apos;re newer. We don&apos;t have a testimonials page full of headshots and quotes about how we changed someone&apos;s life. We&apos;re building a track record one advisor at a time, and if you need a wall of social proof before you&apos;ll consider something, that&apos;s fair—come back in a year.
            </p>
            <p>
              We&apos;re also not the cheapest option. We can&apos;t be. Exclusivity and curation take more work than blasting leads to whoever&apos;s willing to pay. If you&apos;re optimizing purely for cost-per-lead, the numbers won&apos;t look as good on paper. They tend to look better when you calculate cost-per-client-acquired, but that takes trust we haven&apos;t earned yet.
            </p>
            <p className="font-medium text-[var(--gray-800)]">
              What we can tell you is that we give a damn about this working. Our business only grows if advisors are actually closing and want to keep working with us. We don&apos;t have the luxury of churn. We need you to succeed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[var(--blue-50)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-[var(--gray-900)] mb-4">
            If you&apos;re interested, let&apos;s just talk.
          </h2>

          <p className="text-[var(--gray-600)] mb-6">
            We do a fifteen-minute call. You tell us about your practice—who you work with, what you&apos;re looking for, how you like to grow. We&apos;ll explain exactly how our matching works, what leads cost, and what the onboarding looks like.
          </p>

          <p className="text-[var(--gray-600)] mb-8">
            If it seems like a fit, we&apos;ll get you set up. If it doesn&apos;t, we&apos;ll tell you honestly and that&apos;ll be that. No pressure, no follow-up sequence, no sales tactics. Just a conversation to see if this makes sense for both of us.
          </p>

          <Link href="/book" className="btn-primary inline-block">
            Book a Call
          </Link>

          <p className="text-sm text-[var(--gray-500)] mt-4">
            We&apos;ll ask you some questions too. That&apos;s how we figure out if this is the right fit.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 px-6 border-t border-[var(--gray-200)]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--gray-500)] text-center">
            We started this because the way lead generation works for financial advisors has been broken for a long time, and it felt like nobody was willing to do it differently because the broken version is more profitable. We&apos;re betting that doing it right can be profitable too. So far, we&apos;re proving that out. We&apos;d like to keep proving it with advisors who want to be part of something better.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[var(--gray-50)] border-t border-[var(--gray-200)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--gray-500)]">
            &copy; 2026 AssetPlanly
          </p>
          <div className="flex gap-6 text-sm text-[var(--gray-500)]">
            <Link href="/privacy" className="hover:text-[var(--gray-700)] transition">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--gray-700)] transition">Terms</Link>
            <Link href="/login" className="hover:text-[var(--gray-700)] transition">Advisor Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
