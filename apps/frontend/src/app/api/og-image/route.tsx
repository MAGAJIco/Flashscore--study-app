
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Sports Central';
  const prediction = searchParams.get('prediction') || '';
  const confidence = searchParams.get('confidence') || '0';
  const sport = searchParams.get('sport') || 'Sports';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#00ff88',
            }}
          >
            Sports Central
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          {prediction && (
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#00ff88',
              }}
            >
              {prediction}
            </div>
          )}

          <div
            style={{
              fontSize: 48,
              color: '#cbd5e1',
            }}
          >
            {confidence}% Confidence
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              padding: '12px 24px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              color: '#3b82f6',
              fontSize: 32,
              fontWeight: 'bold',
            }}
          >
            {sport.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
