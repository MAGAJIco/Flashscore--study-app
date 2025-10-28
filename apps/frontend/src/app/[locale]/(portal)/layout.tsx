
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sports Central - Empire',
  description: 'MagajiCo Empire Central - Feature-Based Architecture',
};

export default function EmpireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="empire-layout">
      {children}
    </div>
  );
}
