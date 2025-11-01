import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <h2 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Page not found
        </p>
        <Link
          href="/en"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}