
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="empire-docs">{children}</div>;
}

export const metadata = {
  title: 'Sports Central - Empire Documentation',
  description: 'Feature-Based Architecture Documentation',
};
