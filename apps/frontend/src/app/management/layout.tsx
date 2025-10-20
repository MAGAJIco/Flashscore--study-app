import ManagementSidebar from "@components/ManagementSidebar";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e1e1e 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <ManagementSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}