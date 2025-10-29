
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EmpireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/en' }];
    
    paths.forEach((path, index) => {
      if (path !== 'en') {
        const href = '/' + paths.slice(0, index + 1).join('/');
        breadcrumbs.push({
          label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
          href,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen">
      {breadcrumbs.length > 1 && (
        <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <span className="text-gray-500">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-300">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-blue-400 hover:text-blue-300">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
