import React from 'react';
import { ApplicationSubmission } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { FileText, MessageSquare, CheckCircle2, Clock, Building2, User, ArrowRight } from '../icons';

export interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationSubmission[];
  userRole: 'student' | 'ngo';
  onOpenConversation: (submission: ApplicationSubmission) => void;
  onSelectStudentProfile?: (studentName: string) => void;
}

export default function ApplicationsModal({
  isOpen,
  onClose,
  applications,
  userRole,
  onOpenConversation,
  onSelectStudentProfile,
}: ApplicationsModalProps) {
  const isStudent = userRole === 'student';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isStudent ? 'My Submitted Applications' : 'Applications Received'}
      description={
        isStudent
          ? 'Track your volunteer applications and connect directly with community coordinators.'
          : 'Review interested student volunteer introductions and manage outreach.'
      }
      maxWidth="lg"
    >
      <div className="text-left -mt-1 space-y-4">
        
        {applications.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF9F6] rounded-2xl border border-[#E5E7EB] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#94A3B8] mx-auto">
              <FileText size={22} />
            </div>
            <h4 className="font-bold text-sm text-[#14334A]">No Applications Recorded Yet</h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
              {isStudent
                ? 'Browse the project feed and click "I\'m Interested" to submit your first application.'
                : 'As students discover your community brief, their introductions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3 hover:border-[#70A1A8] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {isStudent ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
                        {app.organization}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectStudentProfile?.(app.studentName);
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        <User size={11} />
                        <span>Applicant: {app.studentName} (View Profile)</span>
                      </button>
                    )}
                    <h4 className="font-bold text-sm text-[#14334A] leading-snug mt-0.5">
                      {app.projectTitle}
                    </h4>
                  </div>

                  <span className="text-[10px] font-bold text-[#836527] bg-[#FAF3E5] px-2.5 py-1 rounded-full border border-[#EDD7AE] shrink-0">
                    {app.status}
                  </span>
                </div>

                {/* Intro message snippet */}
                <p className="text-xs text-[#64748B] line-clamp-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E5E7EB]">
                  "{app.introMessage}"
                </p>

                {/* Skills tags & action */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {app.selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold text-[#14334A] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#C8B294]/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isStudent && (
                      <Button
                        variant="outline-subtle"
                        size="sm"
                        onClick={() => {
                          onClose();
                          onSelectStudentProfile?.(app.studentName);
                        }}
                        className="text-xs"
                      >
                        Profile
                      </Button>
                    )}

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onOpenConversation(app);
                      }}
                      leftIcon={<MessageSquare size={13} className="text-white" />}
                      className="text-xs"
                    >
                      Open Discussion
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal actions */}
        <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
          <Button variant="outline-subtle" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}
