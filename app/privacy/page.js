import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-8">Privacy Policy</h1>
        <p className="text-sm text-[var(--gray-500)] mb-8">Last updated: January 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-[var(--gray-700)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">1. Information We Collect</h2>
            <p>AssetPlanly ("we", "our", or "us") collects information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Company or firm name</li>
              <li>Professional credentials (such as CRD numbers)</li>
              <li>Scheduling preferences and communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Connect financial advisors with qualified leads</li>
              <li>Schedule and manage consultations</li>
              <li>Send you updates and marketing communications</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">3. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Financial advisors in our network (for lead matching purposes)</li>
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">5. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Analyze website traffic and usage patterns</li>
              <li>Track marketing campaign effectiveness</li>
              <li>Improve user experience</li>
            </ul>
            <p className="mt-2">We use Facebook Pixel and similar tools to measure advertising effectiveness.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mt-8 mb-4">7. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
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
