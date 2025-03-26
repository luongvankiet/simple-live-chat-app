import AuthImagePattern from '@/components/auth-image-pattern';
import Input from '@/components/input';
import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/paths';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import * as Yup from 'yup';

const Login = () => {
  const { isLoggingIn, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await login(data);
  });

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side of form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="group flex flex-col items-center gap-2">
              <div className="bg-primary/10 group-hover:bg-primary flex size-12 items-center justify-center rounded-xl transition-colors">
                <MessageSquare className="text-primary size-6" />
              </div>
              <h1 className="mt-2 text-2xl font-bold">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="space-y-6">
              <Input
                label="Email"
                type="text"
                name="email"
                placeholder="you@example.com"
                startAdornment={<Mail className="text-base-content/40 size-5" />}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="********"
                startAdornment={<Lock className="text-base-content/40 size-5" />}
                endAdornment={
                  <button type="button" className="btn btn-ghost btn-circle btn-sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="text-base-content/40 size-5" /> : <Eye className="text-base-content/40 size-5" />}
                  </button>
                }
              />

              <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Loading ...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </FormProvider>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{' '}
              <Link to={paths.register} className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern title="Welcom back!" subtitle="Sign in to continue your conversation and find new friends" />
    </div>
  );
};

export default Login;
