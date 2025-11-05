
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Matches - MagajiCo',
  description: 'Watch live football matches and get real-time predictions'
};

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Live Matches</h1>
        <div className="grid gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <p className="text-center text-gray-300">No live matches at the moment</p>
            <p className="text-center text-sm text-gray-400 mt-2">Check back soon for live match coverage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
