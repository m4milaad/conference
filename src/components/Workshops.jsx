// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import PageLayout from "./PageLayout";
import { Wrench } from "lucide-react";

function Workshops() {
  return (
    <PageLayout 
      title="Pre-Conference Workshops"
      subtitle="Hands-on workshops on June 17, 2026"
    >
      <div className="bg-white rounded shadow-sm p-12">
        <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
          <Wrench size={64} className="text-blue-600 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Workshop Details Coming Soon
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mb-4">
            Pre-conference workshops will be held on June 17, 2026. Detailed information about workshop topics, speakers, and registration will be announced soon.
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mt-4">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Workshop Fee:</span> $ 20 (Rs. 1800)
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Workshops;
