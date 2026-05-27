export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 ease-out py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground">Last updated: May 2026</p>
      </div>
      
      <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Bengaluru Cost Explorer, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. User Contributions</h2>
          <p>
            Users can submit pricing data to our platform. By doing so, you grant us the right to use, modify, and display this data publicly. You agree not to submit false, misleading, or malicious data that could harm the integrity of the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. Free Use</h2>
          <p>
            This platform is provided entirely free of charge for the benefit of the community. We do not guarantee the accuracy, completeness, or usefulness of any information on the site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Limitation of Liability</h2>
          <p>
            In no event shall Bengaluru Cost Explorer be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service.
          </p>
        </section>
      </div>
    </div>
  );
}
