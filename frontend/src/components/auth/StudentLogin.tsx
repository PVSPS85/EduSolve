import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from './Input';
import PasswordInput from './PasswordInput';
import Checkbox from './Checkbox';
import AlertBanner from './AlertBanner';
import Button from '../ui/Button';
import { Mail, ArrowRight, GoogleIcon, Sparkles } from '../icons';

export interface StudentLoginProps {
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
  onNavigateNgoLogin: () => void;
  onNavigateForgotPassword: () => void;
  onLoginSuccess: (studentName: string) => void;
}

export default function StudentLogin({
  onNavigateHome,
  onNavigateRegister,
  onNavigateNgoLogin,
  onNavigateForgotPassword,
  onLoginSuccess,
}: StudentLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // States for errors and loading
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample credentials helper for easy demonstration
  const handleFillDemoStudent = () => {
    setEmail('maya.lin@university.edu');
    setPassword('CommunityImpact#2026');
    setErrors({});
    setAuthError(null);
    setNetworkError(false);
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your university or student email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setNetworkError(false);

    if (!validate()) return;

    setIsLoading(true);

    // Simulate authentication verification
    setTimeout(() => {
      setIsLoading(false);

      // Check for intentional test error trigger
      if (email.includes('error@')) {
        setAuthError('Invalid credentials. Please verify your email and password.');
        return;
      }
      if (email.includes('network@')) {
        setNetworkError(true);
        return;
      }

      // Successful login demonstration
      onLoginSuccess(email.split('@')[0]);
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('Alex Chen (Google)');
    }, 600);
  };

  return (
    <AuthLayout
      role="student"
      title="Welcome Back"
      subtitle="Continue your journey towards meaningful impact."
      onNavigateHome={onNavigateHome}
      onSwitchRole={onNavigateNgoLogin}
      switchRoleLabel="NGO Partner Portal"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Inline Auth Error Banner */}
        {authError && (
          <AlertBanner
            type="error"
            title="Authentication Failed"
            message={authError}
            onDismiss={() => setAuthError(null)}
          />
        )}

        {/* Network Error Simulated Banner */}
        {networkError && (
          <AlertBanner
            type="warning"
            title="Connection Timeout"
            message="Unable to reach the authentication gateway. Please check your network and retry."
            onDismiss={() => setNetworkError(false)}
          />
        )}

        {/* Quick Demo Helper Strip */}
        <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-2.5 flex items-center justify-between text-xs">
          <span className="text-[#64748B] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#836527]" />
            Evaluating prototype?
          </span>
          <button
            type="button"
            onClick={handleFillDemoStudent}
            className="font-semibold text-[#14334A] hover:text-[#70A1A8] underline cursor-pointer"
          >
            Auto-fill demo credentials
          </button>
        </div>

        {/* Email Address */}
        <Input
          label="Student Email Address"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="e.g., student@university.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          leftIcon={<Mail size={16} />}
          error={errors.email}
        />

        {/* Password */}
        <div>
          <PasswordInput
            label="Password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
          />

          <div className="flex items-center justify-between mt-2">
            <Checkbox
              label="Remember me on this device"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <button
              type="button"
              onClick={onNavigateForgotPassword}
              className="text-xs font-semibold text-[#14334A] hover:text-[#70A1A8] hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Primary Sign In Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
            rightIcon={
              !isLoading ? (
                <ArrowRight size={16} />
              ) : (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )
            }
            className="justify-center shadow-md py-3"
          >
            {isLoading ? 'Verifying Account...' : 'Sign In'}
          </Button>
        </div>

        {/* Optional Google Social Sign In */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-[#94A3B8] uppercase tracking-wider font-medium">
              or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#E5E7EB] bg-white text-xs sm:text-sm font-semibold text-[#183047] hover:bg-[#FAF9F6] hover:border-[#C8B294] transition-all duration-200 cursor-pointer shadow-2xs"
        >
          <GoogleIcon size={18} />
          <span>Sign in with Google</span>
        </button>

        {/* Footer Navigation Links */}
        <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-center text-xs">
          <p className="text-[#64748B]">
            Don't have a student volunteer account?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-[#14334A] hover:text-[#70A1A8] hover:underline cursor-pointer"
            >
              Create a Student Account
            </button>
          </p>

          <p className="text-[#94A3B8]">
            Represent a community organization?{' '}
            <button
              type="button"
              onClick={onNavigateNgoLogin}
              className="font-semibold text-[#836527] hover:underline cursor-pointer"
            >
              Go to NGO Partner Sign In
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
