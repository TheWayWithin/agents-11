'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AgentIconProps {
  agent: string;
  suite?: 'agent11' | 'empire11';
  size?: 'small' | 'medium' | 'large';
  status?: 'active' | 'inactive' | null;
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const AGENT_COLORS = {
  // Agent-11 Technical Suite
  agent11: {
    strategist: 'text-agent11-strategist',
    architect: 'text-agent11-architect',
    developer: 'text-agent11-developer',
    tester: 'text-agent11-tester',
    designer: 'text-agent11-designer',
    documenter: 'text-agent11-documenter',
    operator: 'text-agent11-operator',
    support: 'text-agent11-support',
    analyst: 'text-agent11-analyst',
    marketer: 'text-agent11-marketer',
    coordinator: 'text-agent11-coordinator',
  },
  // Empire-11 Business Suite
  empire11: {
    sage: 'text-empire11-sage',
    nova: 'text-empire11-nova',
    astra: 'text-empire11-astra',
    phoenix: 'text-empire11-phoenix',
    rex: 'text-empire11-rex',
    zara: 'text-empire11-zara',
    alex: 'text-empire11-alex',
    luna: 'text-empire11-luna',
    kai: 'text-empire11-kai',
    bob: 'text-empire11-bob',
    echo: 'text-empire11-echo',
  },
};

const SIZE_CLASSES = {
  small: 'agent-icon-small',
  medium: 'agent-icon',
  large: 'agent-icon-large',
};

export function AgentIcon({
  agent,
  suite = 'agent11',
  size = 'medium',
  status = null,
  showStatus = false,
  className,
  onClick,
}: AgentIconProps) {
  const getImagePath = () => {
    if (suite === 'agent11') {
      const agentMappings: Record<string, string> = {
        strategist: 'agent11-strategist-product-vision.png',
        architect: 'agent11-architect-system-design.png',
        developer: 'agent11-developer-ship-code.png',
        tester: 'agent11-tester-quality-assurance.png',
        designer: 'agent11-designer-ui-ux.png',
        documenter: 'agent11-documenter-knowledge-capture.png',
        operator: 'agent11-operator-devops.png',
        support: 'agent11-support-customer-support.png',
        analyst: 'agent11-analyst-data-analytics.png',
        marketer: 'agent11-marketer-growth-marketing.png',
        coordinator: 'agent11-coordinator-mission-commander.png',
      };
      return `/agents/${agentMappings[agent] || 'agent11-coordinator-mission-commander.png'}`;
    } else {
      const agentMappings: Record<string, string> = {
        sage: 'empire11-sage-strategy-agent.png',
        nova: 'empire11-nova-sales-agent.png',
        astra: 'empire11-astra-marketing-agent.png',
        phoenix: 'empire11-phoenix-operations-agent.png',
        rex: 'empire11-rex-legal-agent.png',
        zara: 'empire11-zara-finance-agent.png',
        alex: 'empire11-alex-hr-agent.png',
        luna: 'empire11-luna-customer-success-agent.png',
        kai: 'empire11-kai-product-agent.png',
        bob: 'empire11-bob-business-development-agent.png',
        echo: 'empire11-echo-pr-agent.png',
      };
      return `/agents/${agentMappings[agent] || 'empire11-sage-strategy-agent.png'}`;
    }
  };

  const getAgentColorClass = () => {
    return (
      AGENT_COLORS[suite]?.[
        agent as keyof (typeof AGENT_COLORS)[typeof suite]
      ] || ''
    );
  };

  const sizeMap = {
    small: { width: 32, height: 32 },
    medium: { width: 64, height: 64 },
    large: { width: 96, height: 96 },
  };

  return (
    <div
      className={cn(
        'relative inline-block',
        SIZE_CLASSES[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Image
        src={getImagePath()}
        alt={`${suite} ${agent} agent`}
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        className="w-full h-full object-contain rounded-inherit"
        priority={size === 'large'}
      />

      {showStatus && status && (
        <div
          className={cn(
            'absolute -top-1 -right-1 border-2 border-background rounded-full',
            status === 'active' ? 'status-active' : 'status-inactive'
          )}
        />
      )}

      {/* Glow effect on hover */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-300 rounded-inherit',
          'bg-gradient-to-br from-transparent via-transparent',
          getAgentColorClass().replace('text-', 'to-'),
          onClick && 'group-hover:opacity-20'
        )}
      />
    </div>
  );
}

export default AgentIcon;
