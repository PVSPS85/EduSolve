import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from './Input';
import PasswordInput from './PasswordInput';
import AlertBanner from './AlertBanner';
import Button from '../ui/Button';
import { Mail, ArrowRight, ShieldCheck, Sparkles, Building2 } from '../icons';

export interface NgoLoginProps {
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
  onNavigateStudentLogin: () => void;
  onNavigateForgotPassword: () => void;
  onLoginSuccess: (orgName: string) => void;
}

export default function NgoLogin({
  onNavigateHome,
  onNavigateRegister,
  onNavigateStudentLogin,
  onNavigateForgotPassword,
  onLoginSuccess,
}: NgoLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error & loading states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick sample credentials for demonstration
  const handleFillDemoNgo = () => {
    setEmail('director@horizoncommunity.org');
    setPassword('CommunityPartner#2026');
    setErrors({});
    setAuthError(null);
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your organization official email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid official email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your account password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);

      if (email.includes('error@')) {
        setAuthError('Invalid credentials. Organization record not found or password incorrect.');
        return;
      }

      onLoginSuccess('Horizon Community Services');
    }, 800);
  };

  return (
    <AuthLayout
      role="ngo"
      title="Welcome Back, Community Partner"
      subtitle="Connect with students and turn community challenges into meaningful solutions."
      onNavigateHome={onNavigateHome}
      onSwitchRole={onNavigateStudentLogin}
      switchRoleLabel="Student Volunteer Portal"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Subtle trust notice required by brief */}
        <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-xl p-3 text-xs text-[#836527] flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-[#836527] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Verification Notice:</strong> Organization verification is required before publishing project briefs to student squads.
          </p>
        </div>

        {/* Inline Auth Error Banner */}
        {authError && (
          <AlertBanner
            type="error"
            title="Authentication Error"
            message={authError}
            onDismiss={() => setAuthError(null)}
          />
        )}

        {/* Quick Demo Helper */}
        <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-2.5 flex items-center justify-between text-xs">
          <span className="text-[#64748B] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#836527]" />
            Evaluating prototype?
          </span>
          <button
            type="button"
            onClick={handleFillDemoNgo}
            className="font-semibold text-[#14334A] hover:text-[#836527] underline cursor-pointer"
          >
            Auto-fill partner credentials
          </button>
        </div>

        {/* Official Email */}
        <Input
          label="Official Organization Email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="e.g., director@organization.org"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          leftIcon={<Building2 size={16} />}
          helperText="Use the official domain email submitted during organizational registration"
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

          <div className="flex justify-end mt-2">
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
            {isLoading ? 'Authenticating Partner...' : 'Sign In to Partner Portal'}
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-center text-xs">
          <p className="text-[#64748B]">
            Not yet registered as a partner non-profit?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-[#14334A] hover:text-[#836527] hover:underline cursor-pointer"
            >
              Register Your Organization
            </button>
          </p>

          <p className="text-[#94A3B8]">
            Are you a student volunteer?{' '}
            <button
              type="button"
              onClick={onNavigateStudentLogin}
              className="font-semibold text-[#1E4663] hover:underline cursor-pointer"
            >
              Go to Student Sign In
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
