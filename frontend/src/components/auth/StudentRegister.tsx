import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from './Input';
import PasswordInput from './PasswordInput';
import Select from './Select';
import Checkbox from './Checkbox';
import AlertBanner from './AlertBanner';
import Button from '../ui/Button';
import { User, Mail, School, ArrowRight, GoogleIcon } from '../icons';
import { StudentRegistrationData } from '../../types';

export interface StudentRegisterProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onNavigateNgoRegister: () => void;
  onRegistrationSuccess: (data: StudentRegistrationData) => void;
}

export default function StudentRegister({
  onNavigateHome,
  onNavigateLogin,
  onNavigateNgoRegister,
  onRegistrationSuccess,
}: StudentRegisterProps) {
  const [formData, setFormData] = useState<StudentRegistrationData>({
    fullName: '',
    email: '',
    institution: '',
    degree: 'computer-science',
    studyYear: '3rd-year',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentRegistrationData, string>>>({});
  const [existingAccountError, setExistingAccountError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const degreeOptions = [
    { value: 'computer-science', label: 'B.Tech / B.S. in Computer Science or Engineering' },
    { value: 'design', label: 'B.Des / Interaction & Visual Design' },
    { value: 'education', label: 'B.Ed / Education & Pedagogical Studies' },
    { value: 'social-sciences', label: 'B.A. / B.S. Social Sciences & Humanities' },
    { value: 'business', label: 'B.B.A. / M.B.A. Non-Profit & Management' },
    { value: 'data-science', label: 'Data Science & Information Systems' },
    { value: 'other', label: 'Other Interdisciplinary Degree' },
  ];

  const yearOptions = [
    { value: '1st-year', label: '1st Year (Freshman)' },
    { value: '2nd-year', label: '2nd Year (Sophomore)' },
    { value: '3rd-year', label: '3rd Year (Junior)' },
    { value: '4th-year', label: '4th Year (Senior)' },
    { value: 'graduate', label: 'Graduate / Master’s Degree' },
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof StudentRegistrationData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your student or university email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Please enter your college or institution name';
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters with letters & numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExistingAccountError(false);

    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Simulation trigger for already registered
      if (formData.email.toLowerCase().includes('exists@')) {
        setExistingAccountError(true);
        return;
      }

      onRegistrationSuccess(formData);
    }, 800);
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegistrationSuccess({
        fullName: 'Jordan Taylor',
        email: 'jordan.taylor@university.edu',
        institution: 'Metropolitan University',
        degree: 'computer-science',
        studyYear: '3rd-year',
        password: 'Google#OAuth2026',
        confirmPassword: 'Google#OAuth2026',
        acceptTerms: true,
      });
    }, 600);
  };

  return (
    <AuthLayout
      role="student"
      title="Join EduSolve"
      subtitle="Use your skills to create meaningful change."
      onNavigateHome={onNavigateHome}
      onSwitchRole={onNavigateNgoRegister}
      switchRoleLabel="Register as NGO Partner"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Existing Account Banner */}
        {existingAccountError && (
          <AlertBanner
            type="error"
            title="Account Already Registered"
            message={
              <span>
                An account with this email already exists. Please{' '}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="font-bold underline text-[#14334A]"
                >
                  sign in to your existing account
                </button>
                .
              </span>
            }
            onDismiss={() => setExistingAccountError(false)}
          />
        )}

        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          required
          autoComplete="name"
          placeholder="e.g., Ananya Sharma"
          value={formData.fullName}
          onChange={(e) => {
            setFormData({ ...formData, fullName: e.target.value });
            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
          }}
          leftIcon={<User size={16} />}
          error={errors.fullName}
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          placeholder="e.g., ananya@university.edu"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          leftIcon={<Mail size={16} />}
          helperText="We recommend using your university email for academic verification"
          error={errors.email}
        />

        {/* College / Institution */}
        <Input
          label="College or University"
          type="text"
          required
          placeholder="e.g., Stanford University / IIT Delhi"
          value={formData.institution}
          onChange={(e) => {
            setFormData({ ...formData, institution: e.target.value });
            if (errors.institution) setErrors({ ...errors, institution: undefined });
          }}
          leftIcon={<School size={16} />}
          error={errors.institution}
        />

        {/* Degree & Year Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Degree / Major"
            required
            options={degreeOptions}
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          />

          <Select
            label="Study Year"
            required
            options={yearOptions}
            value={formData.studyYear}
            onChange={(e) => setFormData({ ...formData, studyYear: e.target.value })}
          />
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PasswordInput
            label="Password"
            required
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm Password"
            required
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }}
            error={errors.confirmPassword}
          />
        </div>

        {/* Acceptance of Terms & Privacy */}
        <div className="pt-1">
          <Checkbox
            label={
              <span>
                I agree to the{' '}
                <span className="font-semibold text-[#14334A] underline cursor-pointer">
                  Terms of Service
                </span>{' '}
                and acknowledge the{' '}
                <span className="font-semibold text-[#14334A] underline cursor-pointer">
                  Privacy Policy
                </span>
                .
              </span>
            }
            checked={formData.acceptTerms}
            onChange={(e) => {
              setFormData({ ...formData, acceptTerms: e.target.checked });
              if (errors.acceptTerms) setErrors({ ...errors, acceptTerms: undefined });
            }}
            error={errors.acceptTerms}
          />
        </div>

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
            {isLoading ? 'Creating Account...' : 'Create Student Account'}
          </Button>
        </div>

        {/* Optional Google Social Sign Up */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-[#94A3B8] uppercase tracking-wider font-medium">
              or sign up with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#E5E7EB] bg-white text-xs sm:text-sm font-semibold text-[#183047] hover:bg-[#FAF9F6] hover:border-[#C8B294] transition-all duration-200 cursor-pointer shadow-2xs"
        >
          <GoogleIcon size={18} />
          <span>Sign up with Google</span>
        </button>

        {/* Footer Navigation Links */}
        <div className="pt-3 border-t border-[#F1F5F9] space-y-1.5 text-center text-xs">
          <p className="text-[#64748B]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-[#14334A] hover:text-[#70A1A8] hover:underline cursor-pointer"
            >
              Sign In Here
            </button>
          </p>

          <p className="text-[#94A3B8]">
            Represent a non-profit?{' '}
            <button
              type="button"
              onClick={onNavigateNgoRegister}
              className="font-semibold text-[#836527] hover:underline cursor-pointer"
            >
              Register Your Organization Instead
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
