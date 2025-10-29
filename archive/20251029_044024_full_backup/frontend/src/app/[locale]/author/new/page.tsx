"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const [hover, setHover] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Later: send to backend (MongoDB API)
    console.log({
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()),
    });

    // Success → redirect back
    alert("✅ Article submitted successfully!");
    router.push("/author");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hover Menu */}
      <div
        className="relative bg-white shadow p-4 flex justify-between items-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h1 className="text-2xl font-bold">Publish New Article</h1>
        <Link href="/author" className="text-blue-600 hover:underline">
          ⬅ Back to Dashboard
        </Link>
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

      {/* Form */}
      <div className="p-6 max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded min-h-[150px]"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            🚀 Publish
          </button>
        </form>
      </div>
    </div>
  );
}