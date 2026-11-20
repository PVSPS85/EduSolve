import React, { useState } from 'react';
import { Conversation } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  User,
  Building2,
  FileCheck,
  Briefcase,
  School,
  Clock,
  Info,
} from '../icons';

export interface ChatAiPanelProps {
  conversation: Conversation;
  userRole: 'student' | 'ngo';
  onClose: () => void;
  onInsertSuggestedQuestion?: (question: string) => void;
}

export default function ChatAiPanel({
  conversation,
  userRole,
  onClose,
  onInsertSuggestedQuestion,
}: ChatAiPanelProps) {
  // Toggle to inspect both role perspectives inside prototype
  const [activePerspective, setActivePerspective] = useState<'student' | 'ngo'>(userRole);

  // States: 'ready' | 'loading' | 'error'
  const [panelState, setPanelState] = useState<'ready' | 'loading' | 'error'>('ready');

  const isNgoPerspective = activePerspective === 'ngo';

  const handleSimulateRefresh = () => {
    setPanelState('loading');
    setTimeout(() => {
      setPanelState('ready');
    }, 850);
  };

  const handleSimulateError = () => {
    setPanelState('loading');
    setTimeout(() => {
      setPanelState('error');
    }, 600);
  };

  return (
    <aside className="w-80 sm:w-96 bg-white border-l border-[#E5E7EB] flex flex-col justify-between h-full text-left shadow-xs overflow-hidden animate-fadeIn">
      
      {/* 1. Header */}
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-[#FAF9F6] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#14334A] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={18} className="text-[#EDD7AE]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#14334A] leading-tight">
                EduSolve AI Assistant
              </h3>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Decision & Project Fit Support
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#14334A] p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
            aria-label="Close AI Assistant Panel"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed">
          Understand project fit and make informed decisions using information available to you.
        </p>

        {/* Perspective Switcher for Prototype Evaluation */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-[#64748B]">Simulate View:</span>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-0.5 flex items-center">
            <button
              type="button"
              onClick={() => setActivePerspective('ngo')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                isNgoPerspective
                  ? 'bg-[#14334A] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#14334A]'
              }`}
            >
              NGO View
            </button>
            <button
              type="button"
              onClick={() => setActivePerspective('student')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                !isNgoPerspective
                  ? 'bg-[#836527] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#14334A]'
              }`}
            >
              Student View
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Analysis Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        
        {/* Loading State */}
        {panelState === 'loading' && (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#14334A]/20 border-t-[#14334A] rounded-full animate-spin mx-auto" />
            <h4 className="font-bold text-xs text-[#14334A]">Analyzing Public Profile & Brief Data...</h4>
            <p className="text-[11px] text-[#64748B] max-w-xs mx-auto">
              Cross-referencing stated skills, project expectations, and verified information.
            </p>
          </div>
        )}

        {/* Error State */}
        {panelState === 'error' && (
          <div className="p-5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl text-center space-y-3 text-xs text-[#991B1B]">
            <AlertTriangle size={24} className="mx-auto text-[#DC2626]" />
            <h4 className="font-bold">Unable to Refresh AI Insights</h4>
            <p className="text-[11px] leading-relaxed">
              Connection timeout or service unavailable. You can retry the synthesis anytime.
            </p>
            <Button variant="outline-subtle" size="sm" onClick={handleSimulateRefresh} className="text-xs">
              Retry Analysis
            </Button>
          </div>
        )}

        {/* Ready State */}
        {panelState === 'ready' && (
          <>
            {isNgoPerspective ? (
              /* ======================================================== */
              /* NGO VIEW — UNDERSTANDING THE STUDENT */
              /* ======================================================== */
              <div className="space-y-4 text-xs">
                
                {/* Profile Overview Card */}
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8]">
                      Applicant Profile Summary
                    </span>
                    <Badge variant="teal" size="sm">Collegiate Volunteer</Badge>
                  </div>
                  <strong className="block text-sm text-[#14334A]">Alex Chen</strong>
                  <p className="text-[11px] text-[#64748B]">
                    Stanford University • 3rd Year B.S. in Computer Science & HCI
                  </p>
                </div>

                {/* Section 1: Relevant Skills */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#16A34A]" />
                    <span>Documented Relevant Skills</span>
                  </h4>
                  <div className="space-y-1.5 bg-white border border-[#E5E7EB] p-3 rounded-2xl">
                    <p className="text-[11px] text-[#183047] leading-relaxed">
                      <strong>UX Research & WCAG Accessibility:</strong> Student has IAAP WAS certification and documented UI wireframe samples.
                    </p>
                    <p className="text-[11px] text-[#183047] leading-relaxed">
                      <strong>Curriculum Design:</strong> Prior experience drafting modular coding tutorials and tutoring elementary students.
                    </p>
                  </div>
                </div>

                {/* Section 2: Relevant Experience */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-[#70A1A8]" />
                    <span>Experience Provided by Student</span>
                  </h4>
                  <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl space-y-1.5 text-[11px]">
                    <div className="font-semibold text-[#183047]">Peer Coding Mentor (Stanford CS for All)</div>
                    <div className="text-[#64748B]">
                      1 year facilitating hands-on coding clinics with junior students.
                    </div>
                  </div>
                </div>

                {/* Section 3: Project Requirements Comparison */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <FileCheck size={13} className="text-[#836527]" />
                    <span>Project Alignment Observations</span>
                  </h4>
                  <div className="bg-[#FAF3E5] border border-[#EDD7AE] p-3 rounded-2xl space-y-1.5 text-[11px] text-[#836527]">
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-[#14334A]">✓ Strong Alignment:</span>
                      <span>Student has directly built large-font touch interfaces matching your senior tablet brief.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-[#14334A]">✓ Bandwidth:</span>
                      <span>Student availability (5-6 hrs/week) matches the 4-5 hrs/week project requirement.</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Missing Information & Points to Clarify */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={13} className="text-[#A57E59]" />
                    <span>Information to Clarify</span>
                  </h4>
                  <div className="bg-[#F4EFE9] border border-[#C8B294] p-3 rounded-2xl space-y-1 text-[11px] text-[#A57E59]">
                    <p>
                      • Student has not specified previous direct coaching with elderly learners; confirm comfort with geriatric pacing.
                    </p>
                    <p>
                      • Confirm attendance for Saturday onsite coaching sessions at the Chicago hub.
                    </p>
                  </div>
                </div>

                {/* Section 5: Suggested Questions */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#70A1A8]">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" x2="12.01" y1="17" y2="17" />
                    </svg>
                    <span>Suggested Questions for the Student</span>
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      'Could you walk us through how you designed the high-contrast touch targets in your portfolio?',
                      'Are you able to attend the in-person Saturday 10:00 AM workshops at the community center?',
                      'How do you approach explaining technical concepts without using digital jargon?',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onInsertSuggestedQuestion?.(q)}
                        className="w-full text-left p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#70A1A8] hover:bg-[#EBF4F5] transition-all text-[11px] text-[#183047] cursor-pointer block"
                      >
                        <span className="block italic">"{q}"</span>
                        <span className="text-[10px] text-[#70A1A8] font-semibold mt-1 block">
                          + Insert into message composer
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* ======================================================== */
              /* STUDENT VIEW — UNDERSTANDING THE NGO */
              /* ======================================================== */
              <div className="space-y-4 text-xs">
                
                {/* Org Summary Card */}
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#836527]">
                      Organization Background
                    </span>
                    <Badge variant="gold" size="sm">Verified 501(c)(3)</Badge>
                  </div>
                  <strong className="block text-sm text-[#14334A]">Horizon Community Services</strong>
                  <p className="text-[11px] text-[#64748B]">
                    Grassroots non-profit founded in 2014 • Over 12,000 residents supported in Chicago.
                  </p>
                </div>

                {/* Section 1: Verification Status */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#16A34A]" />
                    <span>Verified Platform Status</span>
                  </h4>
                  <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl space-y-1 text-[11px]">
                    <p className="text-[#183047]">
                      <strong>Statutory Verification:</strong> Approved by EduSolve Trust Team. Official state registry records and tax-exempt documentation checked.
                    </p>
                    <p className="text-[#16A34A] font-semibold">
                      ✓ $0 Out-of-pocket expenses policy verified.
                    </p>
                  </div>
                </div>

                {/* Section 2: Project Expectations */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#70A1A8]" />
                    <span>Workload & Timeline Expectations</span>
                  </h4>
                  <div className="bg-[#FAF3E5] border border-[#EDD7AE] p-3 rounded-2xl space-y-1.5 text-[11px] text-[#836527]">
                    <p>
                      <strong>Duration:</strong> 4-week cohort sprint ending mid-November.
                    </p>
                    <p>
                      <strong>Commitment:</strong> 4-5 hours/week including 1 Saturday morning clinic.
                    </p>
                    <p>
                      <strong>Outputs:</strong> Large-font navigation guides + staff handover handbook.
                    </p>
                  </div>
                </div>

                {/* Section 3: Points to Clarify */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={13} className="text-[#A57E59]" />
                    <span>Things to Clarify Before Committing</span>
                  </h4>
                  <div className="bg-[#F4EFE9] border border-[#C8B294] p-3 rounded-2xl space-y-1 text-[11px] text-[#A57E59]">
                    <p>
                      • Confirm exact Android tablet OS models to ensure screen sizes match your prototypes.
                    </p>
                    <p>
                      • Verify whether transit reimbursement vouchers will be issued prior to Saturday workshops.
                    </p>
                  </div>
                </div>

                {/* Section 4: Suggested Questions for NGO */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#70A1A8]">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" x2="12.01" y1="17" y2="17" />
                    </svg>
                    <span>Suggested Questions for the Coordinator</span>
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      'What tablet models will the senior cohort be using during the hands-on workshops?',
                      'Will community center staff be present alongside us during the coaching clinics?',
                      'How will the final printable handbook be distributed after our 4-week sprint?',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onInsertSuggestedQuestion?.(q)}
                        className="w-full text-left p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#70A1A8] hover:bg-[#EBF4F5] transition-all text-[11px] text-[#183047] cursor-pointer block"
                      >
                        <span className="block italic">"{q}"</span>
                        <span className="text-[10px] text-[#70A1A8] font-semibold mt-1 block">
                          + Insert into message composer
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </div>

      {/* 3. Footer Disclaimer & Testing Controls */}
      <div className="p-3.5 sm:p-4 border-t border-[#E5E7EB] bg-[#FAF9F6] space-y-2 text-[10px] text-[#64748B]">
        <div className="flex items-start gap-1.5 leading-snug">
          <Info size={13} className="text-[#70A1A8] shrink-0 mt-0.5" />
          <span>
            AI-generated assistance may be incomplete. Verify important information and make your own decisions.
          </span>
        </div>

        {/* Prototype simulation controls */}
        <div className="pt-1 flex items-center justify-between border-t border-[#E5E7EB]/60">
          <button
            onClick={handleSimulateRefresh}
            className="text-[#70A1A8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} />
            <span>Re-analyze</span>
          </button>

          <button
            onClick={handleSimulateError}
            className="text-[#A57E59] hover:underline cursor-pointer"
          >
            Simulate error
          </button>
        </div>
      </div>

    </aside>
  );
}
