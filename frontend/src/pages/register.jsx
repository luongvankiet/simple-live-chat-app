import AuthImagePattern from '@/components/auth-image-pattern';
import Input from '@/components/input';
import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/paths';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import * as Yup from 'yup';

const Register = () => {
  const { isSigningUp, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    fullName: Yup.string().required('Full name is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await register({ email: data.email, fullName: data.fullName, password: data.password });

    reset();
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
              <h1 className="mt-2 text-2xl font-bold">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="John Doe"
                startAdornment={<User className="text-base-content/40 size-5" />}
              />

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

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="********"
                startAdornment={<Lock className="text-base-content/40 size-5" />}
                endAdornment={
                  <button type="button" className="btn btn-ghost btn-circle btn-sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="text-base-content/40 size-5" /> : <Eye className="text-base-content/40 size-5" />}
                  </button>
                }
              />

              <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Loading ...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </FormProvider>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{' '}
              <Link to={paths.login} className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern title="Join our community" subtitle="Connect with friends and the world around you." />
    </div>
  );
};

export default Register;
