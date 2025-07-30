import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { RegistrationForm } from '@/components/auth/registration-form';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/constants';
import { typographyClasses } from '@/lib/typography';
import { sectionSpacing } from '@/lib/spacing';
// import { Zap, Play, Smartphone, BarChart, Award, Users as UsersIcon, Users, Star, TrendingUp, Shield, Heart } from 'lucide-react';
import { Zap, Play, Smartphone, BarChart, Award, Users as UsersIcon, Users, Star } from 'lucide-react';
import { Carousel } from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main content */}
      <main className={`${sectionSpacing.section} relative overflow-hidden`}>
        {/* Enhanced Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        
        <div className={`${sectionSpacing.container} relative z-10`}>
          {/* Enhanced Hero section */}
          <div className="grid gap-12 lg:grid-cols-2 items-center py-20">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 text-primary mb-4 border border-primary/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                🔥 New challenges every week!
              </div>
              
              <h1 className={`${typographyClasses.h1} text-balance leading-tight`}>
                Transforma tu cuerpo con 
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                  FitCast Challenges
                </span>
              </h1>
              
              <p className={`${typographyClasses.lead} max-w-xl mx-auto lg:mx-0 lg:pr-8 text-muted-foreground`}>
                {APP_CONFIG.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <Link href="/register">
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    🚀 Get Started Now
                    <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="group border-2 hover:bg-primary/5 transition-all duration-300">
                  <Play className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Ver Demo
                </Button>
              </div>
              
              {/* Enhanced social proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary shadow-md">
                        {i}K+
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">10K+ Active Users</div>
                    <div className="text-muted-foreground">Transforming daily</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                  <span className="text-muted-foreground">(2.1k reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-square w-full max-w-lg mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-accent rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-background font-bold">
                  +50%
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-background rounded-full border-2 border-accent"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20">
            <div className="text-center mb-16">
              <h2 className={`${typographyClasses.h2} mb-4`}>
                How We&apos;re Revolutionizing Your Workout
              </h2>
              <p className={`${typographyClasses.lead} max-w-2xl mx-auto`}>
                Discover the features that make FitCast the fitness platform of the future
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <Card variant="elevated" className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <CardTitle className="text-xl">AI-Powered Personalized Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI creates personalized workout plans based on your goals, fitness level, and schedule, adapting in real-time to keep you on the right track.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card variant="elevated" className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <span className="text-2xl">⌚</span>
                  </div>
                  <CardTitle className="text-xl">Effortless Wearable Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sync with Apple Watch, Fitbit, or Google Fit to automatically track steps, heart rate, and workouts for verified rewards.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card variant="elevated" className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <span className="text-2xl">💎</span>
                  </div>
                  <CardTitle className="text-xl">Earn PRIME Tokens for Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete workouts or reach milestones to earn PRIME tokens, redeemable for gear or tradable on the BASE blockchain.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card variant="elevated" className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <CardTitle className="text-xl">Global Fitness Community Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join team challenges, climb the leaderboards, and connect with a global community to stay motivated and earn token bonuses.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Demo Section */}
          <div className="py-20 bg-muted/30 rounded-3xl my-16">
            <div className={`${sectionSpacing.container} text-center mb-12`}>
              <h2 className={`${typographyClasses.h2} mb-4`}>
                Discover the FitCast Experience
              </h2>
              <p className={`${typographyClasses.lead} max-w-2xl mx-auto`}>
                See how our app transforms your workout routine with cutting-edge technology
              </p>
            </div>

            <div className="max-w-5xl mx-auto px-4">
              <Carousel
                items={[
                  {
                    id: 1,
                    title: 'Workout 1',
                    description: 'Strength and endurance training for all levels',
                    image: '/images/carousel/Ejercicio1.jpg',
                  },
                  {
                    id: 2,
                    title: 'Workout 2',
                    description: 'Customized routines to achieve your goals',
                    image: '/images/carousel/Ejercicio2.jpg',
                  },
                  {
                    id: 3,
                    title: 'Workout 3',
                    description: 'Advanced techniques to improve your performance',
                    image: '/images/carousel/Ejercicio3.jpg',
                  },
                  {
                    id: 4,
                    title: 'Workout 4',
                    description: 'Workouts designed for optimal results',
                    image: '/images/carousel/Ejercicio4.jpg',
                  },
                ]}
                autoPlay={true}
                interval={6000}
              />
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto px-4">
              {[
                {
                  icon: <Smartphone className="h-8 w-8" />,
                  title: 'Interfaz Intuitiva',
                  description: 'Diseño limpio y fácil de usar para una experiencia sin complicaciones',
                },
                {
                  icon: <BarChart className="h-8 w-8" />,
                  title: 'Estadísticas Detalladas',
                  description: 'Sigue tu progreso con métricas detalladas y análisis personalizados',
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: 'Logros y Premios',
                  description: 'Desbloquea logros y gana recompensas por tu dedicación',
                },
                {
                  icon: <UsersIcon className="h-8 w-8" />,
                  title: 'Comunidad Global',
                  description: 'Conecta con una comunidad de personas con objetivos similares',
                },
              ].map((feature, index) => (
                <div key={index} className="bg-background p-6 rounded-xl text-center">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            </div>

            <div className={`${sectionSpacing.container} text-center`}>
              <h2 className={`${typographyClasses.h2} mb-6`}>
                ¿Listo para Transformar tu Cuerpo?
              </h2>
              <p className={`${typographyClasses.lead} max-w-2xl mx-auto mb-12`}>
                Elige cómo quieres comenzar tu viaje de fitness con FitCast
              </p>

              <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {/* Option 1 */}
                <div className="bg-background border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Comienza Gratis</h3>
                  <p className="text-muted-foreground mb-6">
                    Prueba FitCast sin costo y descubre cómo podemos ayudarte a alcanzar tus metas.
                  </p>
                  <Button className="w-full">
                    Registrarme Gratis
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Sin tarjeta de crédito requerida
                  </p>
                </div>

                {/* Option 2 */}
                <div className="bg-background border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Popular
                  </div>
                  <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Premium</h3>
                  <p className="text-muted-foreground mb-6">
                    Desbloquea todo el potencial de FitCast con acceso completo a todas las funciones.
                  </p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Obtener Premium
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Prueba 7 días gratis
                  </p>
                </div>

                {/* Option 3 */}
                <div className="bg-background border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="h-16 w-16 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Para Empresas</h3>
                  <p className="text-muted-foreground mb-6">
                    Mejora el bienestar de tu equipo con planes corporativos personalizados.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contactar Ventas
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Descuentos para equipos
                  </p>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t">
                <h3 className="text-lg font-medium mb-4">¿Tienes preguntas?</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-question"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    Centro de Ayuda
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
                    Preguntas Frecuentes
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Contáctanos
                  </Button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
}
