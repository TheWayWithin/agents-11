'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import BrandLogo from '@/components/ui/brand-logo';
import AgentIcon from '@/components/ui/agent-icon';
import AgentGrid from '@/components/ui/agent-grid';
import StatusIndicator from '@/components/ui/status-indicator';
import PatternBackground from '@/components/ui/pattern-background';
import HeroSection from '@/components/ui/hero-section';
import { Button } from '@/components/ui/button';

const BRAND_COLORS = [
  { name: 'Deep Blue', hex: '#1a365d', class: 'bg-brand-blue-500' },
  { name: 'Bright Orange', hex: '#ff6b35', class: 'bg-brand-orange-500' },
  { name: 'Light Gray', hex: '#f5f5f5', class: 'bg-brand-gray-light' },
  { name: 'Dark Gray', hex: '#333333', class: 'bg-brand-gray-dark' },
];

const AGENT11_COLORS = [
  {
    name: 'Strategist',
    hex: '#8B5CF6',
    class: 'bg-agent11-strategist',
    agent: 'strategist',
  },
  {
    name: 'Architect',
    hex: '#2563EB',
    class: 'bg-agent11-architect',
    agent: 'architect',
  },
  {
    name: 'Developer',
    hex: '#10B981',
    class: 'bg-agent11-developer',
    agent: 'developer',
  },
  {
    name: 'Tester',
    hex: '#F97316',
    class: 'bg-agent11-tester',
    agent: 'tester',
  },
  {
    name: 'Designer',
    hex: '#EC4899',
    class: 'bg-agent11-designer',
    agent: 'designer',
  },
  {
    name: 'Documenter',
    hex: '#F59E0B',
    class: 'bg-agent11-documenter',
    agent: 'documenter',
  },
];

const EMPIRE11_COLORS = [
  { name: 'Sage', hex: '#FFD700', class: 'bg-empire11-sage', agent: 'sage' },
  { name: 'Nova', hex: '#ff6b35', class: 'bg-empire11-nova', agent: 'nova' },
  { name: 'Astra', hex: '#8B5CF6', class: 'bg-empire11-astra', agent: 'astra' },
  {
    name: 'Phoenix',
    hex: '#14B8A6',
    class: 'bg-empire11-phoenix',
    agent: 'phoenix',
  },
  { name: 'Rex', hex: '#374151', class: 'bg-empire11-rex', agent: 'rex' },
  { name: 'Zara', hex: '#10B981', class: 'bg-empire11-zara', agent: 'zara' },
];

const SAMPLE_AGENTS = [
  {
    id: '1',
    name: 'strategist',
    suite: 'agent11' as const,
    status: 'active' as const,
    description: 'Product vision & roadmaps',
    category: 'Planning',
  },
  {
    id: '2',
    name: 'developer',
    suite: 'agent11' as const,
    status: 'active' as const,
    description: 'Ship code fast',
    category: 'Development',
  },
  {
    id: '3',
    name: 'designer',
    suite: 'agent11' as const,
    status: 'inactive' as const,
    description: 'UI/UX excellence',
    category: 'Design',
  },
  {
    id: '4',
    name: 'sage',
    suite: 'empire11' as const,
    status: 'active' as const,
    description: 'Strategic leadership',
    category: 'Business',
  },
  {
    id: '5',
    name: 'nova',
    suite: 'empire11' as const,
    status: 'active' as const,
    description: 'Sales growth',
    category: 'Business',
  },
  {
    id: '6',
    name: 'astra',
    suite: 'empire11' as const,
    status: 'inactive' as const,
    description: 'Marketing campaigns',
    category: 'Business',
  },
];

interface DesignSystemProps {
  className?: string;
}

export function DesignSystem({ className }: DesignSystemProps) {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['1', '4']);

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'colors', label: 'Colors' },
    { id: 'logos', label: 'Logos' },
    { id: 'agents', label: 'Agent Icons' },
    { id: 'components', label: 'Components' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'layouts', label: 'Layouts' },
  ];

  const handleAgentClick = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const ColorPalette = ({
    colors,
    title,
  }: {
    colors: any[];
    title: string;
  }) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="space-y-2">
            <div
              className={`w-16 h-16 rounded-lg shadow-md ${color.class} border border-border`}
            />
            <div className="text-sm">
              <p className="font-medium">{color.name}</p>
              <p className="text-muted-foreground text-xs">{color.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <Card className="p-8">
              <div className="text-center space-y-4">
                <BrandLogo variant="horizontal" size="large" />
                <h1 className="text-3xl font-bold">Agents-11 Design System</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A comprehensive visual design system built for the Agents-11
                  marketplace. Combining professional aesthetics with functional
                  excellence.
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Brand Essence</h3>
                <p className="text-muted-foreground">
                  "Superintelligence Meets Individual Freedom" - Representing
                  the powerful combination of advanced AI capabilities with
                  entrepreneurial autonomy.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Visual Assets</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 10 logo variations</li>
                  <li>• 22 agent icons (11 Agent-11 + 11 Empire-11)</li>
                  <li>• 10 UI components and illustrations</li>
                  <li>• 5 background patterns</li>
                  <li>• 7 marketing templates</li>
                </ul>
              </Card>
            </div>
          </div>
        );

      case 'colors':
        return (
          <div className="space-y-8">
            <ColorPalette colors={BRAND_COLORS} title="Brand Colors" />
            <ColorPalette
              colors={AGENT11_COLORS}
              title="Agent-11 Technical Suite"
            />
            <ColorPalette
              colors={EMPIRE11_COLORS}
              title="Empire-11 Business Suite"
            />
          </div>
        );

      case 'logos':
        return (
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6">Logo Variations</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4 text-center">
                  <BrandLogo variant="horizontal" size="large" />
                  <p className="text-sm font-medium">Primary Horizontal</p>
                </div>
                <div className="space-y-4 text-center">
                  <BrandLogo variant="icon" size="large" />
                  <p className="text-sm font-medium">Icon Only</p>
                </div>
                <div className="space-y-4 text-center">
                  <BrandLogo variant="stacked" size="large" />
                  <p className="text-sm font-medium">Stacked Vertical</p>
                </div>
                <div className="space-y-4 text-center">
                  <BrandLogo variant="wordmark" size="large" />
                  <p className="text-sm font-medium">Wordmark Only</p>
                </div>
                <div className="space-y-4 text-center">
                  <BrandLogo variant="orange" size="large" />
                  <p className="text-sm font-medium">Orange Accent</p>
                </div>
                <div className="space-y-4 text-center bg-slate-900 p-4 rounded-lg">
                  <BrandLogo variant="white" size="large" />
                  <p className="text-sm font-medium text-white">
                    Reverse White
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6">Agent Icons</h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Agent-11 Technical Suite
                  </h4>
                  <div className="grid grid-cols-6 md:grid-cols-11 gap-4">
                    {AGENT11_COLORS.map((agent, index) => (
                      <div key={index} className="text-center space-y-2">
                        <AgentIcon
                          agent={agent.agent}
                          suite="agent11"
                          size="medium"
                        />
                        <p className="text-xs font-medium capitalize">
                          {agent.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Empire-11 Business Suite
                  </h4>
                  <div className="grid grid-cols-6 md:grid-cols-11 gap-4">
                    {EMPIRE11_COLORS.map((agent, index) => (
                      <div key={index} className="text-center space-y-2">
                        <AgentIcon
                          agent={agent.agent}
                          suite="empire11"
                          size="medium"
                        />
                        <p className="text-xs font-medium capitalize">
                          {agent.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'components':
        return (
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6">Status Indicators</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <StatusIndicator status="active" showLabel />
                  <StatusIndicator status="inactive" showLabel />
                  <StatusIndicator status="loading" showLabel />
                </div>
                <div className="space-y-4">
                  <StatusIndicator status="error" showLabel />
                  <StatusIndicator status="success" showLabel />
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6">Agent Grid</h3>
              <AgentGrid
                agents={SAMPLE_AGENTS}
                selectedAgents={selectedAgents}
                onAgentClick={handleAgentClick}
                showStatus
                groupByCategory
              />
            </Card>
          </div>
        );

      case 'patterns':
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Geometric Grid</h3>
                <PatternBackground
                  pattern="geometric"
                  opacity={0.3}
                  className="h-32 rounded-lg border"
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">
                      Geometric Pattern
                    </p>
                  </div>
                </PatternBackground>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Circuit Board</h3>
                <PatternBackground
                  pattern="circuit"
                  opacity={0.3}
                  className="h-32 rounded-lg border"
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">
                      Circuit Pattern
                    </p>
                  </div>
                </PatternBackground>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Dot Matrix</h3>
                <PatternBackground
                  pattern="dots"
                  opacity={0.3}
                  className="h-32 rounded-lg border"
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">Dot Pattern</p>
                  </div>
                </PatternBackground>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Wave Flow</h3>
                <PatternBackground
                  pattern="waves"
                  opacity={0.3}
                  className="h-32 rounded-lg border"
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">
                      Wave Pattern
                    </p>
                  </div>
                </PatternBackground>
              </Card>
            </div>
          </div>
        );

      case 'layouts':
        return (
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6">
                Hero Section - Centered
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <HeroSection
                  title="Build Your AI Empire"
                  subtitle="Agents-11 Marketplace"
                  description="Transform your business with our comprehensive suite of AI agents designed for solopreneurs and growing teams."
                  illustration="hero"
                  layout="centered"
                  className="min-h-[400px]"
                >
                  <div className="flex gap-4 justify-center">
                    <Button size="lg">Get Started</Button>
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </div>
                </HeroSection>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6">
                Hero Section - Split Layout
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <HeroSection
                  title="Coordinate Like a Pro"
                  subtitle="Agent Coordination"
                  description="Seamlessly manage multiple AI agents working together to achieve your business goals."
                  illustration="coordination"
                  layout="split"
                  className="min-h-[400px]"
                >
                  <div className="flex gap-4">
                    <Button size="lg">Start Coordinating</Button>
                    <Button variant="outline" size="lg">
                      View Demo
                    </Button>
                  </div>
                </HeroSection>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-4 sticky top-8">
              <nav className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default DesignSystem;
