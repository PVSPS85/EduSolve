import React, { useState, useMemo } from 'react';
import { Project, ApplicationSubmission } from '../../types';
import { SAMPLE_PROJECTS } from '../../data/projects';
import FeedHeader from './FeedHeader';
import FeedPost from './FeedPost';
import FeedFilters, { FeedFilterState } from './FeedFilters';
import QuickApplyModal from './QuickApplyModal';
import ApplicationsModal from './ApplicationsModal';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import {
  Compass,
  Undo2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  Bookmark,
  Users,
  Building2,
  User,
} from '../icons';

export interface SharedProjectFeedProps {
  userRole: 'student' | 'ngo';
  projects?: Project[];
  isAuthenticated: boolean;
  canPostProblems: boolean;
  onToggleRole: () => void;
  onRequireStudentSignIn: () => void;
  onNavigateHome: () => void;
  onSelectProject: (project: Project) => void;
  savedProjectIds: string[];
  onToggleSave: (projectId: string) => void;
  applications: ApplicationSubmission[];
  onApplicationSubmitted: (submission: ApplicationSubmission) => void;
  onNavigatePostProblem?: () => void;
  onNavigateStudentProfile?: () => void;
  onSelectNgoProfile?: (orgName: string) => void;
  onNavigateMessages?: () => void;
  onNavigateWorkspaces?: () => void;
}

export default function SharedProjectFeed({
  userRole,
  projects = SAMPLE_PROJECTS,
  isAuthenticated,
  canPostProblems,
  onToggleRole,
  onRequireStudentSignIn,
  onNavigateHome,
  onSelectProject,
  savedProjectIds,
  onToggleSave,
  applications,
  onApplicationSubmitted,
  onNavigatePostProblem,
  onNavigateStudentProfile,
  onSelectNgoProfile,
  onNavigateMessages,
  onNavigateWorkspaces,
}: SharedProjectFeedProps) {
  // Filter state
  const [filters, setFilters] = useState<FeedFilterState>({
    searchQuery: '',
    selectedCategory: 'All',
    selectedSkill: 'All',
    selectedWorkMode: 'All',
    selectedDuration: 'all',
    sortBy: 'newest',
    showSavedOnly: false,
    showVerifiedOnly: true,
  });

  // Dismissed (Not Interested) posts state
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [lastDismissedId, setLastDismissedId] = useState<string | null>(null);

  // Modals state
  const [applyProject, setApplyProject] = useState<Project | null>(null);
  const [applicationsModalOpen, setApplicationsModalOpen] = useState(false);
  const [manageBriefProject, setManageBriefProject] = useState<Project | null>(null);

  const isStudent = userRole === 'student';

  // Extract all unique skills across projects
  const allAvailableSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    projects.forEach((project) => {
      project.skills?.forEach((skill) => skillsSet.add(skill));
    });
    return Array.from(skillsSet).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (!project.postingApproved) {
        return false;
      }

      if (filters.showVerifiedOnly && !project.isVerified) {
        return false;
      }
      // Exclude dismissed posts
      if (dismissedIds.includes(project.id)) {
        return false;
      }

      // Filter by saved only
      if (filters.showSavedOnly && !savedProjectIds.includes(project.id)) {
        return false;
      }

      // Filter by category
      if (filters.selectedCategory !== 'All' && project.category !== filters.selectedCategory) {
        return false;
      }

      // Filter by skill
      if (filters.selectedSkill !== 'All' && !project.skills.includes(filters.selectedSkill)) {
        return false;
      }

      // Filter by work mode
      if (filters.selectedWorkMode !== 'All' && project.workMode !== filters.selectedWorkMode) {
        return false;
      }

      // Filter by duration
      if (filters.selectedDuration === '1-4' && project.durationWeeks > 4) {
        return false;
      }
      if (filters.selectedDuration === '5-8' && (project.durationWeeks < 5 || project.durationWeeks > 8)) {
        return false;
      }

      // Search query (title, skill, organization, description)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesOrg = project.organization.toLowerCase().includes(query);
        const matchesSkill = project.skills.some((s) => s.toLowerCase().includes(query));
        const matchesDesc = project.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrg && !matchesSkill && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters, dismissedIds, savedProjectIds]);

  const handleDismiss = (projectId: string) => {
    setDismissedIds((prev) => [...prev, projectId]);
    setLastDismissedId(projectId);
  };

  const handleUndoDismiss = () => {
    if (lastDismissedId) {
      setDismissedIds((prev) => prev.filter((id) => id !== lastDismissedId));
      setLastDismissedId(null);
    }
  };

  const handleFilterChange = (newFilters: Partial<FeedFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: 'All',
      selectedSkill: 'All',
      selectedWorkMode: 'All',
      selectedDuration: 'all',
      sortBy: 'newest',
      showSavedOnly: false,
      showVerifiedOnly: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] flex flex-col justify-between selection:bg-[#EDD7AE] selection:text-[#14334A]">
      
      {/* Feed App Shell Header */}
      <FeedHeader
        userRole={userRole}
        isAuthenticated={isAuthenticated}
        canPostProblems={canPostProblems}
        onToggleRole={onToggleRole}
        onNavigateHome={onNavigateHome}
        onOpenMessages={() => {
          if (!isAuthenticated) {
            onRequireStudentSignIn();
          } else if (onNavigateMessages) {
            onNavigateMessages();
          }
        }}
        onOpenApplications={() => {
          if (!isAuthenticated) {
            onRequireStudentSignIn();
          } else {
            setApplicationsModalOpen(true);
          }
        }}
        onOpenWorkspaces={() => onNavigateWorkspaces?.()}
        onOpenMyProjects={() =>
          setFilters((prev) => ({
            ...prev,
            searchQuery: 'Horizon Community Services',
          }))
        }
        onOpenSaved={() => setFilters((prev) => ({ ...prev, showSavedOnly: !prev.showSavedOnly }))}
        onOpenProfile={() => {
          if (!isAuthenticated) {
            onRequireStudentSignIn();
          } else if (isStudent) {
            onNavigateStudentProfile?.();
          } else {
            onSelectNgoProfile?.('Horizon Community Services');
          }
        }}
        onPostProblem={() => {
          if (onNavigatePostProblem) {
            onNavigatePostProblem();
          }
        }}
        savedCount={savedProjectIds.length}
        applicationsCount={applications.length}
        isSavedFilterActive={filters.showSavedOnly}
      />

      {/* Main Feed Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Role Notice Banner */}
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${isStudent ? 'bg-[#14334A]' : 'bg-[#836527]'}`}>
              {isStudent ? <User size={16} /> : <Building2 size={16} />}
            </div>
            <div>
              <span className="font-bold text-[#14334A] block">
                {!isAuthenticated
                  ? 'Browsing Public Community Projects'
                  : isStudent
                  ? 'Viewing as Student Volunteer (Alex Chen · Stanford University)'
                  : 'Viewing as Verified NGO Coordinator (Horizon Community Services)'}
              </span>
              <span className="text-[#64748B]">
                {!isAuthenticated
                  ? 'Explore approved public listings. Student sign-in is required before submitting an application.'
                  : isStudent
                  ? 'Explore community problem briefs, save bookmarks, dismiss irrelevant challenges, and apply.'
                  : 'Manage your organization’s briefs, review applicants, and publish new problem briefs.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isStudent && canPostProblems && onNavigatePostProblem && (
              <Button
                variant="primary"
                size="sm"
                onClick={onNavigatePostProblem}
                className="text-xs"
              >
                + Post a Problem
              </Button>
            )}

            {isAuthenticated && (
              <button
                onClick={onToggleRole}
                className="text-xs font-semibold text-[#14334A] bg-[#FAF9F6] hover:bg-[#EBF4F5] border border-[#E5E7EB] hover:border-[#70A1A8] py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0"
              >
                Switch to {isStudent ? 'NGO View' : 'Student View'}
              </button>
            )}
          </div>
        </div>

        {/* Desktop 2-Column Layout: Central Vertical Feed + Right Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Central Feed Column (8 cols on desktop, max-w-2xl centered) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Last Dismissed Undo Toast */}
            {lastDismissedId && (
              <div className="bg-[#14334A] text-white rounded-2xl p-3.5 px-4 flex items-center justify-between gap-3 text-xs shadow-md animate-fadeIn">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EDD7AE]" />
                  <span>Project brief hidden from your feed.</span>
                </span>
                <button
                  onClick={handleUndoDismiss}
                  className="font-bold text-[#EDD7AE] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Undo2 size={13} />
                  <span>Undo</span>
                </button>
              </div>
            )}

            {/* Filter Active Notification on top of feed */}
            {filters.showSavedOnly && (
              <div className="bg-[#FAF3E5] border border-[#EDD7AE] rounded-2xl p-3.5 px-4 flex items-center justify-between text-xs text-[#836527]">
                <span className="flex items-center gap-2 font-semibold">
                  <Bookmark size={15} />
                  <span>Showing Bookmarked Projects Only ({savedProjectIds.length})</span>
                </span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, showSavedOnly: false }))}
                  className="font-bold underline cursor-pointer text-[#14334A]"
                >
                  Show all projects
                </button>
              </div>
            )}

            {/* Substantial Instagram-Style Vertical Posts List */}
            {filteredProjects.length > 0 ? (
              <div className="space-y-8">
                {filteredProjects.map((project) => (
                  <FeedPost
                    key={project.id}
                    project={project}
                    userRole={userRole}
                    isSaved={savedProjectIds.includes(project.id)}
                    onToggleSave={onToggleSave}
                    onDismiss={handleDismiss}
                    onSelectProject={onSelectProject}
                    onApply={(p) => {
                      if (!isAuthenticated) {
                        onRequireStudentSignIn();
                        return;
                      }
                      setApplyProject(p);
                    }}
                    onManageOwnBrief={(p) => setManageBriefProject(p)}
                    onViewApplicants={() => setApplicationsModalOpen(true)}
                    onSelectNgoProfile={onSelectNgoProfile}
                  />
                ))}
              </div>
            ) : (
              /* Empty Filter State */
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-10 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-[#94A3B8] flex items-center justify-center mx-auto">
                  <Compass size={26} />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#14334A]">
                  No Community Briefs Match These Filters
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Try broadening your search keywords or resetting category and skill filters to see more active community challenges.
                </p>
                <Button variant="primary" size="sm" onClick={handleResetFilters} className="mt-2">
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* End of Feed Indicator */}
            {filteredProjects.length > 0 && (
              <div className="text-center py-6 text-xs text-[#94A3B8]">
                <span>You are up to date with verified community problem briefs.</span>
              </div>
            )}

          </div>

          {/* Right Sidebar Filters & Community Highlights (4 cols on desktop) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            {/* Reactive Filter Panel */}
            <FeedFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              availableSkills={allAvailableSkills}
              totalResults={filteredProjects.length}
            />

            {/* NGO Scoping & Quality Assurance Card */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs text-left space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#70A1A8]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A]">
                  How EduSolve Curates Briefs
                </h4>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Every project shown is submitted by a registered non-profit and independently reviewed to verify that the time commitment is achievable for student volunteers without replacing paid labor.
              </p>
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#836527]">
                <span className="font-semibold">Independent Verification</span>
                <span>Zero Student Fees</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Quick Application Modal */}
      <QuickApplyModal
        isOpen={applyProject !== null}
        onClose={() => setApplyProject(null)}
        project={applyProject}
        onApplicationSubmitted={(submission) => {
          onApplicationSubmitted(submission);
        }}
        onOpenConversation={() => {
          setApplyProject(null);
          onNavigateMessages?.();
        }}
      />

      {/* Applications Modal (My Applications or Received) */}
      <ApplicationsModal
        isOpen={applicationsModalOpen}
        onClose={() => setApplicationsModalOpen(false)}
        applications={applications}
        userRole={userRole}
        onOpenConversation={() => {
          setApplicationsModalOpen(false);
          onNavigateMessages?.();
        }}
        onSelectStudentProfile={() => {
          setApplicationsModalOpen(false);
          onNavigateStudentProfile?.();
        }}
      />

      {/* Manage Own Brief (NGO action) */}
      {manageBriefProject && (
        <Modal
          isOpen={true}
          onClose={() => setManageBriefProject(null)}
          title="Manage Community Brief"
          description={`Brief administration for: ${manageBriefProject.title}`}
          maxWidth="md"
        >
          <div className="text-left -mt-1 space-y-4 text-xs text-[#64748B]">
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between">
                <span>Active Status:</span>
                <span className="text-[#16A34A] font-bold">Published & Accepting Applicants</span>
              </div>
              <div className="flex justify-between">
                <span>Applications Received:</span>
                <span className="text-[#14334A] font-bold">2 Student Inquiries</span>
              </div>
              <div className="flex justify-between">
                <span>Sprint Cohort:</span>
                <span className="text-[#14334A] font-bold">Sprint Alpha (4 Weeks)</span>
              </div>
            </div>
            <p>
              Brief status and cohort timeline are active. Milestone deliverables and applicant selection can be reviewed directly in your project workspace.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
              <Button variant="primary" size="sm" onClick={() => setManageBriefProject(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
