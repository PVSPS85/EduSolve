import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Plus, ShieldCheck, CheckCircle2, FileText, Sparkles, Clock, Users } from '../icons';

export interface PostProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName?: string;
}

export default function PostProblemModal({
  isOpen,
  onClose,
  organizationName = 'Horizon Community Services',
}: PostProblemModalProps) {
  const plannedSteps = [
    {
      step: '1',
      title: 'Articulate the Community Challenge',
      desc: 'Define the target problem statement, constituent demographics, and why local urgency exists.',
    },
    {
      step: '2',
      title: 'Target Skill Profiles & Disciplines',
      desc: 'Select desired student backgrounds (e.g. UX design, Python data analysis, or curriculum pedagogy).',
    },
    {
      step: '3',
      title: 'Milestone Delivery Timeline',
      desc: 'Break down expected deliverables into manageable 4 to 6-week academic sprint increments.',
    },
    {
      step: '4',
      title: 'Coordinator Mentorship Allocation',
      desc: 'Assign an organization representative to lead weekly 45-minute guidance check-ins.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post a Community Problem Brief"
      description={`Submitting as verified partner organization: ${organizationName}.`}
      maxWidth="lg"
    >
      <div className="text-left -mt-1 space-y-5">
        
        {/* Verification clearance badge */}
        <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-2xl p-4 flex items-center justify-between text-xs text-[#836527]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#836527] shrink-0" />
            <div>
              <strong className="block text-[#14334A]">Publishing Permission: Verified</strong>
              <span className="text-[#836527]">Your organization has full authorization to submit community briefs.</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EDD7AE]/50 px-2.5 py-1 rounded-full border border-[#836527]/20 shrink-0 hidden sm:inline">
            Active Partner
          </span>
        </div>

        {/* Phase boundary note */}
        <div className="p-4 rounded-2xl bg-[#EBF4F5] border border-[#70A1A8]/30 text-xs text-[#1E4663] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles size={14} className="text-[#70A1A8]" />
            <span>Interactive Scoping Wizard Planned for Phase 4</span>
          </div>
          <p className="text-[#64748B] leading-relaxed">
            Per the project brief, this button demonstrates verified NGO posting permissions. The multi-step brief editor and milestone builder will be designed in a future phase.
          </p>
        </div>

        {/* Planned submission pipeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-3">
            Upcoming Brief Creation Workflow:
          </h4>
          <div className="space-y-2.5">
            {plannedSteps.map((step) => (
              <div
                key={step.step}
                className="p-3 rounded-xl border border-[#E5E7EB] bg-white text-xs flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#FAF9F6] border border-[#E5E7EB] text-[#14334A] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {step.step}
                </div>
                <div>
                  <h5 className="font-semibold text-[#183047]">{step.title}</h5>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal actions */}
        <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>
            Acknowledge & Return to Feed
          </Button>
        </div>

      </div>
    </Modal>
  );
}
