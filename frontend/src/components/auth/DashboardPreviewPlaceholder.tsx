import React from 'react';
import Button from '../ui/Button';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Building2, GraduationCap, FolderKanban, Users } from '../icons';

export interface DashboardPreviewPlaceholderProps {
  role: 'student' | 'ngo';
  userName: string;
  onSignOut: () => void;
  onNavigateHome: () => void;
}

export default function DashboardPreviewPlaceholder({
  role,
  userName,
  onSignOut,
  onNavigateHome,
}: DashboardPreviewPlaceholderProps) {
  const isStudent = role === 'student';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] flex flex-col justify-between selection:bg-[#EDD7AE] selection:text-[#14334A]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#14334A] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="7" cy="8" r="3.5" fill="#EDD7AE" />
                <circle cx="17" cy="16" r="3.5" fill="#70A1A8" />
                <path d="M9.5 9.5L14.5 14.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base text-[#14334A] block">
                EduSolve
              </span>
              <span className="text-[9px] font-semibold text-[#64748B] uppercase tracking-wider block -mt-1">
                {isStudent ? 'Student Workspace' : 'Community Partner Workspace'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#64748B] hidden sm:inline">
              Signed in as <strong className="text-[#14334A]">{userName}</strong>
            </span>
            <Button variant="outline-subtle" size="sm" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-12 flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-12 shadow-[0_8px_30px_rgba(20,51,74,0.05)] w-full max-w-2xl">
          
          <div className="w-16 h-16 rounded-2xl bg-[#EBF4F5] text-[#14334A] flex items-center justify-center mx-auto mb-6 shadow-xs border border-[#70A1A8]/30">
            {isStudent ? <GraduationCap size={32} /> : <Building2 size={32} />}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF3E5] text-[#836527] border border-[#EDD7AE] mb-4">
            <Sparkles size={13} />
            <span>Phase 2 Scope Boundary Notice</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14334A] tracking-tight mb-3">
            {isStudent
              ? `Welcome to EduSolve, ${userName}!`
              : `Welcome, ${userName}!`}
          </h2>

          <p className="text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed mb-8">
            You have successfully completed the authentication flow. Per project guidelines, full interactive dashboard workspaces (project assignment matching, collaborative messaging, and project progress tracking) are scheduled for Phase 3.
          </p>

          {/* Planned Features Preview */}
          <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-5 text-left mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-3">
              Upcoming {isStudent ? 'Student Volunteer' : 'Community Partner'} Workspace Modules:
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#70A1A8] shrink-0" />
                <span>{isStudent ? 'Browse open briefs and submit applications with team preferences' : 'Draft, scope, and publish new digital literacy & education challenges'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#70A1A8] shrink-0" />
                <span>{isStudent ? 'Protected project rooms with weekly milestone checklist' : 'Review matched student volunteer squads and schedule kickoff calls'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#70A1A8] shrink-0" />
                <span>{isStudent ? 'Documented civic service transcripts and credential exports' : 'Project handover documentation and community impact sign-offs'}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={onNavigateHome}
              className="w-full sm:w-auto justify-center"
            >
              Return to Public Homepage
            </Button>
            <Button
              variant="outline-subtle"
              size="md"
              onClick={onSignOut}
              className="w-full sm:w-auto justify-center"
            >
              Sign Out & Test Other Screens
            </Button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#94A3B8] border-t border-[#E5E7EB] bg-white">
        © {new Date().getFullYear()} EduSolve. Authentication Architecture Demonstration.
      </footer>
    </div>
  );
}
