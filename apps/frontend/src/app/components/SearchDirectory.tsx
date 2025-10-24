import { useState, useEffect, useRef } from 'react';
import { useMobile } from '@hooks/useMobile';

interface SearchResult {
  id: string;
  name: string;
  description?: string;
}

export function SearchDirectory() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();

  // Simulate search filtering
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      // Replace this with your API call
      const filtered: SearchResult[] = mockSearchData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={isMobile ? 'Search...' : 'Search directory...'}
        className="w-full border rounded-2xl p-3 outline-none shadow-sm"
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute bg-white border rounded-2xl shadow-md mt-2 w-full max-h-60 overflow-y-auto z-10">
          {results.map((result) => (
            <li
              key={result.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(result.name);
                setIsOpen(false);
              }}
            >
              <p className="font-medium">{result.name}</p>
              {result.description && (
                <p className="text-sm text-gray-500">{result.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 🔹 Mock data for demonstration (replace with API or DB results)
const mockSearchData: SearchResult[] = [
  { id: '1', name: 'Golden Palm Resort', description: 'Luxury stay and spa' },
  { id: '2', name: 'Michael Junction', description: 'Bustling trade center' },
  { id: '3', name: 'Pear Tree Compound', description: 'Historic landmark' },
];