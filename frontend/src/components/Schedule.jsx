// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import PageLayout from "./PageLayout";
import { Calendar } from "lucide-react";

function Schedule() {
  return (
    <PageLayout 
      title="Conference Schedule"
      subtitle="Stay up to date with our sessions, workshops, and keynotes"
    >
      <div className="bg-white rounded shadow-sm p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Calendar size={64} className="text-blue-600 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Schedule Coming Soon
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            The detailed conference schedule will be published soon. Please check back later for information about sessions, workshops, and keynote presentations.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default Schedule;
