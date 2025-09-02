import { LandingPageContent } from '@/types/content';

export const landingPageContent: LandingPageContent = {
  hero: {
    title: "Transforma tu cuerpo con PrimeBody",
    subtitle: "Únete a desafíos fitness diarios, gana PRIME tokens y comparte tu progreso en Farcaster. La primera Mini App que combina fitness con Web3.",
    ctaText: "Comenzar Transformación",
    backgroundImage: "/images/hero-bg.jpg"
  },
  features: [
    {
      id: "daily-challenges",
      icon: "Trophy",
      title: "Desafíos Diarios",
      description: "Completa rutinas personalizadas y gana PRIME tokens por cada logro alcanzado.",
      highlight: "Gana tokens diariamente"
    },
    {
      id: "social-sharing",
      icon: "Share",
      title: "Comparte en Farcaster",
      description: "Conecta con la comunidad fitness, comparte tu progreso y motiva a otros.",
      highlight: "Comunidad activa"
    },
    {
      id: "web3-rewards",
      icon: "Coins",
      title: "Recompensas Web3",
      description: "Tus logros se convierten en tokens reales que puedes usar en el ecosistema Base.",
      highlight: "Valor real"
    },
    {
      id: "progress-tracking",
      icon: "Chart",
      title: "Seguimiento Inteligente",
      description: "Monitorea tu progreso con métricas avanzadas y análisis personalizados.",
      highlight: "Datos precisos"
    }
  ],
  demo: {
    title: "Ve PrimeBody en Acción",
    description: "Descubre cómo funciona nuestra Mini App y cómo puedes empezar a ganar tokens hoy mismo.",
    screenshots: [
      {
        id: "dashboard",
        url: "/images/demo/dashboard.jpg",
        alt: "Dashboard principal de PrimeBody",
        title: "Dashboard Principal"
      },
      {
        id: "challenges",
        url: "/images/demo/challenges.jpg", 
        alt: "Pantalla de desafíos diarios",
        title: "Desafíos Diarios"
      },
      {
        id: "progress",
        url: "/images/demo/progress.jpg",
        alt: "Seguimiento de progreso",
        title: "Tu Progreso"
      },
      {
        id: "rewards",
        url: "/images/demo/rewards.jpg",
        alt: "Recompensas y tokens ganados",
        title: "Recompensas"
      }
    ],
    videoUrl: "/videos/primebody-demo.mp4"
  },
  cta: {
    title: "¿Listo para Transformar tu Cuerpo con PrimeBody?",
    description: "Únete a miles de usuarios que ya están ganando tokens mientras mejoran su salud. Comienza tu transformación hoy.",
    primaryText: "Comenzar Transformación",
    secondaryText: "Ver Demo",
    urgency: {
      enabled: true,
      message: "🔥 Únete ahora y recibe 100 PRIME tokens de bienvenida"
    }
  },
  footer: {
    links: [
      {
        category: "Producto",
        items: [
          { label: "Características", href: "#features" },
          { label: "Demo", href: "#demo" },
          { label: "Precios", href: "/pricing" },
          { label: "Roadmap", href: "/roadmap" }
        ]
      },
      {
        category: "Comunidad",
        items: [
          { label: "Farcaster", href: "https://warpcast.com/primebody" },
          { label: "Discord", href: "https://discord.gg/primebody" },
          { label: "Twitter", href: "https://twitter.com/primebody" },
          { label: "Blog", href: "/blog" }
        ]
      },
      {
        category: "Soporte",
        items: [
          { label: "Centro de Ayuda", href: "/help" },
          { label: "Contacto", href: "/contact" },
          { label: "Estado", href: "/status" },
          { label: "API", href: "/api-docs" }
        ]
      },
      {
        category: "Legal",
        items: [
          { label: "Términos", href: "/terms" },
          { label: "Privacidad", href: "/privacy" },
          { label: "Cookies", href: "/cookies" },
          { label: "Licencias", href: "/licenses" }
        ]
      }
    ],
    socialLinks: [
      {
        platform: "twitter",
        url: "https://twitter.com/primebody",
        label: "Síguenos en Twitter"
      },
      {
        platform: "farcaster", 
        url: "https://warpcast.com/primebody",
        label: "Únete en Farcaster"
      },
      {
        platform: "discord",
        url: "https://discord.gg/primebody", 
        label: "Comunidad Discord"
      },
      {
        platform: "github",
        url: "https://github.com/primebody",
        label: "Código en GitHub"
      }
    ],
    copyright: "© 2025 PrimeBody. Todos los derechos reservados.",
    newsletter: {
      enabled: true,
      title: "Mantente actualizado",
      description: "Recibe las últimas noticias y actualizaciones de PrimeBody.",
      placeholder: "Tu email",
      buttonText: "Suscribirse"
    }
  }
};