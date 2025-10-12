"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
}

export default function NewsDetails() {
  const params = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
        const res = await fetch(`${backendUrl}/api/news/${params.id}`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setNews(data.data || data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setNews(null); // Set news to null on error to display loading or an error message
      }
    };

    if (params.id) {
      fetchNews();
    }
  }, [params.id]);

  if (!news) return <div className="p-6">Loading...</div>;

  const daysAgo =
    (new Date().getTime() - new Date(news.publishedAt).getTime()) /
    (1000 * 60 * 60 * 24);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/news"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          <span className="text-sm font-semibold">Back to News</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span className="text-sm font-semibold">Home</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{news.title}</h1>
      <p className="text-sm text-gray-500">
        By {news.author} • {new Date(news.publishedAt).toDateString()}
      </p>

      <div className="mt-6 text-lg leading-relaxed">{news.content}</div>

      {daysAgo > 4 && (
        <div className="mt-6 p-4 bg-yellow-50 border rounded-lg text-gray-600">
          📖 This article is now in the <b>Reader Archive</b>. You’re viewing an
          older publication.
        </div>
      )}
    </div>
  );
}