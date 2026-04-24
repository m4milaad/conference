import { Link } from "react-router-dom";
import PageLayout from "./PageLayout";
import { conferencePoliciesSections } from "../content/conferencePolicies";

function ConferenceRulesAndPolicies() {
  return (
    <PageLayout
      title="Rules & Policies"
      subtitle="Conference registration terms — please read before completing your registration"
    >
      <div className="mb-6">
        <Link
          to="/registration"
          className="text-[#1a56db] font-semibold hover:underline text-sm"
        >
          ← Back to registration
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-10 max-w-4xl mx-auto">
        <ol className="space-y-8 list-none p-0 m-0">
          {conferencePoliciesSections.map((section, i) => (
            <li key={section.title} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
              <h2 className="text-lg md:text-xl font-bold text-[#1a56db] mb-3">
                {i + 1}. {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">{section.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
        These policies apply to all registrants for the 2AI Conference. For questions, contact us via the{" "}
        <Link to="/contact" className="text-[#1a56db] hover:underline font-medium">
          help desk
        </Link>
        .
      </p>
    </PageLayout>
  );
}

export default ConferenceRulesAndPolicies;
