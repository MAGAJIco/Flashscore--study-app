'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Author {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  collaborationCount: number;
}

export default function AuthorPage() {
  const params = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthor() {
      try {
        const res = await fetch(`http://0.0.0.0:3001/api/news/authors/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setAuthor(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch author:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchAuthor();
    }
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Loading author profile...</div>;
  }

  if (!author) {
    return <div className="p-8">Author not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{author.name}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{author.bio}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {author.expertise.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {author.collaborationCount} collaborations
        </div>
      </div>
    </div>
  );
}