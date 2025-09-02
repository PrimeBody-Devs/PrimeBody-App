'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
  password: z.string().min(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  }),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones de PrimeBody.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      
      // Call the registration API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors from the server
        if (data.error === 'Validation failed' && data.details) {
          Object.entries(data.details).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              form.setError(field as keyof FormValues, {
                type: 'manual',
                message: errors[0]
              });
            } else if (typeof errors === 'object' && errors !== null) {
              // Handle nested errors
              Object.entries(errors).forEach(([_nestedField, nestedErrors]) => {
                if (Array.isArray(nestedErrors)) {
                  // For nested errors, set the error on the root field with the nested message
                  form.setError(field as keyof FormValues, {
                    type: 'manual',
                    message: nestedErrors[0]
                  });
                }
              });
            }
          });
          return;
        }
        throw new Error(data.error || 'Registration failed');
      }
      
      toast.success('¡Bienvenido a PrimeBody! Tu cuenta ha sido creada exitosamente. ¡Comienza a ganar PRIME tokens!');
      
      // Redirect to the PrimeBody onboarding or dashboard
      router.push('/onboarding');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(
        error instanceof Error 
          ? error.message || 'Error al crear tu cuenta PrimeBody. Por favor intenta nuevamente.'
          : 'Ocurrió un error inesperado. Por favor intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Tu nombre completo" 
                    disabled={isLoading}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="tu@email.com" 
                    disabled={isLoading}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput 
                    placeholder="••••••••" 
                    disabled={isLoading}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Mínimo 8 caracteres para proteger tus PRIME tokens
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput 
                    placeholder="••••••••" 
                    disabled={isLoading}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Acepto los{' '}
                    <a href="/terms" className="text-primary hover:underline font-medium">
                      Términos de Servicio de PrimeBody
                    </a>{' '}
                    y la{' '}
                    <a href="/privacy" className="text-primary hover:underline font-medium">
                      Política de Privacidad
                    </a>
                  </FormLabel>
                  <FormDescription className="text-xs text-muted-foreground mt-1">
                    Incluye el manejo seguro de tus PRIME tokens y datos de fitness
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando tu cuenta PrimeBody...
            </>
          ) : (
            <>
              🚀 Comenzar Transformación
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
