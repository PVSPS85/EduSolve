import React, { useState, useEffect } from 'react';
import AuthLayout from './AuthLayout';
import Button from '../ui/Button';
import AlertBanner from './AlertBanner';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, KeyRound } from '../icons';

export interface EmailVerificationScreenProps {
  role: 'student' | 'ngo';
  email: string;
  onNavigateHome: () => void;
  onVerified: () => void;
}

export default function EmailVerificationScreen({
  role,
  email,
  onNavigateHome,
  onVerified,
}: EmailVerificationScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStudent = role === 'student';

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleCodeChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
    }, 700);
  };

  const handleSimulateInstantVerify = () => {
    setCode(['4', '8', '2', '9', '1', '5']);
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    setResendTimer(45);
    setCanResend(false);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 4000);
  };

  return (
    <AuthLayout
      role={role}
      title="Verify Your Email Address"
      subtitle={`We have dispatched a 6-digit confirmation code to ${email || 'your registered address'}.`}
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-6 text-left">
        {/* Email Highlight Card */}
        <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 text-[#14334A]">
            <Mail size={18} />
          </div>
          <div className="overflow-hidden">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Confirmation Sent To
            </span>
            <span className="text-sm font-bold text-[#14334A] truncate block">
              {email || 'maya.lin@university.edu'}
            </span>
          </div>
        </div>

        {/* Resend success notice */}
        {resendSuccess && (
          <AlertBanner
            type="success"
            title="Code Dispatched"
            message="A fresh 6-digit verification code has been dispatched to your inbox."
            onDismiss={() => setResendSuccess(false)}
          />
        )}

        {/* Error banner */}
        {error && (
          <AlertBanner
            type="error"
            title="Verification Incomplete"
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {/* 6-Digit Code Inputs */}
        <div>
          <label className="block text-xs font-semibold text-[#14334A] mb-2">
            Enter 6-Digit Verification Code
          </label>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-full h-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-white rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20 outline-none transition-all"
              />
            ))}
          </div>
          <p className="text-[11px] text-[#64748B] mt-2">
            Tip: For this prototype preview, you can click "Simulate Instant Verification" below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isVerifying}
            onClick={() => handleVerify()}
            rightIcon={
              !isVerifying ? (
                <ArrowRight size={16} />
              ) : (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )
            }
            className="justify-center shadow-md py-3"
          >
            {isVerifying ? 'Confirming Code...' : 'Confirm & Proceed'}
          </Button>

          <Button
            type="button"
            variant="sand"
            size="md"
            fullWidth
            onClick={handleSimulateInstantVerify}
            leftIcon={<KeyRound size={15} />}
            className="justify-center text-xs sm:text-sm"
          >
            Simulate Instant Verification (Auto-fill 482915)
          </Button>
        </div>

        {/* Resend Timer & Guidance */}
        <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <span>Didn't receive the email? Check spam folder.</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              canResend
                ? 'text-[#14334A] hover:text-[#70A1A8] underline'
                : 'text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            <RefreshCw size={13} className={!canResend ? 'animate-spin' : ''} />
            {canResend ? 'Resend code' : `Resend in ${resendTimer}s`}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
