"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": origin ? `${origin}/` : "/"
      },
      ...items.map((item, index) => {
        const isLastItem = index === items.length - 1;
        const itemUrl = item.href 
          ? (origin ? `${origin}${item.href}` : item.href)
          : (isLastItem && origin ? `${origin}${pathname}` : undefined);
        
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label,
          "item": itemUrl
        };
      })
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          <li className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-1 text-[#6e6e73] hover:text-[#007AFF] transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-[#d1d1d6]" />
              
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-[#6e6e73] hover:text-[#007AFF] transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#1d1d1f] font-semibold">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
