import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/landing/HeroSection';
import HowItWorksSection from './components/landing/HowItWorksSection';
import BothSidesSection from './components/landing/BothSidesSection';
import Footer from './components/layout/Footer';
import RoleModal from './components/layout/RoleModal';
import PolicyModal from './components/layout/PolicyModal';

// Authentication Screens
import StudentLogin from './components/auth/StudentLogin';
import NgoLogin from './components/auth/NgoLogin';
import StudentRegister from './components/auth/StudentRegister';
import NgoRegister from './components/auth/NgoRegister';
import EmailVerificationScreen from './components/auth/EmailVerificationScreen';
import ProfileCompletionPlaceholder from './components/auth/ProfileCompletionPlaceholder';
import NgoVerificationPending from './components/auth/NgoVerificationPending';
import ForgotPasswordScreen from './components/auth/ForgotPasswordScreen';
import PasswordResetSentScreen from './components/auth/PasswordResetSentScreen';
import DashboardPreviewPlaceholder from './components/auth/DashboardPreviewPlaceholder';
import ScreenSwitcherDock from './components/auth/ScreenSwitcherDock';

// Feed & Details Components
import SharedProjectFeed from './components/feed/SharedProjectFeed';
import ProjectDetailsView from './components/feed/ProjectDetailsView';
import QuickApplyModal from './components/feed/QuickApplyModal';

// Dedicated Experiences
import PostProblemPage from './components/ngo/PostProblemPage';
import StudentProfilePage from './components/profile/StudentProfilePage';
import NgoProfilePage from './components/profile/NgoProfilePage';
import MessagesPage from './components/chat/MessagesPage';
import ProjectWorkspacePage from './components/workspace/ProjectWorkspacePage';
import MyWorkspacesPage from './components/workspace/MyWorkspacesPage';

import {
  Project,
  AppScreen,
  StudentRegistrationData,
  NgoRegistrationData,
  ApplicationSubmission,
  ProjectAssignment,
  WorkspaceProject,
} from './types';
import { SAMPLE_PROJECTS } from './data/projects';
import { SAMPLE_STUDENT_PROFILE, SAMPLE_NGO_PROFILE } from './data/profiles';
import { SAMPLE_WORKSPACE_PROJECT } from './data/workspaceData';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = location.pathname;

  const publicScreenForPath = (pathname: string): AppScreen => {
    if (pathname === '/explore') return 'feed';
    if (pathname === '/workspaces') return 'my-workspaces';
    if (pathname === '/how-it-works') return 'how-it-works';
    if (pathname === '/about') return 'about';
    return 'home';
  };

  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() =>
    publicScreenForPath(location.pathname),
  );
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('workspace');

  // Shared active role across workspace, feed and chat ('student' or 'ngo')
  const [feedRole, setFeedRole] = useState<'student' | 'ngo'>('student');

  // Dynamic projects list (allowing newly published problem briefs to appear)
  const [projectsList, setProjectsList] = useState<Project[]>(SAMPLE_PROJECTS);

  // Persistent bookmarks state across feed & details
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>(['proj-1']);

  // Persistent submitted applications list
  const [applications, setApplications] = useState<ApplicationSubmission[]>([
    {
      id: 'app-initial-1',
      projectId: 'proj-1',
      projectTitle: 'Accessible Tablet & Online Banking Modules for Seniors',
      organization: 'Horizon Community Services',
      studentName: 'Alex Chen',
      studentEmail: 'alex.chen@university.edu',
      introMessage:
        'Undergraduate student with experience in accessibility UI and senior digital literacy clinics. Very excited to support this initiative!',
      selectedSkills: ['UX Design', 'Curriculum Design', 'Accessibility'],
      committedHoursWeekly: true,
      submittedAt: 'Yesterday',
      status: 'Under Review',
    },
  ]);

  // Selected project for details view
  const [selectedProject, setSelectedProject] = useState<Project>(SAMPLE_PROJECTS[0]);

  // Details page quick apply modal state
  const [detailsApplyModalOpen, setDetailsApplyModalOpen] = useState(false);

  // Modal states for Homepage
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalInitialRole, setRoleModalInitialRole] = useState<'student' | 'ngo' | 'sign-in' | null>(null);

  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string>('Privacy Policy');

  // Session / flow data passed between auth screens
  const [registeredStudent, setRegisteredStudent] = useState<StudentRegistrationData | null>(null);
  const [registeredNgo, setRegisteredNgo] = useState<NgoRegistrationData | null>(null);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [recoveryRole, setRecoveryRole] = useState<'student' | 'ngo'>('student');
  const [authenticatedUser, setAuthenticatedUser] = useState<{ name: string; role: 'student' | 'ngo' } | null>(null);
  const [assignedWorkspaceProject, setAssignedWorkspaceProject] =
    useState<WorkspaceProject | null>(null);
  const [startProjectCallOnMessages, setStartProjectCallOnMessages] = useState(false);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  useEffect(() => {
    const publicPaths = ['/', '/explore', '/workspaces', '/how-it-works', '/about'];
    if (!publicPaths.includes(location.pathname)) {
      navigate('/', { replace: true });
      return;
    }
    setCurrentScreen(publicScreenForPath(location.pathname));
  }, [location.pathname, navigate]);

  const navigateToPublicPath = (
    path: '/' | '/how-it-works' | '/explore' | '/workspaces' | '/about',
  ) => {
    navigate(path);
  };

  const setScreen = (target: AppScreen) => {
    if (target === 'home') {
      setCurrentScreen('home');
      navigateToPublicPath('/');
      return;
    }
    if (target === 'feed') {
      setCurrentScreen('feed');
      navigateToPublicPath('/explore');
      return;
    }
    if (target === 'my-workspaces') {
      setCurrentScreen('my-workspaces');
      navigateToPublicPath('/workspaces');
      return;
    }
    if (target === 'how-it-works') {
      setCurrentScreen('how-it-works');
      navigateToPublicPath('/how-it-works');
      return;
    }
    if (target === 'about') {
      setCurrentScreen('about');
      navigateToPublicPath('/about');
      return;
    }
    setCurrentScreen(target);
  };

  // Toggle bookmark / save
  const handleToggleSave = (projectId: string) => {
    setSavedProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  // Add new application submission
  const handleApplicationSubmitted = (submission: ApplicationSubmission) => {
    setApplications((prev) => [submission, ...prev]);
  };

  // Handle new problem published by NGO
  const handleProjectPublished = (newProject: Project) => {
    setProjectsList((prev) => [newProject, ...prev]);
    setSelectedProject(newProject);
    setScreen('feed');
  };

  // Navigation helpers that record previous screen
  const navigateWithHistory = (target: AppScreen) => {
    setPreviousScreen(currentScreen);
    setScreen(target);
  };

  // Handlers for modal openings on homepage
  const handleOpenRoleModal = (role?: 'student' | 'ngo' | 'sign-in') => {
    setRoleModalInitialRole(role || null);
    setRoleModalOpen(true);
  };

  const handleOpenPolicy = (policyName: string) => {
    setSelectedPolicy(policyName);
    setPolicyModalOpen(true);
  };

  const roleSelectionModal = (
    <RoleModal
      isOpen={roleModalOpen}
      onClose={() => setRoleModalOpen(false)}
      initialRole={roleModalInitialRole}
      onNavigateScreen={setScreen}
      onExploreProjects={() => setScreen('feed')}
    />
  );

  // Auth Flow Handlers
  const handleStudentRegisterSuccess = (data: StudentRegistrationData) => {
    setRegisteredStudent(data);
    setCurrentScreen('student-email-verification');
  };

  const handleNgoRegisterSuccess = (data: NgoRegistrationData) => {
    setRegisteredNgo(data);
    setCurrentScreen('ngo-email-verification');
  };

  const handleResetRequested = (email: string, role: 'student' | 'ngo') => {
    setRecoveryEmail(email);
    setRecoveryRole(role);
    setCurrentScreen('password-reset-sent');
  };

  const handleLoginSuccess = (name: string, role: 'student' | 'ngo') => {
    setAuthenticatedUser({ name, role });
    setFeedRole(role);
    setCurrentScreen(role === 'student' ? 'student-dashboard-preview' : 'ngo-dashboard-preview');
  };

  const handleProjectAssigned = (assignment: ProjectAssignment) => {
    const workspace: WorkspaceProject = {
      ...SAMPLE_WORKSPACE_PROJECT,
      id: `workspace-${assignment.projectId}`,
      title: assignment.projectTitle,
      organization: assignment.organization,
      status: 'Planning',
      category: 'Assigned Community Project',
      startDate: 'Today',
      targetCompletionDate: `${assignment.duration} from kickoff`,
      progressPercent: 0,
      headerImage: assignment.projectImage,
      summary: assignment.summary,
      authorizedRepresentative: assignment.authorizedRepresentative,
      assignedStudent: assignment.student.name,
      expectedCommitment: assignment.commitment,
      expectedDeliverables: assignment.deliverables,
      tasks: [],
      files: [],
      team: [
        {
          id: 'member-ngo-lead',
          name: assignment.authorizedRepresentative,
          role: 'Authorized NGO Representative',
          isNgoLead: true,
          avatar:
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160',
          affiliation: assignment.organization,
          skills: ['Project Oversight', 'Community Coordination'],
          assignedTasksCount: 0,
          completedTasksCount: 0,
          contributionSummary:
            'Authorized project representative responsible for task review, deliverable approval, and team membership decisions.',
        },
        {
          id: assignment.student.id,
          name: assignment.student.name,
          role: 'Assigned Student Lead',
          isNgoLead: false,
          avatar: assignment.student.avatar,
          affiliation: assignment.student.affiliation,
          skills: ['Project Delivery', 'Student Collaboration'],
          assignedTasksCount: 0,
          completedTasksCount: 0,
          contributionSummary:
            'Primary assigned student responsible for daily progress reporting and coordinating approved collaborators.',
        },
      ],
      updates: [
        {
          id: `activity-assigned-${Date.now()}`,
          author: {
            name: assignment.authorizedRepresentative,
            role: 'Authorized NGO Representative',
            avatar:
              'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
          },
          timestamp: 'Just now',
          content: `Project assigned to ${assignment.student.name}.`,
        },
        {
          id: `activity-workspace-${Date.now()}`,
          author: {
            name: 'EduSolve Prototype',
            role: 'Illustrative System Event',
            avatar: assignment.projectImage,
          },
          timestamp: 'Just now',
          content:
            'Private workspace created for the assigned student and authorized NGO representative. This is a prototype state, not a backend record.',
        },
      ],
      dailyProgress: [],
      teamInvitations: [],
      githubConnected: false,
      githubRepository: undefined,
      githubEvents: [],
    };

    setAssignedWorkspaceProject(workspace);
  };

  // ==========================================
  // AUTHORIZED WORKSPACE LIST
  // ==========================================
  if (currentScreen === 'my-workspaces') {
    return (
      <>
        <MyWorkspacesPage
          userRole={feedRole}
          workspaces={assignedWorkspaceProject ? [assignedWorkspaceProject] : []}
          onOpenWorkspace={(workspace) => {
            setAssignedWorkspaceProject(workspace);
            navigateWithHistory('workspace');
          }}
          onExploreProjects={() => setScreen('feed')}
          onOpenMessages={() => navigateWithHistory('messages')}
          onOpenProfile={() =>
            navigateWithHistory(feedRole === 'student' ? 'student-profile' : 'ngo-profile')
          }
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setScreen} />
      </>
    );
  }

  // ==========================================
  // PRIVATE PROJECT TEAM WORKSPACE
  // ==========================================
  if (currentScreen === 'workspace') {
    return (
      <>
        <ProjectWorkspacePage
          initialProject={assignedWorkspaceProject || SAMPLE_WORKSPACE_PROJECT}
          userRole={feedRole}
          onToggleRole={() => setFeedRole((prev) => (prev === 'student' ? 'ngo' : 'student'))}
          onBackToFeed={() => setScreen('feed')}
          onNavigateMessages={() => navigateWithHistory('messages')}
          onStartCall={() => {
            setStartProjectCallOnMessages(true);
            navigateWithHistory('messages');
          }}
          onOpenStudentProfile={(name) => navigateWithHistory('student-profile')}
          onOpenNgoProfile={(name) => navigateWithHistory('ngo-profile')}
          onProjectChange={
            assignedWorkspaceProject ? setAssignedWorkspaceProject : undefined
          }
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  // ==========================================
  // DEDICATED FULL-PAGE MESSAGING INTERFACE
  // ==========================================
  if (currentScreen === 'messages') {
    return (
      <>
        <MessagesPage
          userRole={feedRole}
          onToggleRole={() => setFeedRole((prev) => (prev === 'student' ? 'ngo' : 'student'))}
          onNavigateFeed={() => setScreen('feed')}
          onOpenStudentProfile={(name) => {
            navigateWithHistory('student-profile');
          }}
          onOpenNgoProfile={(name) => {
            navigateWithHistory('ngo-profile');
          }}
          onOpenWorkspace={() => {
            navigateWithHistory('workspace');
          }}
          onProjectAssigned={handleProjectAssigned}
          autoStartProjectCall={startProjectCallOnMessages}
          onProjectCallStarted={() => setStartProjectCallOnMessages(false)}
          initialProjectTitle={assignedWorkspaceProject?.title}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  // ==========================================
  // NGO — POST A PROBLEM FORM
  // ==========================================
  if (currentScreen === 'post-problem') {
    return (
      <>
        <PostProblemPage
          onBackToFeed={() => setScreen(previousScreen || 'feed')}
          onProjectPublished={handleProjectPublished}
          organizationName="Horizon Community Services"
          initialVerificationStatus="verified"
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  // ==========================================
  // STUDENT PORTFOLIO PROFILE
  // ==========================================
  if (currentScreen === 'student-profile') {
    return (
      <>
        <StudentProfilePage
          studentProfile={SAMPLE_STUDENT_PROFILE}
          viewerRole={feedRole}
          onBack={() => setScreen(previousScreen || 'feed')}
          onOpenConversation={() => {
            navigateWithHistory('messages');
          }}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  // ==========================================
  // NGO ORGANIZATION PROFILE
  // ==========================================
  if (currentScreen === 'ngo-profile') {
    return (
      <>
        <NgoProfilePage
          ngoProfile={SAMPLE_NGO_PROFILE}
          onBack={() => setScreen(previousScreen || 'feed')}
          onSelectProject={(project) => {
            setSelectedProject(project);
            navigateWithHistory('project-details');
          }}
          onViewAllOrgProjects={() => {
            setScreen('feed');
          }}
          onOpenConversation={() => {
            navigateWithHistory('messages');
          }}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  // ==========================================
  // SHARED PROJECT FEED (INSTAGRAM-STYLE)
  // ==========================================
  if (currentScreen === 'feed') {
    return (
      <>
        <SharedProjectFeed
          userRole={feedRole}
          projects={projectsList}
          isAuthenticated={authenticatedUser !== null}
          canPostProblems={authenticatedUser?.role === 'ngo'}
          onToggleRole={() => setFeedRole((prev) => (prev === 'student' ? 'ngo' : 'student'))}
          onRequireStudentSignIn={() => handleOpenRoleModal('sign-in')}
          onNavigateHome={() => setScreen('home')}
          onSelectProject={(project) => {
            setSelectedProject(project);
            navigateWithHistory('project-details');
          }}
          savedProjectIds={savedProjectIds}
          onToggleSave={handleToggleSave}
          applications={applications}
          onApplicationSubmitted={handleApplicationSubmitted}
          onNavigatePostProblem={() => navigateWithHistory('post-problem')}
          onNavigateStudentProfile={() => navigateWithHistory('student-profile')}
          onSelectNgoProfile={() => navigateWithHistory('ngo-profile')}
          onNavigateMessages={() => navigateWithHistory('messages')}
          onNavigateWorkspaces={() => navigateWithHistory('my-workspaces')}
        />
        {roleSelectionModal}
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setScreen} />
      </>
    );
  }

  // ==========================================
  // DEDICATED PROJECT DETAILS PAGE
  // ==========================================
  if (currentScreen === 'project-details') {
    return (
      <>
        <ProjectDetailsView
          project={selectedProject}
          userRole={feedRole}
          isSaved={savedProjectIds.includes(selectedProject.id)}
          onToggleSave={handleToggleSave}
          onBackToFeed={() => setScreen('feed')}
          onApply={() => {
            if (!authenticatedUser) {
              handleOpenRoleModal('sign-in');
              return;
            }
            setDetailsApplyModalOpen(true);
          }}
          onSelectNgoProfile={() => navigateWithHistory('ngo-profile')}
        />

        {/* Quick Application Modal triggered from Details Page */}
        <QuickApplyModal
          isOpen={detailsApplyModalOpen}
          onClose={() => setDetailsApplyModalOpen(false)}
          project={selectedProject}
          onApplicationSubmitted={(submission) => {
            handleApplicationSubmitted(submission);
          }}
          onOpenConversation={() => {
            setDetailsApplyModalOpen(false);
            navigateWithHistory('messages');
          }}
        />

        {roleSelectionModal}
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setScreen} />
      </>
    );
  }

  // ==========================================
  // AUTHENTICATION ROUTES (PRESERVED)
  // ==========================================
  if (currentScreen === 'student-login') {
    return (
      <>
        <StudentLogin
          onNavigateHome={() => setScreen('home')}
          onNavigateRegister={() => setCurrentScreen('student-register')}
          onNavigateNgoLogin={() => setCurrentScreen('ngo-login')}
          onNavigateForgotPassword={() => {
            setRecoveryRole('student');
            setCurrentScreen('forgot-password');
          }}
          onLoginSuccess={(name) => handleLoginSuccess(name, 'student')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'ngo-login') {
    return (
      <>
        <NgoLogin
          onNavigateHome={() => setScreen('home')}
          onNavigateRegister={() => setCurrentScreen('ngo-register')}
          onNavigateStudentLogin={() => setCurrentScreen('student-login')}
          onNavigateForgotPassword={() => {
            setRecoveryRole('ngo');
            setCurrentScreen('forgot-password');
          }}
          onLoginSuccess={(name) => handleLoginSuccess(name, 'ngo')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'student-register') {
    return (
      <>
        <StudentRegister
          onNavigateHome={() => setScreen('home')}
          onNavigateLogin={() => setCurrentScreen('student-login')}
          onNavigateNgoRegister={() => setCurrentScreen('ngo-register')}
          onRegistrationSuccess={handleStudentRegisterSuccess}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'ngo-register') {
    return (
      <>
        <NgoRegister
          onNavigateHome={() => setScreen('home')}
          onNavigateLogin={() => setCurrentScreen('ngo-login')}
          onNavigateStudentRegister={() => setCurrentScreen('student-register')}
          onRegistrationSuccess={handleNgoRegisterSuccess}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'student-email-verification') {
    return (
      <>
        <EmailVerificationScreen
          role="student"
          email={registeredStudent?.email || 'alex.chen@university.edu'}
          onNavigateHome={() => setScreen('home')}
          onVerified={() => setCurrentScreen('student-profile-completion-placeholder')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'ngo-email-verification') {
    return (
      <>
        <EmailVerificationScreen
          role="ngo"
          email={registeredNgo?.email || 'director@horizoncommunity.org'}
          onNavigateHome={() => setScreen('home')}
          onVerified={() => setCurrentScreen('ngo-verification-pending')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'student-profile-completion-placeholder') {
    return (
      <>
        <ProfileCompletionPlaceholder
          studentName={registeredStudent?.fullName || 'Student Volunteer'}
          onNavigateHome={() => setScreen('home')}
          onNavigateLogin={() => setCurrentScreen('student-login')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'ngo-verification-pending') {
    return (
      <>
        <NgoVerificationPending
          organizationName={registeredNgo?.organizationName || 'Horizon Community Services'}
          registrationNumber={registeredNgo?.registrationNumber || 'DL/2022/0123456'}
          onNavigateHome={() => setScreen('home')}
          onNavigateLogin={() => setCurrentScreen('ngo-login')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'forgot-password') {
    return (
      <>
        <ForgotPasswordScreen
          initialRole={recoveryRole}
          onNavigateHome={() => setScreen('home')}
          onNavigateLogin={(role) => setCurrentScreen(role === 'student' ? 'student-login' : 'ngo-login')}
          onResetRequested={handleResetRequested}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'password-reset-sent') {
    return (
      <>
        <PasswordResetSentScreen
          email={recoveryEmail || 'alex.chen@university.edu'}
          role={recoveryRole}
          onNavigateHome={() => setScreen('home')}
          onNavigateLogin={(role) => setCurrentScreen(role === 'student' ? 'student-login' : 'ngo-login')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'student-dashboard-preview' || currentScreen === 'ngo-dashboard-preview') {
    return (
      <>
        <DashboardPreviewPlaceholder
          role={currentScreen === 'student-dashboard-preview' ? 'student' : 'ngo'}
          userName={authenticatedUser?.name || (currentScreen === 'student-dashboard-preview' ? 'Student Volunteer' : 'Partner Representative')}
          onSignOut={() => {
            setAuthenticatedUser(null);
            setScreen('home');
          }}
          onNavigateHome={() => setScreen('feed')}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </>
    );
  }

  if (currentScreen === 'how-it-works') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#183047] flex flex-col selection:bg-[#EDD7AE] selection:text-[#14334A]">
        <Navbar
          onOpenRoleModal={handleOpenRoleModal}
          activePath={activeSection}
          onNavigate={navigateToPublicPath}
        />
        <main className="flex-1 pt-20">
          <HowItWorksSection onLearnMore={() => setScreen('student-register')} />
        </main>
        <Footer onOpenPolicyModal={handleOpenPolicy} />
        {roleSelectionModal}
        <PolicyModal
          isOpen={policyModalOpen}
          onClose={() => setPolicyModalOpen(false)}
          policyName={selectedPolicy}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setScreen} />
      </div>
    );
  }

  if (currentScreen === 'about') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#183047] flex flex-col selection:bg-[#EDD7AE] selection:text-[#14334A]">
        <Navbar
          onOpenRoleModal={handleOpenRoleModal}
          activePath={activeSection}
          onNavigate={navigateToPublicPath}
        />
        <main className="flex-1 pt-20">
          <BothSidesSection
            onStudentAction={() => setScreen('student-register')}
            onNgoAction={() => setScreen('ngo-register')}
          />
        </main>
        <Footer onOpenPolicyModal={handleOpenPolicy} />
        {roleSelectionModal}
        <PolicyModal
          isOpen={policyModalOpen}
          onClose={() => setPolicyModalOpen(false)}
          policyName={selectedPolicy}
        />
        <ScreenSwitcherDock currentScreen={currentScreen} onNavigate={setScreen} />
      </div>
    );
  }

  // ==========================================
  // ROUTE: MINIMAL PUBLIC HOMEPAGE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] flex flex-col selection:bg-[#EDD7AE] selection:text-[#14334A]">
      <Navbar
        onOpenRoleModal={handleOpenRoleModal}
        activePath={activeSection}
        onNavigate={navigateToPublicPath}
      />

      <main className="flex-1">
        <HeroSection
          onJoinStudent={() => setScreen('student-register')}
          onRegisterNgo={() => setScreen('ngo-register')}
        />
      </main>

      {roleSelectionModal}
    </div>
  );
}
