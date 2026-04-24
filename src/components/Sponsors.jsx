// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import PageLayout from "./PageLayout";
import { Sparkles } from "lucide-react";

function Sponsors() {
  return (
    <PageLayout 
      title="Sponsors"
      subtitle="Partnership opportunities for the 2026 International Conference on Applied Artificial Intelligence"
    >
      <div className="bg-white rounded shadow-sm p-12">
        <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
          <Sparkles size={64} className="text-yellow-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sponsorship Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mb-6">
            We are working on creating exciting sponsorship packages for partners,
            organizations, and companies who want to be part of our conference.
          </p>
          <div className="inline-block bg-yellow-100 border border-yellow-300 text-yellow-800 font-medium px-6 py-3 rounded shadow-sm">
            Details will be announced soon
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Sponsors;
