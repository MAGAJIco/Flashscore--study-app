'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

// -----------------------------
// Locale Metadata (for SEO)
// -----------------------------
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = params.locale || "en";

  const titles: Record<string, string> = {
    en: "Sports Central - Predict, Play & Win",
    fr: "Sports Central - Prédisez, Jouez et Gagnez",
    es: "Sports Central - Predice, Juega y Gana",
  };

  const descriptions: Record<string, string> = {
    en: "Your one-stop platform for sports predictions, live updates, analytics, and community engagement.",
    fr: "Votre plateforme unique pour les prédictions sportives, les mises à jour en direct et les analyses.",
    es: "Tu plataforma integral para predicciones deportivas, actualizaciones en vivo y análisis.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

// -----------------------------
// Static Params for Locales
// -----------------------------
export async function generateStaticParams() {
  const locales = ["en", "fr", "es"];
  return locales.map((locale) => ({ locale }));
}

// -----------------------------
// Main Page Component
// -----------------------------
export default function HomePage() {
  const [showMore, setShowMore] = useState(false);
  const params = useParams();
  const locale = params?.locale || "en";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold text-blue-700">Sports Central</h1>
          <nav className="space-x-6">
            <Link href={`/${locale}/predictions`} className="hover:text-blue-700">Predictions</Link>
            <Link href={`/${locale}/matches`} className="hover:text-blue-700">Matches</Link>
            <Link href={`/${locale}/challenges`} className="hover:text-blue-700">Challenges</Link>
            <Link href={`/${locale}/chats`} className="hover:text-blue-700">Chats</Link>
            <Link href={`/${locale}/achievements`} className="hover:text-blue-700">Achievements</Link>
            <Link href={`/${locale}/analytics`} className="hover:text-blue-700">Analytics</Link>
            <Link href={`/${locale}/kids`} className="hover:text-blue-700">Kids</Link>
            <Link href={`/${locale}/live`} className="hover:text-blue-700">Live</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-4">Welcome to Sports Central</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            Your one-stop platform for sports predictions, live updates, analytics, and community engagement.
          </p>
          <Link
            href={`/${locale}/predictions`}
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Start Predicting
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-8">About Sports Central</h3>
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10">
          Sports Central is designed for fans, analysts, and players who love the thrill of predictions, live match insights, and performance analytics.
          {showMore && (
            <span>
              {" "}
              Join exciting challenges, chat with fans worldwide, and track your achievements as you climb the leaderboard.
            </span>
          )}
        </p>
        <div className="text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="bg-blue-700 text-white px-6 py-2 rounded-xl hover:bg-blue-800 transition"
          >
            {showMore ? "Show Less" : "Read More"}
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { title: "Match Predictions", desc: "Predict outcomes and win points as you rise in global rankings." },
            { title: "Live Updates", desc: "Stay updated with scores and match events in real-time." },
            { title: "Community Chat", desc: "Engage with other fans and share your opinions." },
            { title: "Performance Analytics", desc: "Analyze player stats and improve your prediction accuracy." },
            { title: "Challenges & Rewards", desc: "Participate in fun challenges and unlock achievements." },
            { title: "For Kids", desc: "Safe and fun sports games for the younger fans." },
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Join the Game?</h3>
        <p className="mb-6 text-lg">Predict, win, and connect with fans around the world.</p>
        <Link
          href={`/${locale}/predictions`}
          className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-16">
        <p>© {new Date().getFullYear()} Sports Central. All rights reserved.</p>
      </footer>
    </main>
  );
}