import { Link } from "react-router-dom";
import PageLayout from "./PageLayout";

export default function PrivacyPolicy() {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle="2AI Conference — how we handle your information"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-10 text-gray-700 text-sm md:text-base leading-relaxed space-y-6">
        <p>
          This policy describes how the 2AI Conference website (2ai-conference.org and related university pages)
          collects and uses personal data when you browse or register for the event.
        </p>

        <section>
          <h2 className="text-lg font-bold text-[#1a56db] mb-2">1. Data we collect</h2>
          <p>
            Registration requires details such as your name, affiliation, contact information, and (for authors)
            paper-related fields. Technical data (e.g. browser type, approximate region) may be processed when you use
            optional analytics cookies, only if you consent via our cookie banner.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a56db] mb-2">2. Purposes and legal bases</h2>
          <p>
            We process registration data to administer the conference, issue tickets, and communicate about the
            event. Necessary cookies support login sessions and saved form drafts. Optional analytics help us improve
            the site if you opt in.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a56db] mb-2">3. Retention</h2>
          <p>
            Registration records are kept for as long as needed for the conference and applicable university and legal
            requirements. Cookie consent choices are stored locally in your browser until you clear them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a56db] mb-2">4. Sharing</h2>
          <p>
            We do not sell your data. Payment processing is handled by our payment gateway; we do not store full card or
            UPI credentials on our servers. We may share data with service providers strictly for hosting, email, or
            event operations, or when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a56db] mb-2">5. Your rights</h2>
          <p>
            Depending on applicable law, you may have rights to access, correct, delete, or restrict processing of your
            personal data, or to object to certain processing. Contact us via the{" "}
            <Link to="/contact" className="text-[#1a56db] font-semibold underline">
              help desk
            </Link>{" "}
            for requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a56db] mb-2">6. Cookies</h2>
          <p>
            You can change optional cookie categories at any time by clearing site data and revisiting the site to see
            the banner again, or through browser settings. See also our{" "}
            <Link to="/rules-and-policies" className="text-[#1a56db] font-semibold underline">
              conference rules &amp; policies
            </Link>
            .
          </p>
        </section>

        <p className="text-xs text-gray-500 pt-4 border-t border-gray-100">
          Last updated for the 2026 conference cycle. For legal questions, contact the organizing institution.
        </p>
      </div>
    </PageLayout>
  );
}
