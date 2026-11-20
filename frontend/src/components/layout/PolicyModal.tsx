import React from 'react';
import { ShieldCheck, FileText, Mail, CheckCircle2 } from '../ui/icons';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyName: string;
}

export default function PolicyModal({ isOpen, onClose, policyName }: PolicyModalProps) {
  const getPolicyContent = () => {
    switch (policyName) {
      case 'Privacy Policy':
        return {
          title: 'Privacy Policy & Student Data Protection',
          description: 'EduSolve is committed to safeguarding student volunteer and community organization privacy.',
          body: (
            <div className="space-y-4 text-xs text-[#64748B] leading-relaxed">
              <p>
                <strong>1. Information Collection:</strong> During Phase 1, EduSolve only collects voluntary contact information for pilot notifications. In subsequent phases, student academic records and non-profit registration documents are processed solely for verification and project matching.
              </p>
              <p>
                <strong>2. Contact Shielding:</strong> Personal telephone numbers, home addresses, and private student profiles are never shared publicly or sold to third-party commercial entities.
              </p>
              <p>
                <strong>3. Workspace Security:</strong> Project collaboration occurs in controlled team environments where communications are retained solely for safety and delivery verification.
              </p>
            </div>
          ),
        };
      case 'Terms of Service':
        return {
          title: 'Terms of Service & Collaboration Guidelines',
          description: 'Standards governing student volunteer participation and community organization brief submissions.',
          body: (
            <div className="space-y-4 text-xs text-[#64748B] leading-relaxed">
              <p>
                <strong>1. Mutual Respect & Safety:</strong> All participants agree to maintain professional, inclusive, and harassment-free environments during all project phases.
              </p>
              <p>
                <strong>2. Intellectual Property & Community Handover:</strong> Deliverables created under EduSolve briefs are designed as open community assets or non-profit operational toolkits.
              </p>
              <p>
                <strong>3. Verification Disclaimer:</strong> EduSolve conducts independent checks of organizational documentation. Verification does not constitute government endorsement or continuous commercial liability.
              </p>
            </div>
          ),
        };
      case 'Verification Guidelines':
        return {
          title: 'Organization Verification Guidelines',
          description: 'How EduSolve reviews non-profit organizations before projects are approved.',
          body: (
            <div className="space-y-4 text-xs text-[#64748B] leading-relaxed">
              <p>
                <strong>1. Document Review:</strong> We verify non-profit registry status, official operational filings, and active community mission statements.
              </p>
              <p>
                <strong>2. Community Alignment:</strong> Projects must focus on educational enhancement, digital literacy, youth mentorship, or civic resource access.
              </p>
              <p>
                <strong>3. Scoping Feasibility:</strong> Each brief is reviewed by EduSolve coordinators to ensure work is achievable within 4 to 6 weeks by student volunteers without exploitation.
              </p>
            </div>
          ),
        };
      case 'Contact & Inquiries':
      default:
        return {
          title: 'Contact EduSolve Team',
          description: 'Get in touch regarding university partnerships, community briefs, or platform feedback.',
          body: (
            <div className="space-y-4 text-xs text-[#64748B] leading-relaxed">
              <p>
                Have questions about bringing EduSolve to your university department or local non-profit coalition? Reach our team directly:
              </p>
              <div className="p-4 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-medium text-[#14334A]">
                  <Mail className="w-4 h-4 text-[#70A1A8]" />
                  <span>partnerships@edusolve.org</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Inquiries typically answered within 1-2 business days.
                </p>
              </div>
            </div>
          ),
        };
    }
  };

  const content = getPolicyContent();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={content.title}
      description={content.description}
      maxWidth="md"
    >
      <div>
        <div className="mb-6">{content.body}</div>
        <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
