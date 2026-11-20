import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from './Input';
import Button from '../ui/Button';
import AlertBanner from './AlertBanner';
import { Mail, ArrowRight, ArrowLeft, KeyRound } from '../icons';

export interface ForgotPasswordScreenProps {
  initialRole?: 'student' | 'ngo';
  onNavigateHome: () => void;
  onNavigateLogin: (role: 'student' | 'ngo') => void;
  onResetRequested: (email: string, role: 'student' | 'ngo') => void;
}

export default function ForgotPasswordScreen({
  initialRole = 'student',
  onNavigateHome,
  onNavigateLogin,
  onResetRequested,
}: ForgotPasswordScreenProps) {
  const [role, setRole] = useState<'student' | 'ngo'>(initialRole);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const isStudent = role === 'student';

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your account email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onResetRequested(email, role);
    }, 750);
  };

  return (
    <AuthLayout
      role={role}
      title="Reset Your Password"
      subtitle="Enter your registered email address and we'll send you instructions to regain access."
      onNavigateHome={onNavigateHome}
      onSwitchRole={() => setRole(isStudent ? 'ngo' : 'student')}
      switchRoleLabel={isStudent ? 'Switch to NGO Recovery' : 'Switch to Student Recovery'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
        {/* Role Segmented Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold mb-4">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              isStudent
                ? 'bg-[#14334A] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#14334A]'
            }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => setRole('ngo')}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              !isStudent
                ? 'bg-[#14334A] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#14334A]'
            }`}
          >
            NGO Partner Account
          </button>
        </div>

        {/* Email Input */}
        <Input
          label={isStudent ? 'Student University Email' : 'Official Organization Email'}
          type="email"
          required
          autoComplete="email"
          placeholder={isStudent ? 'e.g., student@university.edu' : 'e.g., director@organization.org'}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(undefined);
          }}
          leftIcon={<Mail size={16} />}
          helperText="We will send a secure password reset link to this address"
          error={error}
        />

        {/* Submit Button */}
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
            {isLoading ? 'Dispatching Reset Link...' : 'Send Password Reset Link'}
          </Button>
        </div>

        {/* Return to Login Link */}
        <div className="pt-4 border-t border-[#F1F5F9] text-center text-xs">
          <button
            type="button"
            onClick={() => onNavigateLogin(role)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#14334A] hover:text-[#70A1A8] hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to {isStudent ? 'Student Sign In' : 'NGO Sign In'}</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
