import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { KidsModeProvider } from '../context/KidsModeContext';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AppErrorBoundary } from '@/app/components/AppErrorBoundary';
import { MobileAppLauncher } from '../components/MobileAppLauncher'; // Added MobileAppLauncher import

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' }
  ];
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <KidsModeProvider>
            <AppErrorBoundary>
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </AppErrorBoundary>
            <MobileAppLauncher /> {/* Included MobileAppLauncher */}
          </KidsModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}