import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from './Input';
import PasswordInput from './PasswordInput';
import Select from './Select';
import Checkbox from './Checkbox';
import AlertBanner from './AlertBanner';
import Button from '../ui/Button';
import { Building2, User, Mail, ShieldCheck, ArrowRight, FileCheck } from '../icons';
import { NgoRegistrationData } from '../../types';

export interface NgoRegisterProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onNavigateStudentRegister: () => void;
  onRegistrationSuccess: (data: NgoRegistrationData) => void;
}

export default function NgoRegister({
  onNavigateHome,
  onNavigateLogin,
  onNavigateStudentRegister,
  onRegistrationSuccess,
}: NgoRegisterProps) {
  const [formData, setFormData] = useState<NgoRegistrationData>({
    organizationName: '',
    representativeName: '',
    email: '',
    registrationType: 'ngo-darpan',
    registrationNumber: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NgoRegistrationData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const registrationTypeOptions = [
    { value: 'ngo-darpan', label: 'NGO-DARPAN Registered Entity (India)' },
    { value: 'section-8', label: 'Section 8 Non-Profit Company (Companies Act)' },
    { value: 'registered-trust', label: 'Registered Charitable Public Trust' },
    { value: 'registered-society', label: 'Registered Society (Societies Registration Act)' },
    { value: '501c3', label: '501(c)(3) Exempt Organization (US / Global)' },
    { value: 'other', label: 'Other Statutory Non-Profit / Community Entity' },
  ];

  // Dynamic label and placeholder based on selected registration type
  const getIdentifierConfig = () => {
    switch (formData.registrationType) {
      case 'ngo-darpan':
        return {
          label: 'NGO-DARPAN Unique ID',
          placeholder: 'e.g., DL/2022/0123456',
          helper: 'Enter your valid NITI Aayog DARPAN portal identifier',
        };
      case 'section-8':
        return {
          label: 'Corporate Identification Number (CIN)',
          placeholder: 'e.g., U85300DL2020NPL123456',
          helper: 'Ministry of Corporate Affairs 21-character CIN',
        };
      case 'registered-trust':
        return {
          label: 'Trust Deed / Registration Number',
          placeholder: 'e.g., TR/2018/8874/SD',
          helper: 'Sub-registrar deed registration reference number',
        };
      case 'registered-society':
        return {
          label: 'Society Registration Number',
          placeholder: 'e.g., SOC/DIST/2019/542',
          helper: 'Registrar of Societies issued certificate number',
        };
      case '501c3':
        return {
          label: 'Employer Identification Number (EIN)',
          placeholder: 'e.g., 12-3456789',
          helper: 'IRS assigned nine-digit identification number',
        };
      case 'other':
      default:
        return {
          label: 'Statutory Registration / Gazette Number',
          placeholder: 'e.g., REG/2021/9876',
          helper: 'Enter your official government registration or charter identifier',
        };
    }
  };

  const idConfig = getIdentifierConfig();

  const validate = () => {
    const newErrors: Partial<Record<keyof NgoRegistrationData, string>> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Please enter your registered organization name';
    }

    if (!formData.representativeName.trim()) {
      newErrors.representativeName = 'Please enter the official representative name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter an official organizational email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = `Please enter your ${idConfig.label}`;
    }

    if (!formData.password) {
      newErrors.password = 'Please create an account password';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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

    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onRegistrationSuccess(formData);
    }, 850);
  };

  return (
    <AuthLayout
      role="ngo"
      title="Register Your Organization"
      subtitle="Connect your community challenges with student volunteers."
      onNavigateHome={onNavigateHome}
      onSwitchRole={onNavigateStudentRegister}
      switchRoleLabel="Student Volunteer Sign Up"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Required Verification Notice from Brief */}
        <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-xl p-3.5 text-xs text-[#836527] flex items-start gap-3">
          <ShieldCheck size={18} className="text-[#836527] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block text-[#836527] font-semibold mb-0.5">
              Organization Verification Notice
            </strong>
            Organization verification is required before publishing projects. Submitting registration details does not automatically grant verified status. You will be requested to provide supporting documentation (such as charter deeds or registration certificates) during administrative review.
          </div>
        </div>

        {/* Registered Organization Name */}
        <Input
          label="Registered Organization Name"
          type="text"
          required
          placeholder="e.g., Horizon Community Services Foundation"
          value={formData.organizationName}
          onChange={(e) => {
            setFormData({ ...formData, organizationName: e.target.value });
            if (errors.organizationName) setErrors({ ...errors, organizationName: undefined });
          }}
          leftIcon={<Building2 size={16} />}
          helperText="Enter the full name matching your legal registration records"
          error={errors.organizationName}
        />

        {/* Representative Full Name */}
        <Input
          label="Representative Full Name"
          type="text"
          required
          autoComplete="name"
          placeholder="e.g., Dr. Marcus Vance"
          value={formData.representativeName}
          onChange={(e) => {
            setFormData({ ...formData, representativeName: e.target.value });
            if (errors.representativeName) setErrors({ ...errors, representativeName: undefined });
          }}
          leftIcon={<User size={16} />}
          helperText="Primary point of contact for project scoping and student coordination"
          error={errors.representativeName}
        />

        {/* Official Email */}
        <Input
          label="Official Organization Email"
          type="email"
          required
          autoComplete="email"
          placeholder="e.g., director@horizoncommunity.org"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          leftIcon={<Mail size={16} />}
          error={errors.email}
        />

        {/* Registration Type Dropdown */}
        <Select
          label="Organization Legal Structure / Type"
          required
          options={registrationTypeOptions}
          value={formData.registrationType}
          onChange={(e) => {
            setFormData({
              ...formData,
              registrationType: e.target.value,
              registrationNumber: '', // Reset on type change
            });
          }}
        />

        {/* Dynamic Registration Number Input */}
        <Input
          label={idConfig.label}
          type="text"
          required
          placeholder={idConfig.placeholder}
          value={formData.registrationNumber}
          onChange={(e) => {
            setFormData({ ...formData, registrationNumber: e.target.value });
            if (errors.registrationNumber) setErrors({ ...errors, registrationNumber: undefined });
          }}
          leftIcon={<FileCheck size={16} />}
          helperText={idConfig.helper}
          error={errors.registrationNumber}
        />

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

        {/* Terms Acceptance */}
        <div className="pt-1">
          <Checkbox
            label={
              <span>
                I represent that I am authorized to register on behalf of this organization, agree to the{' '}
                <span className="font-semibold text-[#14334A] underline cursor-pointer">
                  Terms of Service
                </span>
                , and acknowledge the{' '}
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
            {isLoading ? 'Submitting Registration...' : 'Register Organization'}
          </Button>
        </div>

        {/* Links */}
        <div className="pt-3 border-t border-[#F1F5F9] space-y-1.5 text-center text-xs">
          <p className="text-[#64748B]">
            Already registered your non-profit?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-[#14334A] hover:text-[#836527] hover:underline cursor-pointer"
            >
              Sign In to Partner Portal
            </button>
          </p>

          <p className="text-[#94A3B8]">
            Are you a student volunteer?{' '}
            <button
              type="button"
              onClick={onNavigateStudentRegister}
              className="font-semibold text-[#1E4663] hover:underline cursor-pointer"
            >
              Register as Student Volunteer
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
