export interface Project {
  id: string;
  title: string;
  organization: string;
  organizationType: string;
  organizationAvatar: string;
  organizationCity: string;
  isVerified: boolean;
  postingApproved: boolean;
  verificationBadgeLabel?: string;
  category: 'Digital Literacy' | 'STEM & Coding' | 'Resource Access' | 'Learning Tools' | 'Mentorship';
  description: string;
  longDescription: string;
  image: string;
  imageAlt: string;
  skills: string[];
  duration: string;
  durationWeeks: number;
  commitment: string;
  workMode: 'Remote' | 'Hybrid' | 'In-Person';
  teamSize: string;
  location: string;
  
  // Details page specific
  whyItMatters: string;
  objectives: string[];
  expectedOutcome: string;
  deliverables: string[];
  constraints: string[];
  supportingMaterials: { name: string; type: string; size?: string }[];
  volunteerExpectations: string;
  materialExpenses: string;
  organizationContact: {
    name: string;
    role: string;
    email: string;
  };
  isOwnListing?: boolean;
}

export interface ApplicationSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  organization: string;
  studentName: string;
  studentEmail: string;
  introMessage: string;
  selectedSkills: string[];
  portfolioLink?: string;
  committedHoursWeekly: boolean;
  submittedAt: string;
  status: 'Under Review' | 'Accepted' | 'Interview Scheduled';
}

export type UserRole = 'student' | 'ngo' | null;

export type NgoVerificationStatus = 'verified' | 'pending' | 'additional-info' | 'rejected';

export interface ChatAttachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  name: string;
  size?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'ngo';
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  attachments?: ChatAttachment[];
  isWarningSensitive?: boolean;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: 'student' | 'ngo';
  avatar: string;
  affiliation: string;
}

export interface Conversation {
  id: string;
  title: string;
  isGroup: boolean;
  avatar: string;
  projectTitle?: string;
  organization?: string;
  institution?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline?: boolean;
  participants: ConversationParticipant[];
  messages: ChatMessage[];
  firstChatNoticeAcknowledged?: boolean;
}

export interface ProjectAssignment {
  projectId: string;
  projectTitle: string;
  projectImage: string;
  organization: string;
  authorizedRepresentative: string;
  duration: string;
  commitment: string;
  summary: string;
  deliverables: string[];
  applicationStatus: string;
  assignmentMessage?: string;
  student: {
    id: string;
    name: string;
    avatar: string;
    affiliation: string;
  };
}

export interface CallState {
  isOpen: boolean;
  type: 'audio' | 'video' | 'group';
  status: 'calling' | 'incoming' | 'connected' | 'ended';
  isScreenSharing: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  durationSeconds: number;
  callerName?: string;
  callerAvatar?: string;
  callerRole?: 'student' | 'ngo';
}

// Workspace Domain Types
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'blocked';

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  deadline: string;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  completionNotes?: string;
  updatedAt?: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  fileType: string;
  size: string;
  uploadedBy: {
    name: string;
    avatar: string;
    role: string;
  };
  uploadDate: string;
  relatedTask?: string;
  downloadUrl?: string;
}

export interface WorkspaceTeamMember {
  id: string;
  name: string;
  role: string;
  isNgoLead: boolean;
  avatar: string;
  affiliation: string;
  skills: string[];
  assignedTasksCount: number;
  completedTasksCount: number;
  contributionSummary: string;
}

export interface WorkspaceUpdate {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  relatedTask?: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface DailyProgressReport {
  id: string;
  date: string;
  submittedAt: string;
  student: {
    name: string;
    avatar: string;
  };
  completedToday: string;
  nextSteps: string;
  blockers?: string;
  relatedTask?: string;
  attachment?: string;
  githubLink?: string;
  status: 'draft' | 'submitted';
}

export type TeamInvitationStatus =
  | 'Pending'
  | 'Accepted'
  | 'Declined'
  | 'Approval Pending'
  | 'Approved'
  | 'Rejected';

export interface WorkspaceTeamInvitation {
  id: string;
  student: {
    id: string;
    name: string;
    avatar: string;
    affiliation: string;
  };
  invitedBy: string;
  message?: string;
  status: TeamInvitationStatus;
}

export interface GithubActivityEvent {
  id: string;
  type: 'Commit pushed' | 'Pull request opened' | 'Pull request merged' | 'Release published';
  contributor: string;
  description: string;
  repositoryUrl: string;
  timestamp: string;
  relatedTask?: string;
}

export interface WorkspaceProject {
  id: string;
  title: string;
  organization: string;
  organizationAvatar: string;
  status: 'In Progress' | 'Completed' | 'Planning';
  category: string;
  startDate: string;
  targetCompletionDate: string;
  progressPercent: number;
  headerImage: string;
  summary: string;
  authorizedRepresentative?: string;
  assignedStudent?: string;
  expectedCommitment?: string;
  expectedDeliverables?: string[];
  tasks: WorkspaceTask[];
  files: WorkspaceFile[];
  team: WorkspaceTeamMember[];
  updates: WorkspaceUpdate[];
  dailyProgress: DailyProgressReport[];
  teamInvitations: WorkspaceTeamInvitation[];
  githubConnected: boolean;
  githubRepository?: string;
  githubEvents: GithubActivityEvent[];
}

export type AppScreen =
  | 'home'
  | 'how-it-works'
  | 'about'
  | 'feed'
  | 'project-details'
  | 'post-problem'
  | 'student-profile'
  | 'ngo-profile'
  | 'messages'
  | 'my-workspaces'
  | 'workspace'
  | 'student-login'
  | 'ngo-login'
  | 'student-register'
  | 'ngo-register'
  | 'student-email-verification'
  | 'ngo-email-verification'
  | 'student-profile-completion-placeholder'
  | 'ngo-verification-pending'
  | 'forgot-password'
  | 'password-reset-sent'
  | 'student-dashboard-preview'
  | 'ngo-dashboard-preview';

// Backwards compatibility alias
export type AuthScreen = AppScreen;

export interface ModalState {
  isOpen: boolean;
  type: 'role-select' | 'student-join' | 'ngo-register' | 'sign-in' | 'project-detail' | null;
  selectedProject?: Project | null;
}

export interface StudentRegistrationData {
  fullName: string;
  email: string;
  institution: string;
  degree: string;
  studyYear: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface NgoRegistrationData {
  organizationName: string;
  representativeName: string;
  email: string;
  registrationType: string;
  registrationNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface StudentProfileData {
  id: string;
  name: string;
  avatar: string;
  institution: string;
  degree: string;
  studyYear: string;
  bio: string;
  skills: string[];
  portfolioLinks: {
    label: string;
    url: string;
    platform: 'github' | 'portfolio' | 'linkedin' | 'demo';
  }[];
  experience: {
    role: string;
    organization: string;
    period: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    honors?: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    year: string;
  }[];
  preferredCategories: string[];
  availability: string;
  preferredWorkMode: 'Remote' | 'Hybrid' | 'In-Person' | 'Flexible';
  completedEduSolveContributions: {
    projectTitle: string;
    organization: string;
    date: string;
    impactSummary: string;
  }[];
}

export interface NgoProfileData {
  id: string;
  name: string;
  avatar: string;
  verificationStatus: NgoVerificationStatus;
  location: string;
  registrationType: string;
  registrationNumber: string;
  missionStatement: string;
  about: string;
  focusAreas: string[];
  website: string;
  contactEmail: string;
  contactRepresentative: string;
  activeProjectsCount: number;
  totalVolunteersEngaged: number;
}
