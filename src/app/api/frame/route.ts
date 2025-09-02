import { NextRequest, NextResponse } from 'next/server';
import { APP_CONFIG, FRAME_CONFIG } from '@/lib/constants';
import { getFarcasterUser, verifyFarcasterFid } from '@/lib/neynar';

interface FrameActionPayload {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    castId?: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: FrameActionPayload = await request.json();
    const { untrustedData } = body;
    
    // Verificar que el FID existe en Farcaster
    const farcasterUserExists = await verifyFarcasterFid(untrustedData.fid);
    
    if (!farcasterUserExists) {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${APP_CONFIG.url}/api/frame/image?title=Error&subtitle=Farcaster user not found" />
            <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="${APP_CONFIG.url}/api/frame" />
            <title>PrimeBody - User Not Found</title>
          </head>
          <body>
            <h1>Farcaster user not found</h1>
            <p>Please make sure you're using a valid Farcaster account.</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Obtener datos del usuario de Farcaster
    let farcasterUser;
    try {
      farcasterUser = await getFarcasterUser(untrustedData.fid);
    } catch (error) {
      console.error('Error getting Farcaster user:', error);
      // Continuar sin datos del usuario si hay error
    }
    
    // Log the interaction for analytics
    console.log('Frame interaction:', {
      fid: untrustedData.fid,
      username: farcasterUser?.username || 'unknown',
      buttonIndex: untrustedData.buttonIndex,
      timestamp: new Date(untrustedData.timestamp * 1000),
    });

    // Handle different button actions
    switch (untrustedData.buttonIndex) {
      case 1:
        // Button 1: Start Your Fitness Journey
        const registrationUrl = `${APP_CONFIG.url}/register?ref=farcaster&fid=${untrustedData.fid}${farcasterUser?.username ? `&username=${farcasterUser.username}` : ''}`;
        
        return NextResponse.json({
          type: 'frame',
          frameUrl: registrationUrl,
        });
      
      default:
        // Default action - redirect to main app
        return NextResponse.json({
          type: 'frame',
          frameUrl: `${APP_CONFIG.url}?ref=farcaster&fid=${untrustedData.fid}`,
        });
    }
  } catch (error) {
    console.error('Frame API error:', error);
    
    // Return error frame
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${APP_CONFIG.url}/api/frame/image?title=Error&subtitle=Something went wrong. Please try again." />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="Try Again" />
          <meta property="fc:frame:post_url" content="${APP_CONFIG.url}/api/frame" />
          <title>PrimeBody - Error</title>
        </head>
        <body>
          <h1>Error occurred</h1>
          <p>Please try again later.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

export async function GET(request: NextRequest) {
  // Handle GET request for frame preview
  const { searchParams } = new URL(request.url);
  const preview = searchParams.get('preview') === 'true';
  
  if (preview) {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${FRAME_CONFIG.imageUrl}" />
          <meta property="fc:frame:image:aspect_ratio" content="${FRAME_CONFIG.aspectRatio}" />
          <meta property="fc:frame:button:1" content="${FRAME_CONFIG.buttonText}" />
          <meta property="fc:frame:post_url" content="${FRAME_CONFIG.postUrl}" />
          <meta property="og:title" content="PrimeBody" />
          <meta property="og:description" content="Transform your body with real crypto rewards on Farcaster" />
          <meta property="og:image" content="${FRAME_CONFIG.imageUrl}" />
          <title>PrimeBody - Farcaster Frame</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              color: white;
              margin: 0;
              padding: 40px;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .container {
              text-align: center;
              max-width: 600px;
            }
            h1 {
              font-size: 3rem;
              margin-bottom: 1rem;
              background: linear-gradient(90deg, #3b82f6, #10b981);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            p {
              font-size: 1.2rem;
              color: #94a3b8;
              margin-bottom: 2rem;
            }
            .features {
              display: flex;
              gap: 2rem;
              justify-content: center;
              margin: 2rem 0;
            }
            .feature {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
            }
            .emoji {
              font-size: 2rem;
            }
            .cta {
              background: linear-gradient(90deg, #3b82f6, #10b981);
              color: white;
              padding: 1rem 2rem;
              border-radius: 0.5rem;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>PrimeBody</h1>
            <p>Earn PRIME Tokens for Your Body Transformation</p>
            <div class="features">
              <div class="feature">
                <div class="emoji">🏋️</div>
                <span>AI Workouts</span>
              </div>
              <div class="feature">
                <div class="emoji">💎</div>
                <span>PRIME Tokens</span>
              </div>
              <div class="feature">
                <div class="emoji">🌍</div>
                <span>Global Community</span>
              </div>
            </div>
            <a href="${APP_CONFIG.url}/register" class="cta">Start Your Journey</a>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
  
  return NextResponse.json({
    message: 'PrimeBody Frame API',
    version: 'vNext',
    endpoints: {
      image: `${APP_CONFIG.url}/api/frame/image`,
      action: `${APP_CONFIG.url}/api/frame`,
    },
  });
}