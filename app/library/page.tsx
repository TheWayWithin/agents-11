import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentIcon } from '@/components/ui/agent-icon';
import { PatternBackground } from '@/components/ui/pattern-background';

// Mock data for the agents - in production this would come from the database
const agents = [
  {
    id: '1',
    name: 'Agent-11',
    slug: 'agent-11',
    description:
      'Advanced AI agent framework with multi-modal capabilities and strategic thinking',
    long_description:
      'Agent-11 represents the pinnacle of AI agent technology, featuring advanced multi-modal capabilities, strategic thinking patterns, and enterprise-grade deployment tools. Built for professionals who demand excellence.',
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
  },
  {
    id: '2',
    name: 'Empire-11',
    slug: 'empire-11',
    description:
      'Complete automation empire with 11 specialized agents working in harmony',
    long_description:
      'Empire-11 is a comprehensive automation ecosystem featuring 11 specialized agents that work together to handle complex business operations. Perfect for organizations ready to fully embrace AI automation.',
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
  },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen">
      <PatternBackground pattern="geometric" opacity={0.08}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agent Library
            </h1>
            <p className="text-xl text-gray-600">
              Discover premium AI agents and automation systems built for
              professionals
            </p>
          </div>

          {/* Featured Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Featured Systems
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {agents.map(agent => (
                <Card
                  key={agent.id}
                  className="p-6 hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <AgentIcon
                        agent={
                          agent.slug === 'agent-11' ? 'coordinator' : 'sage'
                        }
                        suite={
                          agent.slug === 'agent-11' ? 'agent11' : 'empire11'
                        }
                        size="large"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {agent.name}
                        </h3>
                        <Badge
                          variant={
                            agent.tier_required === 'enterprise'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {agent.tier_required}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{agent.description}</p>
                    </div>
                  </div>

                  {/* Agent Preview Icons */}
                  {agent.slug === 'agent-11' ? (
                    <div className="flex justify-center space-x-2 mb-4">
                      <AgentIcon
                        agent="strategist"
                        suite="agent11"
                        size="small"
                      />
                      <AgentIcon
                        agent="architect"
                        suite="agent11"
                        size="small"
                      />
                      <AgentIcon
                        agent="developer"
                        suite="agent11"
                        size="small"
                      />
                      <AgentIcon
                        agent="designer"
                        suite="agent11"
                        size="small"
                      />
                      <AgentIcon agent="tester" suite="agent11" size="small" />
                      <AgentIcon
                        agent="operator"
                        suite="agent11"
                        size="small"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center space-x-2 mb-4">
                      <AgentIcon agent="nova" suite="empire11" size="small" />
                      <AgentIcon agent="astra" suite="empire11" size="small" />
                      <AgentIcon
                        agent="phoenix"
                        suite="empire11"
                        size="small"
                      />
                      <AgentIcon agent="rex" suite="empire11" size="small" />
                      <AgentIcon agent="zara" suite="empire11" size="small" />
                      <AgentIcon agent="luna" suite="empire11" size="small" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Version:</span>{' '}
                      {agent.version}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>{' '}
                      {agent.file_size}
                      MB
                    </div>
                    <div>
                      <span className="font-medium">Downloads:</span>{' '}
                      {agent.download_count.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Rating:</span>
                      <div className="flex items-center ml-2">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{agent.rating}</span>
                        <span className="text-gray-400 ml-1">
                          ({agent.rating_count})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ${agent.price}
                    </div>
                    <Link href={`/library/${agent.slug}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-white/90 backdrop-blur-sm rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Custom Agent Development?
            </h2>
            <p className="text-gray-600 mb-6">
              Our team can build custom AI agents tailored to your specific
              needs and requirements.
            </p>
            <Button size="lg">Contact Us</Button>
          </section>
        </div>
      </PatternBackground>
    </div>
  );
}
