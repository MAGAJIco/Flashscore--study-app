"use client";
import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  preview: string;
  fullContent: string;
  publishedAt: string;
}

export default function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news/latest")
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  return (
    <section className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">📰 Latest News</h2>
      {news.map((item) => (
        <div key={item.id} className="border-b py-3">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-gray-700">
            {expanded === item.id ? item.fullContent : item.preview}
          </p>
          <button
            onClick={() =>
              setExpanded(expanded === item.id ? null : item.id)
            }
            className="text-blue-600 text-sm"
          >
            {expanded === item.id ? "Show Less" : "Read More"}
          </button>
        </div>
      ))}
      <a
        href="/reader"
        className="block mt-4 text-center text-blue-700 font-medium"
      >
        📚 Read Older Stories
      </a>
    </section>
  );
}