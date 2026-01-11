'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AdvisorSalesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: "500K+", label: "Monthly Visitors" },
    { value: "$250K+", label: "Avg. Lead Assets" },
    { value: "85%", label: "Contact Rate" },
    { value: "12x", label: "Average ROI" },
  ];

  const features = [
    {
      icon: "🎯",
      title: "Exclusive Leads",
      description: "Each lead is sent to a maximum of 3 advisors, ensuring less competition and higher conversion rates."
    },
    {
      icon: "⚡",
      title: "Real-Time Delivery",
      description: "Leads are delivered instantly via SMS, email, and your dashboard the moment they submit their information."
    },
    {
      icon: "🔍",
      title: "Pre-Qualified Prospects",
      description: "Every lead completes our comprehensive questionnaire covering assets, goals, and timeline."
    },
    {
      icon: "📍",
      title: "Geographic Targeting",
      description: "Choose your service areas down to the zip code level. Only pay for leads in your territory."
    },
    {
      icon: "💰",
      title: "Transparent Pricing",
      description: "No hidden fees or long-term contracts. Pay per lead with volume discounts available."
    },
    {
      icon: "📊",
      title: "Performance Dashboard",
      description: "Track your lead pipeline, conversion rates, and ROI in real-time with detailed analytics."
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Consumers Find Us",
      description: "People searching for financial guidance discover AssetPlanly through our educational content, calculators, and marketing."
    },
    {
      step: "02",
      title: "They Complete Our Questionnaire",
      description: "Prospects answer detailed questions about their financial situation, goals, investable assets, and preferences."
    },
    {
      step: "03",
      title: "We Match & Deliver",
      description: "Our algorithm matches qualified leads with advisors based on location, specialization, and availability."
    },
    {
      step: "04",
      title: "You Connect & Convert",
      description: "Receive instant notifications and reach out while the prospect is still engaged. Close more clients."
    },
  ];

  const testimonials = [
    {
      quote: "AssetPlanly has transformed my practice. The lead quality is exceptional - these are people who are genuinely ready to work with an advisor.",
      author: "Michael R.",
      title: "CFP, Wealth Management Advisor",
      location: "Dallas, TX"
    },
    {
      quote: "I was skeptical at first, but the ROI speaks for itself. I've closed over $8M in new AUM from AssetPlanly leads in just 6 months.",
      author: "Sarah K.",
      title: "Senior Financial Advisor",
      location: "Chicago, IL"
    },
    {
      quote: "The real-time delivery is a game changer. Being able to call prospects within minutes of their inquiry has dramatically improved my conversion rate.",
      author: "David L.",
      title: "Independent RIA",
      location: "Phoenix, AZ"
    },
  ];

  const faqs = [
    {
      question: "How much do leads cost?",
      answer: "Lead pricing varies based on your target market and the prospect's investable assets. Our leads typically range from $150-$400 per lead. We offer volume discounts and flexible budgets to fit practices of all sizes."
    },
    {
      question: "How are leads qualified?",
      answer: "Every prospect completes our comprehensive questionnaire covering investable assets, financial goals, timeline for working with an advisor, and preferred communication method. We verify contact information before delivery."
    },
    {
      question: "How many advisors receive each lead?",
      answer: "Each lead is shared with a maximum of 3 advisors to ensure healthy competition while maintaining quality. You can upgrade to exclusive leads for sole access to high-value prospects."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No. AssetPlanly operates on a pay-as-you-go model. Set your monthly budget, adjust anytime, and pause or cancel with no penalties."
    },
    {
      question: "What if a lead has bad contact information?",
      answer: "We stand behind our lead quality. If contact information is invalid or the prospect is completely unresponsive after multiple attempts, we'll credit your account."
    },
    {
      question: "How quickly will I receive leads?",
      answer: "Lead volume depends on your geographic area and budget. Most advisors receive their first lead within 48-72 hours of activating their account. High-demand markets may see leads within hours."
    },
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "500",
      period: "/month",
      description: "Perfect for advisors testing the platform",
      features: [
        "3-5 qualified leads/month",
        "Shared leads (max 3 advisors)",
        "Real-time SMS & email delivery",
        "Basic dashboard access",
        "Email support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Growth",
      price: "1,500",
      period: "/month",
      description: "For advisors ready to scale",
      features: [
        "10-15 qualified leads/month",
        "Priority lead matching",
        "50% exclusive leads",
        "Advanced analytics dashboard",
        "Phone & email support",
        "Lead quality guarantee"
      ],
      cta: "Start Growing",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams and high-volume practices",
      features: [
        "Unlimited lead volume",
        "100% exclusive leads",
        "Multi-advisor team support",
        "Custom integrations (CRM)",
        "Dedicated account manager",
        "White-glove onboarding"
      ],
      cta: "Contact Sales",
      popular: false
    },
  ];

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
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link href="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] pt-40 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--teal)]/10 border border-[var(--teal)]/20 mb-6">
              <span className="text-[var(--teal)] text-sm font-medium">Trusted by 2,000+ Financial Advisors</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              High-Intent Leads for{" "}
              <span className="text-[var(--teal)]">Financial Advisors</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect with qualified prospects actively seeking financial guidance.
              Pre-screened leads with verified assets, delivered in real-time to grow your practice.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Start Receiving Leads
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-[var(--teal)]">{stat.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-[var(--navy-light)] py-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            Partnered with advisors at <span className="text-white font-medium">Ameriprise</span> • <span className="text-white font-medium">Edward Jones</span> • <span className="text-white font-medium">Raymond James</span> • <span className="text-white font-medium">Independent RIAs</span> • <span className="text-white font-medium">and more</span>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">
              How AssetPlanly Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, transparent process to connect you with qualified prospects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-[var(--teal)]/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-[var(--navy)] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-1/2 h-0.5 bg-[var(--teal)]/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">
              Why Advisors Choose AssetPlanly
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to grow your practice with high-quality leads
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[var(--navy)] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Quality Section */}
      <section className="py-20 bg-[var(--navy)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Lead Quality You Can Trust
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Every AssetPlanly lead goes through our rigorous qualification process to ensure you're connecting with serious prospects.
              </p>

              <div className="space-y-4">
                {[
                  "Minimum $100K investable assets verified",
                  "Active intent to work with an advisor",
                  "Complete contact information validated",
                  "Timeline and goals clearly defined",
                  "Geographic and demographic data included"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-[var(--teal)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--navy-light)] rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Sample Lead Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Investable Assets</span>
                  <span className="text-[var(--teal)] font-semibold">$750,000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Primary Goal</span>
                  <span className="text-white">Retirement Planning</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Timeline</span>
                  <span className="text-white">Within 30 days</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Age Range</span>
                  <span className="text-white">55-64</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-400">Contact Preference</span>
                  <span className="text-white">Phone call</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No long-term contracts. No hidden fees. Adjust your budget anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  tier.popular
                    ? 'bg-[var(--navy)] text-white ring-4 ring-[var(--teal)] scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--teal)] text-white text-sm font-medium mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${tier.popular ? 'text-white' : 'text-[var(--navy)]'}`}>
                  {tier.name}
                </h3>
                <p className={`mb-4 ${tier.popular ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tier.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${tier.popular ? 'text-white' : 'text-[var(--navy)]'}`}>
                    ${tier.price}
                  </span>
                  <span className={tier.popular ? 'text-gray-400' : 'text-gray-600'}>{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[var(--teal)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={tier.popular ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
                    tier.popular
                      ? 'bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)]'
                      : 'bg-[var(--navy)] text-white hover:bg-[var(--navy-light)]'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">
              Trusted by Top Advisors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what financial professionals are saying about AssetPlanly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <div className="font-semibold text-[var(--navy)]">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                  <div className="text-sm text-gray-400">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about AssetPlanly
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-[var(--navy)]">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--navy)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Grow Your Practice?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join 2,000+ financial advisors who trust AssetPlanly to deliver qualified prospects.
            Start receiving leads within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
              Get Started Today
            </Link>
            <Link href="/find-advisor" className="btn-secondary text-lg px-8 py-4">
              I&apos;m Looking for an Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--navy-light)] py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image src="/logo.png" alt="AssetPlanly" width={280} height={70} className="h-16 w-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Connecting qualified prospects with trusted financial advisors.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Advisors</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/signup" className="hover:text-white transition">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Advisor Login</Link></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Consumers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/find-advisor" className="hover:text-white transition">Find an Advisor</Link></li>
                <li><Link href="/resources" className="hover:text-white transition">Financial Resources</Link></li>
                <li><Link href="/calculators" className="hover:text-white transition">Calculators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            <p>&copy; 2026 AssetPlanly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
