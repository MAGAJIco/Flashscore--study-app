
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { KidsModeProvider } from '../context/KidsModeContext';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
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
      </KidsModeProvider>
    </NextIntlClientProvider>
  );
}
