import React from "react";

const NotificationBar = () => {
  return (
    <div className="bg-[#d32f2f] border-y-4 border-yellow-400 text-white overflow-hidden py-3 relative z-20 shadow-xl">
      <div className="animate-marquee whitespace-nowrap flex items-center w-max hover:[animation-play-state:paused]">
        
        {/* 1. FREE TRIP OFFER */}
        <span className="text-yellow-200 font-bold text-lg md:text-xl mx-8 inline-flex items-center tracking-wide">
          ✨ Exclusive Offer: Free one day Local Kashmir trip for limited participants! ✨
        </span>
        <span className="text-white mx-4 text-2xl">•</span>

        {/* 2. DOWNLOAD BROCHURE (Clickable) */}
        <a 
          href="/brochure.pdf" 
          download="2AI_2026_Brochure.pdf"
          className="text-white font-bold text-lg md:text-xl mx-8 inline-flex items-center tracking-wide underline decoration-yellow-400 decoration-2 underline-offset-4 hover:text-yellow-200 cursor-pointer transition-colors"
        >
          📄 Download Conference Brochure
        </a>
        <span className="text-white mx-4 text-2xl">•</span>

        {/* 3. SPRINGER NEWS */}
        <span className="text-white font-bold text-lg md:text-xl mx-8 inline-flex items-center tracking-wide">
          📢 All selected and presented articles will be published in Springer CCIS Proceedings (Scopus Indexed, Pending approval)
        </span>
        <span className="text-yellow-300 mx-4 text-2xl">•</span>

        {/* --- REPEAT FOR SMOOTH SCROLLING --- */}

        {/* 1. FREE TRIP OFFER (Repeat) */}
        <span className="text-yellow-200 font-bold text-lg md:text-xl mx-8 inline-flex items-center tracking-wide">
          ✨ Exclusive Offer: Free one day Local Kashmir trip for limited participants! ✨
        </span>
        <span className="text-white mx-4 text-2xl">•</span>

        {/* 2. DOWNLOAD BROCHURE (Repeat) */}
        <a 
          href="/brochure.pdf" 
          download="2AI_2026_Brochure.pdf"
          className="text-white font-bold text-lg md:text-xl mx-8 inline-flex items-center tracking-wide underline decoration-yellow-400 decoration-2 underline-offset-4 hover:text-yellow-200 cursor-pointer transition-colors"
        >
          📄 Download Conference Brochure
        </a>
        <span className="text-white mx-4 text-2xl">•</span>

        {/* 3. SPRINGER NEWS (Repeat) */}
        <span className="text-white font-bold text-lg md:text-xl mx-8 inline-flex items-center tracking-wide">
          📢 All selected and presented articles will be published in Springer CCIS Proceedings (Scopus Indexed, Pending approval)
        </span>
        <span className="text-yellow-300 mx-4 text-2xl">•</span>
        
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
      `}</style>
    </div>
  );
};

export default NotificationBar;