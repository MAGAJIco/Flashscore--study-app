import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Inter, Roboto } from 'next/font/google';
import './styles/globals.css';
import './styles/mobile-optimizations.css';
import './styles/responsive-layout.css';
import './fonts.css';
import '../themes/theme-base.css';
import {
  AppWrapper,
  MobileOptimizationWrapper,
  HydrationSafeWrapper,
  GlobalErrorHandler,
  Header,
} from '@/app/components';
import { locales } from '@/i18n';
import type { Metadata, Viewport } from 'next';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['Inter-Fallback', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  fallback: ['Roboto-Fallback', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  title: 'MagajiCo - AI Sports Predictions',
  description: 'AI-Powered Sports Predictions & Analytics - Live Matches, News, and Intelligent Forecasting',
  applicationName: 'MagajiCo Sports',
  keywords: ['sports predictions', 'AI analytics', 'live scores', 'sports betting', 'football predictions'],
  authors: [{ name: 'MagajiCo' }],
  creator: 'MagajiCo',
  publisher: 'MagajiCo',
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://magajico.com'),
  openGraph: {
    type: 'website',
    title: 'MagajiCo - AI Sports Predictions',
    description: 'AI-Powered Sports Predictions & Analytics - Live Matches, News, and Intelligent Forecasting',
    url: 'https://magajico.com',
    siteName: 'MagajiCo Sports',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MagajiCo Sports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MagajiCo - AI Sports Predictions',
    description: 'AI-Powered Sports Predictions & Analytics - Live Matches, News, and Intelligent Forecasting',
    creator: '@magajico',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MagajiCo',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MobileOptimizationWrapper>
            <AppWrapper>
              <Header />
              <HydrationSafeWrapper>
                {children}
              </HydrationSafeWrapper>
            </AppWrapper>
          </MobileOptimizationWrapper>
          <GlobalErrorHandler />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}