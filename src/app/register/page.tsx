'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegistrationForm } from '@/components/auth/registration-form';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const fid = searchParams.get('fid');
  const isFarcasterReferral = ref === 'farcaster';

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      {isFarcasterReferral && (
        <div className="absolute top-4 left-4 right-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3 text-center backdrop-blur-sm">
          <p className="text-sm text-primary font-medium">
            🎉 ¡Bienvenido a PrimeBody desde Farcaster! {fid && `(FID: ${fid})`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Comienza a ganar PRIME tokens por entrenar 💪
          </p>
        </div>
      )}
      
      <Button
        variant="ghost"
        asChild
        className="absolute left-4 top-4 md:left-8 md:top-8 hover:bg-primary/5 hover:text-primary transition-all duration-300"
      >
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a PrimeBody
        </Link>
      </Button>
      
      <Card className="w-full max-w-md border-2 border-primary/10 shadow-xl bg-background/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-2">
            <span className="text-2xl">💪</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Únete a PrimeBody
          </CardTitle>
          <CardDescription className="text-center leading-relaxed">
            Crea tu cuenta y comienza a ganar PRIME tokens por transformar tu cuerpo
          </CardDescription>
          
          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>12K+ usuarios activos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
              <span>847K+ PRIME tokens</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <RegistrationForm />
          
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">
                O continúa con
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span className="ml-2 text-sm">Google</span>
            </Button>
            <Button variant="outline" type="button" className="border-accent/20 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300">
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm">GitHub</span>
            </Button>
          </div>
          
          {/* Enhanced sign-in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta PrimeBody?{' '}
              <Link href="/login" className="text-primary hover:text-accent font-medium hover:underline transition-colors duration-300">
                Iniciar Sesión
              </Link>
            </p>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-4 flex justify-center items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
              <span>Base Network</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
              <span>Farcaster</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
