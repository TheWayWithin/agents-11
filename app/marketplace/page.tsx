import Link from 'next/link';
import { RouteGuard } from '@/components/route-guard';

export default function MarketplacePage() {
  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Agent Marketplace
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Marketplace coming soon
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Preview Cards */}
            {[
              { name: "THE COORDINATOR", desc: "Your AI Chief of Staff" },
              { name: "THE MARKETER", desc: "Content & Social Media" },
              { name: "THE DEVELOPER", desc: "Code & Automation" },
              { name: "THE SUPPORT", desc: "Customer Service" },
              { name: "THE ANALYST", desc: "Data & Analytics" },
              { name: "THE DESIGNER", desc: "UI/UX Design" }
            ].map((agent, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {agent.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {agent.desc}
                </p>
                <div className="bg-gray-100 rounded px-3 py-1 text-sm text-gray-500">
                  Coming Soon
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <p className="text-lg text-gray-600 mb-6">
              We're building an amazing marketplace experience for you to discover, preview, and deploy AI agents.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/email-gate"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-4"
              >
                Get Early Access
              </Link>
              
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </RouteGuard>
  );
}