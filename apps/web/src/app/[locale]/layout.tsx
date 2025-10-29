import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { KidsModeProvider } from '../context/KidsModeContext';
import { notFound } from 'next/navigation';
import { MobileAppLauncher } from '../components/MobileAppLauncher'; // Added MobileAppLauncher import

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
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
    <NextIntlClientProvider messages={messages}>
      <KidsModeProvider>
        {children}
        <MobileAppLauncher /> {/* Included MobileAppLauncher */}
      </KidsModeProvider>
    </NextIntlClientProvider>
  );
}