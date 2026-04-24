import { useState } from "react";
import PageLayout from "./PageLayout";
import { EDGE_FUNCTIONS, SUPABASE_ANON_KEY } from "../config/api";

export default function TestRegistration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testData = {
    fullName: "John Doe",
    affiliation: "Test University",
    designation: "Professor",
    country: "India",
    email: "test@example.com", // Change this to your email
    contactNumber: "1234567890",
    participantType: "Author",
    paperId: "TEST-001",
    paperTitle: "Test Paper on AI",
    numAuthors: 2,
    subCategory: "Machine Learning",
    region: "Asia",
    attendWorkshop: "Yes",
    totalFeeUsd: 100,
    totalFeeInr: 8000,
    modeOfPayment: "Test",
    transactionId: `TEST-${Date.now()}`,
    dateOfPayment: new Date().toISOString().split('T')[0],
    declaration: true,
    paymentVerified: true, // Set to true to trigger email
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(EDGE_FUNCTIONS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || data.msg || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Test Registration" subtitle="Development Testing">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ Testing Mode</h3>
          <p className="text-sm text-amber-800">
            This page is for testing the registration flow without payment gateway.
            It will create a test registration in the database.
          </p>
        </div>

        {/* Test Data Display */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Test Data</h3>
          <div className="bg-gray-50 rounded p-4 overflow-x-auto">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            💡 <strong>Tip:</strong> Change the email address in the code to your email to receive the ticket.
          </p>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <button
            onClick={handleTest}
            disabled={loading}
            className="px-8 py-3 bg-[#2c5aa0] text-white font-semibold rounded-lg hover:bg-[#234a85] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating Test Registration..." : "🧪 Create Test Registration"}
          </button>
        </div>

        {/* Success Result */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              ✅ Registration Successful!
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-green-800">Registration ID:</p>
                <p className="font-mono text-lg text-green-900">{result.registrationId}</p>
              </div>
              
              {result.qrCode && (
                <div>
                  <p className="text-sm font-semibold text-green-800 mb-2">QR Code:</p>
                  <img 
                    src={result.qrCode} 
                    alt="QR Code" 
                    className="border-2 border-green-300 rounded p-2 bg-white"
                    style={{ maxWidth: "300px" }}
                  />
                </div>
              )}

              <div className="bg-white rounded p-4 border border-green-200">
                <p className="text-sm font-semibold text-green-800 mb-2">Next Steps:</p>
                <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                  <li>Check your email inbox for the registration ticket</li>
                  <li>Go to Admin Dashboard to see the registration</li>
                  <li>Use the QR code to test ticket verification</li>
                </ul>
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href="/admin"
                  className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#234a85] transition text-sm"
                >
                  View in Admin Dashboard
                </a>
                <a
                  href="/verify-ticket"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Test QR Verification
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
            <p className="text-sm text-red-700">{error}</p>
            
            <div className="mt-4 bg-white rounded p-4 border border-red-200">
              <p className="text-sm font-semibold text-red-800 mb-2">Common Issues:</p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Check if Supabase environment variables are set</li>
                <li>Verify the registrations table exists in database</li>
                <li>Check browser console for detailed errors</li>
                <li>View Supabase Edge Function logs</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📝 How to Use</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>
              <strong>Update Email:</strong> Edit <code className="bg-blue-100 px-1 rounded">src/components/TestRegistration.jsx</code> 
              and change <code className="bg-blue-100 px-1 rounded">email: "test@example.com"</code> to your email
            </li>
            <li>
              <strong>Set up Email (Optional):</strong> Configure Resend API key in Supabase to receive email tickets
            </li>
            <li>
              <strong>Click Test Button:</strong> Creates a test registration with payment verified
            </li>
            <li>
              <strong>Check Results:</strong> View in admin dashboard or check your email
            </li>
          </ol>
        </div>

        {/* Email Setup Reminder */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-3">📧 Email Setup (Optional)</h3>
          <p className="text-sm text-purple-800 mb-3">
            To receive email tickets, set these environment variables in Supabase:
          </p>
          <div className="bg-white rounded p-3 border border-purple-200">
            <code className="text-xs text-purple-900 block">
              RESEND_API_KEY=re_your_key_here<br />
              RESEND_FROM=2AI Conference &lt;onboarding@resend.dev&gt;
            </code>
          </div>
          <p className="text-sm text-purple-700 mt-3">
            See <code className="bg-purple-100 px-1 rounded">EMAIL_TICKET_SETUP.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
