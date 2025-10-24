import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from '@providers/SessionProvider';
import { UserPreferencesProvider } from '@providers/UserPreferencesProvider';
import { Header } from '@components/Header';
import { BottomNavigation } from '@components/BottomNavigation';
import { AppErrorBoundary } from '@components/AppErrorBoundary';
import { MobileInstallPrompter } from '@components/MobileInstallPrompter';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@styles/globals.css';
import { MobileMetaOptimizer } from './components/MobileMetaOptimizer';
import { MobileLayout } from './components/MobileLayout';
import { MobilePerformanceMonitor } from './components/MobilePerformanceMonitor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MajajiCo - AI-Powered Sports Predictions',
  description: 'Professional sports predictions powered by machine learning',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MajajiCo'
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale || 'en'} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <UserPreferencesProvider>
              <AppErrorBoundary>
                <Header />
                <Suspense fallback={null}>
                  <MobileMetaOptimizer />
                  <MobilePerformanceMonitor />
                </Suspense>
                <MobileLayout>
                  {children}
                </MobileLayout>
                <BottomNavigation />
                <Suspense fallback={null}>
                  <MobileInstallPrompter />
                </Suspense>
              </AppErrorBoundary>
            </UserPreferencesProvider>
          </SessionProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}