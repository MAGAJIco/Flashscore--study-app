//apps/frontend/src/components/sections/FrontendApps.tsx

const apps = [
  {
    icon: '🏠',
    title: 'Portal',
    description: 'Main dashboard & navigation hub',
    items: ['page.tsx - Landing with feature cards', 'layout.tsx - Portal-specific layout']
  },
  {
    icon: '🤖',
    title: 'Predictions',
    description: 'AI Predictions & ML Features',
    items: ['ai-predictions/ - ML interface', 'coach/ - AI coach assistant', 'analytics/ - Prediction analytics']
  },
  {
    icon: '⚡',
    title: 'Live Tracking',
    description: 'Real-time sports updates',
    items: ['matches/ - Live match tracker', 'scores/ - Live scores display', 'odds/ - Live odds updates']
  },
  {
    icon: '👥',
    title: 'Social',
    description: 'Community & engagement',
    items: ['feed/ - Social feed', 'challenges/ - Friend challenges', 'chat/ - Live match chat', 'forum/ - Community discussions']
  },
  {
    icon: '🎮',
    title: 'Kids Mode',
    description: 'Safe environment for children',
    items: ['dashboard/ - Kids dashboard', 'quizzes/ - Educational quizzes', 'learning/ - Learning paths']
  },
  {
    icon: '🏆',
    title: 'Rewards',
    description: 'Achievements & gamification',
    items: ['achievements/ - Achievement system', 'leaderboard/ - Global rankings', 'coins/ - Pi Coin management']
  },
];

export function FrontendApps() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">📱 Frontend Apps Structure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {apps.map((app, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
              <span className="text-3xl">{app.icon}</span>
              {app.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{app.description}</p>
            <ul className="space-y-2">
              {app.items.map((item, i) => (
                <li 
                  key={i}
                  className="text-sm text-gray-700 py-2 border-b border-gray-300 last:border-0 transition-all hover:pl-2 hover:text-indigo-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
