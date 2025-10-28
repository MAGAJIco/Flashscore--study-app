
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MagajiCo - Your Sports Prediction Platform',
  description: 'AI-powered sports predictions and live scores',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="portal-layout">
          {children}
        </div>
      </body>
    </html>
  );
}
