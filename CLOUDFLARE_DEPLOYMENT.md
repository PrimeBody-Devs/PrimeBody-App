# Cloudflare Pages Build Configuration

## Build Settings
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `.next`
- **Root directory**: `/`
- **Node.js version**: `18`

## Environment Variables (Set in Cloudflare Dashboard)

### Required
```
NEXT_PUBLIC_APP_NAME=FitCast Challenges
NEXT_PUBLIC_APP_URL=https://fitcast-challenges.pages.dev
```

### Optional
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_GA_ID=your_analytics_id_here
```

## Deployment Steps

1. **Install Cloudflare CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```

3. **Deploy to Cloudflare Pages**:
   ```bash
   npm run deploy:cloudflare
   ```

## Manual Deployment via Dashboard

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your GitHub repository
3. Set build settings as shown above
4. Add environment variables
5. Deploy

## Custom Domain Setup

1. In Cloudflare Pages dashboard
2. Go to Custom domains
3. Add your domain (e.g., `fitcast.app`)
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Performance Optimizations

- Cloudflare CDN for global edge caching
- Automatic HTTPS with SSL certificates
- Brotli compression enabled
- HTTP/3 support
- DDoS protection included