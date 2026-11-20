import React from 'react';
import { WorkspaceProject } from '../../types';
import Button from '../ui/Button';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Folder,
  MessageSquare,
  User,
  Users,
} from '../icons';

interface MyWorkspacesPageProps {
  userRole: 'student' | 'ngo';
  workspaces: WorkspaceProject[];
  onOpenWorkspace: (workspace: WorkspaceProject) => void;
  onExploreProjects: () => void;
  onOpenMessages: () => void;
  onOpenProfile: () => void;
}

export default function MyWorkspacesPage({
  userRole,
  workspaces,
  onOpenWorkspace,
  onExploreProjects,
  onOpenMessages,
  onOpenProfile,
}: MyWorkspacesPageProps) {
  const isStudent = userRole === 'student';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <button
            onClick={onExploreProjects}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#14334A] text-[#EDD7AE] flex items-center justify-center">
              <Folder size={18} />
            </div>
            <div>
              <strong className="text-base text-[#14334A] block leading-tight">EduSolve</strong>
              <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">
                My Workspaces
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="Workspace navigation">
            <button
              onClick={onExploreProjects}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#64748B] hover:bg-[#FAF9F6] hover:text-[#14334A]"
            >
              Explore Projects
            </button>
            <button className="px-3 py-2 rounded-lg text-xs font-bold text-[#14334A] bg-[#EBF4F5] flex items-center gap-1.5">
              <Folder size={14} className="text-[#70A1A8]" />
              Workspace
            </button>
            <button
              onClick={onOpenMessages}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#64748B] hover:bg-[#FAF9F6] hover:text-[#14334A] flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              Messages
            </button>
            <button
              onClick={onOpenProfile}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#64748B] hover:bg-[#FAF9F6] hover:text-[#14334A] flex items-center gap-1.5"
            >
              {isStudent ? <User size={14} /> : <Building2 size={14} />}
              {isStudent ? 'Profile' : 'Organization Profile'}
            </button>
          </nav>

          <Button variant="outline-subtle" size="sm" onClick={onExploreProjects}>
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft size={13} />
              Feed
            </span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-7">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#70A1A8]">
            Authorized Project Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14334A] mt-1">
            My Workspaces
          </h1>
          <p className="text-sm text-[#64748B] mt-2 max-w-2xl">
            Open projects where you are an assigned or approved member. Interface visibility is illustrative; production access must be enforced by backend authorization.
          </p>
        </div>

        {workspaces.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-[#70A1A8] flex items-center justify-center mx-auto mb-4">
              <Folder size={27} />
            </div>
            <h2 className="text-lg font-bold text-[#14334A]">
              {isStudent
                ? 'Your workspace is waiting for your first project.'
                : 'Your organization has no active workspaces yet.'}
            </h2>
            <p className="text-sm text-[#64748B] mt-2 max-w-xl mx-auto leading-relaxed">
              {isStudent
                ? 'Explore community projects, express your interest, and access your workspace when an NGO assigns you to a project.'
                : 'Review your approved project listings and assign an eligible student to create a private collaboration workspace.'}
            </p>
            <Button variant="primary" className="mt-6" onClick={onExploreProjects}>
              {isStudent ? 'Explore Projects' : 'View My Projects'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workspaces.map((workspace) => {
              const completedTasks = workspace.tasks.filter(
                (task) => task.status === 'completed',
              ).length;
              const lastActivity = workspace.updates[0]?.timestamp || 'No activity yet';

              return (
                <article
                  key={workspace.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-[0_4px_24px_rgba(20,51,74,0.05)]"
                >
                  <div className="relative h-44 sm:h-52 bg-[#FAF9F6]">
                    <img
                      src={workspace.headerImage}
                      alt={workspace.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14334A]/75 to-transparent" />
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider bg-[#FAF3E5] text-[#836527] border border-[#EDD7AE] rounded-full px-2.5 py-1">
                      Illustrative Prototype Workspace
                    </span>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="text-lg sm:text-xl font-bold leading-snug">
                        {workspace.title}
                      </h2>
                      <span className="text-xs text-white/80">{workspace.organization}</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                          Your Role
                        </span>
                        <strong className="text-[#14334A]">
                          {isStudent ? 'Student Member' : 'NGO Representative'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                          Status
                        </span>
                        <strong className="text-[#836527]">{workspace.status}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                          Team
                        </span>
                        <strong className="text-[#14334A] inline-flex items-center gap-1">
                          <Users size={12} /> {workspace.team.length}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                          Last Activity
                        </span>
                        <strong className="text-[#14334A] inline-flex items-center gap-1">
                          <Clock size={12} /> {lastActivity}
                        </strong>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-[#64748B]">
                          {completedTasks}/{workspace.tasks.length} tasks completed
                        </span>
                        <strong className="text-[#14334A]">
                          {workspace.progressPercent}%
                        </strong>
                      </div>
                      <div className="h-2 bg-[#FAF9F6] border border-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#70A1A8] to-[#14334A]"
                          style={{ width: `${workspace.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                      <span className="text-[10px] text-[#64748B] inline-flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-[#70A1A8]" />
                        Approved members only
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenWorkspace(workspace)}
                      >
                        Open Workspace
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
