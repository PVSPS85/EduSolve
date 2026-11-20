import React, { useMemo, useState } from 'react';
import { Conversation, ProjectAssignment } from '../../types';
import { SAMPLE_PROJECTS } from '../../data/projects';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import {
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  UserCheck,
} from '../icons';

interface AssignProjectDialogProps {
  isOpen: boolean;
  conversation: Conversation;
  onClose: () => void;
  onAssigned: (assignment: ProjectAssignment) => void;
  onOpenWorkspace: () => void;
}

export default function AssignProjectDialog({
  isOpen,
  conversation,
  onClose,
  onAssigned,
  onOpenWorkspace,
}: AssignProjectDialogProps) {
  const relevantProjects = useMemo(() => {
    const matches = SAMPLE_PROJECTS.filter(
      (project) =>
        project.organization === conversation.organization &&
        project.postingApproved,
    );
    return matches.length > 0 ? matches : SAMPLE_PROJECTS.filter((project) => project.postingApproved);
  }, [conversation.organization]);

  const eligibleStudents = conversation.participants.filter(
    (participant) => participant.role === 'student',
  );

  const [selectedProjectId, setSelectedProjectId] = useState(
    relevantProjects.find((project) => project.title === conversation.projectTitle)?.id ||
      relevantProjects[0]?.id ||
      '',
  );
  const [selectedStudentId, setSelectedStudentId] = useState(
    eligibleStudents[0]?.id || '',
  );
  const [assignmentMessage, setAssignmentMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedProject =
    relevantProjects.find((project) => project.id === selectedProjectId) ||
    relevantProjects[0];
  const selectedStudent =
    eligibleStudents.find((student) => student.id === selectedStudentId) ||
    eligibleStudents[0];

  const handleAssign = () => {
    if (!selectedProject || !selectedStudent || !confirmed) return;

    onAssigned({
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      projectImage: selectedProject.image,
      organization: selectedProject.organization,
      authorizedRepresentative:
        conversation.participants.find((participant) => participant.role === 'ngo')?.name ||
        conversation.title,
      duration: selectedProject.duration,
      commitment: selectedProject.commitment,
      summary: selectedProject.description,
      deliverables: selectedProject.deliverables.slice(0, 3),
      applicationStatus: 'Approved for Assignment',
      assignmentMessage: assignmentMessage.trim() || undefined,
      student: {
        id: selectedStudent.id,
        name: selectedStudent.name,
        avatar: selectedStudent.avatar,
        affiliation: selectedStudent.affiliation,
      },
    });
    setSuccess(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={success ? 'Project Assigned Successfully' : 'Assign Project to Student'}
      description={
        success
          ? 'Your project workspace has been created. You and the assigned student can now collaborate, manage tasks and track progress.'
          : 'Confirm the applicant and project before creating a private collaboration workspace.'
      }
      maxWidth="xl"
    >
      {success ? (
        <div className="space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF4F5] border border-[#70A1A8]/40 flex items-center justify-center mx-auto text-[#14334A]">
            <CheckCircle2 size={28} />
          </div>
          <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 text-left text-xs space-y-2">
            <strong className="text-sm text-[#14334A] block">{selectedProject?.title}</strong>
            <span className="text-[#64748B] block">
              Assigned to {selectedStudent?.name} for {selectedProject?.organization}.
            </span>
            <span className="text-[10px] text-[#94A3B8] block">
              Prototype only — no backend assignment or database record was created.
            </span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="primary" onClick={onOpenWorkspace}>
              Open Workspace
            </Button>
            <Button variant="outline-subtle" onClick={onClose}>
              Return to Chat
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-left">
          {relevantProjects.length > 1 && (
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
                Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="w-full bg-[#FAF9F6] text-sm text-[#183047] p-3 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              >
                {relevantProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
              Eligible Applicant
            </label>
            <select
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              className="w-full bg-[#FAF9F6] text-sm text-[#183047] p-3 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            >
              {eligibleStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} · {student.affiliation}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4">
            <img
              src={selectedStudent?.avatar}
              alt={selectedStudent?.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[#E5E7EB]"
            />
            <div className="space-y-2 text-xs">
              <strong className="text-base text-[#14334A] block">{selectedProject?.title}</strong>
              <span className="flex items-center gap-2 text-[#64748B]">
                <Building2 size={14} className="text-[#836527]" />
                {selectedProject?.organization}
              </span>
              <span className="flex items-center gap-2 text-[#64748B]">
                <Clock size={14} className="text-[#70A1A8]" />
                {selectedProject?.duration} · {selectedProject?.commitment}
              </span>
              <span className="flex items-center gap-2 text-[#836527] font-semibold">
                <UserCheck size={14} />
                Application: Approved for Assignment
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={15} className="text-[#70A1A8]" />
              <strong className="text-xs uppercase tracking-wider text-[#14334A]">
                Expected Deliverables
              </strong>
            </div>
            <ul className="space-y-1.5 text-xs text-[#64748B]">
              {selectedProject?.deliverables.slice(0, 3).map((deliverable) => (
                <li key={deliverable} className="flex items-start gap-2">
                  <span className="text-[#70A1A8]">•</span>
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
              Optional Assignment Message
            </label>
            <textarea
              rows={3}
              value={assignmentMessage}
              onChange={(event) => setAssignmentMessage(event.target.value)}
              placeholder="Add kickoff context, priorities, or a welcome note..."
              className="w-full bg-[#FAF9F6] text-sm text-[#183047] p-3 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none resize-none"
            />
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF3E5] border border-[#EDD7AE] text-xs text-[#836527] cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5"
            />
            <span>
              <strong className="block mb-0.5">Confirm private workspace creation</strong>
              Assigning this project creates workspace access for the selected student and authorized NGO representative.
            </span>
          </label>

          <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
            <ShieldCheck size={13} className="text-[#70A1A8]" />
            Interface permissions are illustrative; production authorization must be enforced by the backend.
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
            <Button variant="outline-subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={!confirmed} onClick={handleAssign}>
              Assign Project & Create Workspace
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
