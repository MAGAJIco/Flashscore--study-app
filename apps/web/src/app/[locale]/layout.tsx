import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { GoogleNavBar } from '../components/layout/GoogleNavBar';
import { HealthMonitorInitializer } from '@/components/HealthMonitorInitializer';
import { MobileOptimizer } from '../components/MobileOptimizer';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { AppErrorBoundary } from '../components/AppErrorBoundary';
import { ServiceStatusIndicator } from '../components/ServiceStatusIndicator';
import '../globals.css';

// Font optimization
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

// Define valid locales as const
const VALID_LOCALES = ['en', 'es', 'fr', 'de'] as const;
type Locale = typeof VALID_LOCALES[number];

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Viewport configuration
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
    ],
  };
}

// Metadata configuration
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  
  const titles: Record<Locale, string> = {
    en: 'Your App Name',
    es: 'Nombre de tu aplicación',
    fr: 'Nom de votre application',
    de: 'Name Ihrer Anwendung'
  };
  
  const descriptions: Record<Locale, string> = {
    en: 'Your app description',
    es: 'Descripción de tu aplicación',
    fr: 'Description de votre application',
    de: 'Beschreibung Ihrer Anwendung'
  };
  
  const validLocale = VALID_LOCALES.includes(locale as Locale) ? (locale as Locale) : 'en';
  
  return {
    title: titles[validLocale],
    description: descriptions[validLocale],
  };
}

// Static params generation
export async function generateStaticParams() {
  return VALID_LOCALES.map(locale => ({ locale }));
}

// Locale validation helper
function isValidLocale(locale: string): locale is Locale {
  return VALID_LOCALES.includes(locale as Locale);
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error);
    notFound();
  }

  return (
    <html 
      lang={locale} 
      suppressHydrationWarning 
      className="h-full"
    >
      <body className={`${inter.className} antialiased h-full bg-background text-foreground`}>
        <AppErrorBoundary>
          <MobileOptimizer />
          <HealthMonitorInitializer />
          <ServiceStatusIndicator />
          
          <NextIntlClientProvider 
            messages={messages}
            locale={locale}
            timeZone="UTC"
          >
            <div className="flex flex-col min-h-screen">
              <GoogleNavBar />
              
              <main className="flex-1 pt-16 pb-20 safe-bottom mobile-container">
                {children}
              </main>
              
              <MobileBottomNav />
            </div>
          </NextIntlClientProvider>
        </AppErrorBoundary>
      </body>
    </html>
  );
}