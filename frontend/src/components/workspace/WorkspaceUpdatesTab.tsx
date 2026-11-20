import React, { useState } from 'react';
import { WorkspaceUpdate, WorkspaceTask, WorkspaceTeamMember } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import {
  Clock,
  Plus,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  Paperclip,
  User,
  Building2,
} from '../icons';

export interface WorkspaceUpdatesTabProps {
  updates: WorkspaceUpdate[];
  tasks: WorkspaceTask[];
  teamMembers: WorkspaceTeamMember[];
  userRole: 'student' | 'ngo';
  onPostUpdate: (update: Omit<WorkspaceUpdate, 'id'>) => void;
}

export default function WorkspaceUpdatesTab({
  updates,
  tasks,
  teamMembers,
  userRole,
  onPostUpdate,
}: WorkspaceUpdatesTabProps) {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [relatedTask, setRelatedTask] = useState(tasks[0]?.title || '');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [attachmentName, setAttachmentName] = useState('Sprint_Progress_Summary.pdf');

  const isStudent = userRole === 'student';

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onPostUpdate({
      author: {
        name: isStudent ? 'Alex Chen' : 'Pooja Sharma',
        role: isStudent ? 'Student Tech Lead' : 'NGO Project Lead',
        avatar: isStudent
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
      },
      timestamp: 'Just now',
      content: content.trim(),
      relatedTask: relatedTask || undefined,
      attachment: hasAttachment
        ? {
            name: attachmentName,
            size: '1.4 MB',
            type: 'PDF',
          }
        : undefined,
    });

    setContent('');
    setHasAttachment(false);
    setPostModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left py-6">
      
      {/* 1. Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#70A1A8]" />
            <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
              Project Milestones & Timeline Updates ({updates.length})
            </h3>
          </div>
          <span className="text-xs text-[#64748B] mt-0.5 block">
            Chronological log of project milestones, sprint reviews, and deliverable handoffs.
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setPostModalOpen(true)}
          leftIcon={<Plus size={14} />}
          className="text-xs shadow-xs"
        >
          Post Project Update
        </Button>
      </div>

      {/* 2. Timeline Feed */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,51,74,0.04)] space-y-8">
        <div className="relative border-l-2 border-[#E5E7EB] ml-3 sm:ml-4 space-y-8">
          {updates.map((update, idx) => (
            <div key={update.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-3 border-[#70A1A8] group-hover:border-[#14334A] transition-colors shadow-2xs" />

              <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
                {/* Author & Timestamp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={update.author.avatar}
                      alt={update.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <strong className="text-[#14334A] block leading-tight">
                        {update.author.name}
                      </strong>
                      <span className="text-[10px] text-[#64748B] block">
                        {update.author.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-[#94A3B8] font-medium">
                    {update.timestamp}
                  </span>
                </div>

                {/* Related Task Tag */}
                {update.relatedTask && (
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#836527] bg-[#FAF3E5] px-2.5 py-0.5 rounded-full border border-[#EDD7AE]">
                    <span>Milestone:</span>
                    <span className="text-[#14334A] truncate max-w-xs">{update.relatedTask}</span>
                  </div>
                )}

                {/* Content */}
                <p className="text-xs sm:text-sm text-[#183047] leading-relaxed">
                  {update.content}
                </p>

                {/* Attachment Badge */}
                {update.attachment && (
                  <div className="inline-flex items-center gap-2 p-2 px-3 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#14334A] font-semibold mt-1">
                    <FileText size={15} className="text-[#70A1A8]" />
                    <span>{update.attachment.name}</span>
                    <span className="text-[10px] text-[#94A3B8]">({update.attachment.size})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Post Update Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="Post Project Progress Update"
        description="Share a milestone achievement or blocker resolution with the approved team."
        maxWidth="md"
      >
        <form onSubmit={handlePostSubmit} className="space-y-4 text-left -mt-2 text-xs">
          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              Update Content <span className="text-[#A57E59]">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe what was accomplished, deliverables completed, or upcoming testing schedules..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              Related Task / Milestone
            </label>
            <select
              value={relatedTask}
              onChange={(e) => setRelatedTask(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            >
              <option value="">General Project Announcement</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E7EB] space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#14334A]">
              <input
                type="checkbox"
                checked={hasAttachment}
                onChange={(e) => setHasAttachment(e.target.checked)}
                className="rounded border-[#D1D5DB] text-[#14334A]"
              />
              <span className="flex items-center gap-1.5">
                <Paperclip size={13} />
                Attach project artifact or verification summary
              </span>
            </label>

            {hasAttachment && (
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="w-full bg-white text-xs text-[#183047] p-2 rounded-lg border border-[#E5E7EB]"
                placeholder="Filename (e.g. Sprint_Milestone_Test.pdf)"
              />
            )}
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
            <Button variant="outline-subtle" size="sm" type="button" onClick={() => setPostModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Post Update
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
