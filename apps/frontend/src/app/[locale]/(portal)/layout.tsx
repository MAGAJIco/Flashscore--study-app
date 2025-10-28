
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MagajiCo Empire Central',
  description: 'MagajiCo Empire Central - Your Command Center',
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
