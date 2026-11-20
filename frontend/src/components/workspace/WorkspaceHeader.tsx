import React from 'react';
import { WorkspaceProject } from '../../types';
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Video,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  Building2,
  User,
  Sparkles,
  Plus,
} from '../icons';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export interface WorkspaceHeaderProps {
  project: WorkspaceProject;
  userRole: 'student' | 'ngo';
  onToggleRole: () => void;
  onBackToFeed: () => void;
  onOpenMessages: () => void;
  onStartCall: () => void;
  onSubmitDailyProgress: () => void;
}

export default function WorkspaceHeader({
  project,
  userRole,
  onToggleRole,
  onBackToFeed,
  onOpenMessages,
  onStartCall,
  onSubmitDailyProgress,
}: WorkspaceHeaderProps) {
  const isStudent = userRole === 'student';

  return (
    <div className="bg-white border-b border-[#E5E7EB] shadow-2xs text-left">
      {/* 1. Top Bar: Return Link & Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-[#F1F5F9] text-xs">
        <button
          onClick={onBackToFeed}
          className="inline-flex items-center gap-1.5 font-semibold text-[#14334A] hover:text-[#70A1A8] py-1 px-2.5 rounded-lg hover:bg-[#FAF9F6] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to My Projects & Feed</span>
        </button>

        {/* Workspace Security & Perspective Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[#16A34A] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0] text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Private Team Workspace</span>
          </div>

          <div className="flex items-center bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={onToggleRole}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isStudent
                  ? 'bg-[#14334A] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#14334A]'
              }`}
              title="Switch to Student Volunteer perspective"
            >
              <User size={12} className={isStudent ? 'text-[#EDD7AE]' : 'text-[#70A1A8]'} />
              <span>Student View</span>
            </button>

            <button
              type="button"
              onClick={onToggleRole}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isStudent
                  ? 'bg-[#836527] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#14334A]'
              }`}
              title="Switch to NGO Coordinator perspective"
            >
              <Building2 size={12} className={!isStudent ? 'text-[#EDD7AE]' : 'text-[#836527]'} />
              <span>NGO View</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Project Identity Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          
          {/* Left: Thumbnail, Titles, Status, & Dates */}
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            {/* Project Header Image Thumbnail */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs shrink-0 bg-[#FAF9F6]">
              <img
                src={project.headerImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15" />
            </div>

            <div className="min-w-0">
              {/* Category, Status & NGO Organization */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] bg-[#EBF4F5] px-2.5 py-0.5 rounded-full border border-[#70A1A8]/40">
                  {project.category}
                </span>

                <span className="text-[10px] font-bold text-[#836527] bg-[#FAF3E5] px-2.5 py-0.5 rounded-full border border-[#EDD7AE] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#836527]" />
                  <span>{project.status}</span>
                </span>

                <span className="text-xs text-[#64748B] font-medium hidden sm:inline">
                  Lead Organization:{' '}
                  <strong className="text-[#14334A]">{project.organization}</strong>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#14334A] tracking-tight leading-tight">
                {project.title}
              </h1>

              {/* Timeline Dates & Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-2">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-[#70A1A8]" />
                  <span>Started: {project.startDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-[#70A1A8]" />
                  <span>Target Completion: <strong>{project.targetCompletionDate}</strong></span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1">
                  <Users size={13} className="text-[#70A1A8]" />
                  <span>{project.team.length} Approved Members</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions & Progress Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F1F5F9]">
            
            {/* Communication Action Buttons (Reuse existing experience) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {isStudent && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onSubmitDailyProgress}
                  leftIcon={<Plus size={15} />}
                  className="flex-1 sm:flex-none text-xs font-bold"
                >
                  Submit Daily Progress
                </Button>
              )}
              <Button
                variant="outline-subtle"
                size="md"
                onClick={onOpenMessages}
                leftIcon={<MessageSquare size={15} className="text-[#70A1A8]" />}
                className="flex-1 sm:flex-none text-xs font-bold"
              >
                Project Messages
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={onStartCall}
                leftIcon={<Video size={15} />}
                className="flex-1 sm:flex-none text-xs font-bold shadow-xs"
              >
                Start Team Call
              </Button>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full sm:w-64 bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-2.5 px-3 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-bold text-[#14334A] uppercase tracking-wider">
                  Sprint Progress
                </span>
                <strong className="text-xs font-extrabold text-[#14334A]">
                  {project.progressPercent}%
                </strong>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#E5E7EB]">
                <div
                  style={{ width: `${project.progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-[#70A1A8] to-[#14334A] rounded-full transition-all duration-500"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
