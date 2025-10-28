export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="empire-layout">
          {children}
        </div>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'MagajiCo - Your Sports Prediction Platform',
  description: 'AI-powered sports predictions and live scores',
};