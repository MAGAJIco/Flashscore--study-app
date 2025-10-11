
"use client";

import Link from "next/link";
import { useState } from "react";
import AuthorsSidebar from "@components/AuthorsSidebar";

// Mock data (replace with MongoDB later)
const myArticles = [
  { id: 1, title: "Match Analysis: Eagles vs Lions", date: "2025-10-01" },
  { id: 2, title: "Why Team Z Will Win the League", date: "2025-09-28" },
];

export default function AuthorPage() {
  const [hover, setHover] = useState(false);
  const [search, setSearch] = useState("");

  const filteredArticles = myArticles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorsSidebar />
      
      {/* Main Content */}
      <div className="ml-80">
        {/* Hover Menu */}
        <div
          className="relative bg-white shadow p-4"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <h1 className="text-2xl font-bold">Author Dashboard</h1>
          {hover && (
            <div className="absolute left-0 top-full w-full bg-white shadow-md flex justify-around p-4 z-50">
              <Link href="/">🏠 Home</Link>
              <Link href="/news">📰 News</Link>
              <Link href="/predictions">📊 Predictions</Link>
              <Link href="/archive">📂 Archive</Link>
              <Link href="/author">✍️ Author</Link>
            </div>
          )}
        </div>

        {/* Author Tools */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">✍️ Manage Your Articles</h2>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search your articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          {/* Publish button */}
          <Link href="/author/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              ➕ Publish New Article
            </button>
          </Link>

          {/* List of articles */}
          <div className="space-y-3">
            {filteredArticles.map((a) => (
              <div
                key={a.id}
                className="p-3 bg-white shadow flex justify-between items-center rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{a.title}</h3>
                  <p className="text-sm text-gray-500">{a.date}</p>
                </div>
                <div className="space-x-2">
                  <button className="text-blue-600">✏️ Edit</button>
                  <button className="text-red-600">🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
