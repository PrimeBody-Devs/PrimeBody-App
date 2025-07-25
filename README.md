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
   cp .env.local.example .env.local
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