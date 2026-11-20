import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Flag,
  Ban,
  CheckCircle2,
  X,
  Eye,
  Info,
} from '../icons';

// 1. First-Chat Privacy Notice Component
export interface FirstChatNoticeProps {
  onAcknowledge: () => void;
  userRole?: 'student' | 'ngo';
}

export function FirstChatNotice({ onAcknowledge, userRole = 'student' }: FirstChatNoticeProps) {
  return (
    <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-2xl p-4 sm:p-5 text-left text-xs text-[#836527] shadow-xs space-y-3 mb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#836527] shrink-0" />
          <h4 className="font-bold text-sm text-[#14334A]">
            EduSolve Two-Way Communication & Safety Standards
          </h4>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#EDD7AE] shrink-0">
          Safety First
        </span>
      </div>

      <p className="text-[#183047] leading-relaxed">
        Both student volunteers and non-profit coordinators are protected by EduSolve safety policies. Please review these essential guidelines before beginning your conversation:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
        <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#EDD7AE]/60">
          <Lock size={14} className="text-[#836527] shrink-0 mt-0.5" />
          <span>
            <strong>Never share credentials:</strong> Do not request or share passwords, OTPs, or banking information.
          </span>
        </div>

        <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#EDD7AE]/60">
          <ShieldCheck size={14} className="text-[#836527] shrink-0 mt-0.5" />
          <span>
            <strong>Protect personal privacy:</strong> Avoid unnecessary sharing of personal phone numbers and home addresses.
          </span>
        </div>

        <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#EDD7AE]/60">
          <CheckCircle2 size={14} className="text-[#836527] shrink-0 mt-0.5" />
          <span>
            <strong>Confidentiality of beneficiaries:</strong> Do not upload private client or student beneficiary data.
          </span>
        </div>

        <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#EDD7AE]/60">
          <Flag size={14} className="text-[#836527] shrink-0 mt-0.5" />
          <span>
            <strong>Report concerns:</strong> Immediately flag off-platform solicitations or inappropriate conduct.
          </span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-[#EDD7AE]/60">
        <span className="text-[11px] text-[#836527]/80">
          All shared messages and project artifacts are retained for community service verification.
        </span>
        <Button variant="sand" size="sm" onClick={onAcknowledge} className="font-bold text-xs shadow-2xs">
          I Understand & Acknowledge
        </Button>
      </div>
    </div>
  );
}

// 2. Report Message / Conversation Modal
export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedName: string;
}

export function ReportModal({ isOpen, onClose, reportedName }: ReportModalProps) {
  const [reason, setReason] = useState('off-platform');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Report Concern regarding ${reportedName}`}
      description="Reports are confidential and reviewed within 12 hours by the EduSolve Trust & Governance Team."
      maxWidth="md"
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-left -mt-2">
          <div>
            <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
              Reason for Report <span className="text-[#EA4335]">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs text-[#183047] rounded-xl px-3 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            >
              <option value="off-platform">Solicitation of private contact / off-platform payment</option>
              <option value="credentials">Requesting passwords, OTPs, or financial details</option>
              <option value="inappropriate">Inappropriate, harassing, or unprofessional conduct</option>
              <option value="beneficiary">Unlawful distribution of beneficiary private data</option>
              <option value="misrepresentation">Misrepresentation of organizational status or academic standing</option>
              <option value="other">Other policy violation</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#14334A] block mb-1">
              Additional Context (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe what occurred or paste relevant context..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs text-[#183047] placeholder-[#94A3B8] rounded-xl p-3 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <p className="text-[11px] text-[#64748B] leading-relaxed">
            EduSolve logs this conversation thread for safety review. Submitting a report does not inform the other participant.
          </p>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline-subtle" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-[#EA4335] hover:bg-[#DC2626]">
              Submit Confidential Report
            </Button>
          </div>
        </form>
      ) : (
        <div className="py-6 text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto">
            <CheckCircle2 size={26} />
          </div>
          <h4 className="font-bold text-[#14334A] text-sm">Report Received</h4>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Thank you for helping keep EduSolve safe. Our Trust team has received the transcript reference and will investigate promptly.
          </p>
        </div>
      )}
    </Modal>
  );
}

// 3. Block User Confirmation Modal
export interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onConfirmBlock: () => void;
}

export function BlockModal({ isOpen, onClose, userName, onConfirmBlock }: BlockModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Block Communication with ${userName}?`}
      description="You will no longer receive direct messages, audio/video calls, or collaboration invites from this participant."
      maxWidth="sm"
    >
      <div className="text-left -mt-2 space-y-4 text-xs text-[#64748B]">
        <div className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-[#991B1B] flex items-start gap-2.5">
          <Ban size={18} className="shrink-0 mt-0.5 text-[#DC2626]" />
          <div>
            <strong className="block font-semibold">Immediate Communication Freeze</strong>
            <span>Active project team threads will require coordinator administrative reassignment.</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
          <Button variant="outline-subtle" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirmBlock();
              onClose();
            }}
            className="bg-[#EA4335] hover:bg-[#DC2626]"
          >
            Block Participant
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// 4. Photo Enlarge Preview Modal
export interface PhotoEnlargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
}

export function PhotoEnlargeModal({ isOpen, onClose, imageUrl, caption }: PhotoEnlargeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-[#EDD7AE] p-1.5 rounded-lg cursor-pointer"
          aria-label="Close photo preview"
        >
          <X size={24} />
        </button>

        <img
          src={imageUrl}
          alt={caption || 'Attached project image'}
          className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain border border-white/20 shadow-2xl"
        />

        {caption && (
          <div className="mt-3 text-center text-xs text-white/90 bg-black/60 px-4 py-1.5 rounded-full">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
