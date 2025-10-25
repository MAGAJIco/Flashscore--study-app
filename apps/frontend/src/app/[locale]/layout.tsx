import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AppWrapper } from '@components/AppWrapper';
import '@/app/styles/globals.css';

const locales = ['en', 'es', 'fr', 'de', 'pt'];

// Resilient Brand Header Component - Always renders
function BrandHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-2xl font-bold">MagajiCo</h1>
        <p className="text-sm opacity-90">AI-Powered Sports Predictions</p>
      </div>
    </div>
  );
}

// Error Fallback Component with MagajiCo branding
function ErrorFallback({ error }: { error?: Error }) {
  return (
    <html lang="en">
      <body>
        <BrandHeader />
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Section Unavailable
              </h2>
              <p className="text-gray-600 mb-4">
                {error?.message || 'This section is temporarily unavailable. Other features may still work.'}
              </p>
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm text-blue-800">
                  <strong>MagajiCo is still running!</strong> Try refreshing or navigate to another section.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  console.log('🏗️ RootLayout: Starting render for locale:', locale);

  if (!locales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages();
    console.log('✅ RootLayout: Messages loaded successfully');
  } catch (error) {
    console.error('❌ RootLayout: Failed to load messages', error);
    return <ErrorFallback error={error as Error} />;
  }

  console.log('🎨 RootLayout: HTML body rendered at', new Date().toISOString());

  return (
    <html lang={locale}>
      <body>
        <BrandHeader />
        <div className="pt-20">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AppWrapper>
              {children}
            </AppWrapper>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}