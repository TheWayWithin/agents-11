import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroSection } from '@/components/landing/hero-section';
import { UnlimitedOffer } from '@/components/landing/unlimited-offer';
import { AgentIcon } from '@/components/ui/agent-icon';
import { PatternBackground } from '@/components/ui/pattern-background';

export default function Home() {
  return (
    <main>
      {/* Value Ladder Hero Section */}
      <HeroSection />

      {/* Unlimited Offer Section */}
      <UnlimitedOffer />

      {/* Featured Products */}
      <PatternBackground pattern="circuit" opacity={0.05} className="py-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Agent Systems
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <AgentIcon agent="coordinator" suite="agent11" size="large" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Agent-11
                </h3>
                <p className="text-gray-600 mb-6">
                  Advanced AI agent framework with multi-modal capabilities,
                  strategic thinking, and enterprise-grade deployment tools.
                </p>
                <div className="flex justify-center space-x-2 mb-6">
                  <AgentIcon agent="developer" suite="agent11" size="small" />
                  <AgentIcon agent="designer" suite="agent11" size="small" />
                  <AgentIcon agent="tester" suite="agent11" size="small" />
                  <AgentIcon agent="strategist" suite="agent11" size="small" />
                </div>
                <Link href="/library/agent-11">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <AgentIcon agent="sage" suite="empire11" size="large" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Empire-11
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete automation empire with 11 specialized agents working
                  in harmony to handle complex business operations.
                </p>
                <div className="flex justify-center space-x-2 mb-6">
                  <AgentIcon agent="nova" suite="empire11" size="small" />
                  <AgentIcon agent="astra" suite="empire11" size="small" />
                  <AgentIcon agent="phoenix" suite="empire11" size="small" />
                  <AgentIcon agent="zara" suite="empire11" size="small" />
                </div>
                <Link href="/library/empire-11">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </PatternBackground>

      {/* Value Propositions */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Agents-11?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Battle-Tested
              </h3>
              <p className="text-gray-600">
                Every agent system has been rigorously tested in real-world
                scenarios and proven to deliver results.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rapid Deployment
              </h3>
              <p className="text-gray-600">
                Get up and running in minutes with our streamlined deployment
                process and comprehensive documentation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Enterprise Ready
              </h3>
              <p className="text-gray-600">
                Built with security, scalability, and compliance in mind. Ready
                for production environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Operations?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of professionals already using our premium AI agent
          systems.
        </p>
        <Link href="/signup">
          <Button size="lg" className="px-8 py-3 text-lg">
            Get Started Today
          </Button>
        </Link>
      </section>
    </main>
  );
}
