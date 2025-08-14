import Link from 'next/link';

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Package
          </h1>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 mb-8">
            <p className="text-xl text-gray-600 mb-6">
              Package selection coming soon
            </p>
            
            <p className="text-gray-500 mb-8">
              We're working on creating the perfect agent packages for different business needs.
              In the meantime, check out our unlimited offer!
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
              
              <div>
                <Link 
                  href="/email-gate"
                  className="inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  Want to browse for free? Create account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}