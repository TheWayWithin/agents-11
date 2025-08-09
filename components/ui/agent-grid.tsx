'use client';

import { cn } from '@/lib/utils';
import AgentIcon from './agent-icon';

export interface Agent {
  id: string;
  name: string;
  suite: 'agent11' | 'empire11';
  status?: 'active' | 'inactive';
  description?: string;
  category?: string;
}

export interface AgentGridProps {
  agents: Agent[];
  selectedAgents?: string[];
  onAgentClick?: (agentId: string) => void;
  showStatus?: boolean;
  groupByCategory?: boolean;
  className?: string;
  iconSize?: 'small' | 'medium' | 'large';
}

export function AgentGrid({
  agents,
  selectedAgents = [],
  onAgentClick,
  showStatus = false,
  groupByCategory = false,
  className,
  iconSize = 'medium',
}: AgentGridProps) {
  const groupedAgents = groupByCategory
    ? agents.reduce(
        (acc, agent) => {
          const category = agent.category || 'Other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(agent);
          return acc;
        },
        {} as Record<string, Agent[]>
      )
    : { 'All Agents': agents };

  return (
    <div className={cn('space-y-8', className)}>
      {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
        <div key={category}>
          {groupByCategory && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {category}
            </h3>
          )}

          <div className="agent-grid">
            {categoryAgents.map(agent => (
              <div
                key={agent.id}
                className={cn(
                  'agent-card group',
                  selectedAgents.includes(agent.id) && 'ring-2 ring-primary',
                  onAgentClick && 'hover:ring-1 hover:ring-primary/50'
                )}
                onClick={() => onAgentClick?.(agent.id)}
              >
                <div className="flex flex-col items-center space-y-2">
                  <AgentIcon
                    agent={agent.name.toLowerCase()}
                    suite={agent.suite}
                    size={iconSize}
                    status={agent.status}
                    showStatus={showStatus}
                  />

                  <div className="text-center">
                    <p className="font-medium text-sm text-foreground capitalize">
                      {agent.name}
                    </p>
                    {agent.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {agent.description}
                      </p>
                    )}
                  </div>

                  {selectedAgents.includes(agent.id) && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AgentGrid;
