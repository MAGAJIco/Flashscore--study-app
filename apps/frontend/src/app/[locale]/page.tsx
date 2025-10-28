import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Sports Central
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered sports prediction and community platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            title="Live Matches"
            description="Real-time scores and match tracking"
            href="/live"
            icon="⚡"
          />
          <FeatureCard
            title="AI Predictions"
            description="Machine learning powered match predictions"
            href="/ai-predictions"
            icon="🤖"
          />
          <FeatureCard
            title="News"
            description="Latest sports news and updates"
            href="/news"
            icon="📰"
          />
          <FeatureCard
            title="Social Feed"
            description="Connect with sports fans"
            href="/feed"
            icon="👥"
          />
          <FeatureCard
            title="Kids Mode"
            description="Educational sports content for kids"
            href="/kids"
            icon="👶"
          />
          <FeatureCard
            title="Achievements"
            description="Track your rewards and achievements"
            href="/achievements"
            icon="🏆"
          />
          <FeatureCard
            title="Empire Builder"
            description="Build your sports empire"
            href="/empire"
            icon="🏰"
          />
          <FeatureCard
            title="Documentation"
            description="Learn about the platform"
            href="/docs"
            icon="📚"
          />
          <FeatureCard
            title="Analytics"
            description="Deep dive into sports analytics"
            href="/analytics"
            icon="📊"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
