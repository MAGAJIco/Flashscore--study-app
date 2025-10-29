"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoogleNavBar } from '@/app/components/layout/GoogleNavBar';
import { MagajiCoAppLauncher } from '@/app/components/MagajiCoAppLauncher';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <GoogleNavBar />
      <main className="pt-0">
        {children}
      </main>
      <MagajiCoAppLauncher />
    </div>
  );
}