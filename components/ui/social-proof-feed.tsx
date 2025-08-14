'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface ActivityItem {
  id: string;
  user: string;
  location: string;
  action: string;
  plan?: string;
  timeAgo: string;
  type: 'upgrade' | 'signup' | 'download' | 'achievement';
}

interface SocialProofFeedProps {
  className?: string;
  showLiveCounter?: boolean;
  maxItems?: number;
}

// Mock data for demonstration - in production, this would come from real analytics
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    user: 'Michael',
    location: 'Austin',
    action: 'upgraded to Unlimited',
    plan: 'Unlimited',
    timeAgo: '2 minutes ago',
    type: 'upgrade',
  },
  {
    id: '2',
    user: 'Sarah',
    location: 'Seattle',
    action: 'downloaded Agent-11 Suite',
    timeAgo: '4 minutes ago',
    type: 'download',
  },
  {
    id: '3',
    user: 'David',
    location: 'Miami',
    action: 'started 7-day trial',
    plan: 'Unlimited',
    timeAgo: '6 minutes ago',
    type: 'signup',
  },
  {
    id: '4',
    user: 'Lisa',
    location: 'Portland',
    action: 'saved 12 hours with Automation Agent',
    timeAgo: '8 minutes ago',
    type: 'achievement',
  },
  {
    id: '5',
    user: 'Alex',
    location: 'Denver',
    action: 'upgraded from Category to Unlimited',
    plan: 'Unlimited',
    timeAgo: '11 minutes ago',
    type: 'upgrade',
  },
  {
    id: '6',
    user: 'Emma',
    location: 'Boston',
    action: 'generated $5,000 revenue this month',
    timeAgo: '14 minutes ago',
    type: 'achievement',
  },
];\n\nconst liveStats = {\n  activeViewers: 247,\n  hoursSaved: 23445,\n  revenueGenerated: 847332,\n  businessesAutomated: 1247,\n  satisfaction: 4.9,\n};\n\nconst getActivityIcon = (type: ActivityItem['type']) => {\n  switch (type) {\n    case 'upgrade':\n      return '🚀';\n    case 'signup':\n      return '✨';\n    case 'download':\n      return '📦';\n    case 'achievement':\n      return '🎯';\n    default:\n      return '🟢';\n  }\n};\n\nconst getActivityColor = (type: ActivityItem['type']) => {\n  switch (type) {\n    case 'upgrade':\n      return 'text-green-600';\n    case 'signup':\n      return 'text-blue-600';\n    case 'download':\n      return 'text-purple-600';\n    case 'achievement':\n      return 'text-orange-600';\n    default:\n      return 'text-gray-600';\n  }\n};\n\nexport function SocialProofFeed({\n  className = '',\n  showLiveCounter = true,\n  maxItems = 6,\n}: SocialProofFeedProps) {\n  const [activities, setActivities] = useState<ActivityItem[]>([]);\n  const [liveCount, setLiveCount] = useState(liveStats.activeViewers);\n\n  useEffect(() => {\n    // Simulate real-time activity updates\n    setActivities(mockActivities.slice(0, maxItems));\n\n    const interval = setInterval(() => {\n      // Simulate live viewer count changes\n      setLiveCount(prev => prev + Math.floor(Math.random() * 5) - 2);\n      \n      // Occasionally add new activities\n      if (Math.random() > 0.7) {\n        const newActivity: ActivityItem = {\n          id: Date.now().toString(),\n          user: ['Jordan', 'Taylor', 'Casey', 'Morgan'][Math.floor(Math.random() * 4)],\n          location: ['Chicago', 'Phoenix', 'Atlanta', 'Dallas'][Math.floor(Math.random() * 4)],\n          action: ['joined Unlimited', 'started trial', 'downloaded agents'][Math.floor(Math.random() * 3)],\n          timeAgo: 'just now',\n          type: ['upgrade', 'signup', 'download'][Math.floor(Math.random() * 3)] as ActivityItem['type'],\n        };\n        \n        setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);\n      }\n    }, 8000); // Update every 8 seconds\n\n    return () => clearInterval(interval);\n  }, [maxItems]);\n\n  return (\n    <Card className={`p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}>\n      {/* Header */}\n      <div className=\"mb-4\">\n        <h3 className=\"text-lg font-bold text-gray-900 mb-2\">🟢 Live Activity</h3>\n        {showLiveCounter && (\n          <p className=\"text-sm text-gray-600\">\n            <span className=\"font-semibold text-green-600\">{liveCount}</span> people viewing this page right now\n          </p>\n        )}\n      </div>\n\n      {/* Activity Feed */}\n      <div className=\"space-y-3 mb-6\">\n        {activities.map((activity, index) => (\n          <div\n            key={activity.id}\n            className={`flex items-start space-x-3 text-sm transition-all duration-500 ${\n              index === 0 ? 'animate-pulse' : ''\n            }`}\n          >\n            <span className=\"text-lg\">{getActivityIcon(activity.type)}</span>\n            <div className=\"flex-1\">\n              <span className=\"font-medium text-gray-900\">{activity.user}</span>\n              <span className=\"text-gray-600\"> in </span>\n              <span className=\"font-medium text-gray-700\">{activity.location}</span>\n              <span className=\"text-gray-600\"> {activity.action}</span>\n              {activity.plan && (\n                <span className={`ml-1 font-semibold ${getActivityColor(activity.type)}`}>\n                  ({activity.plan})\n                </span>\n              )}\n              <div className=\"text-xs text-gray-500 mt-1\">{activity.timeAgo}</div>\n            </div>\n          </div>\n        ))}\n      </div>\n\n      {/* Stats Summary */}\n      <div className=\"border-t border-blue-200 pt-4\">\n        <h4 className=\"text-sm font-semibold text-gray-900 mb-3\">📊 This Month's Impact</h4>\n        <div className=\"grid grid-cols-2 gap-4 text-sm\">\n          <div>\n            <div className=\"font-bold text-blue-600\">⏱️ {liveStats.hoursSaved.toLocaleString()}</div>\n            <div className=\"text-gray-600\">Hours Saved</div>\n          </div>\n          <div>\n            <div className=\"font-bold text-green-600\">💰 ${Math.floor(liveStats.revenueGenerated / 1000)}K</div>\n            <div className=\"text-gray-600\">Revenue Generated</div>\n          </div>\n          <div>\n            <div className=\"font-bold text-purple-600\">🚀 {liveStats.businessesAutomated.toLocaleString()}</div>\n            <div className=\"text-gray-600\">Businesses Automated</div>\n          </div>\n          <div>\n            <div className=\"font-bold text-orange-600\">⭐ {liveStats.satisfaction}/5</div>\n            <div className=\"text-gray-600\">Avg Satisfaction</div>\n          </div>\n        </div>\n      </div>\n    </Card>\n  );\n}"