import React, { useState } from 'react';
import { Project } from '../../types';
import {
  ArrowLeft,
  Bookmark,
  BookmarkFilled,
  Clock,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ExternalLink,
  Share2,
  ArrowRight,
  Mail,
  Building2,
  Briefcase,
  AlertTriangle,
  Info,
} from '../icons';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SkillTag from '../ui/SkillTag';

export interface ProjectDetailsViewProps {
  project: Project;
  userRole: 'student' | 'ngo';
  isSaved: boolean;
  onToggleSave: (projectId: string) => void;
  onBackToFeed: () => void;
  onApply: (project: Project) => void;
  onSelectNgoProfile?: (orgName: string) => void;
}

export default function ProjectDetailsView({
  project,
  userRole,
  isSaved,
  onToggleSave,
  onBackToFeed,
  onApply,
  onSelectNgoProfile,
}: ProjectDetailsViewProps) {
  const [copied, setCopied] = useState(false);
  const isStudent = userRole === 'student';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryVariants: Record<Project['category'], 'teal' | 'sand' | 'navy' | 'taupe' | 'gold'> = {
    'Digital Literacy': 'teal',
    'STEM & Coding': 'navy',
    'Resource Access': 'sand',
    'Learning Tools': 'taupe',
    Mentorship: 'gold',
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] pb-24 text-left">
      
      {/* 1. Top Sub-Nav Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-18 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBackToFeed}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#14334A] hover:text-[#70A1A8] py-1.5 px-3 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Project Feed</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#14334A] py-1.5 px-3 rounded-xl border border-[#E5E7EB] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              <Share2 size={14} />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleSave(project.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#FAF3E5] text-[#836527] border-[#EDD7AE]'
                  : 'bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#C8B294] hover:text-[#14334A]'
              }`}
            >
              {isSaved ? <BookmarkFilled size={14} className="text-[#836527]" /> : <Bookmark size={14} />}
              <span>{isSaved ? 'Saved' : 'Save Project'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* 2. Hero Media & Title Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-[0_8px_30px_rgba(20,51,74,0.05)] mb-8">
          
          {/* Main Photo Container */}
          <div className="relative w-full h-72 sm:h-96 md:h-[420px] bg-[#FAF9F6]">
            <img
              src={project.image}
              alt={project.imageAlt}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14334A]/85 via-[#14334A]/30 to-transparent" />

            {/* Badges on top */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge variant={categoryVariants[project.category]} size="md">
                {project.category}
              </Badge>
              <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                {project.workMode}
              </span>
            </div>

            {/* Title & Organization Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white max-w-4xl">
              <button
                type="button"
                onClick={() => onSelectNgoProfile?.(project.organization)}
                className="flex items-center gap-3 mb-2 text-left cursor-pointer group focus:outline-none"
              >
                <img
                  src={project.organizationAvatar}
                  alt={project.organization}
                  className="w-8 h-8 rounded-xl object-cover border border-white/30 group-hover:border-white transition-colors"
                />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EDD7AE] group-hover:underline">
                  {project.organization}
                </span>
                {project.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#836527] bg-[#FAF3E5] px-2 py-0.5 rounded-full">
                    <ShieldCheck size={11} />
                    Verified Non-Profit
                  </span>
                )}
              </button>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {project.title}
              </h1>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 bg-[#FAF9F6] border-t border-[#E5E7EB] text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#70A1A8] shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Project Duration</span>
                <span className="font-bold text-[#14334A] text-sm">{project.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#70A1A8] shrink-0">
                <Briefcase size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Weekly Commitment</span>
                <span className="font-bold text-[#14334A] text-sm">{project.commitment}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#70A1A8] shrink-0">
                <Users size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Team Composition</span>
                <span className="font-bold text-[#14334A] text-sm">{project.teamSize}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#70A1A8] shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Work Location</span>
                <span className="font-bold text-[#14334A] text-sm truncate block">{project.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Two-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Detailed Problem Statement */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#14334A] mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#70A1A8]" />
                <span>The Community Problem Brief</span>
              </h2>
              <p className="text-sm text-[#183047] leading-relaxed mb-4">
                {project.longDescription}
              </p>
            </section>

            {/* Why The Problem Matters */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#14334A] mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EDD7AE]" />
                <span>Why This Challenge Matters</span>
              </h2>
              <div className="bg-[#FAF9F6] border-l-4 border-[#C8B294] p-4 rounded-r-2xl mb-4 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {project.whyItMatters}
              </div>
            </section>

            {/* Objectives & Expected Outcomes */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#14334A] mb-4">
                Core Objectives & Target Outcomes
              </h2>
              
              <div className="space-y-3 mb-6">
                {project.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#EBF4F5] text-[#1E4663] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-[#183047] leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-2xl p-4 text-xs text-[#836527]">
                <strong className="block mb-1 text-[#836527] uppercase tracking-wider text-[10px]">
                  Verified Community Impact Goal:
                </strong>
                <p className="leading-relaxed">{project.expectedOutcome}</p>
              </div>
            </section>

            {/* Expected Deliverables */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#14334A] mb-4">
                Concrete Deliverables Expected
              </h2>
              <div className="space-y-3">
                {project.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-xs sm:text-sm">
                    <CheckCircle2 size={18} className="text-[#70A1A8] shrink-0 mt-0.5" />
                    <span className="text-[#183047] font-medium leading-relaxed">{deliv}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Constraints & Dependencies */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#14334A] mb-3">
                Constraints & Operating Context
              </h2>
              <div className="space-y-2.5 text-xs text-[#64748B]">
                {project.constraints.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#C8B294] font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Volunteer Expectations & Zero Cost Policy */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#14334A] mb-4">
                Volunteer Commitments & Resource Policy
              </h2>
              
              <div className="space-y-4 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                <div>
                  <h4 className="font-bold text-[#14334A] text-xs uppercase tracking-wider mb-1">
                    Student Availability Expectations:
                  </h4>
                  <p>{project.volunteerExpectations}</p>
                </div>

                <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-xs text-[#166534]">
                  <strong className="block font-bold mb-1">Zero Out-Of-Pocket Expenses:</strong>
                  <p>{project.materialExpenses}</p>
                </div>
              </div>
            </section>

            {/* Supporting Materials */}
            {project.supportingMaterials.length > 0 && (
              <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
                <h2 className="text-lg font-bold text-[#14334A] mb-3">
                  Supporting Documentation & Brief Attachments
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.supportingMaterials.map((mat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText size={18} className="text-[#70A1A8] shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-[#14334A] truncate block">{mat.name}</span>
                          <span className="text-[10px] text-[#94A3B8]">{mat.type} {mat.size && `• ${mat.size}`}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#70A1A8] bg-[#EBF4F5] px-2 py-1 rounded-md shrink-0">
                        View
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sticky Sidebar Action Card (Right 4 Cols) */}
          <div className="lg:col-span-4 sticky top-36 space-y-6">
            
            {/* Quick Action Card */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-[0_8px_30px_rgba(20,51,74,0.06)] space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                    Volunteer Status
                  </span>
                  <span className="text-sm font-bold text-[#16A34A] flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    Accepting Applications
                  </span>
                </div>

                <Badge variant="teal" size="sm">
                  Cohort Alpha
                </Badge>
              </div>

              {/* Primary Call to Action */}
              <div className="space-y-2.5">
                {isStudent ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => onApply(project)}
                    rightIcon={<ArrowRight size={16} />}
                    className="justify-center py-3.5 shadow-md"
                  >
                    I'm Interested — Apply to Project
                  </Button>
                ) : (
                  <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 text-center">
                    <span className="text-xs font-semibold text-[#64748B] block mb-2">
                      Viewing brief as NGO Representative
                    </span>
                    <Button
                      variant="outline-subtle"
                      size="sm"
                      fullWidth
                      onClick={() => onApply(project)}
                      className="justify-center text-xs"
                    >
                      Test Student Application Modal
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline-subtle"
                  size="md"
                  fullWidth
                  onClick={() => onToggleSave(project.id)}
                  leftIcon={isSaved ? <BookmarkFilled size={15} className="text-[#836527]" /> : <Bookmark size={15} />}
                  className="justify-center py-2.5"
                >
                  {isSaved ? 'Saved in Your Bookmarks' : 'Save for Later'}
                </Button>
              </div>

              {/* Required Skills Checklist */}
              <div className="pt-4 border-t border-[#F1F5F9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-2.5">
                  Target Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.map((skill) => (
                    <SkillTag key={skill} label={skill} size="sm" />
                  ))}
                </div>
              </div>

              {/* NGO Contact & Oversight Card (Clickable to NGO Profile) */}
              <div className="pt-4 border-t border-[#F1F5F9] text-xs">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-bold text-[#14334A] uppercase tracking-wider text-[10px]">
                    Project Lead & Mentorship
                  </h4>
                  <button
                    type="button"
                    onClick={() => onSelectNgoProfile?.(project.organization)}
                    className="text-[11px] font-semibold text-[#70A1A8] hover:underline cursor-pointer"
                  >
                    View NGO Profile
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectNgoProfile?.(project.organization)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] hover:border-[#70A1A8] transition-colors text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#14334A] font-bold text-xs shrink-0 group-hover:border-[#70A1A8]">
                    {project.organizationContact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[#14334A] block truncate group-hover:text-[#70A1A8]">
                      {project.organizationContact.name}
                    </span>
                    <span className="text-[11px] text-[#64748B] block truncate">
                      {project.organizationContact.role}
                    </span>
                  </div>
                  <ArrowRight size={13} className="text-[#94A3B8] group-hover:text-[#14334A] shrink-0" />
                </button>
              </div>

              {/* Trust & Safety micro badge */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-start gap-2 text-[11px] text-[#64748B]">
                <ShieldCheck size={14} className="text-[#70A1A8] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Verified organization brief. Communications and student hours are logged for certified community service credits.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
