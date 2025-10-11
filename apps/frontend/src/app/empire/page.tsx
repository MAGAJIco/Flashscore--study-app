import MagajiCoFoundation from './MagajiCoFoundation/MagajiCoFoundation';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* AI CEO Quick Access */}
      <div className="fixed top-20 right-4 z-50">
        <Link 
          href="/empire/ai-ceo"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          🧠 AI CEO
        </Link>
      </div>
      
      <MagajiCoFoundation />
    </div>
  );
}
