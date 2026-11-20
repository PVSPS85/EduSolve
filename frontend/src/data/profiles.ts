import { StudentProfileData, NgoProfileData } from '../types';

export const SAMPLE_STUDENT_PROFILE: StudentProfileData = {
  id: 'student-alex-chen',
  name: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=240&h=240',
  institution: 'Stanford University',
  degree: 'B.S. in Computer Science & Human-Computer Interaction',
  studyYear: '3rd Year (Junior)',
  bio: 'Undergraduate student focused on accessible software engineering and digital literacy pedagogy. Passionate about applying frontend architecture and human-centered design to community non-profits.',
  skills: [
    'React',
    'TypeScript',
    'Python',
    'UX Research',
    'WCAG Accessibility',
    'Curriculum Design',
    'Workshop Facilitation',
    'Tailwind CSS',
  ],
  portfolioLinks: [
    {
      label: 'GitHub Repository',
      url: 'https://github.com/alexchen-student',
      platform: 'github',
    },
    {
      label: 'Personal Design Portfolio',
      url: 'https://alexchen.design',
      platform: 'portfolio',
    },
    {
      label: 'LinkedIn Profile',
      url: 'https://linkedin.com/in/alexchen-student',
      platform: 'linkedin',
    },
    {
      label: 'Senior Tablet UI Prototype Demo',
      url: 'https://demo.edusolve.org/senior-tablet-ui',
      platform: 'demo',
    },
  ],
  experience: [
    {
      role: 'Peer Coding Mentor',
      organization: 'Stanford CS for All Initiative',
      period: 'Sept 2024 – Present',
      description: 'Led weekly bi-lingual coding lab sessions in Python for local East Palo Alto high school students.',
    },
    {
      role: 'Frontend Engineering Intern',
      organization: 'CivicTech Collective',
      period: 'June 2024 – Aug 2024',
      description: 'Built accessible open-data visual dashboards for regional food security food bank distribution networks.',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Stanford University, Stanford CA',
      period: '2023 – 2027 (Expected)',
      honors: 'Dean’s Honor List · GPA 3.88',
    },
  ],
  certifications: [
    {
      title: 'Certified Web Accessibility Specialist (WAS Core)',
      issuer: 'International Association of Accessibility Professionals (IAAP)',
      year: '2024',
    },
    {
      title: 'Community Leadership & Civic Engagement Certificate',
      issuer: 'Haas Center for Public Service',
      year: '2023',
    },
  ],
  preferredCategories: ['Digital Literacy', 'STEM & Coding', 'Learning Tools'],
  availability: '5-6 hours/week (Evenings & Saturdays)',
  preferredWorkMode: 'Hybrid',
  completedEduSolveContributions: [
    {
      projectTitle: 'Accessible Tablet & Online Banking Modules for Seniors',
      organization: 'Horizon Community Services',
      date: 'Fall 2025 (4-Week Sprint)',
      impactSummary: 'Co-designed large-font touch gesture guide and facilitated 2 live digital clinic coaching sessions for 38 seniors.',
    },
  ],
};

export const SAMPLE_NGO_PROFILE: NgoProfileData = {
  id: 'ngo-horizon-community',
  name: 'Horizon Community Services',
  avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=240&h=240',
  verificationStatus: 'verified',
  location: 'Chicago, IL (Westside Community Hub)',
  registrationType: '501(c)(3) Non-Profit Charitable Organization',
  registrationNumber: 'EIN: 36-9874120 / State Registry: IL-2014-9981',
  missionStatement:
    'Dedicated to bridging intergenerational digital opportunity gaps and providing accessible lifelong educational resources for urban seniors and under-resourced families.',
  about:
    'Founded in 2014, Horizon Community Services operates two grassroots neighborhood centers in Chicago. We provide direct food pantry support, bilingual public benefits navigation, and adult digital literacy clinics. Over the past decade, we have assisted over 12,000 residents with essential civic access and healthcare appointment connectivity.',
  focusAreas: [
    'Senior Digital Literacy',
    'Intergenerational Tutoring',
    'Telehealth Navigation',
    'Community Resource Access',
    'Language Translation',
  ],
  website: 'https://horizoncommunity.org',
  contactEmail: 'director@horizoncommunity.org',
  contactRepresentative: 'Dr. Marcus Vance (Director of Community Programs)',
  activeProjectsCount: 2,
  totalVolunteersEngaged: 18,
};
