import React from 'react';
import AuthLayout from './AuthLayout';
import Button from '../ui/Button';
import { ShieldCheck, CheckCircle2, Clock, FileCheck, ArrowRight, Building2, AlertTriangle } from '../icons';

export interface NgoVerificationPendingProps {
  organizationName?: string;
  registrationNumber?: string;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export default function NgoVerificationPending({
  organizationName = 'Horizon Community Services',
  registrationNumber = 'DL/2022/0123456',
  onNavigateHome,
  onNavigateLogin,
}: NgoVerificationPendingProps) {
  const timeline = [
    {
      step: '1',
      title: 'Official Email Verified',
      status: 'Completed',
      desc: 'Organization domain communication channel confirmed.',
      completed: true,
    },
    {
      step: '2',
      title: 'Registration Documentation Review',
      status: 'In Progress (Estimated 2-3 business days)',
      desc: 'EduSolve verification team independently cross-checks statutory registry records.',
      current: true,
    },
    {
      step: '3',
      title: 'Community Scope Feasibility Call',
      status: 'Upcoming',
      desc: 'Short 20-minute discussion to review educational project briefs and mentor allocation.',
      upcoming: true,
    },
    {
      step: '4',
      title: 'Project Publishing Workspace Access',
      status: 'Locked Until Approval',
      desc: 'Access to post community briefs and review student volunteer squad applications.',
      upcoming: true,
    },
  ];

  return (
    <AuthLayout
      role="ngo"
      title="Registration Received"
      subtitle="Organization verification is currently in progress."
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-6 text-left">
        {/* Verification Status Warning / Notice */}
        <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#EDD7AE] flex items-center justify-center text-[#836527] shrink-0 mt-0.5">
            <Clock size={20} className="text-[#836527]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#836527]">
              Verification Pending for {organizationName}
            </h4>
            <p className="text-xs text-[#836527]/90 mt-1 leading-relaxed">
              Submitting registration details does not automatically grant verified status. In accordance with platform governance, all non-profit credentials undergo manual review before project publishing privileges are granted.
            </p>
          </div>
        </div>

        {/* Submission Details Summary */}
        <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 text-xs space-y-2">
          <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]">
            <span className="text-[#64748B]">Organization Name:</span>
            <strong className="text-[#14334A]">{organizationName}</strong>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]">
            <span className="text-[#64748B]">Identifier Submitted:</span>
            <span className="font-mono text-[#183047] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
              {registrationNumber}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#64748B]">Current Authorization:</span>
            <span className="text-[#836527] font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#836527] animate-pulse" />
              Under Review
            </span>
          </div>
        </div>

        {/* Verification Pipeline Timeline */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-3">
            Verification Pipeline & Next Steps
          </h5>

          <div className="space-y-3">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                  item.completed
                    ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                    : item.current
                    ? 'bg-white border-[#C8B294] shadow-xs'
                    : 'bg-[#FAF9F6] border-[#E5E7EB] opacity-70'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    item.completed
                      ? 'bg-[#16A34A] text-white'
                      : item.current
                      ? 'bg-[#836527] text-white'
                      : 'bg-[#E5E7EB] text-[#64748B]'
                  }`}
                >
                  {item.completed ? '✓' : item.step}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h6 className="font-bold text-[#14334A]">{item.title}</h6>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        item.completed
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : item.current
                          ? 'bg-[#FAF3E5] text-[#836527]'
                          : 'bg-[#E2E8F0] text-[#64748B]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Notice */}
        <p className="text-[11px] text-[#64748B] leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E7EB]">
          <strong>Notice:</strong> An EduSolve onboarding lead will reach out if additional supporting documentation (e.g., certificate of incorporation, 80G/12A registration, or board resolution) is required.
        </p>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onNavigateLogin}
            rightIcon={<ArrowRight size={15} />}
            className="justify-center py-3"
          >
            Go to Partner Sign In
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
