import React, { useState } from 'react';
import { Project } from '../../types';
import {
  ShieldCheck,
  Bookmark,
  BookmarkFilled,
  Clock,
  Users,
  MapPin,
  ThumbsDown,
  ArrowRight,
  Eye,
  CheckCircle2,
  Undo2,
  Building2,
  Briefcase,
  Share2,
} from '../icons';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SkillTag from '../ui/SkillTag';

export interface FeedPostProps {
  project: Project;
  userRole: 'student' | 'ngo';
  isSaved: boolean;
  onToggleSave: (projectId: string) => void;
  onDismiss: (projectId: string) => void;
  onSelectProject: (project: Project) => void;
  onApply: (project: Project) => void;
  onManageOwnBrief?: (project: Project) => void;
  onViewApplicants?: (project: Project) => void;
  onSelectNgoProfile?: (orgName: string) => void;
}

export default function FeedPost({
  project,
  userRole,
  isSaved,
  onToggleSave,
  onDismiss,
  onSelectProject,
  onApply,
  onManageOwnBrief,
  onViewApplicants,
  onSelectNgoProfile,
}: FeedPostProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const isStudent = userRole === 'student';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const categoryVariants: Record<Project['category'], 'teal' | 'sand' | 'navy' | 'taupe' | 'gold'> = {
    'Digital Literacy': 'teal',
    'STEM & Coding': 'navy',
    'Resource Access': 'sand',
    'Learning Tools': 'taupe',
    Mentorship: 'gold',
  };

  return (
    <article className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(20,51,74,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(20,51,74,0.08)] hover:border-[#C8B294]/60 text-left">
      
      {/* 1. Header: NGO Identity, Location, Verification & Bookmark */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with subtle ring & link to NGO profile */}
          <button
            type="button"
            onClick={() => onSelectNgoProfile?.(project.organization)}
            className="relative shrink-0 text-left cursor-pointer focus:outline-none group"
            title={`View ${project.organization} profile`}
          >
            <img
              src={project.organizationAvatar}
              alt={project.organization}
              className="w-11 h-11 rounded-2xl object-cover border border-[#E5E7EB] shadow-2xs group-hover:border-[#70A1A8] transition-colors"
            />
            {project.isVerified && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#14334A] text-white flex items-center justify-center border-2 border-white shadow-xs"
                title="Verified Community Organization"
              >
                <CheckCircle2 size={10} className="text-[#EDD7AE]" />
              </span>
            )}
          </button>

          {/* Org details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectNgoProfile?.(project.organization)}
                className="font-bold text-sm text-[#14334A] hover:text-[#70A1A8] transition-colors truncate cursor-pointer text-left focus:outline-none"
                title={`View ${project.organization} profile`}
              >
                {project.organization}
              </button>
              {project.isVerified && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#836527] bg-[#FAF3E5] px-2 py-0.5 rounded-full border border-[#EDD7AE]">
                  <ShieldCheck size={11} className="text-[#836527]" />
                  <span>Verified NGO</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
              <span>{project.organizationCity}</span>
              <span>•</span>
              <span className="font-medium text-[#1E4663]">{project.workMode}</span>
            </div>
          </div>
        </div>

        {/* Top Actions: NGO indicator, Share, Save */}
        <div className="flex items-center gap-1.5 shrink-0">
          {project.isOwnListing && !isStudent && (
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-[#1E4663] bg-[#EBF4F5] px-2.5 py-1 rounded-full border border-[#70A1A8]/40">
              Your Organization Listing
            </span>
          )}

          <button
            onClick={handleShare}
            className="p-2 text-[#94A3B8] hover:text-[#14334A] hover:bg-[#FAF9F6] rounded-xl transition-colors cursor-pointer"
            title="Share brief link"
            aria-label="Share brief"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={() => onToggleSave(project.id)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSaved
                ? 'text-[#836527] bg-[#FAF3E5] border border-[#EDD7AE]'
                : 'text-[#94A3B8] hover:text-[#14334A] hover:bg-[#FAF9F6] border border-transparent'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Project for Later'}
            aria-label={isSaved ? 'Saved' : 'Save Project'}
          >
            {isSaved ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      {/* 2. Main Project Image (Single, substantial vertical aspect ratio) */}
      <div
        onClick={() => onSelectProject(project)}
        className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-[#FAF9F6] cursor-pointer group"
      >
        <img
          src={project.image}
          alt={project.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />

        {/* Category Pill Tag Overlay */}
        <div className="absolute top-4 left-4">
          <Badge variant={categoryVariants[project.category]} size="sm">
            {project.category}
          </Badge>
        </div>

        {/* Duration & Commitment Tag Overlay */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#14334A]/80 backdrop-blur-xs text-white px-3 py-1 rounded-full shadow-sm">
            <Clock size={12} className="text-[#EDD7AE]" />
            <span>{project.duration}</span>
          </span>
        </div>

        {/* Hover hint */}
        <div className="absolute inset-0 bg-[#14334A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#14334A] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye size={14} className="text-[#70A1A8]" />
            <span>Click to View Full Project Brief</span>
          </span>
        </div>
      </div>

      {/* 3. Post Body: Title, Description, Skills, & Metadata Info Row */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Title */}
        <div>
          <button
            onClick={() => onSelectProject(project)}
            className="text-left font-extrabold text-lg sm:text-xl text-[#14334A] hover:text-[#1E4663] transition-colors leading-snug cursor-pointer group"
          >
            <span className="group-hover:underline underline-offset-2">{project.title}</span>
          </button>
        </div>

        {/* Brief Description */}
        <p className="text-sm text-[#64748B] leading-relaxed">
          {project.description}
        </p>

        {/* Information Meta Row: Team Size, Commitment, Work Mode */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl text-xs text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Team</span>
            <span className="font-bold text-[#14334A] text-xs sm:text-sm">{project.teamSize}</span>
          </div>
          <div className="border-x border-[#E5E7EB]">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Commitment</span>
            <span className="font-bold text-[#14334A] text-xs sm:text-sm">{project.commitment}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Format</span>
            <span className="font-bold text-[#14334A] text-xs sm:text-sm">{project.workMode}</span>
          </div>
        </div>

        {/* Required Skills Tags */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
            Target Skill Profile
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <SkillTag key={skill} label={skill} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Action Footer: Role-Specific Behavior */}
      <div className="p-4 sm:p-5 bg-[#FAF9F6]/80 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {isStudent ? (
          <>
            {/* Left: Not Interested dismissal action */}
            <button
              onClick={() => onDismiss(project.id)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#EA4335] py-2 px-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
              title="Hide this project from your feed"
            >
              <ThumbsDown size={14} />
              <span>Not Interested</span>
            </button>

            {/* Right: View Details & Primary I'm Interested button */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline-subtle"
                size="md"
                onClick={() => onSelectProject(project)}
                leftIcon={<Eye size={15} />}
                className="flex-1 sm:flex-none justify-center text-xs"
              >
                View Details
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => onApply(project)}
                rightIcon={<ArrowRight size={15} />}
                className="flex-1 sm:flex-none justify-center text-xs sm:text-sm py-2.5 px-5 shadow-sm"
              >
                I'm Interested
              </Button>
            </div>
          </>
        ) : (
          /* NGO View: Distinguish own listing or view details */
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {project.isOwnListing ? (
              <>
                <span className="text-xs text-[#836527] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#836527]" />
                  <span>Managed by your organization account</span>
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="sand"
                    size="sm"
                    onClick={() => onViewApplicants?.(project)}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    View Applicants (2)
                  </Button>

                  <Button
                    variant="outline-subtle"
                    size="sm"
                    onClick={() => onManageOwnBrief?.(project)}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    Manage Brief
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelectProject(project)}
                    leftIcon={<Eye size={14} />}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    Public View
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs text-[#64748B]">
                  Posted by peer organization <strong>{project.organization}</strong>
                </span>

                <Button
                  variant="outline-subtle"
                  size="sm"
                  onClick={() => onSelectProject(project)}
                  leftIcon={<Eye size={14} />}
                  className="w-full sm:w-auto justify-center text-xs"
                >
                  View Full Brief Details
                </Button>
              </>
            )}
          </div>
        )}
      </div>

    </article>
  );
}
