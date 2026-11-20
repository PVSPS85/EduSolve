import React, { useState } from 'react';
import {
  Compass,
  Bookmark,
  BookmarkFilled,
  MessageSquare,
  User,
  Building2,
  Plus,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Folder,
  Briefcase,
} from '../icons';
import Button from '../ui/Button';

export interface FeedHeaderProps {
  userRole: 'student' | 'ngo';
  isAuthenticated: boolean;
  canPostProblems: boolean;
  onToggleRole: () => void;
  onNavigateHome: () => void;
  onOpenMessages: () => void;
  onOpenWorkspaces: () => void;
  onOpenMyProjects: () => void;
  onOpenApplications: () => void;
  onOpenSaved: () => void;
  onOpenProfile: () => void;
  onPostProblem: () => void;
  savedCount: number;
  applicationsCount: number;
  isSavedFilterActive: boolean;
}

export default function FeedHeader({
  userRole,
  isAuthenticated,
  canPostProblems,
  onToggleRole,
  onNavigateHome,
  onOpenMessages,
  onOpenWorkspaces,
  onOpenMyProjects,
  onOpenApplications,
  onOpenSaved,
  onOpenProfile,
  onPostProblem,
  savedCount,
  applicationsCount,
  isSavedFilterActive,
}: FeedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStudent = userRole === 'student';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              aria-label="EduSolve Home"
            >
              <div className="w-9 h-9 rounded-xl bg-[#14334A] flex items-center justify-center shadow-xs group-hover:bg-[#1E4663] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="7" cy="8" r="3.5" fill="#EDD7AE" />
                  <circle cx="17" cy="16" r="3.5" fill="#70A1A8" />
                  <path d="M9.5 9.5L14.5 14.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-[#14334A] leading-tight">
                  EduSolve
                </span>
                <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase -mt-0.5">
                  Shared Project Feed
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-[#E5E7EB]">
              <button
                onClick={onNavigateHome}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
              >
                Home
              </button>

              <button
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#14334A] bg-[#EBF4F5] text-[#1E4663] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Compass size={14} className="text-[#70A1A8]" />
                <span>Explore Projects</span>
              </button>

              {isStudent && <button
                onClick={onOpenSaved}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSavedFilterActive
                    ? 'bg-[#FAF3E5] text-[#836527] font-bold border border-[#EDD7AE]'
                    : 'text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6]'
                }`}
              >
                {isSavedFilterActive ? <BookmarkFilled size={14} className="text-[#836527]" /> : <Bookmark size={14} />}
                <span>Saved Projects</span>
                {savedCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#14334A] text-white font-mono">
                    {savedCount}
                  </span>
                )}
              </button>}

              {!isStudent && (
                <button
                  onClick={onOpenMyProjects}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Briefcase size={14} />
                  <span>My Projects</span>
                </button>
              )}

              <button
                onClick={onOpenApplications}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileText size={14} />
                <span>{isStudent ? 'My Applications' : 'Applications Received'}</span>
                {applicationsCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#70A1A8] text-white font-mono">
                    {applicationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenWorkspaces}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Folder size={14} />
                <span>Workspace</span>
              </button>

              <button
                onClick={onOpenMessages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare size={14} />
                <span>Messages</span>
              </button>
            </nav>
          </div>

          {/* Right: Actions & Role Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* NGO Only: "+ Post a Problem" Button */}
            {!isStudent && canPostProblems && (
              <Button
                variant="primary"
                size="sm"
                onClick={onPostProblem}
                leftIcon={<Plus size={15} />}
                className="hidden sm:inline-flex bg-[#14334A] shadow-xs text-xs"
              >
                + Post a Problem
              </Button>
            )}

            {/* Role Switcher Pill */}
            {isAuthenticated && (
              <div className="flex items-center bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={onToggleRole}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isStudent
                    ? 'bg-[#14334A] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#14334A]'
                }`}
                title="Switch to Student Volunteer View"
              >
                <User size={12} />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={onToggleRole}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isStudent
                    ? 'bg-[#836527] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#14334A]'
                }`}
                title="Switch to Verified NGO Partner View"
              >
                <Building2 size={12} />
                <span>NGO Partner</span>
              </button>
              </div>
            )}

            {/* Profile Avatar Button */}
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl border border-[#E5E7EB] hover:border-[#70A1A8] bg-[#FAF9F6] flex items-center justify-center text-[#14334A] hover:bg-[#EBF4F5] transition-colors cursor-pointer shadow-2xs"
              aria-label="Open User Profile Info"
            >
              {isStudent ? <User size={16} /> : <Building2 size={16} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#14334A] hover:bg-[#FAF9F6] border border-[#E5E7EB] cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 py-4 space-y-2 animate-fadeIn">
          {!isStudent && canPostProblems && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                onPostProblem();
              }}
              leftIcon={<Plus size={15} />}
              className="justify-center mb-2"
            >
              + Post a Problem
            </Button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateHome();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#183047] hover:bg-[#FAF9F6]"
          >
            Home
          </button>

          {!isStudent && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyProjects();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#183047] hover:bg-[#FAF9F6]"
            >
              My Projects
            </button>
          )}

          {isStudent && <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSaved();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#183047] hover:bg-[#FAF9F6] flex items-center justify-between"
          >
            <span>Saved Projects</span>
            {savedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#14334A] text-white font-mono">
                {savedCount}
              </span>
            )}
          </button>}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenWorkspaces();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#183047] hover:bg-[#FAF9F6]"
          >
            Workspace
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenApplications();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#183047] hover:bg-[#FAF9F6] flex items-center justify-between"
          >
            <span>{isStudent ? 'My Applications' : 'Applications Received'}</span>
            {applicationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#70A1A8] text-white font-mono">
                {applicationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenMessages();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#183047] hover:bg-[#FAF9F6]"
          >
            Messages
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenProfile();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#183047] hover:bg-[#FAF9F6]"
          >
            {isStudent ? 'Profile' : 'Organization Profile'}
          </button>
        </div>
      )}
    </header>
  );
}
