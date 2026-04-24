import { useState } from "react";
import { Link } from "react-router-dom";
import { useConsent } from "../hooks/useConsent";

export default function CookieConsent() {
  const { bannerOpen, acceptAll, saveCustom, essentialOnly } = useConsent();
  const [manageOpen, setManageOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!bannerOpen) return null;

  const openManage = () => {
    setManageOpen(true);
  };

  const closeManage = () => setManageOpen(false);

  const handleSavePreferences = () => {
    saveCustom({ analytics, marketing });
    setManageOpen(false);
  };

  return (
    <>
      {manageOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-prefs-title"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h2 id="cookie-prefs-title" className="text-lg font-bold text-gray-900 mb-2">
              Cookie preferences
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose which optional categories we may use. Strictly necessary cookies are always on so the site and
              registration can work.
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start justify-between gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Strictly necessary</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Session, security, and preferences required for the conference site to function.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#16a34a] shrink-0">Always on</span>
              </li>
              <li className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-200">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Analytics</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Helps us understand how visitors use the site (loaded only if you enable this).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-[#1a56db] focus:ring-[#1a56db]"
                />
              </li>
              <li className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-200">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Marketing</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Reminders about the conference on other platforms (only if you opt in).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-[#1a56db] focus:ring-[#1a56db]"
                />
              </li>
            </ul>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={closeManage}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1a56db] rounded-lg hover:opacity-95"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-[90] p-4 md:p-5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] border-t border-gray-200 bg-white/95 backdrop-blur-sm"
        role="region"
        aria-label="Cookie consent"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1 text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-900 mb-1">We value your privacy</p>
            <p>
              We use cookies and similar technologies that are necessary for this site to work, and optional cookies
              only if you allow them. Read our{" "}
              <Link to="/privacy-policy" className="text-[#1a56db] font-semibold underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              for details on how data from registration and browsing is handled.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={essentialOnly}
              className="px-4 py-2.5 text-sm font-semibold text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 order-3 sm:order-1"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={openManage}
              className="px-4 py-2.5 text-sm font-semibold text-[#1a56db] border border-[#1a56db] rounded-lg hover:bg-blue-50 order-2"
            >
              Manage preferences
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-[#16a34a] rounded-lg hover:bg-green-700 order-1 sm:order-3"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
