import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckoutButton } from '@/components/pricing/checkout-button';
import { AgentIcon } from '@/components/ui/agent-icon';
import { PatternBackground } from '@/components/ui/pattern-background';

// Mock data - in production this would come from the database
const agentData: Record<string, any> = {
  'agent-11': {
    id: '1',
    name: 'Agent-11',
    slug: 'agent-11',
    description:
      'Advanced AI agent framework with multi-modal capabilities and strategic thinking',
    long_description: `
      Agent-11 represents the pinnacle of AI agent technology, featuring:
      
      • Advanced multi-modal capabilities (text, image, audio processing)
      • Strategic thinking patterns with long-term planning
      • Enterprise-grade deployment tools and monitoring
      • Extensive customization and integration options
      • Production-ready with comprehensive documentation
      
      Perfect for professionals who demand excellence and reliability in their AI automation systems.
    `,
    category: 'agent',
    tier_required: 'pro',
    version: '2.1.0',
    file_size: 45.2,
    tags: ['AI', 'Automation', 'Enterprise', 'Multi-modal'],
    featured: true,
    download_count: 1247,
    rating: 4.9,
    rating_count: 89,
    price: 299,
    features: [
      'Multi-modal AI processing',
      'Strategic thinking framework',
      'Enterprise deployment tools',
      'Advanced customization',
      'Real-time monitoring',
      'Comprehensive documentation',
      'Priority support',
      'Regular updates',
    ],
    requirements: [
      'Python 3.9+',
      'Docker (optional)',
      'API keys for external services',
      '8GB+ RAM recommended',
      'Pro subscription or higher',
    ],
    changelog: [
      {
        version: '2.1.0',
        date: '2024-01-15',
        changes: [
          'Enhanced multi-modal capabilities',
          'Improved performance',
          'Bug fixes',
        ],
      },
      {
        version: '2.0.0',
        date: '2023-12-01',
        changes: [
          'Major architecture update',
          'New strategic thinking module',
          'Breaking changes',
        ],
      },
      {
        version: '1.5.2',
        date: '2023-11-15',
        changes: ['Security updates', 'Minor improvements'],
      },
    ],
  },
  'empire-11': {
    id: '2',
    name: 'Empire-11',
    slug: 'empire-11',
    description:
      'Complete automation empire with 11 specialized agents working in harmony',
    long_description: `
      Empire-11 is a comprehensive automation ecosystem featuring 11 specialized agents:
      
      • Research Agent - Intelligence gathering and analysis
      • Content Agent - Multi-format content creation
      • Communication Agent - Email, chat, and social management
      • Data Agent - Processing and analytics
      • Marketing Agent - Campaign management and optimization
      • Sales Agent - Lead qualification and nurturing
      • Support Agent - Customer service automation
      • Finance Agent - Bookkeeping and reporting
      • Project Agent - Task and workflow management
      • Security Agent - Monitoring and threat detection
      • Coordination Agent - Inter-agent communication and orchestration
      
      All agents work together seamlessly to handle complex business operations.
    `,
    category: 'empire',
    tier_required: 'enterprise',
    version: '1.3.0',
    file_size: 127.8,
    tags: ['Empire', 'Multi-Agent', 'Business', 'Automation'],
    featured: true,
    download_count: 542,
    rating: 4.8,
    rating_count: 34,
    price: 999,
    features: [
      '11 specialized AI agents',
      'Unified orchestration system',
      'Cross-agent communication',
      'Business process automation',
      'Real-time analytics dashboard',
      'Custom workflow builder',
      'Enterprise security',
      'White-label options',
    ],
    requirements: [
      'Python 3.10+',
      'Docker Compose',
      'PostgreSQL database',
      '32GB+ RAM recommended',
      'Enterprise subscription',
      'Dedicated server recommended',
    ],
    changelog: [
      {
        version: '1.3.0',
        date: '2024-01-10',
        changes: [
          'New Finance Agent',
          'Enhanced coordination',
          'Performance improvements',
        ],
      },
      {
        version: '1.2.0',
        date: '2023-12-20',
        changes: ['Added Security Agent', 'Improved dashboard', 'Bug fixes'],
      },
      {
        version: '1.1.0',
        date: '2023-11-30',
        changes: ['Communication Agent updates', 'New integrations'],
      },
    ],
  },
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function LibraryDetailPage({ params }: PageProps) {
  const agent = agentData[params.slug];

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PatternBackground pattern="dots" opacity={0.06}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/library" className="hover:text-gray-700">
                  Library
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">{agent.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <div className="flex items-start gap-6 mb-4">
                  <div className="flex-shrink-0">
                    <AgentIcon
                      agent={agent.slug === 'agent-11' ? 'coordinator' : 'sage'}
                      suite={agent.slug === 'agent-11' ? 'agent11' : 'empire11'}
                      size="large"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-4xl font-bold text-gray-900">
                        {agent.name}
                      </h1>
                      <Badge
                        variant={
                          agent.tier_required === 'enterprise'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {agent.tier_required}
                      </Badge>
                      {agent.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                    <p className="text-xl text-gray-600 mb-4">
                      {agent.description}
                    </p>
                  </div>
                </div>

                {/* Agent Preview Icons */}
                {agent.slug === 'agent-11' ? (
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    <AgentIcon
                      agent="strategist"
                      suite="agent11"
                      size="medium"
                    />
                    <AgentIcon
                      agent="architect"
                      suite="agent11"
                      size="medium"
                    />
                    <AgentIcon
                      agent="developer"
                      suite="agent11"
                      size="medium"
                    />
                    <AgentIcon agent="designer" suite="agent11" size="medium" />
                    <AgentIcon agent="tester" suite="agent11" size="medium" />
                    <AgentIcon agent="operator" suite="agent11" size="medium" />
                    <AgentIcon agent="support" suite="agent11" size="medium" />
                    <AgentIcon agent="analyst" suite="agent11" size="medium" />
                    <AgentIcon agent="marketer" suite="agent11" size="medium" />
                    <AgentIcon
                      agent="documenter"
                      suite="agent11"
                      size="medium"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    <AgentIcon agent="nova" suite="empire11" size="medium" />
                    <AgentIcon agent="astra" suite="empire11" size="medium" />
                    <AgentIcon agent="phoenix" suite="empire11" size="medium" />
                    <AgentIcon agent="rex" suite="empire11" size="medium" />
                    <AgentIcon agent="zara" suite="empire11" size="medium" />
                    <AgentIcon agent="luna" suite="empire11" size="medium" />
                    <AgentIcon agent="alex" suite="empire11" size="medium" />
                    <AgentIcon agent="kai" suite="empire11" size="medium" />
                    <AgentIcon agent="bob" suite="empire11" size="medium" />
                    <AgentIcon agent="echo" suite="empire11" size="medium" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4">About {agent.name}</h2>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {agent.long_description}
                  </pre>
                </div>
              </Card>

              {/* Features */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {agent.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Requirements */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
                <ul className="space-y-2">
                  {agent.requirements.map(
                    (requirement: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    )
                  )}
                </ul>
              </Card>

              {/* Changelog */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4">Changelog</h2>
                <div className="space-y-4">
                  {agent.changelog.map((entry: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          v{entry.version}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{entry.date}</span>
                      </div>
                      <ul className="space-y-1">
                        {entry.changes.map(
                          (change: string, changeIndex: number) => (
                            <li
                              key={changeIndex}
                              className="text-gray-700 text-sm"
                            >
                              • {change}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <Card className="p-6 sticky top-8 bg-white/95 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${agent.price}
                  </div>
                  <p className="text-gray-600">One-time purchase</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">{agent.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">File Size:</span>
                    <span className="font-medium">{agent.file_size}MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Downloads:</span>
                    <span className="font-medium">
                      {agent.download_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 font-medium">{agent.rating}</span>
                      <span className="text-gray-400 ml-1">
                        ({agent.rating_count})
                      </span>
                    </div>
                  </div>
                </div>

                <CheckoutButton
                  tier={agent.tier_required as 'basic' | 'pro' | 'enterprise'}
                  className="w-full mb-4"
                >
                  Purchase & Download
                </CheckoutButton>

                <p className="text-xs text-gray-600 text-center">
                  Secure payment via Stripe. Instant download after purchase.
                </p>
              </Card>

              {/* Support */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Documentation included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Email support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Community access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Free updates</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PatternBackground>
    </div>
  );
}
