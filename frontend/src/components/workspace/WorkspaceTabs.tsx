import React from 'react';
import {
  Activity,
  CheckSquare,
  Folder,
  Users,
  Clock,
  MessageSquare,
} from '../icons';

export type WorkspaceTabId =
  | 'overview'
  | 'tasks'
  | 'progress'
  | 'files'
  | 'team'
  | 'github'
  | 'updates'
  | 'messages';

export interface WorkspaceTabsProps {
  activeTab: WorkspaceTabId;
  onTabChange: (tab: WorkspaceTabId) => void;
  tasksCount: number;
  filesCount: number;
  teamCount: number;
  updatesCount: number;
  progressCount: number;
  githubCount: number;
}

export default function WorkspaceTabs({
  activeTab,
  onTabChange,
  tasksCount,
  filesCount,
  teamCount,
  updatesCount,
  progressCount,
  githubCount,
}: WorkspaceTabsProps) {
  const tabs: { id: WorkspaceTabId; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Project Overview', icon: Activity },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: tasksCount },
    { id: 'progress', label: 'Daily Progress', icon: Clock, count: progressCount },
    { id: 'files', label: 'Files & Deliverables', icon: Folder, count: filesCount },
    { id: 'team', label: 'Team', icon: Users, count: teamCount },
    { id: 'github', label: 'GitHub Activity', icon: Activity, count: githubCount },
    { id: 'updates', label: 'Activity', icon: Clock, count: updatesCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2"
          aria-label="Workspace tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#14334A] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6]'
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? 'text-[#EDD7AE]' : 'text-[#70A1A8]'}
                />
                <span>{tab.label}</span>

                {typeof tab.count === 'number' && (
                  <span
                    className={`ml-0.5 px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FAF9F6] text-[#64748B] border border-[#E5E7EB]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
