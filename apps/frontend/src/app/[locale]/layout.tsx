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
import { MobileMetaOptimizer } from '@components/MobileMetaOptimizer';
import { MobileLayout } from '@components/MobileLayout';
import { MobilePerformanceMonitor } from '@components/MobilePerformanceMonitor';
import { HydrationMonitor } from '@components/HydrationMonitor';
import { HydrationCoordinator } from '@components/HydrationCoordinator';
import { ThemeInitializer } from '@components/ThemeInitializer';
import { DebugPanel } from '@components/DebugPanel';
import { RenderDebugger } from '@components/RenderDebugger';

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
  console.log('🏗️ RootLayout: Starting render for locale:', locale);

  let messages;
  try {
    messages = await getMessages();
    console.log('✅ RootLayout: Messages loaded successfully');
  } catch (error) {
    console.error('❌ RootLayout: Failed to load messages:', error);
    throw error;
  }

  console.log('✅ RootLayout: Rendering complete');

  return (
    <html lang={locale || 'en'} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `console.log('🎨 RootLayout: HTML body rendered at', new Date().toISOString());`
          }}
        />
        <HydrationCoordinator priority="high">
          <NextIntlClientProvider messages={messages}>
            <SessionProvider>
              <UserPreferencesProvider>
                <AppErrorBoundary>
                  <ThemeInitializer />
                  <Suspense fallback={
                    <div style={{ minHeight: '60px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>Loading Header...</span>
                    </div>
                  }>
                    <Header />
                  </Suspense>
                  <Suspense fallback={null}>
                    <MobileMetaOptimizer />
                    <MobilePerformanceMonitor />
                    <HydrationMonitor />
                  </Suspense>
                  <MobileLayout>
                    {children}
                  </MobileLayout>
                  <Suspense fallback={
                    <div style={{ minHeight: '60px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>Loading Navigation...</span>
                    </div>
                  }>
                    <BottomNavigation />
                  </Suspense>
                  <Suspense fallback={null}>
                    <MobileInstallPrompter />
                  </Suspense>
                </AppErrorBoundary>
              </UserPreferencesProvider>
            </SessionProvider>
          </NextIntlClientProvider>
          <Analytics />
          <SpeedInsights />
          <Suspense fallback={null}>
            <RenderDebugger />
          </Suspense>
        </HydrationCoordinator>
      </body>
    </html>
  );
}