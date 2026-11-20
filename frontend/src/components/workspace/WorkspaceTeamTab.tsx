import React, { useState } from 'react';
import { WorkspaceTeamInvitation, WorkspaceTeamMember } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SkillTag from '../ui/SkillTag';
import Modal from '../ui/Modal';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
  Plus,
  School,
  Building2,
  CheckSquare,
  UserCheck,
  Clock,
  X,
} from '../icons';

export interface WorkspaceTeamTabProps {
  team: WorkspaceTeamMember[];
  userRole: 'student' | 'ngo';
  onOpenProfile: (member: WorkspaceTeamMember) => void;
  onOpenChat: () => void;
  onAddMember?: (member: WorkspaceTeamMember) => void;
  invitations: WorkspaceTeamInvitation[];
  onInvitationChange: (invitation: WorkspaceTeamInvitation) => void;
}

export default function WorkspaceTeamTab({
  team,
  userRole,
  onOpenProfile,
  onOpenChat,
  onAddMember,
  invitations,
  onInvitationChange,
}: WorkspaceTeamTabProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('candidate-jordan');
  const [invitationMessage, setInvitationMessage] = useState('');

  const isStudent = userRole === 'student';
  const eligibleStudents = [
    {
      id: 'candidate-jordan',
      name: 'Jordan Lee',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
      affiliation: 'Stanford University · Data Science',
    },
    {
      id: 'candidate-priya',
      name: 'Priya Nair',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
      affiliation: 'UC Berkeley · Education Technology',
    },
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStudent =
      eligibleStudents.find((student) => student.id === selectedStudentId) ||
      eligibleStudents[0];
    onInvitationChange({
      id: `invitation-${Date.now()}`,
      student: selectedStudent,
      invitedBy: 'Alex Chen',
      message: invitationMessage.trim() || undefined,
      status: 'Pending',
    });
    setInvitationMessage('');
    setInviteModalOpen(false);
  };

  const updateInvitation = (
    invitation: WorkspaceTeamInvitation,
    status: WorkspaceTeamInvitation['status'],
  ) => {
    const updated = { ...invitation, status };
    onInvitationChange(updated);
    if (status === 'Approved' && !team.some((member) => member.id === invitation.student.id)) {
      onAddMember?.({
        id: invitation.student.id,
        name: invitation.student.name,
        role: 'Approved Student Collaborator',
        isNgoLead: false,
        avatar: invitation.student.avatar,
        affiliation: invitation.student.affiliation,
        skills: ['Collaboration', 'Project Delivery'],
        assignedTasksCount: 0,
        completedTasksCount: 0,
        contributionSummary:
          'Invited by the assigned student and approved by the authorized NGO representative.',
      });
    }
  };

  return (
    <div className="space-y-6 text-left py-6">
      
      {/* 1. Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#70A1A8]" />
            <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
              Approved Team Members ({team.length})
            </h3>
          </div>
          <span className="text-xs text-[#64748B] mt-0.5 block">
            Approved collaborative squad between non-profit leadership and student specialists.
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline-subtle"
            size="sm"
            onClick={onOpenChat}
            leftIcon={<MessageSquare size={14} className="text-[#70A1A8]" />}
            className="text-xs"
          >
            Team Chat
          </Button>

          {isStudent ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setInviteModalOpen(true)}
              leftIcon={<Plus size={14} />}
              className="text-xs shadow-xs"
            >
              Invite Team Member
            </Button>
          ) : (
            <span className="text-[11px] text-[#64748B] bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
              Review accepted invitations below
            </span>
          )}
        </div>
      </div>

      {/* Private Workspace Notice */}
      <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-[#836527]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#836527] shrink-0" />
          <span>
            <strong>Private Workspace Access:</strong> Only approved student team members and authorized NGO coordinators have access to this workspace.
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold text-[#836527] hidden sm:inline">
          Restricted Access
        </span>
      </div>

      {invitations.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
              Team Invitations ({invitations.length})
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Invited students cannot access private workspace content until NGO approval.
            </p>
          </div>
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={invitation.student.avatar}
                    alt={invitation.student.name}
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div>
                    <strong className="text-sm text-[#14334A] block">
                      {invitation.student.name}
                    </strong>
                    <span className="text-[11px] text-[#64748B]">
                      {invitation.student.affiliation}
                    </span>
                    <span className="text-[10px] text-[#836527] font-bold block mt-1">
                      {invitation.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isStudent && invitation.status === 'Pending' && (
                    <>
                      <Button
                        variant="outline-subtle"
                        size="sm"
                        onClick={() => updateInvitation(invitation, 'Declined')}
                      >
                        Simulate Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateInvitation(invitation, 'Accepted')}
                      >
                        Simulate Accept
                      </Button>
                    </>
                  )}
                  {isStudent && invitation.status === 'Accepted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateInvitation(invitation, 'Approval Pending')}
                    >
                      Send for NGO Approval
                    </Button>
                  )}
                  {!isStudent && invitation.status === 'Approval Pending' && (
                    <>
                      <Button
                        variant="outline-subtle"
                        size="sm"
                        onClick={() => updateInvitation(invitation, 'Rejected')}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateInvitation(invitation, 'Approved')}
                      >
                        Approve Member
                      </Button>
                    </>
                  )}
                  {invitation.status === 'Pending' && !isStudent && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <Clock size={13} />
                      Awaiting student response
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 shadow-[0_4px_24px_rgba(20,51,74,0.04)] space-y-4 hover:border-[#70A1A8] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Member Top Bar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-13 h-13 rounded-2xl object-cover border border-[#E5E7EB] shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base text-[#14334A] leading-tight">
                        {member.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          member.isNgoLead
                            ? 'bg-[#FAF3E5] text-[#836527] border-[#EDD7AE]'
                            : 'bg-[#EBF4F5] text-[#1E4663] border-[#70A1A8]/40'
                        }`}
                      >
                        {member.isNgoLead ? 'NGO Project Lead' : 'Student Specialist'}
                      </span>
                    </div>

                    <span className="text-xs text-[#70A1A8] font-semibold block mt-0.5">
                      {member.role}
                    </span>

                    <span className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                      {member.isNgoLead ? <Building2 size={11} /> : <School size={11} />}
                      <span>{member.affiliation}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Contribution Summary */}
              <p className="text-xs text-[#183047] leading-relaxed mt-3 bg-[#FAF9F6] p-3 rounded-2xl border border-[#E5E7EB]">
                {member.contributionSummary}
              </p>

              {/* Skills Tags */}
              <div className="pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
                  Designated Skills
                </span>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map((skill) => (
                    <SkillTag key={skill} label={skill} size="sm" />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: View Profile & Direct Message */}
            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#64748B]">
                Tasks: <strong>{member.assignedTasksCount}</strong> assigned
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline-subtle"
                  size="sm"
                  onClick={() => onOpenProfile(member)}
                  rightIcon={<ExternalLink size={12} />}
                  className="text-xs"
                >
                  EduSolve Profile
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenChat}
                  leftIcon={<MessageSquare size={12} />}
                  className="text-xs"
                >
                  Message
                </Button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 3. Invite Team Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Team Member"
        description="Invite an existing EduSolve student. Workspace access remains locked until acceptance and NGO approval."
        maxWidth="md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-left -mt-2 text-xs">
          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              Search Existing EduSolve Students
            </label>
            <input
              type="text"
              placeholder="Search by name, institution, or skill..."
              className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              Select Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            >
              {eligibleStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} · {student.affiliation}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              Optional Invitation Message
            </label>
            <textarea
              rows={3}
              value={invitationMessage}
              onChange={(e) => setInvitationMessage(e.target.value)}
              placeholder="Explain the role and why their skills would help the project..."
              className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
            <Button
              variant="outline-subtle"
              size="sm"
              type="button"
              onClick={() => setInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
