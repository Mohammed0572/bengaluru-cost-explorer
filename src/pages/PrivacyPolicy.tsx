export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 ease-out py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: May 2026</p>
      </div>
      
      <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            Bengaluru Cost Explorer is a crowdsourced platform. We collect the data you voluntarily submit regarding the cost of living (prices, items, areas). If you create an account, we may collect your email address and name to authenticate you securely via our third-party provider (Supabase).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>
            The pricing data you submit is anonymized and aggregated to display average costs to other users. Your email address and personal information are strictly used for account security and are never sold or shared with external marketing agencies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information. However, please remember that no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via the Contact page or email us directly at the provided support address.
          </p>
        </section>
      </div>
    </div>
  );
}
