import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function KidsModePage() {
  const { locale } = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-5xl font-bold mb-8 text-purple-700">Welcome to Kids Mode!</h1>
      <p className="text-xl text-gray-700 mb-12">
        This is a safe and fun space designed just for kids. Explore and play!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Example Content Card 1 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <img src="/images/games-icon.png" alt="Games" className="w-24 h-24 mb-4"/>
          <h2 className="text-2xl font-semibold mb-3 text-pink-600">Fun Games</h2>
          <p className="text-gray-600 text-center">
            Play exciting and educational games that make learning a blast!
          </p>
          <Link
            href={`/${locale}/games`}
            className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-bold text-sm hover:shadow-md transition-all"
          >
            Play Now!
          </Link>
        </div>

        {/* Example Content Card 2 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <img src="/images/stories-icon.png" alt="Stories" className="w-24 h-24 mb-4"/>
          <h2 className="text-2xl font-semibold mb-3 text-purple-600">Amazing Stories</h2>
          <p className="text-gray-600 text-center">
            Dive into magical stories and let your imagination soar.
          </p>
          <Link
            href={`/${locale}/stories`}
            className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-full font-bold text-sm hover:shadow-md transition-all"
          >
            Read Along
          </Link>
        </div>

        {/* Example Content Card 3 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <img src="/images/art-icon.png" alt="Art" className="w-24 h-24 mb-4"/>
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">Creative Corner</h2>
          <p className="text-gray-600 text-center">
            Unleash your inner artist with fun drawing and coloring activities.
          </p>
          <Link
            href={`/${locale}/art`}
            className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full font-bold text-sm hover:shadow-md transition-all"
          >
            Get Creative
          </Link>
        </div>

        {/* Example Content Card 4 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <img src="/images/learning-icon.png" alt="Learning" className="w-24 h-24 mb-4"/>
          <h2 className="text-2xl font-semibold mb-3 text-teal-500">Learning Fun</h2>
          <p className="text-gray-600 text-center">
            Discover new things with interactive learning modules.
          </p>
          <Link
            href={`/${locale}/learning`}
            className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-full font-bold text-sm hover:shadow-md transition-all"
          >
            Start Learning
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <Link
          href={`/${locale}`}
          className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Return to Main Dashboard
        </Link>
      </div>
    </div>
  );
}