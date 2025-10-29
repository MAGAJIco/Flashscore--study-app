import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css'
import { KidsModeProvider } from './context/KidsModeContext';

export const metadata: Metadata = {
  title: 'MagajiCo',
  description: 'Sports Prediction Platform',
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages();

  return (
    <html lang={locale || 'en'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <KidsModeProvider>
            {children}
          </KidsModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}