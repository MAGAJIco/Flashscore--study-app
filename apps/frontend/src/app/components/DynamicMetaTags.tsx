
"use client";

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'prediction' | 'leaderboard';
  author?: string;
  publishedTime?: string;
}

export default function DynamicMetaTags({
  title,
  description,
  image = '/icons/icon-512x512.png',
  type = 'website',
  author,
  publishedTime
}: MetaTagsProps) {
  const pathname = usePathname();
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.replit.app'}${pathname}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title} | Sports Central</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Sports Central" />
      
      {author && <meta property="article:author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@SportsCenter" />

      {/* Deep Linking */}
      <meta property="al:ios:url" content={`sportscentral://content${pathname}`} />
      <meta property="al:ios:app_store_id" content="your-app-id" />
      <meta property="al:ios:app_name" content="Sports Central" />
      <meta property="al:android:url" content={`sportscentral://content${pathname}`} />
      <meta property="al:android:package" content="com.sportscentral.app" />
      <meta property="al:android:app_name" content="Sports Central" />
      <meta property="al:web:url" content={url} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  );
}
