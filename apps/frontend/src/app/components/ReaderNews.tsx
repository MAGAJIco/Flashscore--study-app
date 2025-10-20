"use client";
import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  preview: string;
  fullContent: string;
  publishedAt: string;
}

export default function ReaderNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news/archive")
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  return (
    <section className="p-6 bg-gray-50 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">📚 Reader Archive</h2>
      {news.map((item) => (
        <div key={item.id} className="border-b py-3">
          <h3 className="font-medium text-gray-800">{item.title}</h3>
          <p className="text-gray-600">
            {expanded === item.id ? item.fullContent : item.preview}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Published: {new Date(item.publishedAt).toLocaleDateString()}
          </p>
          <button
            onClick={() =>
              setExpanded(expanded === item.id ? null : item.id)
            }
            className="text-blue-500 text-sm"
          >
            {expanded === item.id ? "Show Less" : "Read More"}
          </button>
        </div>
      ))}
    </section>
  );
}