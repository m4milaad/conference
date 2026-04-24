// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import Navbar from "./Navbar";

function PageLayout({ children, title, subtitle, showHeader = true }) {
  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <Navbar />
      
      {showHeader && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
