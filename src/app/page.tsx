'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { RegistrationForm } from '@/components/auth/registration-form';
import Link from 'next/link';
import { APP_CONFIG, STRUCTURED_DATA } from '@/lib/constants';
import { typographyClasses } from '@/lib/typography';
import { sectionSpacing } from '@/lib/spacing';
// import { Zap, Play, Smartphone, BarChart, Award, Users as UsersIcon, Users, Star, TrendingUp, Shield, Heart } from 'lucide-react';
import { Zap, Play, Smartphone, BarChart, Award, Users as UsersIcon, Users, Star } from 'lucide-react';
import { Carousel } from '@/components/ui/carousel';
import Head from 'next/head';

export default function Home() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const fid = searchParams.get('fid');
  const isFarcasterReferral = ref === 'farcaster';

  // Initialize scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Structured Data for SEO */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA.website),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA.webApplication),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA.organization),
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-background text-foreground">
      {isFarcasterReferral && (
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-purple-500/20 p-3 text-center">
          <p className="text-sm text-purple-300">
            🎉 Welcome from Farcaster! Ready to start your fitness journey? {fid && `(FID: ${fid})`}
          </p>
        </div>
      )}
      {/* Main content with PrimeBody gradient background */}
      <main className={`${sectionSpacing.section} relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5`}>
        {/* Enhanced Decorative elements with PrimeBody branding */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        
        {/* Additional PrimeBody brand elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full filter blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tl from-accent/10 to-transparent rounded-full filter blur-2xl opacity-30 animate-pulse [animation-delay:1.5s]"></div>
        
        <div className={`${sectionSpacing.container} relative z-10`}>
          {/* Enhanced Hero section with PrimeBody branding and animations */}
          <div className="grid gap-12 lg:grid-cols-2 items-center py-20">
            <div className="text-center lg:text-left space-y-8">
              {/* Animated badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 text-primary mb-4 border border-primary/20 backdrop-blur-sm animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out [animation-delay:100ms]">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                💪 Gana PRIME tokens por entrenar
              </div>
              
              {/* Main hero title with entrance animation */}
              <h1 className={`${typographyClasses.h1} text-balance leading-tight animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out [animation-delay:200ms]`}>
                Transforma tu cuerpo con{' '}
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-[gradient_3s_ease-in-out_infinite]">
                  PrimeBody
                </span>
              </h1>
              
              {/* Updated subtitle with PrimeBody messaging */}
              <p className={`${typographyClasses.lead} max-w-xl mx-auto lg:mx-0 lg:pr-8 text-muted-foreground animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out [animation-delay:300ms]`}>
                Únete a desafíos fitness diarios, gana PRIME tokens reales y comparte tu progreso en Farcaster. La primera Mini App que combina transformación corporal con recompensas crypto.
              </p>
              
              {/* CTA buttons with staggered animation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out [animation-delay:400ms]">
                <Link href="/register">
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                    🚀 Comenzar Transformación
                    <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="group border-2 hover:bg-primary/5 transition-all duration-300 hover:border-primary/50">
                  <Play className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Ver Demo
                </Button>
              </div>
              
              {/* Enhanced social proof with animation */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out [animation-delay:500ms]">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary shadow-md hover:scale-110 transition-transform duration-200">
                        {i}K+
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">10K+ Usuarios Activos</div>
                    <div className="text-muted-foreground">Transformándose diariamente</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 hover:scale-110 transition-transform duration-200" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                  <span className="text-muted-foreground">(2.1k reseñas)</span>
                </div>
              </div>
            </div>
            
            {/* Hero visual with PrimeBody branding and animations */}
            <div className="relative animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out [animation-delay:600ms]">
              <div className="relative aspect-square w-full max-w-lg mx-auto bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                
                {/* Central icon with pulse animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center backdrop-blur-sm border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <div className="text-4xl animate-pulse">💪</div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-8 left-8 h-16 w-16 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-primary/30 animate-bounce [animation-delay:1s]">
                  <span className="text-xl">🏆</span>
                </div>
                
                <div className="absolute top-8 right-8 h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent/30 animate-bounce [animation-delay:2s]">
                  <span className="text-sm">⚡</span>
                </div>
                
                <div className="absolute bottom-20 left-12 h-14 w-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-primary/20 animate-bounce [animation-delay:3s]">
                  <span className="text-lg">🎯</span>
                </div>
                
                {/* Progress indicator */}
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-gradient-to-br from-accent to-accent/80 rounded-tl-2xl rounded-br-2xl flex flex-col items-center justify-center text-background font-bold shadow-lg hover:scale-105 transition-transform duration-300">
                  <span className="text-xs">PRIME</span>
                  <span className="text-lg">+50%</span>
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-background rounded-full border-2 border-accent animate-ping"></span>
                </div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-20 animate-[spin_8s_linear_infinite] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:xor] p-[2px]"></div>
              </div>
            </div>
          </div>

          {/* Features Section with PrimeBody-specific features */}
          <div className="py-20 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <div className="text-center mb-16">
              <h2 className={`${typographyClasses.h2} mb-4`}>
                Cómo PrimeBody Revoluciona tu Transformación Corporal
              </h2>
              <p className={`${typographyClasses.lead} max-w-2xl mx-auto`}>
                Descubre las características que hacen de PrimeBody la plataforma fitness del futuro
              </p>
            </div>

            {/* Responsive grid: 2x2 desktop, 1x4 mobile */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {/* Feature 1: Body Transformation Focus */}
              <Card variant="elevated" className="group h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">💪</span>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    Transformación Corporal Personalizada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Planes de entrenamiento adaptados a tu cuerpo y objetivos específicos. Nuestra IA analiza tu progreso y ajusta automáticamente tu rutina para maximizar tu transformación física.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                    Resultados visibles en 30 días
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2: PRIME Token Rewards */}
              <Card variant="elevated" className="group h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-accent/20 bg-gradient-to-br from-background to-accent/5">
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">🪙</span>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-accent transition-colors duration-300">
                    Gana PRIME Tokens Reales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Cada entrenamiento completado te recompensa con PRIME tokens verificables en blockchain. Intercambia por productos fitness o mantén como inversión en tu salud.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-accent font-medium">
                    <span className="h-2 w-2 bg-accent rounded-full animate-pulse"></span>
                    Construido en Base Network
                  </div>
                </CardContent>
              </Card>

              {/* Feature 3: Farcaster Integration */}
              <Card variant="elevated" className="group h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">🌐</span>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    Comunidad Web3 en Farcaster
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Comparte tu progreso, únete a desafíos grupales y conecta con una comunidad global de fitness en Farcaster. Tu transformación inspira a otros.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                    Mini App nativa de Farcaster
                  </div>
                </CardContent>
              </Card>

              {/* Feature 4: Smart Tracking */}
              <Card variant="elevated" className="group h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-2 hover:border-accent/20 bg-gradient-to-br from-background to-accent/5">
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-accent transition-colors duration-300">
                    Seguimiento Inteligente Automático
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Integración perfecta con wearables para tracking automático. Métricas avanzadas de composición corporal, progreso y predicciones de resultados.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-accent font-medium">
                    <span className="h-2 w-2 bg-accent rounded-full animate-pulse"></span>
                    Compatible con Apple Watch & más
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional feature highlights */}
            <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300 group">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Resultados Rápidos</h3>
                <p className="text-sm text-muted-foreground">Optimización basada en ciencia del deporte</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 hover:border-accent/20 transition-all duration-300 group">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">🔒</span>
                </div>
                <h3 className="font-semibold mb-2">Seguridad Web3</h3>
                <p className="text-sm text-muted-foreground">Tus datos y tokens siempre protegidos</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300 group">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Objetivos Claros</h3>
                <p className="text-sm text-muted-foreground">Metas alcanzables con recompensas reales</p>
              </div>
            </div>
          </div>

          {/* Demo Section - PrimeBody App Showcase */}
          <div className="py-20 bg-gradient-to-br from-muted/20 via-primary/5 to-accent/5 rounded-3xl my-16 relative overflow-hidden animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/10 rounded-full filter blur-3xl opacity-50"></div>
            
            <div className={`${sectionSpacing.container} text-center mb-12 relative z-10`}>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 text-primary mb-6 border border-primary/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                📱 Mini App en Farcaster
              </div>
              
              <h2 className={`${typographyClasses.h2} mb-4`}>
                Experimenta PrimeBody en Acción
              </h2>
              <p className={`${typographyClasses.lead} max-w-2xl mx-auto`}>
                Descubre cómo nuestra Mini App revoluciona tu transformación corporal con tecnología Web3 y recompensas crypto reales
              </p>
            </div>

            {/* PrimeBody App Screenshots Carousel */}
            <div className="max-w-5xl mx-auto px-4 relative z-10">
              <Carousel
                items={[
                  {
                    id: 1,
                    title: 'Dashboard Principal',
                    description: 'Visualiza tu progreso, PRIME tokens ganados y desafíos activos en tiempo real',
                    image: '/images/carousel/Ejercicio1.jpg',
                  },
                  {
                    id: 2,
                    title: 'Entrenamientos Personalizados',
                    description: 'Rutinas adaptadas por IA según tu nivel y objetivos de transformación corporal',
                    image: '/images/carousel/Ejercicio2.jpg',
                  },
                  {
                    id: 3,
                    title: 'Recompensas PRIME',
                    description: 'Gana tokens verificables por cada entrenamiento completado y meta alcanzada',
                    image: '/images/carousel/Ejercicio3.jpg',
                  },
                  {
                    id: 4,
                    title: 'Comunidad Farcaster',
                    description: 'Comparte logros, únete a desafíos y conecta con la comunidad fitness Web3',
                    image: '/images/carousel/Ejercicio4.jpg',
                  },
                ]}
                autoPlay={true}
                interval={8000}
              />
            </div>

            {/* PrimeBody App Features Showcase */}
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto px-4 relative z-10">
              {[
                {
                  icon: <Smartphone className="h-8 w-8" />,
                  title: 'Mini App Nativa',
                  description: 'Experiencia perfecta integrada en Farcaster sin necesidad de instalación adicional',
                  gradient: 'from-primary/20 to-primary/10',
                  delay: '100ms'
                },
                {
                  icon: <BarChart className="h-8 w-8" />,
                  title: 'Métricas Web3',
                  description: 'Tracking avanzado con datos verificables en blockchain y análisis predictivo',
                  gradient: 'from-accent/20 to-accent/10',
                  delay: '200ms'
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: 'Tokens PRIME',
                  description: 'Recompensas crypto reales por cada logro, intercambiables en el ecosistema Base',
                  gradient: 'from-primary/20 to-accent/10',
                  delay: '300ms'
                },
                {
                  icon: <UsersIcon className="h-8 w-8" />,
                  title: 'Red Social Fitness',
                  description: 'Comunidad global en Farcaster con desafíos grupales y competencias',
                  gradient: 'from-accent/20 to-primary/10',
                  delay: '400ms'
                },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`bg-background/80 backdrop-blur-sm p-6 rounded-xl text-center border border-white/10 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out`}
                  style={{ animationDelay: feature.delay }}
                >
                  <div className={`h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Interactive element */}
                  <div className="mt-4 h-1 w-0 bg-gradient-to-r from-primary to-accent rounded-full group-hover:w-full transition-all duration-500 mx-auto"></div>
                </div>
              ))}
            </div>
            
            {/* Call-to-action for demo */}
            <div className="mt-16 text-center relative z-10">
              <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button size="lg" className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Probar PrimeBody Ahora
                </Button>
                <Button variant="outline" size="lg" className="group border-2 hover:bg-primary/5 transition-all duration-300">
                  <Zap className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
                  Ver Más Funciones
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
                Únete a miles de usuarios que ya están transformando su cuerpo y ganando PRIME tokens
              </p>
            </div>
          </div>

          {/* CTA Section - PrimeBody Conversion Optimization */}
          <div className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            {/* Enhanced Decorative elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse [animation-delay:1s]"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            </div>

            <div className={`${sectionSpacing.container} text-center relative z-10`}>
              {/* Enhanced social proof badge with urgency */}
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 text-primary mb-6 border border-primary/20 backdrop-blur-sm animate-pulse">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                🔥 +12,847 usuarios transformándose • +500K PRIME tokens distribuidos
              </div>

              <h2 className={`${typographyClasses.h2} mb-6`}>
                ¿Listo para Transformar tu Cuerpo con PrimeBody?
              </h2>
              <p className={`${typographyClasses.lead} max-w-2xl mx-auto mb-12`}>
                Únete a la revolución fitness Web3. Transforma tu cuerpo, gana PRIME tokens reales y conecta con una comunidad global en Farcaster.
              </p>

              {/* Enhanced social proof stats with animations */}
              <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
                <div className="flex flex-col items-center group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">12.8K+</div>
                  <div className="text-sm text-muted-foreground">Usuarios Transformándose</div>
                  <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-1"></div>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">847K+</div>
                  <div className="text-sm text-muted-foreground">PRIME Tokens Distribuidos</div>
                  <div className="h-0.5 w-0 bg-accent group-hover:w-full transition-all duration-500 mt-1"></div>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">97.3%</div>
                  <div className="text-sm text-muted-foreground">Satisfacción Usuario</div>
                  <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-1"></div>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">21 días</div>
                  <div className="text-sm text-muted-foreground">Promedio Resultados</div>
                  <div className="h-0.5 w-0 bg-accent group-hover:w-full transition-all duration-500 mt-1"></div>
                </div>
              </div>

              {/* PrimeBody Pricing Plans */}
              <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {/* Starter Plan */}
                <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 hover:shadow-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">Transformación Básica</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Comienza tu viaje fitness Web3. Acceso a entrenamientos básicos y gana tus primeros PRIME tokens.
                    </p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">Gratis</span>
                      <span className="text-muted-foreground">/siempre</span>
                    </div>
                    <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        Entrenamientos básicos diarios
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        Hasta 10 PRIME tokens/mes
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        Acceso a comunidad Farcaster
                      </li>
                    </ul>
                    <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
                      Comenzar Transformación
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Sin tarjeta de crédito • Acceso inmediato
                    </p>
                  </div>
                </div>

                {/* Premium Plan - Most Popular */}
                <div className="bg-background/90 backdrop-blur-sm border-2 border-accent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden scale-105">
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-primary text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                    🔥 Más Popular
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Award className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300">PrimeBody Pro</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Maximiza tu transformación con IA avanzada, entrenamientos premium y recompensas multiplicadas.
                    </p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-accent">$12.99</span>
                      <span className="text-muted-foreground">/mes</span>
                      <div className="text-sm text-muted-foreground line-through">$19.99</div>
                    </div>
                    <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                        Entrenamientos IA personalizados
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                        PRIME tokens ilimitados
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                        Análisis corporal avanzado
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                        Desafíos premium exclusivos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                        Soporte prioritario 24/7
                      </li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                      Comenzar Transformación Pro
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      7 días gratis • Cancela cuando quieras
                    </p>
                  </div>
                </div>

                {/* Elite Plan */}
                <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 hover:shadow-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">PrimeBody Elite</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Para equipos y empresas. Transforma la cultura fitness de tu organización con Web3.
                    </p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">Custom</span>
                      <div className="text-sm text-muted-foreground">Desde $99/mes</div>
                    </div>
                    <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        Dashboard empresarial
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        Competencias entre equipos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        Pool de tokens corporativo
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        Integración con RRHH
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300">
                      Contactar Ventas
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Demo personalizada • Onboarding incluido
                    </p>
                  </div>
                </div>
              </div>

              {/* PrimeBody Social Proof & Support */}
              <div className="mt-16 pt-8 border-t border-primary/10">
                {/* Testimonials */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-6 text-center">Lo que dicen nuestros usuarios</h3>
                  <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
                    <div className="bg-background/70 backdrop-blur-sm p-5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">@crypto_fit_alex</span>
                        <div className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Verificado</div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"Perdí 18kg en 4 meses y gané 3,247 PRIME tokens. La IA personaliza perfectamente mis entrenamientos. ¡Nunca volveré a un gym tradicional!"</p>
                      <div className="mt-2 text-xs text-primary font-medium">💎 Ganó $847 en PRIME tokens</div>
                    </div>
                    <div className="bg-background/70 backdrop-blur-sm p-5 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">@maria_fitness_pro</span>
                        <div className="ml-auto text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Pro User</div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"La comunidad en Farcaster es increíble. Competimos diariamente y nos motivamos. Los desafíos grupales son adictivos 💪"</p>
                      <div className="mt-2 text-xs text-accent font-medium">🏆 Top 1% en desafíos</div>
                    </div>
                    <div className="bg-background/70 backdrop-blur-sm p-5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">@web3_athlete_dao</span>
                        <div className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Elite</div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"Cambié de MyFitnessPal a PrimeBody. Los tokens son reales, los puedo tradear en Base. Es el futuro del fitness 🚀"</p>
                      <div className="mt-2 text-xs text-primary font-medium">⚡ 6 meses consecutivos activo</div>
                    </div>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8 opacity-60">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Verificado en Base Network</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span>Integrado con Farcaster</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                    <span>Datos encriptados</span>
                  </div>
                </div>

                {/* Support options */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-center">¿Necesitas ayuda para comenzar?</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/5 hover:text-primary transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-question"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                      Guía de Inicio
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent/5 hover:text-accent transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
                      FAQ sobre PRIME Tokens
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/5 hover:text-primary transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3m0 0a5 5 0 1 0-7-7 5 5 0 0 0 7 7z"/></svg>
                      Comunidad Farcaster
                    </Button>
                  </div>
                  
                  {/* Enhanced urgency element with scarcity */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-accent/15 to-primary/15 rounded-xl border-2 border-accent/30 text-center relative overflow-hidden group hover:border-accent/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg">🚀</span>
                        <p className="text-base font-bold text-foreground">Oferta Exclusiva de Lanzamiento</p>
                        <span className="text-lg">🚀</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Los primeros <span className="font-bold text-accent">500 usuarios</span> reciben:
                      </p>
                      <div className="flex flex-wrap justify-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-accent">💎</span>
                          <span className="font-medium">200 PRIME tokens gratis</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-primary">⚡</span>
                          <span className="font-medium">3 meses Pro gratis</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-accent">🏆</span>
                          <span className="font-medium">NFT exclusivo</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Solo quedan <span className="font-bold text-red-500">127 espacios</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </main>
    </div>
    </>
  );
}
