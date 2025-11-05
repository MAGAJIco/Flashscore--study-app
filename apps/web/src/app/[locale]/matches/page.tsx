
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matches - MagajiCo',
  description: 'Browse upcoming and past football matches'
};

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Matches</h1>
        <div className="grid gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <p className="text-center text-gray-300">Loading matches...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
