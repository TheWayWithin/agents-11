import Link from 'next/link';

export default function EmailGatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Create Free Account to Browse
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Email gate coming soon
            </p>
            
            <p className="text-gray-500 mb-8">
              We're setting up a seamless registration process. This will allow you to browse our AI agent marketplace for free before deciding on a package.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  🔒 Free browsing • No commitment • Instant access
                </p>
              </div>
              
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
              
              <div>
                <Link 
                  href="/marketplace"
                  className="inline-block text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Preview marketplace (demo) →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}