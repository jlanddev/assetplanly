import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <nav className="bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/">
            <Image src="/logo.png" alt="AssetPlanly" width={160} height={36} className="h-9 w-auto" />
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-8">Terms of Service</h1>
        <p className="text-sm text-[var(--gray-500)] mb-8">Last updated: January 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-[var(--gray-700)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using AssetPlanly ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">2. Description of Service</h2>
            <p>AssetPlanly is a lead generation and matching platform that connects individuals seeking financial advisory services with qualified financial advisors. We facilitate introductions but do not provide financial advice directly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not misrepresent your identity or credentials</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">4. Financial Advisor Requirements</h2>
            <p>Financial advisors using our platform must:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Be properly licensed and registered with applicable regulatory bodies</li>
              <li>Maintain all required credentials and certifications</li>
              <li>Comply with SEC, FINRA, and state regulations</li>
              <li>Handle all leads professionally and ethically</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">5. Lead Quality and Exclusivity</h2>
            <p>While we strive to provide high-quality, exclusive leads, we do not guarantee:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>That leads will result in clients or revenue</li>
              <li>The accuracy of information provided by prospects</li>
              <li>The financial situation or suitability of any prospect</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">6. Payment Terms</h2>
            <p>Payment terms, pricing, and billing cycles will be established in separate agreements with financial advisors. All fees are non-refundable unless otherwise specified.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, AssetPlanly shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">8. Disclaimer</h2>
            <p>AssetPlanly is not a financial advisor, broker-dealer, or investment advisor. We do not provide financial, investment, legal, or tax advice. Users should consult with qualified professionals before making financial decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">9. Termination</h2>
            <p>We reserve the right to terminate or suspend access to our Service at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">10. Changes to Terms</h2>
            <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">11. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p className="mt-2">Email: support@assetplanly.com</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--gray-200)]">
          <Link href="/" className="text-[var(--blue-600)] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
