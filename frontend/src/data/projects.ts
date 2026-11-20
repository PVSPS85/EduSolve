import { Project } from '../types';

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Accessible Tablet & Online Banking Modules for Seniors',
    organization: 'Horizon Community Services',
    organizationType: 'Non-Profit Community Center (Illustrative)',
    organizationAvatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
    organizationCity: 'Chicago, IL',
    isVerified: true,
    postingApproved: true,
    verificationBadgeLabel: 'Verified Non-Profit',
    category: 'Digital Literacy',
    description: 'Design easy-to-follow visual guides and run interactive workshops helping local seniors navigate telemedicine, digital banking, and family video calls safely.',
    longDescription:
      'Horizon Community Services works with over 400 seniors in urban neighborhoods who face growing digital exclusion as essential health and civic services shift online. Student volunteers will collaborate with social workers to design low-jargon visual reference cards, test tablet interfaces with elderly participants, and facilitate weekly hands-on guidance clinics.',
    image:
      'https://images.unsplash.com/photo-1695653422557-3b85c1d6d061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzZW5pb3IlMjBwZXJzb24lMjBsZWFybmluZyUyMGNvbXB1dGVyJTIwdGFibGV0JTIwdm9sdW50ZWVyJTIwdGVhY2hlcnxlbnwxfHx8fDE3OTE4OTYyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Senior learning how to use a digital tablet with volunteer guidance',
    skills: ['UX Design', 'Curriculum Design', 'Community Tutoring', 'Accessibility'],
    duration: '4 Weeks',
    durationWeeks: 4,
    commitment: '4-5 hrs/week',
    workMode: 'Hybrid',
    teamSize: '3 Student Volunteers',
    location: 'Hybrid · Westside Community Center',
    whyItMatters:
      'Over 68% of community elders report feeling anxious when logging into medical patient portals or utility billing accounts. Without structured peer assistance, seniors are increasingly vulnerable to phishing scams or miss critical medical appointments.',
    objectives: [
      'Create 8 modular visual quick-reference sheets for iOS and Android tablets.',
      'Pilot and iterate two 90-minute digital literacy coaching clinics with senior cohorts.',
      'Deliver a reusable facilitator handbook for ongoing community center volunteer staff.',
    ],
    expectedOutcome:
      'At least 50 senior participants will independently schedule telehealth appointments and conduct two-factor bank logins with verified confidence.',
    deliverables: [
      'Printable large-font step-by-step navigation guides (min. 18pt font with color-coded steps)',
      'Interactive practice exercises for tablet touch gestures and fraud detection drills',
      '4 in-person coaching sessions facilitated collaboratively at the community center',
      'Staff handover toolkit and digital PDF repository for permanent community center staff',
    ],
    constraints: [
      'Must work offline on subsidized Android tablets with minimal internet bandwidth.',
      'Design must adhere to WCAG AAA contrast standards for visual accessibility.',
      'Materials must avoid technical jargon (e.g. use "Tap here to call doctor" instead of "Initiate WebRTC stream").',
    ],
    supportingMaterials: [
      { name: 'Senior Digital Literacy Survey Results (PDF)', type: 'PDF Document', size: '1.4 MB' },
      { name: 'Tablet Hardware Specs & Current OS Version', type: 'Technical Note', size: '240 KB' },
    ],
    volunteerExpectations:
      'Attendance at 1 weekly in-person Saturday morning workshop (Chicago center) plus 3-4 hours of remote design/curriculum iteration.',
    materialExpenses:
      'All test tablets, workshop printing, and volunteer commute transit vouchers are provided at zero cost by Horizon Community Services.',
    organizationContact: {
      name: 'Dr. Marcus Vance',
      role: 'Director of Community Programs',
      email: 'm.vance@horizoncommunity.org',
    },
    isOwnListing: true,
  },
  {
    id: 'proj-2',
    title: 'Scratch & Python After-School Logic Curriculum',
    organization: 'NextGen Pathways Initiative',
    organizationType: 'Youth Educational Foundation (Illustrative)',
    organizationAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
    organizationCity: 'Atlanta, GA',
    isVerified: true,
    postingApproved: true,
    verificationBadgeLabel: 'Verified Non-Profit',
    category: 'STEM & Coding',
    description:
      'Build interactive hands-on coding modules and exercises for middle-schoolers in underserved public school districts with limited computer lab time.',
    longDescription:
      'NextGen Pathways provides after-school tutoring for middle school students from communities underrepresented in tech. The objective of this project is to develop five modular creative coding units that run directly in low-bandwidth browser environments without complex local machine setups.',
    image:
      'https://images.unsplash.com/photo-1719159381981-1327b22aff9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzdHVkZW50cyUyMGNvZGluZyUyMGNvbXB1dGVyJTIwd29ya3Nob3B8ZW58MXx8fHwxNzkxODk2MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Students engaged in interactive computer coding lesson',
    skills: ['Python', 'Pedagogy', 'Block Coding', 'Mentorship'],
    duration: '6 Weeks',
    durationWeeks: 6,
    commitment: '5-6 hrs/week',
    workMode: 'In-Person',
    teamSize: '4 Student Volunteers',
    location: 'In-Person · Martin Luther King Jr. Middle School Lab',
    whyItMatters:
      'Students in underfunded school districts often experience computer classes as typing drills rather than creative computational thinking. Early exposure to creative coding fosters STEM confidence before high school tracking takes place.',
    objectives: [
      'Design five engaging browser-based mini-games (e.g. maze runners, interactive stories).',
      'Provide dual learning tracks: visual Block Coding for beginners and gentle Python syntax for advanced learners.',
      'Train four high school teacher aides to facilitate future cohorts.',
    ],
    expectedOutcome:
      'A 6-week curriculum tested with 35 students resulting in a public showcase where every student presents a personalized interactive project.',
    deliverables: [
      '5 interactive browser-based Scratch and basic Python challenges',
      'Educator lesson plans with rubrics, timing schedules, and troubleshooting FAQs',
      'Student self-paced reflection worksheets and accomplishment badges',
      'Demonstration showcase session with student cohort and families',
    ],
    constraints: [
      'Computers run locked-down Chromebooks: zero local terminal access or pip installs permitted.',
      'Must load completely within 15 seconds on a shared 20 Mbps school broadband link.',
    ],
    supportingMaterials: [
      { name: 'School District Computer Lab Environment Spec', type: 'Tech Brief', size: '510 KB' },
      { name: 'State Middle School CS Standards Mapping', type: 'Curriculum Guide', size: '2.1 MB' },
    ],
    volunteerExpectations:
      'Lead two 75-minute after-school lab sessions on Tuesdays and Thursdays from 3:45pm to 5:00pm, plus remote weekly team standup.',
    materialExpenses:
      'All school access passes, student snack budgets, and curriculum printing covered by NextGen Pathways.',
    organizationContact: {
      name: 'Elena Rostova',
      role: 'Curriculum & Outreach Coordinator',
      email: 'elena@nextgenpathways.org',
    },
    isOwnListing: false,
  },
  {
    id: 'proj-3',
    title: 'Multilingual Reading & Homework Aid Catalog',
    organization: 'Civic Reading Alliance',
    organizationType: 'Literacy Coalition (Illustrative)',
    organizationAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
    organizationCity: 'Austin, TX',
    isVerified: true,
    postingApproved: true,
    verificationBadgeLabel: 'Verified Non-Profit',
    category: 'Resource Access',
    description:
      'Curate and tag bilingual open-access educational e-books and worksheets for immigrant families seeking elementary English and math support.',
    longDescription:
      'The Civic Reading Alliance bridges educational resource gaps for newcomer and immigrant families. Student collaborators will review open-educational resources (OER), establish clear reading level tags, write parent guidance notes in English and Spanish, and publish an indexed web repository.',
    image:
      'https://images.unsplash.com/photo-1532789339108-2ebc484efbf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx2b2x1bnRlZXIlMjBjaGlsZHJlbiUyMGJvb2t8ZW58MXx8fHwxNzkxODk2MjUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Children reading books together in supportive environment',
    skills: ['Content Curation', 'Bilingual Translation', 'Educational Tech', 'Metadata'],
    duration: '4 Weeks',
    durationWeeks: 4,
    commitment: '3-4 hrs/week',
    workMode: 'Remote',
    teamSize: '3 Student Volunteers',
    location: '100% Remote Collaboration',
    whyItMatters:
      'Non-English speaking parents frequently struggle to assist children with elementary homework due to language barriers. Providing culturally attuned, bilingual materials empowers parents to participate directly in their children’s learning journey.',
    objectives: [
      'Index 60+ open-source elementary reading texts mapped to Lexile reading scores.',
      'Translate parent guidance notes and comprehension questions into English and Spanish.',
      'Build a mobile-friendly search directory that operates seamlessly on low-cost smartphones.',
    ],
    expectedOutcome:
      'A publicly accessible, lightweight web repository utilized by 12 community library branches across Travis County.',
    deliverables: [
      'Repository of 60 curated open-licensed elementary reading texts with vocabulary glossaries',
      'Bilingual vocabulary companion worksheets in print-ready PDF and editable formats',
      'Searchable category taxonomy for grades 1-5 categorized by reading difficulty',
      'Family usage guide with tips for establishing supportive 15-minute daily reading habits',
    ],
    constraints: [
      'Strict adherence to Creative Commons / Open Access public domain copyright licensing.',
      'Mobile web UI must consume less than 1.5 MB total page weight for low-data mobile plans.',
    ],
    supportingMaterials: [
      { name: 'OER Open Text Licensing Guidelines', type: 'Legal Manual', size: '890 KB' },
      { name: 'Bilingual Terminology Style Guide', type: 'Language Ref', size: '340 KB' },
    ],
    volunteerExpectations:
      'Weekly 45-minute remote sync with Alliance lead, with flexible asynchronous content curation and translation work.',
    materialExpenses: '100% remote software licenses provided; no volunteer expenses incurred.',
    organizationContact: {
      name: 'Sofia Mendoza',
      role: 'Family Engagement Director',
      email: 'sofia@civicreading.org',
    },
    isOwnListing: false,
  },
  {
    id: 'proj-4',
    title: 'Low-Cost Sensor Experiments & Lesson Templates',
    organization: 'Prairie Discovery Collective',
    organizationType: 'Regional STEM Non-Profit (Illustrative)',
    organizationAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
    organizationCity: 'Des Moines, IA',
    isVerified: true,
    postingApproved: true,
    verificationBadgeLabel: 'Verified Non-Profit',
    category: 'Learning Tools',
    description:
      'Develop 5 offline science experiment activities using everyday household materials and open-source measurement software for resource-constrained schools.',
    longDescription:
      'Prairie Discovery Collective works with semi-rural schools that lack dedicated science laboratory equipment. This team will engineer repeatable physics and environmental biology experiments that can be executed safely with budget sensors and recycled components.',
    image:
      'https://images.unsplash.com/photo-1568585262983-9b54814595a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxzdGVtJTIwZWR1Y2F0aW9uJTIwcm9ib3RpY3MlMjBjb2RpbmclMjBjaGlsZHJlbiUyMG1lbnRvcnxlbnwxfHx8fDE3OTE4OTYyNDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Student working with digital measurement device in science lab',
    skills: ['STEM Curriculum', 'Technical Writing', 'Physics / Chemistry', 'Graphic Design'],
    duration: '5 Weeks',
    durationWeeks: 5,
    commitment: '4-5 hrs/week',
    workMode: 'Hybrid',
    teamSize: '4 Student Volunteers',
    location: 'Hybrid · Campus Maker Lab & Rural School Clinics',
    whyItMatters:
      'Rural schools in the region have an average lab budget under $200 per year per science classroom. Hands-on physical science concepts cannot be absorbed solely through outdated textbooks without practical experiment validation.',
    objectives: [
      'Design five rigorous physics/chemistry experiments utilizing materials found under $10 per class.',
      'Incorporate open-source phone sensor apps (e.g. Phyphox) for accelerometer and soundwave measurement.',
      'Produce clear teacher safety protocols and student laboratory sheets.',
    ],
    expectedOutcome:
      'Kit instructions adopted across 14 rural Iowa middle school science classrooms affecting 400+ students.',
    deliverables: [
      '5 complete experimental safety and instruction sheets with step-by-step illustrations',
      'Component acquisition guide and Bill of Materials totaling under $15 per classroom setup',
      'Short instructional video demos (under 3 min each) for non-specialist schoolteachers',
      'Safety validation and compliance sign-off report reviewed by a licensed educator',
    ],
    constraints: [
      'Zero use of hazardous or regulated chemicals (must rely on pantry-safe household items).',
      'Must function without continuous internet connectivity once apps are downloaded.',
    ],
    supportingMaterials: [
      { name: 'Rural Classroom Equipment Inventory Benchmark', type: 'Survey', size: '1.1 MB' },
      { name: 'Safety Standards Checklist for Middle School Labs', type: 'Safety Code', size: '780 KB' },
    ],
    volunteerExpectations:
      'Prototype testing in campus engineering/science spaces plus optional Friday morning site demonstration.',
    materialExpenses:
      'All prototype materials, measurement sensors, and travel reimbursements fully financed by Prairie Discovery Collective.',
    organizationContact: {
      name: 'Prof. Lyle Hendrick',
      role: 'Director of Applied Education',
      email: 'lyle@prairiediscovery.org',
    },
    isOwnListing: false,
  },
  {
    id: 'proj-5',
    title: 'First-Generation College Prep & Guidance Playbook',
    organization: 'Urban Youth Empowerment Trust',
    organizationType: 'Community Advocacy Org (Illustrative)',
    organizationAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
    organizationCity: 'Philadelphia, PA',
    isVerified: true,
    postingApproved: true,
    verificationBadgeLabel: 'Verified Non-Profit',
    category: 'Mentorship',
    description:
      'Create a modular college application and scholarship discovery framework paired with weekly video workshops for first-generation high school applicants.',
    longDescription:
      'Navigating college applications, financial aid documentation, and scholarship deadlines is a major barrier for first-generation students. A multidisciplinary student volunteer team will create digestible step-by-step playbooks, host peer advice Q&A sessions, and offer feedback on application essays.',
    image:
      'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHZvbHVudGVlcmluZyUyMHRlYWNoaW5nJTIwZWR1Y2F0aW9uJTIwZGlnaXRhbCUyMGxpdGVyYWN5fGVufDF8fHx8MTc5MTg5NjIyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Young adults collaborating around a table planning educational steps',
    skills: ['Admissions Mentoring', 'Resource Guides', 'Workshop Facilitation', 'Community Outreach'],
    duration: '6 Weeks',
    durationWeeks: 6,
    commitment: '4 hrs/week',
    workMode: 'Remote',
    teamSize: '3 Student Volunteers',
    location: '100% Remote Video Sessions',
    whyItMatters:
      'Over $3.75 billion in Pell Grant and scholarship aid goes unclaimed annually because students and families miss obscure financial aid deadlines. First-generation students are 40% more likely to enroll when supported by near-peer collegiate mentors.',
    objectives: [
      'Assemble a comprehensive 35-page digital and printable application timeline playbook.',
      'Facilitate 4 live virtual workshop sessions addressing FAFSA, CSS Profile, and personal essays.',
      'Provide structured essay brainstorming templates for 40 high school seniors.',
    ],
    expectedOutcome:
      'Every participating senior submits at least three scholarship applications and one completed state financial aid file before deadlines.',
    deliverables: [
      'Comprehensive digital and printable application handbook with color-coded checklist milestones',
      'Timeline tracker Google Sheet template for tracking application deadlines and portal logins',
      '3 live virtual essay brainstorming workshops recorded for asynchronous viewing',
      'Peer reviewer rubric for constructive feedback on draft personal statements',
    ],
    constraints: [
      'Student volunteers must undergo standard child safety policy orientation prior to mentoring.',
      'All virtual sessions recorded and monitored by an adult Trust coordinator.',
    ],
    supportingMaterials: [
      { name: 'First-Gen Mentorship Ethics & Boundary Code', type: 'Compliance Doc', size: '420 KB' },
      { name: 'Financial Aid Milestone Schedule (2026-2027)', type: 'Policy Memo', size: '610 KB' },
    ],
    volunteerExpectations:
      'Two 60-minute evening Zoom sessions per week with high school seniors, plus 2 hours of asynchronous essay feedback.',
    materialExpenses: 'All mentoring software, Zoom enterprise accounts, and student stipend grants provided by the Trust.',
    organizationContact: {
      name: 'Tanya Washington',
      role: 'Youth Pathways Lead',
      email: 'tanya@urbanyouthtrust.org',
    },
    isOwnListing: false,
  },
];
