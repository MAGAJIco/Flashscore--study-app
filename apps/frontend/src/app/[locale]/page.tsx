'use client';

import { GoogleNavBar } from '../components/layout/GoogleNavBar';
import { LiveCarousel } from '../components/carousels/LiveCarousel';
import { NewsCarousel } from '../components/carousels/NewsCarousel';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <GoogleNavBar />
      
      <div className="container mx-auto px-5 py-8 max-w-7xl">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Sports Central
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            🏆 AI-powered sports prediction and community platform with real-time tracking
          </p>
        </div>

        <div className="space-y-8 mb-10">
          <LiveCarousel />
          <NewsCarousel />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Feature Apps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Portal"
              description="Main dashboard and navigation hub"
              href={`/${locale}/empire`}
              icon="🏠"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              title="AI Predictions"
              description="Machine learning powered match predictions"
              href={`/${locale}/ai-predictions`}
              icon="🤖"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              title="Live Tracking"
              description="Real-time scores and match updates"
              href={`/${locale}/matches`}
              icon="⚡"
              gradient="from-red-500 to-orange-500"
            />
            <FeatureCard
              title="Social Feed"
              description="Connect with sports fans worldwide"
              href={`/${locale}/feed`}
              icon="👥"
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              title="Kids Mode"
              description="Safe educational sports content"
              href={`/${locale}/kids`}
              icon="🎮"
              gradient="from-yellow-500 to-amber-500"
            />
            <FeatureCard
              title="Rewards"
              description="Track achievements and earn coins"
              href={`/${locale}/achievements`}
              icon="🏆"
              gradient="from-indigo-500 to-blue-500"
            />
            <FeatureCard
              title="Analytics"
              description="Deep dive into sports statistics"
              href={`/${locale}/analytics`}
              icon="📊"
              gradient="from-teal-500 to-cyan-500"
            />
            <FeatureCard
              title="Chat"
              description="Live match discussions"
              href={`/${locale}/chat`}
              icon="💬"
              gradient="from-pink-500 to-rose-500"
            />
            <FeatureCard
              title="Documentation"
              description="Learn about the platform"
              href={`/${locale}/docs`}
              icon="📚"
              gradient="from-violet-500 to-purple-500"
            />
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>🏗️ Feature-Based Architecture | Built with Next.js 14 & FastAPI</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  icon,
  gradient,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 border-transparent hover:border-purple-200">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}
