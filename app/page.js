import Link from "next/link";

export default function AdvisorSalesPage() {
  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      {/* Simple header */}
      <header className="py-8 px-6 md:px-12 lg:px-24">
        <Link href="/" className="text-xl font-medium text-[var(--near-black)]">
          AssetPlanly
        </Link>
      </header>

      {/* Main content */}
      <main className="px-6 md:px-12 lg:px-24 max-w-3xl pb-24">

        {/* Hero */}
        <section className="mb-20">
          <h1 className="text-4xl md:text-5xl mb-8 text-[var(--near-black)]">
            We send you leads that no other advisor will ever see.
          </h1>
          <p className="text-[var(--mid-gray)] mb-8">
            That&apos;s the whole thing. When someone comes through our platform looking for a wealth advisor, we match them with one person. Not five. Not whoever pays the most. One. And that person sees your name, your background, your approach—before they ever get on the phone. We&apos;re not a lead marketplace. We&apos;re a matching service that happens to be small enough to actually work.
          </p>
          <Link href="/book" className="btn-primary inline-block">
            Book a Call
          </Link>
        </section>

        {/* The Model */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl mb-6 text-[var(--near-black)]">
            Here&apos;s what we do differently and why it matters.
          </h2>
          <p className="text-[var(--mid-gray)] mb-6">
            Most lead platforms make money by selling the same lead to multiple advisors. That&apos;s the business model—volume on both sides, quality be damned. You&apos;re paying to compete, not to connect.
          </p>
          <p className="text-[var(--mid-gray)] mb-6">
            We flipped it. We work with a smaller group of advisors and a smaller pool of leads, and we match them intentionally. When a prospect comes in, we look at what they need and who on our roster is the best fit. Then we send them to that one advisor with a warm introduction and context about why we think it&apos;s a match.
          </p>
          <p className="text-[var(--mid-gray)] mb-6">
            The prospect already knows who you are when you call. They picked you. That&apos;s a different conversation than cold-dialing someone who requested a generic callback.
          </p>
          <p className="text-[var(--mid-gray)]">
            And because we&apos;re not trying to serve thousands of advisors, we can actually pay attention. We know your practice. We know what kind of clients you&apos;re looking for. We&apos;re not just dumping leads into a queue and hoping something sticks.
          </p>
        </section>

        {/* Exclusivity */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl mb-6 text-[var(--near-black)]">
            When we say exclusive, we mean it in the simplest possible way.
          </h2>
          <p className="text-[var(--mid-gray)] mb-6">
            The lead goes to you. Only you. We don&apos;t sell it again tomorrow. We don&apos;t have a &quot;standard&quot; tier where it&apos;s shared and a &quot;premium&quot; tier where it&apos;s exclusive. There&apos;s no tier. Every single lead on this platform goes to one advisor, and that&apos;s how it works whether you&apos;re paying us a little or a lot.
          </p>
          <p className="text-[var(--mid-gray)]">
            We also don&apos;t put our brand in front of yours. The prospect sees your name, your credentials, your photo. They&apos;re not &quot;requesting an advisor&quot;—they&apos;re choosing to talk to you specifically. By the time you pick up the phone, the relationship has already started.
          </p>
        </section>

        {/* Control */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl mb-6 text-[var(--near-black)]">
            Turn your leads on when you want them. Turn them off when you don&apos;t.
          </h2>
          <p className="text-[var(--mid-gray)] mb-6">
            Going on vacation? Slammed with client work? Just closed a big account and need to catch your breath? You control the flow. Pause leads whenever you need to, turn them back on when you&apos;re ready. No penalties, no questions, no awkward conversations with an account manager trying to hit quota.
          </p>
          <p className="text-[var(--mid-gray)] mb-6">
            This isn&apos;t a firehose you can&apos;t shut off. It&apos;s a faucet you control completely.
          </p>
          <p className="text-[var(--mid-gray)]">
            And when leads do come in, they land in a CRM we built specifically for this. Nothing bloated, nothing complicated—just a clean system to track your prospects, see where each conversation stands, and make sure nothing falls through the cracks. It&apos;s included. You don&apos;t need to duct-tape leads into some other system or pay for another tool.
          </p>
        </section>

        {/* Who We Work With */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl mb-6 text-[var(--near-black)]">
            We don&apos;t accept every advisor who applies, and here&apos;s why.
          </h2>
          <p className="text-[var(--mid-gray)] mb-6">
            The math only works if we keep the ratio tight. More advisors means either fewer leads per person or pressure to grow lead volume in ways that sacrifice quality. We&apos;d rather have forty advisors who are all getting good leads than four hundred fighting over scraps.
          </p>
          <p className="text-[var(--mid-gray)] mb-6">
            So we&apos;re selective. We want advisors who actually follow up—not because we&apos;re being precious about it, but because it&apos;s a waste of everyone&apos;s time and money if a qualified lead sits in your inbox for a week. We want advisors who care about the client relationship, not just the close. And honestly, we want people we like working with. This is a small operation. We talk to our advisors. We&apos;re building something together.
          </p>
          <p className="text-[var(--mid-gray)]">
            If that sounds like more commitment than you&apos;re looking for, no hard feelings. There are plenty of platforms that will sell you leads with no questions asked. We&apos;re just not one of them.
          </p>
        </section>

        {/* Honest Stuff */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl mb-6 text-[var(--near-black)]">
            A few things we should be upfront about.
          </h2>
          <p className="text-[var(--mid-gray)] mb-6">
            We&apos;re newer. We don&apos;t have a testimonials page full of headshots and quotes about how we changed someone&apos;s life. We&apos;re building a track record one advisor at a time, and if you need a wall of social proof before you&apos;ll consider something, that&apos;s fair—come back in a year.
          </p>
          <p className="text-[var(--mid-gray)] mb-6">
            We&apos;re also not the cheapest option. We can&apos;t be. Exclusivity and curation take more work than blasting leads to whoever&apos;s willing to pay. If you&apos;re optimizing purely for cost-per-lead, the numbers won&apos;t look as good on paper. They tend to look better when you calculate cost-per-client-acquired, but that takes trust we haven&apos;t earned yet.
          </p>
          <p className="text-[var(--mid-gray)]">
            What we can tell you is that we give a damn about this working. Our business only grows if advisors are actually closing and want to keep working with us. We don&apos;t have the luxury of churn. We need you to succeed.
          </p>
        </section>

        {/* The Call */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl mb-6 text-[var(--near-black)]">
            If you&apos;re interested, let&apos;s just talk.
          </h2>
          <p className="text-[var(--mid-gray)] mb-6">
            We do a fifteen-minute call. You tell us about your practice—who you work with, what you&apos;re looking for, how you like to grow. We&apos;ll explain exactly how our matching works, what leads cost, and what the onboarding looks like.
          </p>
          <p className="text-[var(--mid-gray)] mb-8">
            If it seems like a fit, we&apos;ll get you set up. If it doesn&apos;t, we&apos;ll tell you honestly and that&apos;ll be that. No pressure, no follow-up sequence, no sales tactics. Just a conversation to see if this makes sense for both of us.
          </p>
          <div className="mb-4">
            <Link href="/book" className="btn-primary inline-block">
              Book a Call
            </Link>
          </div>
          <p className="text-sm text-[var(--mid-gray)]">
            We&apos;ll ask you some questions too. That&apos;s how we figure out if this is the right fit.
          </p>
        </section>

        {/* Closing */}
        <section className="border-t border-[var(--light-gray)] pt-12">
          <p className="text-[var(--mid-gray)]">
            We started this because the way lead generation works for financial advisors has been broken for a long time, and it felt like nobody was willing to do it differently because the broken version is more profitable. We&apos;re betting that doing it right can be profitable too. So far, we&apos;re proving that out. We&apos;d like to keep proving it with advisors who want to be part of something better.
          </p>
        </section>

      </main>

      {/* Simple footer */}
      <footer className="px-6 md:px-12 lg:px-24 py-12 border-t border-[var(--light-gray)]">
        <div className="max-w-3xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="text-sm text-[var(--mid-gray)]">
              &copy; 2026 AssetPlanly
            </p>
            <div className="flex gap-6 text-sm text-[var(--mid-gray)]">
              <Link href="/privacy" className="hover:text-[var(--near-black)] transition">Privacy</Link>
              <Link href="/terms" className="hover:text-[var(--near-black)] transition">Terms</Link>
              <Link href="/login" className="hover:text-[var(--near-black)] transition">Advisor Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
