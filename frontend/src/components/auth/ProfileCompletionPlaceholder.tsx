import React from 'react';
import AuthLayout from './AuthLayout';
import Button from '../ui/Button';
import { CheckCircle2, GraduationCap, ArrowRight, Sparkles, FolderKanban, Award, Clock } from '../icons';

export interface ProfileCompletionPlaceholderProps {
  studentName?: string;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export default function ProfileCompletionPlaceholder({
  studentName = 'Student Volunteer',
  onNavigateHome,
  onNavigateLogin,
}: ProfileCompletionPlaceholderProps) {
  const upcomingSteps = [
    {
      title: 'Technical & Pedagogical Skill Inventory',
      desc: 'Tag your competencies across web development, graphic design, curriculum planning, and tutoring.',
    },
    {
      title: 'Community Cause Preferences',
      desc: 'Select preferred impact areas: elder digital literacy, youth STEM, or bilingual resource access.',
    },
    {
      title: 'Weekly Availability & Cohort Matching',
      desc: 'Specify flexible hours (approx. 4-6 hrs/week) to align with non-profit project timelines.',
    },
    {
      title: 'Student ID Verification & Academic Credit',
      desc: 'Upload college verification credentials for portfolio transcript certification.',
    },
  ];

  return (
    <AuthLayout
      role="student"
      title="Email Verified Successfully!"
      subtitle="Your account is active. Next: Profile Completion Flow (Planned for Phase 3)."
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-6 text-left">
        {/* Verification Success Confirmation Card */}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shrink-0 mt-0.5">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#166534]">
              Account Verified, {studentName}!
            </h4>
            <p className="text-xs text-[#166534]/90 mt-1 leading-relaxed">
              Your email credentials have been confirmed. In accordance with Phase 2 scope, initial registration is complete.
            </p>
          </div>
        </div>

        {/* Phase 3 Preview Box */}
        <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#70A1A8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#14334A]">
              What Profile Completion Will Include (Phase 3)
            </span>
          </div>

          <div className="space-y-3">
            {upcomingSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#EBF4F5] text-[#1E4663] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h5 className="font-semibold text-[#183047]">{step.title}</h5>
                  <p className="text-[#64748B] mt-0.5 text-[11px] leading-normal">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onNavigateLogin}
            rightIcon={<ArrowRight size={15} />}
            className="justify-center py-3"
          >
            Go to Student Sign In
          </Button>

          <Button
            variant="outline-subtle"
            size="md"
            fullWidth
            onClick={onNavigateHome}
            className="justify-center py-3"
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
