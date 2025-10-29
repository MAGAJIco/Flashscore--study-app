
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { bottomNavItems, drawerSections, appMenuItems } from './navigation-items';

export function useNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = useCallback((href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname]);

  const navigate = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return {
    pathname,
    isActive,
    navigate,
    bottomNavItems,
    drawerSections,
    appMenuItems,
  };
}
