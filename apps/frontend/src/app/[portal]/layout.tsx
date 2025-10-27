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

export const metadata = {
  title: 'Sports Central - Portal',
  description: 'Feature-Based Architecture Documentation',
};