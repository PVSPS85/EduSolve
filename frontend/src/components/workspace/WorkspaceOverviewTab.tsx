import React from 'react';
import { WorkspaceProject, WorkspaceTask } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  Folder,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  Building2,
} from '../icons';

export interface WorkspaceOverviewTabProps {
  project: WorkspaceProject;
  onNavigateTab: (
    tab: 'tasks' | 'progress' | 'files' | 'team' | 'github' | 'updates' | 'messages',
  ) => void;
  onOpenTaskDetails: (task: WorkspaceTask) => void;
  onSelectMember: (memberId: string) => void;
}

export default function WorkspaceOverviewTab({
  project,
  onNavigateTab,
  onOpenTaskDetails,
  onSelectMember,
}: WorkspaceOverviewTabProps) {
  // Summary counts
  const completedTasks = project.tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = project.tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = project.tasks.filter((t) => t.status === 'todo').length;

  // Imminent tasks (top 3)
  const upcomingTasks = project.tasks.slice(0, 3);

  const statusBadge = (status: WorkspaceTask['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
            <CheckCircle2 size={10} /> Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#14334A] bg-[#EBF4F5] px-2 py-0.5 rounded-full border border-[#70A1A8]/40">
            <Clock size={10} className="text-[#70A1A8]" /> In Progress
          </span>
        );
      case 'todo':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#64748B] bg-[#FAF9F6] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
            To Do
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#991B1B] bg-[#FEF2F2] px-2 py-0.5 rounded-full border border-[#FCA5A5]">
            Blocked
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left py-6">
      
      {/* 1. Project Summary Banner & Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Summary (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-7 shadow-[0_4px_24px_rgba(20,51,74,0.03)] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#836527]" />
              <span>Project Mission Brief</span>
            </span>
            <span className="text-xs text-[#64748B]">
              Approved Cohort Alpha
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#14334A] leading-snug">
            {project.title}
          </h2>

          <p className="text-xs sm:text-sm text-[#183047] leading-relaxed">
            {project.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B] border-t border-[#F1F5F9]">
            <span className="flex items-center gap-1.5">
              <Building2 size={13} className="text-[#836527]" />
              <span>NGO: <strong className="text-[#14334A]">{project.organization}</strong></span>
            </span>
            <span>•</span>
            <span>
              Representative:{' '}
              <strong className="text-[#14334A]">
                {project.authorizedRepresentative || 'Authorized NGO Lead'}
              </strong>
            </span>
            <span>•</span>
            <span>
              Assigned Student:{' '}
              <strong className="text-[#14334A]">
                {project.assignedStudent || 'Approved Student Lead'}
              </strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#70A1A8]" />
              <span>Oct 1 – Nov 15, 2026 (6 Weeks)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#16A34A]" />
              <span className="text-[#16A34A] font-semibold">Zero Volunteer Expense</span>
            </span>
          </div>

          {project.expectedDeliverables && project.expectedDeliverables.length > 0 && (
            <div className="pt-3 border-t border-[#F1F5F9]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                Expected Deliverables · {project.expectedCommitment}
              </span>
              <div className="flex flex-wrap gap-2">
                {project.expectedDeliverables.map((deliverable) => (
                  <span
                    key={deliverable}
                    className="text-[11px] text-[#183047] bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg px-2.5 py-1"
                  >
                    {deliverable}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary Metrics (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-7 shadow-[0_4px_24px_rgba(20,51,74,0.03)] flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
              Sprint Completion
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#14334A] tracking-tight">
                {project.progressPercent}%
              </span>
              <span className="text-xs font-semibold text-[#16A34A]">
                On Schedule
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E5E7EB] mt-3">
              <div
                style={{ width: `${project.progressPercent}%` }}
                className="h-full bg-gradient-to-r from-[#70A1A8] to-[#14334A] rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F1F5F9] text-center text-xs">
            <div className="p-2 bg-[#FAF9F6] rounded-xl border border-[#E5E7EB]">
              <span className="text-[10px] font-bold text-[#64748B] block">To Do</span>
              <strong className="text-sm font-extrabold text-[#14334A]">{todoTasks}</strong>
            </div>

            <div className="p-2 bg-[#FAF9F6] rounded-xl border border-[#E5E7EB]">
              <span className="text-[10px] font-bold text-[#70A1A8] block">In Prog</span>
              <strong className="text-sm font-extrabold text-[#14334A]">{inProgressTasks}</strong>
            </div>

            <div className="p-2 bg-[#FAF9F6] rounded-xl border border-[#E5E7EB]">
              <span className="text-[10px] font-bold text-[#16A34A] block">Done</span>
              <strong className="text-sm font-extrabold text-[#16A34A]">{completedTasks}</strong>
            </div>
          </div>

          <p className="text-[10px] text-[#94A3B8] text-center">
            * All figures are illustrative milestone progress indicators.
          </p>
        </div>

      </div>

      {/* 2. Upcoming Tasks & Team Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Upcoming Tasks (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-[#70A1A8]" />
              <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
                Upcoming Tasks & Milestones
              </h3>
            </div>

            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-bold text-[#14334A] hover:text-[#70A1A8] flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>View All Tasks ({project.tasks.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Imminent Tasks list */}
          <div className="space-y-2.5">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onOpenTaskDetails(task)}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] hover:border-[#70A1A8] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-xs sm:text-sm text-[#14334A] group-hover:text-[#70A1A8] transition-colors">
                      {task.title}
                    </span>
                    {statusBadge(task.status)}
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-1">{task.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <div className="flex items-center gap-1.5 text-[#183047] font-medium">
                    <img
                      src={task.assignedTo.avatar}
                      alt={task.assignedTo.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <span className="text-[11px] truncate max-w-[100px]">{task.assignedTo.name}</span>
                  </div>

                  <span className="text-[#D1D5DB]">|</span>

                  <span className="text-[11px] font-semibold text-[#836527] bg-[#FAF3E5] px-2 py-0.5 rounded-lg border border-[#EDD7AE]">
                    {task.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Button
              variant="outline-subtle"
              size="sm"
              onClick={() => onNavigateTab('tasks')}
              className="w-full sm:w-auto text-xs"
            >
              Open Full Tasks List
            </Button>
          </div>
        </div>

        {/* Team Members Preview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#70A1A8]" />
              <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
                Project Squad ({project.team.length})
              </h3>
            </div>

            <button
              onClick={() => onNavigateTab('team')}
              className="text-xs font-semibold text-[#70A1A8] hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {project.team.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => onSelectMember(member.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] hover:border-[#70A1A8] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-9 h-9 rounded-xl object-cover shrink-0 border border-[#E5E7EB]"
                  />
                  <div className="min-w-0">
                    <strong className="block text-xs text-[#14334A] truncate group-hover:text-[#70A1A8]">
                      {member.name}
                    </strong>
                    <span className="text-[10px] text-[#64748B] block truncate">
                      {member.role}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#70A1A8] bg-[#EBF4F5] px-2 py-0.5 rounded-md shrink-0">
                  {member.isNgoLead ? 'NGO Lead' : 'Student'}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Recent Activity Section */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#70A1A8]" />
            <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
              Recent Project Activity & Milestones
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('updates')}
            className="text-xs font-bold text-[#14334A] hover:text-[#70A1A8] flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>View All Updates</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="space-y-3">
          {project.updates.map((update) => (
            <div
              key={update.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] flex items-start gap-3.5 text-xs"
            >
              <img
                src={update.author.avatar}
                alt={update.author.name}
                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-[#E5E7EB] mt-0.5"
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <strong className="text-[#14334A]">{update.author.name}</strong>
                    <span className="text-[11px] text-[#64748B]">({update.author.role})</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">{update.timestamp}</span>
                </div>

                <p className="text-[#183047] leading-relaxed">{update.content}</p>

                {update.attachment && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-[#E5E7EB] text-[11px] font-semibold text-[#14334A] mt-1">
                    <FileText size={12} className="text-[#70A1A8]" />
                    <span>{update.attachment.name}</span>
                    <span className="text-[10px] text-[#94A3B8]">({update.attachment.size})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
