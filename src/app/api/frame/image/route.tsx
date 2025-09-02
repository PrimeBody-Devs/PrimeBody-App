import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getFarcasterUser } from '@/lib/neynar';

// Using Node.js runtime to support Neynar SDK
// export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'PrimeBody';
    const subtitle = searchParams.get('subtitle') || 'Earn PRIME Tokens for Your Body Transformation';
    const fid = searchParams.get('fid');
    
    // Si tenemos un FID, obtener datos del usuario
    let farcasterUser = null;
    if (fid) {
      try {
        farcasterUser = await getFarcasterUser(parseInt(fid));
      } catch (error) {
        console.error('Error fetching user for frame image:', error);
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* User Profile (si existe) */}
          {farcasterUser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '30px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <img
                src={farcasterUser.pfpUrl}
                width="80"
                height="80"
                alt={`${farcasterUser.username} profile picture`}
                style={{ borderRadius: '50%', border: '3px solid #3b82f6' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {farcasterUser.displayName}
                </span>
                <span style={{ fontSize: '18px', color: '#94a3b8' }}>
                  @{farcasterUser.username}
                </span>
              </div>
            </div>
          )}

          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              width: '120px',
              height: '120px',
              marginBottom: '40px',
              boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5)',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
            </svg>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: farcasterUser ? '48px' : '64px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
              background: 'linear-gradient(90deg, #3b82f6, #10b981)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}
          >
            {farcasterUser ? `Welcome ${farcasterUser.displayName}!` : title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.3,
              marginBottom: '40px',
            }}
          >
            {farcasterUser ? 'Ready to start your fitness journey?' : subtitle}
          </p>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              fontSize: '20px',
              color: '#e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px' }}>🏋️</div>
              <span>AI Workouts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px' }}>💎</div>
              <span>PRIME Tokens</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px' }}>🌍</div>
              <span>Global Community</span>
            </div>
          </div>

          {/* Call to Action */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '18px',
              color: '#10b981',
              fontWeight: '600',
            }}
          >
            <span>Click to Start</span>
            <div style={{ fontSize: '20px' }}>→</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error('Error generating frame image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}