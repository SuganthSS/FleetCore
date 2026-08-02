import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, AlertCircle, ArrowRight, Shield, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, LoadingSpinner } from '@/components/ui';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      // Optionally store remember me state in localStorage if custom logic is needed
      if (data.rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      setApiError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* ── LEFT SECTION: BRANDING & MARKETING (Hidden on mobile/tablet) ── */}
      <section className="hidden lg:flex w-1/2 flex-col justify-between bg-navy-950 p-12 text-white relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-secondary/20 blur-[100px]" />

        {/* Top Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Truck className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-white leading-none">
              FleetCore
            </span>
            <span className="block text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-1">
              Enterprise Logistics
            </span>
          </div>
        </div>

        {/* Mid Hero Area */}
        <div className="my-auto space-y-8 z-10 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            INTELLIGENT FLEET MANAGEMENT
          </div>

          {/* Title & Copy */}
          <div className="space-y-4">
            <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              SMART TRACKING,<br />
              <span className="text-primary">CLEAR PATHS</span>
            </h2>
            <p className="text-base text-zinc-300 leading-relaxed">
              Real-time telemetry, automated dispatching, and AI-driven maintenance scheduling. Optimize your routes and reduce operational overhead seamlessly.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="space-y-1">
              <span className="block text-2xl xl:text-3xl font-extrabold text-primary">95%</span>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-400">On-Time Flow</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl xl:text-3xl font-extrabold text-white">80+</span>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-400">Active Hubs</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl xl:text-3xl font-extrabold text-white">24/7</span>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-400">Security Flow</span>
            </div>
          </div>
        </div>

        {/* Floating Cards (Mock visualization inspired by reference) */}
        <div className="absolute right-0 bottom-1/4 translate-x-12 hidden xl:flex flex-col gap-4 z-10">
          {/* Floating Card 1 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-xl shadow-black/30 translate-x-[-20px] transition-transform duration-500 hover:translate-y-[-4px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] text-zinc-400 uppercase font-semibold">System Protection</span>
              <span className="block text-sm font-bold text-white">Safe Transit Active</span>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-xl shadow-black/30 translate-x-[-60px] transition-transform duration-500 hover:translate-y-[-4px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] text-zinc-400 uppercase font-semibold">Active Shipments</span>
              <span className="block text-sm font-bold text-white">328k+ Moving</span>
            </div>
          </div>

          {/* Floating Card 3 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-xl shadow-black/30 translate-x-[-10px] transition-transform duration-500 hover:translate-y-[-4px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] text-zinc-400 uppercase font-semibold">Daily Updates</span>
              <span className="block text-sm font-bold text-white">Efficiency +14.2%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} FleetCore. All rights reserved.
          </p>
        </div>
      </section>

      {/* ── RIGHT SECTION: CENTERED LOGIN CARD ── */}
      <section className="flex flex-1 flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12 relative">
        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">FleetCore</span>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Welcome Text */}
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the fleet control center
            </p>
          </div>

          {/* Error Alert */}
          {apiError && (
            <div
              className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive animate-slide-up"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold leading-none">Authentication Failed</p>
                <p className="text-xs leading-normal opacity-90">{apiError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-5"
            noValidate
          >
            {/* Email Field */}
            <Input
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              error={errors.email?.message}
              disabled={isLoading}
              autoComplete="email"
              required
              {...register('email')}
            />

            {/* Password Field */}
            <div>
              <Input
                label="Password"
                placeholder="••••••••••••"
                isPassword
                error={errors.password?.message}
                disabled={isLoading}
                autoComplete="current-password"
                required
                {...register('password')}
              />
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between py-1 text-xs">
              <label className="flex items-center gap-2 font-medium text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-0 disabled:opacity-50"
                  {...register('rememberMe')}
                />
                Remember Me
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => e.preventDefault()}
                className="font-medium text-primary/80 hover:text-primary transition-colors cursor-not-allowed opacity-60"
                aria-disabled="true"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 font-semibold rounded-lg gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="border-white/20 border-t-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>Powered by <span className="font-bold text-foreground">FleetCore</span> Platform</p>
        </footer>
      </section>
    </div>
  );
};
