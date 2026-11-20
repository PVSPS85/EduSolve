import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { Compass, X, CheckCircle2 } from '../icons';

export interface ScreenSwitcherDockProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export default function ScreenSwitcherDock({
  currentScreen,
  onNavigate,
}: ScreenSwitcherDockProps) {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: AppScreen; label: string; group: 'Project Experience' | 'Student' | 'NGO' | 'Shared' | 'Public' }[] = [
    { id: 'workspace', label: 'Private Project Team Workspace', group: 'Project Experience' },
    { id: 'messages', label: 'Dedicated Full-Page Messaging & AI Chat', group: 'Project Experience' },
    { id: 'feed', label: 'Shared Project Feed (Instagram-style)', group: 'Project Experience' },
    { id: 'project-details', label: 'Dedicated Project Details Page', group: 'Project Experience' },
    { id: 'post-problem', label: 'NGO — Post a Problem Form', group: 'Project Experience' },
    { id: 'student-profile', label: 'Student Portfolio Profile', group: 'Student' },
    { id: 'ngo-profile', label: 'NGO Organization Profile', group: 'NGO' },
    { id: 'home', label: 'Public Homepage', group: 'Public' },
    { id: 'how-it-works', label: 'How It Works', group: 'Public' },
    { id: 'about', label: 'About EduSolve', group: 'Public' },
    { id: 'student-login', label: 'Student Login', group: 'Student' },
    { id: 'student-register', label: 'Student Registration', group: 'Student' },
    { id: 'student-email-verification', label: 'Student Email Verification', group: 'Student' },
    { id: 'student-profile-completion-placeholder', label: 'Profile Completion (Next Phase)', group: 'Student' },
    { id: 'ngo-login', label: 'NGO Login', group: 'NGO' },
    { id: 'ngo-register', label: 'NGO Registration', group: 'NGO' },
    { id: 'ngo-email-verification', label: 'NGO Email Verification', group: 'NGO' },
    { id: 'ngo-verification-pending', label: 'NGO Verification Pending', group: 'NGO' },
    { id: 'forgot-password', label: 'Forgot Password', group: 'Shared' },
    { id: 'password-reset-sent', label: 'Password Reset Sent', group: 'Shared' },
    { id: 'student-dashboard-preview', label: 'Student Auth Success (Preview)', group: 'Student' },
    { id: 'ngo-dashboard-preview', label: 'NGO Auth Success (Preview)', group: 'NGO' },
  ];

  return (
    <div className="fixed bottom-3 right-3 z-50 text-xs font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#14334A] text-white hover:bg-[#1E4663] px-3.5 py-2.5 rounded-full shadow-[0_8px_24px_rgba(20,51,74,0.3)] border border-white/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Open Prototype Screen Navigator"
        >
          <Compass size={15} className="text-[#EDD7AE]" />
          <span className="font-semibold hidden sm:inline">Prototype Screen Navigator</span>
          <span className="sm:hidden font-semibold">Screens</span>
          <span className="bg-[#70A1A8] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {screens.findIndex((s) => s.id === currentScreen) + 1}/{screens.length}
          </span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_20px_48px_rgba(20,51,74,0.22)] p-4 w-80 sm:w-96 max-h-[85vh] overflow-y-auto animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-[#70A1A8]" />
              <span className="font-bold text-[#14334A] text-sm">
                Prototype Navigation Matrix
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#64748B] hover:text-[#14334A] p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close Navigator"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-[11px] text-[#64748B] mb-3 leading-relaxed">
            Jump directly to any authentication screen, project feed view, messaging interface, or workspace.
          </p>

          {/* Screen Groups */}
          <div className="space-y-3">
            {['Project Experience', 'Public', 'Student', 'NGO', 'Shared'].map((group) => {
              const groupScreens = screens.filter((s) => s.group === group);
              if (groupScreens.length === 0) return null;

              return (
                <div key={group} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block px-1">
                    {group}
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {groupScreens.map((s) => {
                      const isActive = currentScreen === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            onNavigate(s.id);
                            setIsOpen(false);
                          }}
                          className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-[#14334A] text-white font-semibold shadow-2xs'
                              : 'text-[#183047] hover:bg-[#FAF9F6] hover:text-[#14334A]'
                          }`}
                        >
                          <span className="truncate">{s.label}</span>
                          {isActive && <CheckCircle2 size={13} className="text-[#EDD7AE] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
