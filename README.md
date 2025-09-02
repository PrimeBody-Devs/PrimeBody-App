# PrimeBody - Landing Page

A professional landing page for the Farcaster Mini App that transforms your body with real crypto rewards.

## 🚀 Features

- **Next.js 14** con App Router y TypeScript
- **Tailwind CSS** con design system personalizado
- **Framer Motion** para animaciones suaves
- **Dark/Light Mode** con persistencia
- **Responsive Design** mobile-first
- **SEO Optimizado** con meta tags completos
- **Web3 Integration** con Wagmi y Base Network
- **Performance** optimizado para Lighthouse 90+

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Temas**: next-themes
- **Iconos**: Lucide React
- **Linting**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── app/                 # App Router (Next.js 14)
├── components/          # React Components
│   ├── layout/         # Header, Footer, Navigation
│   ├── sections/       # Hero, Features, Demo, CTA
│   ├── ui/            # Button, Card, Modal
│   └── icons/         # Custom Icons
├── lib/               # Utilities and Configuration
├── types/             # TypeScript Types
└── styles/            # Global Styles
```

## 🚀 Inicio Rápido

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   # Create .env.local file
   touch .env.local
   ```
   
   Add the following to your `.env.local`:
   ```env
   # WalletConnect Configuration (Optional)
   # Get your project ID from https://cloud.walletconnect.com/
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=PrimeBody
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

## 📝 Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types
- `npm run clean` - Clean build files

## 🎨 Design System

### Colors
- **Primary**: Azul (#3b82f6)
- **Accent**: Verde (#10b981)
- **Background**: Dinámico según tema
- **Surface**: Superficies elevadas

### Typography
- **Font Family**: Inter (sans-serif)
- **Scale**: 12px - 48px con line-heights optimizados

### Spacing
- **Sistema**: 4px base unit
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)

## 🔧 Configuración

### Temas
El proyecto soporta dark/light mode automático con:
- Detección de preferencia del sistema
- Toggle manual
- Persistencia en localStorage

### SEO
Configuración completa de meta tags:
- Open Graph para redes sociales
- Twitter Cards
- Structured Data
- Sitemap automático

### Performance
Optimizaciones incluidas:
- Code splitting automático
- Image optimization
- Font optimization
- CSS purging

### Web3 Configuration
El proyecto incluye integración con Web3 siguiendo las mejores prácticas de Base:

#### **Tecnologías**
- **Wagmi v2** - Biblioteca moderna para interacción con Ethereum
- **Viem** - Cliente TypeScript para transacciones y contratos
- **Base Network** - Red principal (mainnet y testnet soportados)
- **WalletConnect v2** - Conexión móvil (opcional)
- **MetaMask** y **Coinbase Wallet** - Wallets soportados

#### **Características**
- ✅ **Detección automática de red** - Detecta si el usuario está en Base
- ✅ **Cambio de red automático** - Botón para cambiar a Base si está en otra red
- ✅ **Validación de direcciones** - Verificación de formato de direcciones
- ✅ **Formateo de balances** - Manejo correcto de decimales y precision
- ✅ **Explorer integration** - Enlaces directos a Basescan
- ✅ **Error handling** - Manejo robusto de errores de conexión
- ✅ **SSR compatible** - Funciona con Server-Side Rendering

#### **Configuración**
```env
# WalletConnect (opcional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# App Configuration
NEXT_PUBLIC_APP_NAME=FitCast
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **Notas**
- **Desarrollo**: Solo MetaMask disponible para evitar errores de COOP
- **Producción**: Todos los wallets disponibles
- **WalletConnect**: Opcional, requiere project ID de cloud.walletconnect.com
- **Redes**: Soporte completo para Base mainnet y testnet

## 🚀 Deployment

### Pre-deployment Checklist
```bash
# Run all checks before deploying
npm run precommit      # Lint + type check
npm run build          # Test production build
npm run build:analyze  # Check bundle size
npm run lighthouse     # Performance audit
```

### Vercel (Recomendado)

#### 1. Environment Variables
Configure in Vercel Dashboard:
```env
NEXT_PUBLIC_APP_NAME=PrimeBody
NEXT_PUBLIC_APP_URL=https://primebody.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

#### 2. Build Settings
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node.js Version: 18.x

#### 3. Deploy
```bash
npm run build
vercel --prod
```

### Performance Targets
- Lighthouse Performance: 90+
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Bundle Size: < 500KB total JS

### Post-deployment
- [ ] Verify all pages load correctly
- [ ] Test Core Web Vitals
- [ ] Check analytics tracking
- [ ] Verify SEO meta tags
- [ ] Test social media sharing

### Otros Proveedores
```bash
npm run build
npm run start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔗 Enlaces

- [Farcaster](https://farcaster.xyz/)
- [Base](https://base.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)