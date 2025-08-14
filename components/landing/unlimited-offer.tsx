import Link from 'next/link';
import { CTAButton } from './cta-button';

export function UnlimitedOffer() {
  const benefits = [
    "THE COORDINATOR - Your AI Chief of Staff",
    "THE MARKETER - Content & Social Media", 
    "THE DEVELOPER - Code & Automation",
    "THE SUPPORT - Customer Service",
    "Plus 19 more AI employees",
    "New agents added every month",
    "Priority support & updates"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title and Subtitle */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎯 UNLIMITED ACCESS - <span className="text-green-600">$39/month</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            Get ALL 23 AI Employees + New Ones Monthly
          </p>

          {/* Benefits Card */}
          <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 mb-12">
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-lg text-gray-800 font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <CTAButton href="/email-gate">
              GET UNLIMITED ACCESS NOW
            </CTAButton>
            
            <p className="text-gray-600 text-lg">
              30-day money-back guarantee • Cancel anytime
            </p>
            
            <Link 
              href="/packages" 
              className="inline-block text-blue-600 hover:text-blue-800 underline text-lg transition-colors"
            >
              Not ready for unlimited? See package options →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}