interface TrustBadge {
  icon: string;
  text: string;
  id: string;
}

const badges: TrustBadge[] = [
  {
    id: 'guarantee',
    icon: '🔒',
    text: '30-Day Guarantee'
  },
  {
    id: 'secured',
    icon: '✓',
    text: 'SSL Secured'
  },
  {
    id: 'members',
    icon: '👥',
    text: '2,341 Active Members'
  }
];

export function TrustBadges() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
      {badges.map((badge, index) => (
        <div
          key={badge.id}
          className="
            flex items-center gap-3
            px-4 py-2
            bg-white/80 backdrop-blur-sm
            border border-gray-200
            rounded-full
            shadow-sm hover:shadow-md
            transition-all duration-300 ease-in-out
            hover:scale-105
            group
          "
          style={{
            animationDelay: `${index * 150}ms`
          }}
        >
          <span 
            className="
              text-lg
              group-hover:scale-110
              transition-transform duration-200
            "
          >
            {badge.icon}
          </span>
          <span 
            className="
              text-sm sm:text-base font-medium text-gray-700
              group-hover:text-gray-900
              transition-colors duration-200
            "
          >
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
}