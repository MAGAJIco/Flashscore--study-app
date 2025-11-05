import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { GoogleNavBar } from '../components/layout/GoogleNavBar';
import { HealthMonitorInitializer } from '@/components/HealthMonitorInitializer';
import { MobileOptimizer } from '../components/MobileOptimizer';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { AppErrorBoundary } from '../components/AppErrorBoundary';
import { ServiceStatusIndicator } from '../components/ServiceStatusIndicator';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' }
  ];
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  const validLocales = ['en', 'es', 'fr', 'de'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error('Failed to load messages:', error);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <AppErrorBoundary>
          <MobileOptimizer />
          <HealthMonitorInitializer />
          <ServiceStatusIndicator />
          <NextIntlClientProvider messages={messages}>
            <GoogleNavBar />
            <main className="pt-16 pb-20 safe-bottom mobile-container">
              {children}
            </main>
            <MobileBottomNav />
          </NextIntlClientProvider>
        </AppErrorBoundary>
      </body>
    </html>
  );
}