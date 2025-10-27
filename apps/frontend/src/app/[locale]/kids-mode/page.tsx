"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Shield, Star, Book, Trophy } from 'lucide-react';

export default function KidsModePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Shield className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kids Mode
            </h1>
            <Shield className="w-12 h-12 text-purple-600" />
          </div>

          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 mb-4">
              A safe and fun way for kids to learn about sports!
            </p>
            <p className="text-gray-600">
              Age-appropriate content with parental controls
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Book className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-900">Learn Sports</h3>
              </div>
              <p className="text-purple-800">
                Discover fun facts and rules about different sports in a kid-friendly way!
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-pink-600" />
                <h3 className="text-xl font-bold text-pink-900">Fun Quizzes</h3>
              </div>
              <p className="text-pink-800">
                Test your sports knowledge with interactive quizzes and games!
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">Earn Badges</h3>
              </div>
              <p className="text-blue-800">
                Complete challenges and earn special badges for your achievements!
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`/${locale}`}
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Return to Main Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 text-center">
          <p className="text-gray-600">
            <Shield className="w-5 h-5 inline-block mr-2" />
            Parents: This mode provides age-appropriate content and parental controls.
          </p>
        </div>
      </div>
    </div>
  );
}
