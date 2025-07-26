# FitCast Challenges - Landing Page

Una landing page profesional para la Mini App de Farcaster que combina fitness con recompensas crypto reales.

## 🚀 Características

- **Next.js 14** con App Router y TypeScript
- **Tailwind CSS** con design system personalizado
- **Framer Motion** para animaciones suaves
- **Dark/Light Mode** con persistencia
- **Responsive Design** mobile-first
- **SEO Optimizado** con meta tags completos
- **Performance** optimizado para Lighthouse 90+

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Temas**: next-themes
- **Iconos**: Lucide React
- **Linting**: ESLint + Prettier

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App Router (Next.js 14)
├── components/          # Componentes React
│   ├── layout/         # Header, Footer, Navigation
│   ├── sections/       # Hero, Features, Demo, CTA
│   ├── ui/            # Button, Card, Modal
│   └── icons/         # Iconos personalizados
├── lib/               # Utilidades y configuración
├── types/             # Tipos TypeScript
└── styles/            # Estilos globales
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
   NEXT_PUBLIC_APP_NAME=FitCast
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Ejecutar ESLint
- `npm run lint:fix` - Corregir errores de ESLint
- `npm run format` - Formatear código con Prettier
- `npm run type-check` - Verificar tipos TypeScript
- `npm run clean` - Limpiar archivos de build

## 🎨 Design System

### Colores
- **Primary**: Azul (#3b82f6)
- **Accent**: Verde (#10b981)
- **Background**: Dinámico según tema
- **Surface**: Superficies elevadas

### Tipografía
- **Font Family**: Inter (sans-serif)
- **Scale**: 12px - 48px con line-heights optimizados

### Espaciado
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

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

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