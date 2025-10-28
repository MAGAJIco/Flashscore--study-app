
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sports Central - Portal',
  description: 'Feature-Based Architecture Documentation',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-layout">
      {children}
    </div>
  );
}
