
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sports Central - Portal',
  description: 'Feature-Based Architecture Documentation',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
