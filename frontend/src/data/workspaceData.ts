import { WorkspaceProject } from '../types';

export const SAMPLE_WORKSPACE_PROJECT: WorkspaceProject = {
  id: 'workspace-rural-platform',
  title: 'Digital Learning Platform for Rural Students',
  organization: 'Aarambh Foundation',
  organizationAvatar:
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160',
  status: 'In Progress',
  category: 'Digital Literacy & Rural EdTech',
  startDate: 'Oct 1, 2026',
  targetCompletionDate: 'Nov 15, 2026',
  progressPercent: 62,
  headerImage:
    'https://images.unsplash.com/photo-1568585262983-9b54814595a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  summary:
    'Aarambh Foundation works with 14 semi-rural government schools across underserved districts lacking steady broadband. Our approved collegiate squad is designing a lightweight, offline-first digital learning web platform with modular curriculum units in mathematics and elementary science.',
  authorizedRepresentative: 'Pooja Sharma',
  assignedStudent: 'Alex Chen',
  expectedCommitment: '4-6 hours per week',
  expectedDeliverables: [
    'Offline-first learning platform prototype',
    'Accessible classroom navigation system',
    'Bilingual sample curriculum modules',
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Finalize project requirements & classroom device audit',
      description:
        'Review device constraints across 14 rural schools (Android 8.0 tablets and low-spec Chromebooks). Finalize non-functional bandwidth budgets.',
      assignedTo: {
        id: 'member-pooja',
        name: 'Pooja Sharma',
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'NGO Project Lead',
      },
      deadline: 'Oct 8, 2026',
      status: 'completed',
      priority: 'high',
      completionNotes:
        'Audit complete. Bandwidth target capped at 1.5MB total bundle size with complete offline caching enabled.',
      updatedAt: 'Oct 7, 2026',
    },
    {
      id: 'task-2',
      title: 'Design the UI prototype & high-contrast navigation',
      description:
        'Create interactive Figma wireframes and design system components optimized for 8-inch screens with touch-friendly navigation for young students.',
      assignedTo: {
        id: 'member-maya',
        name: 'Maya Lin',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'UI/UX Designer',
      },
      deadline: 'Oct 22, 2026',
      status: 'in-progress',
      priority: 'high',
      completionNotes:
        'First draft of student learning dashboard and lesson reader complete. Undergoing accessibility check.',
      updatedAt: 'Yesterday',
    },
    {
      id: 'task-3',
      title: 'Build the offline-first authentication & login flow',
      description:
        'Implement lightweight student PIN code authentication and school role session caching using browser IndexedDB storage.',
      assignedTo: {
        id: 'member-alex',
        name: 'Alex Chen',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'Student Tech Lead',
      },
      deadline: 'Oct 28, 2026',
      status: 'in-progress',
      priority: 'high',
      completionNotes: 'IndexedDB wrapper written and tested on 2G throttled network simulation.',
      updatedAt: '2 days ago',
    },
    {
      id: 'task-4',
      title: 'Prepare sample learning content & bilingual modules',
      description:
        'Curate 20 bilingual science & math worksheets with self-paced reflection quizzes formatted for offline audio accompaniment.',
      assignedTo: {
        id: 'member-david',
        name: 'David Park',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'Content & Pedagogy Specialist',
      },
      deadline: 'Nov 4, 2026',
      status: 'todo',
      priority: 'medium',
      completionNotes: '',
    },
    {
      id: 'task-5',
      title: 'Test the prototype with pilot rural classrooms',
      description:
        'Conduct remote usability testing session with 12 rural students and 3 volunteer instructors at the Aarambh learning center.',
      assignedTo: {
        id: 'member-maya',
        name: 'Maya Lin',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'UI/UX Designer',
      },
      deadline: 'Nov 10, 2026',
      status: 'todo',
      priority: 'medium',
      completionNotes: '',
    },
    {
      id: 'task-6',
      title: 'Accessibility audit & WCAG AAA contrast validation',
      description:
        'Verify color contrast, large font scaling, and screen reader labels for all interactive quiz elements.',
      assignedTo: {
        id: 'member-alex',
        name: 'Alex Chen',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'Student Tech Lead',
      },
      deadline: 'Nov 12, 2026',
      status: 'todo',
      priority: 'low',
      completionNotes: '',
    },
  ],
  files: [
    {
      id: 'file-1',
      name: 'Project_Requirements_v2.pdf',
      fileType: 'PDF',
      size: '1.8 MB',
      uploadedBy: {
        name: 'Pooja Sharma',
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'NGO Project Lead',
      },
      uploadDate: 'Oct 7, 2026',
      relatedTask: 'Finalize project requirements & classroom device audit',
      downloadUrl: '#',
    },
    {
      id: 'file-2',
      name: 'Rural_Learning_Platform_Prototype.fig',
      fileType: 'FIG',
      size: '14.2 MB',
      uploadedBy: {
        name: 'Maya Lin',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'UI/UX Designer',
      },
      uploadDate: 'Oct 11, 2026',
      relatedTask: 'Design the UI prototype & high-contrast navigation',
      downloadUrl: '#',
    },
    {
      id: 'file-3',
      name: 'Elementary_Curriculum_Sample_Pack.pdf',
      fileType: 'PDF',
      size: '3.4 MB',
      uploadedBy: {
        name: 'David Park',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'Content & Pedagogy Specialist',
      },
      uploadDate: 'Oct 12, 2026',
      relatedTask: 'Prepare sample learning content & bilingual modules',
      downloadUrl: '#',
    },
    {
      id: 'file-4',
      name: 'Offline_Storage_Architecture_Spec.docx',
      fileType: 'DOCX',
      size: '620 KB',
      uploadedBy: {
        name: 'Alex Chen',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        role: 'Student Tech Lead',
      },
      uploadDate: 'Oct 13, 2026',
      relatedTask: 'Build the offline-first authentication & login flow',
      downloadUrl: '#',
    },
  ],
  team: [
    {
      id: 'member-pooja',
      name: 'Pooja Sharma',
      role: 'NGO Project Lead & Community Coordinator',
      isNgoLead: true,
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160',
      affiliation: 'Director of Education Programs · Aarambh Foundation',
      skills: ['Community Outreach', 'School Liaison', 'Curriculum Standards', 'Child Welfare'],
      assignedTasksCount: 1,
      completedTasksCount: 1,
      contributionSummary:
        'Coordinating with 14 regional rural schools, overseeing device logistics, and providing pedagogical review.',
    },
    {
      id: 'member-alex',
      name: 'Alex Chen',
      role: 'Student Tech Lead',
      isNgoLead: false,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160',
      affiliation: 'Stanford University · 3rd Year CS & HCI',
      skills: ['React', 'TypeScript', 'Offline IndexedDB', 'WCAG AAA'],
      assignedTasksCount: 2,
      completedTasksCount: 0,
      contributionSummary:
        'Architecting offline-first client database, state management, and lightweight frontend bundle optimization.',
    },
    {
      id: 'member-maya',
      name: 'Maya Lin',
      role: 'Student UI/UX Designer',
      isNgoLead: false,
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160',
      affiliation: 'Rhode Island School of Design · Junior Designer',
      skills: ['Figma', 'Visual Hierarchy', 'Child-Friendly UX', 'Illustration'],
      assignedTasksCount: 2,
      completedTasksCount: 0,
      contributionSummary:
        'Designing high-contrast touch interfaces, icon navigation language, and printable student flashcard templates.',
    },
    {
      id: 'member-david',
      name: 'David Park',
      role: 'Content & Pedagogy Specialist',
      isNgoLead: false,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160',
      affiliation: 'University of Illinois Urbana-Champaign · Education Major',
      skills: ['Bilingual Pedagogy', 'Elementary Math', 'Science Writing'],
      assignedTasksCount: 1,
      completedTasksCount: 0,
      contributionSummary:
        'Structuring 20 offline-compatible science lesson scripts and self-evaluating student comprehension questions.',
    },
  ],
  updates: [
    {
      id: 'update-1',
      author: {
        name: 'Alex Chen',
        role: 'Student Tech Lead',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
      },
      timestamp: 'Today at 11:20 AM',
      content:
        'Completed initial IndexedDB offline storage testing on emulated 2G speeds. Students will be able to store up to 5 full lesson units locally with zero network connection.',
      relatedTask: 'Build the offline-first authentication & login flow',
      attachment: {
        name: 'Offline_Storage_Architecture_Spec.docx',
        size: '620 KB',
        type: 'DOCX',
      },
    },
    {
      id: 'update-2',
      author: {
        name: 'Maya Lin',
        role: 'UI/UX Designer',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
      },
      timestamp: 'Yesterday at 4:15 PM',
      content:
        'Shared the interactive prototype on Figma. All button touch targets meet the 48px standard for children’s finger gestures. Color palette meets WCAG AAA standards for sunlight visibility.',
      relatedTask: 'Design the UI prototype & high-contrast navigation',
      attachment: {
        name: 'Rural_Learning_Platform_Prototype.fig',
        size: '14.2 MB',
        type: 'FIG',
      },
    },
    {
      id: 'update-3',
      author: {
        name: 'Pooja Sharma',
        role: 'NGO Project Lead',
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
      },
      timestamp: 'Oct 8, 2026',
      content:
        'Approved the project requirements specification. Confirmed 14 pilot classrooms and scheduled the teacher orientation for early November.',
      relatedTask: 'Finalize project requirements & classroom device audit',
      attachment: {
        name: 'Project_Requirements_v2.pdf',
        size: '1.8 MB',
        type: 'PDF',
      },
    },
  ],
  dailyProgress: [],
  teamInvitations: [],
  githubConnected: false,
  githubEvents: [],
};
