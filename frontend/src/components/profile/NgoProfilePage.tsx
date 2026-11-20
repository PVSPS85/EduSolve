import React, { useState } from 'react';
import { NgoProfileData, Project, NgoVerificationStatus } from '../../types';
import { SAMPLE_NGO_PROFILE } from '../../data/profiles';
import { SAMPLE_PROJECTS } from '../../data/projects';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SkillTag from '../ui/SkillTag';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  MessageSquare,
  Bookmark,
  BookmarkFilled,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from '../icons';

export interface NgoProfilePageProps {
  ngoProfile?: NgoProfileData;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onViewAllOrgProjects: (orgName: string) => void;
  onOpenConversation?: () => void;
}

export default function NgoProfilePage({
  ngoProfile = SAMPLE_NGO_PROFILE,
  onBack,
  onSelectProject,
  onViewAllOrgProjects,
  onOpenConversation,
}: NgoProfilePageProps) {
  // Verification status state with simulator toggle
  const [verificationStatus, setVerificationStatus] = useState<NgoVerificationStatus>(
    ngoProfile.verificationStatus
  );

  // Follow organization toggle
  const [isFollowing, setIsFollowing] = useState(false);

  // Filter projects belonging to this NGO
  const activeProjects = SAMPLE_PROJECTS.filter(
    (p) => p.organization === ngoProfile.name || p.isOwnListing
  );

  // Verification Status Badge Rendering
  const renderVerificationDisplay = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
            <CheckCircle2 size={13} className="text-[#16A34A]" />
            <span>Verified Community Partner</span>
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#836527] bg-[#FAF3E5] px-3 py-1 rounded-full border border-[#EDD7AE]">
            <Clock size={13} className="text-[#836527]" />
            <span>Verification Pending Review</span>
          </div>
        );
      case 'additional-info':
        return (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A57E59] bg-[#F4EFE9] px-3 py-1 rounded-full border border-[#C8B294]">
            <AlertTriangle size={13} className="text-[#A57E59]" />
            <span>Additional Compliance Documents Needed</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#991B1B] bg-[#FEF2F2] px-3 py-1 rounded-full border border-[#FCA5A5]">
            <X size={13} className="text-[#DC2626]" />
            <span>Registration Not Approved</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] pb-24 text-left">
      
      {/* Top Sub-Nav Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#14334A] hover:text-[#70A1A8] py-1.5 px-3 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Verification Status Simulator (Allows testing all 4 verification states) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B] hidden sm:inline">Verification State:</span>
            <select
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value as NgoVerificationStatus)}
              className="bg-[#FAF9F6] text-xs font-semibold text-[#183047] rounded-xl px-2.5 py-1.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none cursor-pointer"
            >
              <option value="verified">Verified (Approved)</option>
              <option value="pending">Pending Review</option>
              <option value="additional-info">Additional Info Needed</option>
              <option value="rejected">Rejected / Ineligible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* Verification Status Explanation Banner (When not verified) */}
        {verificationStatus !== 'verified' && (
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
              verificationStatus === 'pending'
                ? 'bg-[#FAF3E5] border-[#EDD7AE] text-[#836527]'
                : verificationStatus === 'additional-info'
                ? 'bg-[#F4EFE9] border-[#C8B294] text-[#A57E59]'
                : 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
            }`}
          >
            <Info size={18} className="shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                {verificationStatus === 'pending'
                  ? 'Verification in Progress'
                  : verificationStatus === 'additional-info'
                  ? 'Additional Information Requested'
                  : 'Verification Rejected'}
              </strong>
              <span>
                {verificationStatus === 'pending'
                  ? 'Submitted statutory registration documents are being compared against public non-profit registries by the EduSolve trust team.'
                  : verificationStatus === 'additional-info'
                  ? 'Our compliance team has requested a copy of your state non-profit exemption certificate before full verified partner status can be granted.'
                  : 'This organization registration did not meet our community collaboration standards. Problem briefs cannot be published to student volunteers.'}
              </span>
            </div>
          </div>
        )}

        {/* 1. Organization Header Profile Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,51,74,0.04)] relative overflow-hidden">
          {/* Top brand accent ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#836527] via-[#C8B294] to-[#14334A]" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            {/* Identity */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <img
                src={ngoProfile.avatar}
                alt={ngoProfile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
              />

              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#14334A]">
                    {ngoProfile.name}
                  </h1>

                  {renderVerificationDisplay()}
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#64748B] mt-1">
                  <MapPin size={15} className="text-[#70A1A8] shrink-0" />
                  <span className="font-semibold text-[#183047]">{ngoProfile.location}</span>
                </div>

                <p className="text-xs text-[#64748B] mt-0.5">
                  {ngoProfile.registrationType} • <span className="font-mono text-[#183047]">{ngoProfile.registrationNumber}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
              <Button
                variant="outline-subtle"
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                leftIcon={isFollowing ? <BookmarkFilled size={14} className="text-[#836527]" /> : <Bookmark size={14} />}
                className="flex-1 sm:flex-none text-xs"
              >
                {isFollowing ? 'Following Organization' : 'Follow Organization'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={onOpenConversation}
                leftIcon={<MessageSquare size={14} />}
                className="flex-1 sm:flex-none text-xs shadow-xs"
              >
                Message Coordinator
              </Button>
            </div>

          </div>

          {/* Mission Statement Callout */}
          <div className="mt-6 pt-6 border-t border-[#F1F5F9] bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E7EB]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#836527] block mb-1">
              Core Community Mission:
            </span>
            <p className="text-xs sm:text-sm text-[#183047] leading-relaxed italic">
              "{ngoProfile.missionStatement}"
            </p>
          </div>

        </div>

        {/* 2. Content Sections: About, Focus Areas & Active Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Column (8 cols): About, Focus Areas, Recent & Active Projects */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* About The Organization */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#14334A] mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-[#70A1A8]" />
                <span>About {ngoProfile.name}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#183047] leading-relaxed">
                {ngoProfile.about}
              </p>
            </section>

            {/* Main Focus Areas */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#14334A] mb-3">
                Main Focus Areas & Programs
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {ngoProfile.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#FAF9F6] text-[#14334A] border border-[#E5E7EB] font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </section>

            {/* Active & Recent Project Briefs */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#14334A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>Active Community Problem Briefs</span>
                </h2>
                <button
                  onClick={() => onViewAllOrgProjects(ngoProfile.name)}
                  className="text-xs text-[#70A1A8] font-semibold hover:underline cursor-pointer"
                >
                  View on Feed
                </button>
              </div>

              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] hover:border-[#70A1A8] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs group"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E5E7EB]"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
                          {project.category} · {project.duration}
                        </span>
                        <h4
                          onClick={() => onSelectProject(project)}
                          className="font-bold text-sm text-[#14334A] group-hover:text-[#1E4663] transition-colors truncate cursor-pointer"
                        >
                          {project.title}
                        </h4>
                        <span className="text-[11px] text-[#64748B]">
                          {project.teamSize} • {project.commitment}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline-subtle"
                      size="sm"
                      onClick={() => onSelectProject(project)}
                      rightIcon={<ArrowRight size={13} />}
                      className="shrink-0 text-xs self-stretch sm:self-auto justify-center"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (4 cols): Public Contact & Organization Stats */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Authorized Public Contact Information */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-3.5 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#14334A] block pb-2 border-b border-[#F1F5F9]">
                Authorized Contact Information
              </h3>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                  Coordinator Representative
                </span>
                <span className="font-semibold text-[#183047] block mt-0.5">
                  {ngoProfile.contactRepresentative}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                  Official Communication Email
                </span>
                <div className="flex items-center gap-1.5 text-[#14334A] mt-0.5 font-medium">
                  <Mail size={13} className="text-[#70A1A8]" />
                  <span>{ngoProfile.contactEmail}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                  Official Public Website
                </span>
                <a
                  href={ngoProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#70A1A8] hover:underline font-semibold mt-0.5"
                >
                  <Globe size={13} />
                  <span>{ngoProfile.website}</span>
                  <ExternalLink size={11} className="text-[#94A3B8]" />
                </a>
              </div>
            </section>

            {/* Quick Community Metrics */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs text-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#14334A] block pb-2 border-b border-[#F1F5F9]">
                Community Engagement
              </h3>

              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Active Community Briefs:</span>
                <strong className="text-[#14334A]">{ngoProfile.activeProjectsCount}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Student Cohorts Completed:</span>
                <strong className="text-[#14334A]">4 Cohorts</strong>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Zero-Expense Policy:</span>
                <span className="text-[#16A34A] font-bold">100% Guaranteed</span>
              </div>
            </section>

            {/* Safety & Verification Notice */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-[11px] text-[#64748B] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#14334A]">
                <ShieldCheck size={14} className="text-[#70A1A8]" />
                <span>EduSolve Trust Standard</span>
              </div>
              <p className="leading-relaxed">
                Organizations undergo independent documentation checks. Verification indicates review of submitted non-profit filings and does not constitute government endorsement.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
