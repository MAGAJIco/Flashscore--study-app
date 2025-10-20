"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": typeof window !== 'undefined' ? `${window.location.origin}/` : "/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href && typeof window !== 'undefined' 
          ? `${window.location.origin}${item.href}` 
          : undefined
      }))
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
