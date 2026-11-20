import React, { useState } from 'react';
import { ApplicationSubmission } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { MessageSquare, Send, CheckCircle2, ShieldCheck, Clock, Building2, User } from '../icons';

export interface ConversationPlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ApplicationSubmission | null;
  userRole?: 'student' | 'ngo';
}

export default function ConversationPlaceholderModal({
  isOpen,
  onClose,
  submission,
  userRole = 'student',
}: ConversationPlaceholderModalProps) {
  const [newReply, setNewReply] = useState('');
  const [replies, setReplies] = useState<string[]>([]);
  const isStudent = userRole === 'student';

  if (!submission) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReply.trim()) {
      setReplies([...replies, newReply.trim()]);
      setNewReply('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Inquiry & Discussion Thread"
      description={`Direct communication channel between ${submission.studentName} and ${submission.organization}.`}
      maxWidth="lg"
    >
      <div className="text-left -mt-2 space-y-4">
        
        {/* Project Header Banner */}
        <div className="p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#70A1A8] block">Project Inquiry</span>
            <strong className="text-[#14334A] truncate block text-xs sm:text-sm">{submission.projectTitle}</strong>
          </div>
          <span className="text-[10px] font-bold text-[#836527] bg-[#FAF3E5] px-2.5 py-1 rounded-full border border-[#EDD7AE] shrink-0">
            {submission.status}
          </span>
        </div>

        {/* Phase boundary note */}
        <div className="bg-[#FAF3E5]/70 border border-[#EDD7AE] rounded-xl p-3 text-xs text-[#836527] flex items-center gap-2">
          <Clock size={15} className="shrink-0" />
          <span>
            <strong>Phase 3 Prototype Channel:</strong> Full real-time messaging, calendar scheduling, and collaborative document attachments will unlock in Phase 4.
          </span>
        </div>

        {/* Message Thread History */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-4 max-h-[300px] overflow-y-auto">
          
          {/* Automated System Notice */}
          <div className="text-center text-[11px] text-[#94A3B8] my-1">
            <span>Application submitted on {submission.submittedAt}</span>
          </div>

          {/* Student Introduction Bubble */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#14334A] text-white flex items-center justify-center shrink-0 text-xs font-bold">
              {submission.studentName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 max-w-[85%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#14334A]">{submission.studentName}</span>
                <span className="text-[10px] text-[#94A3B8]">Applicant</span>
              </div>
              <div className="bg-[#EBF4F5] text-[#183047] p-3 rounded-2xl rounded-tl-xs text-xs leading-relaxed border border-[#70A1A8]/20">
                <p>{submission.introMessage}</p>
                
                {/* Skills highlighted */}
                <div className="mt-2.5 pt-2 border-t border-[#70A1A8]/20 flex flex-wrap gap-1">
                  {submission.selectedSkills.map((s) => (
                    <span key={s} className="bg-white/90 text-[#14334A] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>

                {submission.portfolioLink && (
                  <div className="mt-2 text-[10px] text-[#1E4663] truncate">
                    Portfolio: <a href={submission.portfolioLink} target="_blank" rel="noreferrer" className="underline">{submission.portfolioLink}</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NGO Coordinator Response */}
          <div className="flex items-start gap-2.5 flex-row-reverse">
            <div className="w-8 h-8 rounded-xl bg-[#836527] text-white flex items-center justify-center shrink-0 text-xs font-bold">
              NGO
            </div>
            <div className="flex-1 max-w-[85%] text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-[10px] text-[#94A3B8]">Coordinator</span>
                <span className="text-xs font-bold text-[#14334A]">{submission.organization}</span>
              </div>
              <div className="bg-[#FAF3E5] text-[#836527] p-3 rounded-2xl rounded-tr-xs text-xs leading-relaxed text-left border border-[#EDD7AE]">
                <p>
                  Thank you for applying, {submission.studentName}! Our team is reviewing your highlighted skills and availability. We typically respond within 2 business days to set up a preliminary video kickoff call.
                </p>
              </div>
            </div>
          </div>

          {/* Any newly sent replies */}
          {replies.map((reply, idx) => (
            <div key={idx} className={`flex items-start gap-2.5 ${isStudent ? '' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 text-xs font-bold ${
                isStudent ? 'bg-[#14334A]' : 'bg-[#836527]'
              }`}>
                {isStudent ? 'ME' : 'NGO'}
              </div>
              <div className={`flex-1 max-w-[85%] ${isStudent ? 'text-left' : 'text-right'}`}>
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] text-[#183047] p-3 rounded-2xl text-xs leading-relaxed text-left">
                  {reply}
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="flex gap-2">
          <input
            type="text"
            placeholder={isStudent ? 'Send follow-up question to coordinator...' : 'Reply to student applicant...'}
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="flex-1 bg-white text-xs text-[#183047] placeholder-[#94A3B8] rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            rightIcon={<Send size={14} />}
            className="px-4"
          >
            Send
          </Button>
        </form>

        {/* Modal Bottom Actions */}
        <div className="pt-2 flex justify-end">
          <Button variant="outline-subtle" size="sm" onClick={onClose}>
            Close Thread
          </Button>
        </div>

      </div>
    </Modal>
  );
}
