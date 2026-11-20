import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import PasswordInput from './PasswordInput';
import Button from '../ui/Button';
import AlertBanner from './AlertBanner';
import { Mail, CheckCircle2, ArrowRight, ArrowLeft, KeyRound } from '../icons';

export interface PasswordResetSentScreenProps {
  email: string;
  role: 'student' | 'ngo';
  onNavigateHome: () => void;
  onNavigateLogin: (role: 'student' | 'ngo') => void;
}

export default function PasswordResetSentScreen({
  email,
  role,
  onNavigateHome,
  onNavigateLogin,
}: PasswordResetSentScreenProps) {
  const [showSimulatedForm, setShowSimulatedForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      setPasswordError('Please enter a new password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSuccess(true);
    }, 700);
  };

  return (
    <AuthLayout
      role={role}
      title={resetSuccess ? 'Password Updated!' : 'Check Your Inbox'}
      subtitle={
        resetSuccess
          ? 'Your credentials have been securely updated. You can now sign in.'
          : `We have dispatched password recovery instructions to ${email || 'your email'}.`
      }
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-6 text-left">
        {!resetSuccess && !showSimulatedForm && (
          <>
            {/* Sent Confirmation Card */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#14334A] shrink-0 mt-0.5">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14334A]">
                  Recovery Email Dispatched
                </h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Please open the link inside the email to choose a new password. The link will expire in 60 minutes for security.
                </p>
              </div>
            </div>

            {/* Prototype simulation button */}
            <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-xl p-3.5 text-xs text-[#836527] space-y-2">
              <span className="font-semibold block">
                Interactive Testing Mode:
              </span>
              <p className="text-[11px] leading-relaxed">
                Click below to simulate opening the secure link delivered in your email.
              </p>
              <Button
                type="button"
                variant="sand"
                size="sm"
                fullWidth
                onClick={() => setShowSimulatedForm(true)}
                leftIcon={<KeyRound size={14} />}
                className="justify-center mt-1"
              >
                Simulate Clicking Reset Link (Set New Password)
              </Button>
            </div>

            {/* Return to login */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline-subtle"
                size="md"
                fullWidth
                onClick={() => onNavigateLogin(role)}
                leftIcon={<ArrowLeft size={16} />}
                className="justify-center py-3"
              >
                Return to Sign In
              </Button>
            </div>
          </>
        )}

        {/* Simulated Form to Set New Password */}
        {!resetSuccess && showSimulatedForm && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="bg-[#EBF4F5] border border-[#70A1A8]/40 rounded-xl p-3 text-xs text-[#1E4663]">
              <span className="font-semibold block mb-0.5">Reset Token Validated</span>
              <span>Please set a fresh, secure password for your EduSolve account.</span>
            </div>

            <PasswordInput
              label="New Password"
              required
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (passwordError) setPasswordError(undefined);
              }}
            />

            <PasswordInput
              label="Confirm New Password"
              required
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) setPasswordError(undefined);
              }}
              error={passwordError}
            />

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
              {isLoading ? 'Saving New Password...' : 'Save & Update Password'}
            </Button>
          </form>
        )}

        {/* Final Success State */}
        {resetSuccess && (
          <div className="space-y-4">
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle2 size={24} className="text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#166534]">
                  Password Successfully Changed
                </h4>
                <p className="text-xs text-[#166534]/90 mt-1">
                  You can now sign in using your updated password.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNavigateLogin(role)}
              rightIcon={<ArrowRight size={16} />}
              className="justify-center py-3"
            >
              Proceed to Sign In
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
