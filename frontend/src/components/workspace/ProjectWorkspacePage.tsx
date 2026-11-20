import React, { useEffect, useState } from 'react';
import {
  DailyProgressReport,
  GithubActivityEvent,
  WorkspaceProject,
  WorkspaceTask,
  WorkspaceFile,
  WorkspaceTeamMember,
  WorkspaceTeamInvitation,
  WorkspaceUpdate,
} from '../../types';
import { SAMPLE_WORKSPACE_PROJECT } from '../../data/workspaceData';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceTabs, { WorkspaceTabId } from './WorkspaceTabs';
import WorkspaceOverviewTab from './WorkspaceOverviewTab';
import WorkspaceTasksTab from './WorkspaceTasksTab';
import WorkspaceFilesTab from './WorkspaceFilesTab';
import WorkspaceTeamTab from './WorkspaceTeamTab';
import WorkspaceUpdatesTab from './WorkspaceUpdatesTab';
import WorkspaceDailyProgressTab from './WorkspaceDailyProgressTab';
import WorkspaceGithubTab from './WorkspaceGithubTab';

export interface ProjectWorkspacePageProps {
  initialProject?: WorkspaceProject;
  userRole: 'student' | 'ngo';
  onToggleRole: () => void;
  onBackToFeed: () => void;
  onNavigateMessages: () => void;
  onStartCall: () => void;
  onOpenStudentProfile?: (name?: string) => void;
  onOpenNgoProfile?: (name?: string) => void;
  onProjectChange?: (project: WorkspaceProject) => void;
}

export default function ProjectWorkspacePage({
  initialProject = SAMPLE_WORKSPACE_PROJECT,
  userRole,
  onToggleRole,
  onBackToFeed,
  onNavigateMessages,
  onStartCall,
  onOpenStudentProfile,
  onOpenNgoProfile,
  onProjectChange,
}: ProjectWorkspacePageProps) {
  const [project, setProject] = useState<WorkspaceProject>(initialProject);
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('overview');

  useEffect(() => {
    setProject(initialProject);
    setActiveTab('overview');
  }, [initialProject]);

  useEffect(() => {
    onProjectChange?.(project);
  }, [project, onProjectChange]);

  const activityAuthor = (role: 'student' | 'ngo') => ({
    name: role === 'student' ? 'Alex Chen' : project.authorizedRepresentative || 'Pooja Sharma',
    role: role === 'student' ? 'Assigned Student Lead' : 'Authorized NGO Representative',
    avatar:
      role === 'student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120'
        : 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
  });

  const addActivity = (
    content: string,
    role: 'student' | 'ngo' = userRole,
    relatedTask?: string,
  ) => {
    const activity: WorkspaceUpdate = {
      id: `activity-${Date.now()}-${Math.random()}`,
      author: activityAuthor(role),
      timestamp: 'Just now',
      content,
      relatedTask,
    };
    setProject((prev) => ({ ...prev, updates: [activity, ...prev.updates] }));
  };

  // Task Handlers
  const handleAddTask = (newTaskData: Omit<WorkspaceTask, 'id'>) => {
    const newTask: WorkspaceTask = {
      id: `task-${Date.now()}`,
      ...newTaskData,
    };
    setProject((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      updates: [
        {
          id: `activity-task-${Date.now()}`,
          author: activityAuthor(userRole),
          timestamp: 'Just now',
          content: `Created task “${newTask.title}” and assigned it to ${newTask.assignedTo.name}.`,
          relatedTask: newTask.title,
        },
        ...prev.updates,
      ],
    }));
  };

  const handleUpdateTask = (updatedTask: WorkspaceTask) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      progressPercent:
        prev.tasks.length === 0
          ? 0
          : Math.round(
              (prev.tasks
                .map((task) => (task.id === updatedTask.id ? updatedTask : task))
                .filter((task) => task.status === 'completed').length /
                prev.tasks.length) *
                100,
            ),
      updates: [
        {
          id: `activity-task-update-${Date.now()}`,
          author: activityAuthor(userRole),
          timestamp: 'Just now',
          content: `Updated “${updatedTask.title}” to ${updatedTask.status.replace('-', ' ')}.`,
          relatedTask: updatedTask.title,
        },
        ...prev.updates,
      ],
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // File Handlers
  const handleUploadFile = (newFileData: Omit<WorkspaceFile, 'id'>) => {
    const newFile: WorkspaceFile = {
      id: `file-${Date.now()}`,
      ...newFileData,
    };
    setProject((prev) => ({
      ...prev,
      files: [newFile, ...prev.files],
      updates: [
        {
          id: `activity-file-${Date.now()}`,
          author: activityAuthor(userRole),
          timestamp: 'Just now',
          content: `Uploaded file “${newFile.name}” to Files & Deliverables.`,
          relatedTask: newFile.relatedTask,
        },
        ...prev.updates,
      ],
    }));
  };

  const handleDeleteFile = (fileId: string) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
    }));
  };

  // Team Handlers
  const handleAddTeamMember = (newMember: WorkspaceTeamMember) => {
    setProject((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
      updates: [
        {
          id: `activity-member-${Date.now()}`,
          author: activityAuthor('ngo'),
          timestamp: 'Just now',
          content: `${newMember.name} was approved by the NGO and added to the active project team.`,
        },
        ...prev.updates,
      ],
    }));
  };

  const handleInvitationChange = (invitation: WorkspaceTeamInvitation) => {
    setProject((prev) => ({
      ...prev,
      teamInvitations: prev.teamInvitations.some((item) => item.id === invitation.id)
        ? prev.teamInvitations.map((item) =>
            item.id === invitation.id ? invitation : item,
          )
        : [invitation, ...prev.teamInvitations],
    }));
    addActivity(
      `Team invitation for ${invitation.student.name} changed to ${invitation.status}.`,
      invitation.status === 'Approved' || invitation.status === 'Rejected' ? 'ngo' : 'student',
    );
  };

  // Updates Handlers
  const handlePostUpdate = (newUpdateData: Omit<WorkspaceUpdate, 'id'>) => {
    const newUpdate: WorkspaceUpdate = {
      id: `update-${Date.now()}`,
      ...newUpdateData,
    };
    setProject((prev) => ({
      ...prev,
      updates: [newUpdate, ...prev.updates],
    }));
  };

  const handleDailyProgress = (reportData: Omit<DailyProgressReport, 'id'>) => {
    const report: DailyProgressReport = {
      id: `progress-${Date.now()}`,
      ...reportData,
    };
    setProject((prev) => ({
      ...prev,
      dailyProgress: [report, ...prev.dailyProgress],
      updates: [
        {
          id: `activity-progress-${Date.now()}`,
          author: activityAuthor('student'),
          timestamp: 'Just now',
          content:
            report.status === 'draft'
              ? 'Saved a daily progress report draft.'
              : 'Submitted a daily progress report.',
          relatedTask: report.relatedTask,
        },
        ...prev.updates,
      ],
    }));
  };

  const handleGithubConnect = () => {
    const events: GithubActivityEvent[] = [
      {
        id: `github-commit-${Date.now()}`,
        type: 'Commit pushed',
        contributor: 'Alex Chen',
        description: 'Added accessible navigation states and offline cache validation.',
        repositoryUrl: 'https://github.com/example/edusolve-project',
        timestamp: 'Illustrative event · just now',
        relatedTask: project.tasks[0]?.title,
      },
      {
        id: `github-pr-${Date.now()}`,
        type: 'Pull request opened',
        contributor: 'Alex Chen',
        description: 'Opened a prototype pull request for NGO review.',
        repositoryUrl: 'https://github.com/example/edusolve-project/pull/12',
        timestamp: 'Illustrative event · just now',
      },
      {
        id: `github-merge-${Date.now()}`,
        type: 'Pull request merged',
        contributor: 'Alex Chen',
        description: 'Merged the reviewed accessibility improvements into the prototype branch.',
        repositoryUrl: 'https://github.com/example/edusolve-project/pull/11',
        timestamp: 'Illustrative event · earlier today',
        relatedTask: project.tasks[0]?.title,
      },
      {
        id: `github-release-${Date.now()}`,
        type: 'Release published',
        contributor: project.authorizedRepresentative || 'Authorized NGO Representative',
        description: 'Published an illustrative pilot-ready prototype release for team review.',
        repositoryUrl: 'https://github.com/example/edusolve-project/releases/tag/v0.1',
        timestamp: 'Illustrative event · earlier today',
      },
    ];
    setProject((prev) => ({
      ...prev,
      githubConnected: true,
      githubRepository: 'github.com/example/edusolve-project',
      githubEvents: events,
      updates: [
        {
          id: `activity-github-${Date.now()}`,
          author: activityAuthor(userRole),
          timestamp: 'Just now',
          content:
            'Connected an illustrative GitHub repository. No live synchronization is active.',
        },
        ...prev.updates,
      ],
    }));
  };

  const handleTabChange = (tab: WorkspaceTabId) => {
    if (tab === 'messages') {
      onNavigateMessages();
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] flex flex-col justify-between selection:bg-[#EDD7AE] selection:text-[#14334A]">
      
      {/* 1. Project Workspace Top Header */}
      <WorkspaceHeader
        project={project}
        userRole={userRole}
        onToggleRole={onToggleRole}
        onBackToFeed={onBackToFeed}
        onOpenMessages={onNavigateMessages}
        onStartCall={onStartCall}
        onSubmitDailyProgress={() => setActiveTab('progress')}
      />

      {/* 2. Workspace Navigation Tabs (Overview, Tasks, Files, Team, Updates) */}
      <WorkspaceTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tasksCount={project.tasks.length}
        filesCount={project.files.length}
        teamCount={project.team.length}
        updatesCount={project.updates.length}
        progressCount={project.dailyProgress.length}
        githubCount={project.githubEvents.length}
      />

      {/* 3. Tab Views Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <WorkspaceOverviewTab
            project={project}
            onNavigateTab={handleTabChange}
            onOpenTaskDetails={(task) => {
              setActiveTab('tasks');
            }}
            onSelectMember={(memberId) => {
              const m = project.team.find((t) => t.id === memberId);
              if (m?.isNgoLead) {
                onOpenNgoProfile?.(m.name);
              } else {
                onOpenStudentProfile?.(m?.name);
              }
            }}
          />
        )}

        {activeTab === 'progress' && (
          <WorkspaceDailyProgressTab
            reports={project.dailyProgress}
            tasks={project.tasks}
            userRole={userRole}
            onSubmit={handleDailyProgress}
            onOpenMessages={onNavigateMessages}
          />
        )}

        {/* TASKS TAB (SIMPLE TASK LIST - MOST IMPORTANT FEATURE) */}
        {activeTab === 'tasks' && (
          <WorkspaceTasksTab
            tasks={project.tasks}
            teamMembers={project.team}
            userRole={userRole}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {/* FILES & DELIVERABLES TAB */}
        {activeTab === 'files' && (
          <WorkspaceFilesTab
            files={project.files}
            tasks={project.tasks}
            userRole={userRole}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFile}
          />
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <WorkspaceTeamTab
            team={project.team}
            userRole={userRole}
            onOpenProfile={(member) => {
              if (member.isNgoLead) {
                onOpenNgoProfile?.(member.name);
              } else {
                onOpenStudentProfile?.(member.name);
              }
            }}
            onOpenChat={onNavigateMessages}
            onAddMember={handleAddTeamMember}
            invitations={project.teamInvitations}
            onInvitationChange={handleInvitationChange}
          />
        )}

        {activeTab === 'github' && (
          <WorkspaceGithubTab
            connected={project.githubConnected}
            repository={project.githubRepository}
            events={project.githubEvents}
            onConnect={handleGithubConnect}
          />
        )}

        {/* UPDATES TAB */}
        {activeTab === 'updates' && (
          <WorkspaceUpdatesTab
            updates={project.updates}
            tasks={project.tasks}
            teamMembers={project.team}
            userRole={userRole}
            onPostUpdate={handlePostUpdate}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#94A3B8] border-t border-[#E5E7EB] bg-white">
        © {new Date().getFullYear()} EduSolve. Private Project Workspace Architecture.
      </footer>
    </div>
  );
}
