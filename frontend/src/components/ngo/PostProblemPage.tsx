import React, { useState } from 'react';
import { Project, NgoVerificationStatus } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../auth/Input';
import Select from '../auth/Select';
import AlertBanner from '../auth/AlertBanner';
import FeedPost from '../feed/FeedPost';
import Modal from '../ui/Modal';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Eye,
  Info,
  AlertTriangle,
  Building2,
  X,
  FileCheck,
  Sparkles,
} from '../icons';

export interface PostProblemPageProps {
  onBackToFeed: () => void;
  onProjectPublished: (newProject: Project) => void;
  organizationName?: string;
  initialVerificationStatus?: NgoVerificationStatus;
}

export default function PostProblemPage({
  onBackToFeed,
  onProjectPublished,
  organizationName = 'Horizon Community Services',
  initialVerificationStatus = 'verified',
}: PostProblemPageProps) {
  // Verification status state (can be toggled to test both states)
  const [verificationStatus, setVerificationStatus] = useState<NgoVerificationStatus>(initialVerificationStatus);

  // Form Fields State
  // Section A: Basic info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Project['category']>('Digital Literacy');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');

  // Section B: Requirements
  const [skills, setSkills] = useState<string[]>(['UX Design', 'Accessibility', 'Curriculum Design']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [duration, setDuration] = useState('4 Weeks');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'In-Person'>('Hybrid');
  const [commitment, setCommitment] = useState('4-5 hrs/week');
  const [teamSize, setTeamSize] = useState('3-4 Student Volunteers');
  const [location, setLocation] = useState('Chicago, IL (Hybrid)');
  const [constraints, setConstraints] = useState<string>('Must work on low-bandwidth devices. WCAG AAA contrast standard.');

  // Section C: Deliverables & Expectations
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Large-font illustrated navigation guides for seniors',
    'Interactive digital safety & anti-phishing practice drill',
    'Facilitator manual for permanent community center staff',
  ]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');
  const [completionCriteria, setCompletionCriteria] = useState('');
  const [collaborationExpectations, setCollaborationExpectations] = useState(
    'Weekly 45-minute Saturday Zoom sync + asynchronous Slack milestone check-ins.'
  );
  const [materialExpenses, setMaterialExpenses] = useState(
    'All workshop hardware, print assets, and volunteer commute transit vouchers provided at zero cost.'
  );
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Section D: Project Image (Single main image)
  const sampleImages = [
    {
      url: 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      label: 'Community Workshop & Student Team',
    },
    {
      url: 'https://images.unsplash.com/photo-1695653422557-3b85c1d6d061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      label: 'Senior Tablet Learning Guidance',
    },
    {
      url: 'https://images.unsplash.com/photo-1719159381981-1327b22aff9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      label: 'Youth Computer Coding Lab',
    },
  ];

  const [projectImage, setProjectImage] = useState<string>(sampleImages[0].url);
  const [imageAlt, setImageAlt] = useState('Community members collaborating on digital literacy challenges');

  // Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Skill tag add/remove
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (skills.length > 1) {
      setSkills(skills.filter((s) => s !== skillToRemove));
    }
  };

  // Deliverable add/remove
  const handleAddDeliverable = () => {
    if (newDeliverableInput.trim()) {
      setDeliverables([...deliverables, newDeliverableInput.trim()]);
      setNewDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter((_, idx) => idx !== index));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Project title is required.';
    if (!description.trim()) newErrors.description = 'Short feed description is required.';
    if (description.length > 180) newErrors.description = 'Short description must be 180 characters or less.';
    if (!longDescription.trim()) newErrors.longDescription = 'Detailed problem statement is required.';
    if (!whyItMatters.trim()) newErrors.whyItMatters = 'Please explain why this problem matters.';
    if (skills.length === 0) newErrors.skills = 'At least one required skill is needed.';
    if (!expectedOutcome.trim()) newErrors.expectedOutcome = 'Expected outcome is required.';
    if (!projectImage) newErrors.image = 'A project photo is required for the feed post.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Draft
  const handleSaveDraft = () => {
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  // Publish
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationStatus !== 'verified') return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPublishSuccess(true);

      const createdProject: Project = {
        id: `proj-${Date.now()}`,
        title: title.trim(),
        organization: organizationName,
        organizationType: 'Verified Community Partner',
        organizationAvatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
        organizationCity: location,
        isVerified: true,
        verificationBadgeLabel: 'Verified Non-Profit',
        category,
        description: description.trim(),
        longDescription: longDescription.trim(),
        image: projectImage,
        imageAlt: imageAlt || title,
        skills,
        duration,
        durationWeeks,
        commitment,
        workMode,
        teamSize,
        location,
        whyItMatters: whyItMatters.trim(),
        objectives: [
          'Coordinate directly with community coordinators on milestone goals.',
          'Develop reusable, documented educational assets for permanent staff adoption.',
        ],
        expectedOutcome: expectedOutcome.trim(),
        deliverables,
        constraints: [constraints.trim()],
        supportingMaterials: [
          { name: 'Community Problem Scope & Background Brief', type: 'PDF Document', size: '1.2 MB' },
        ],
        volunteerExpectations: collaborationExpectations.trim(),
        materialExpenses: materialExpenses.trim(),
        organizationContact: {
          name: 'Dr. Marcus Vance',
          role: 'Director of Community Programs',
          email: 'director@horizoncommunity.org',
        },
        isOwnListing: true,
      };

      onProjectPublished(createdProject);
    }, 900);
  };

  // Quick auto-fill helper for rapid prototype inspection
  const handleAutoFill = () => {
    setTitle('Youth STEM Coding Playbook for Community Libraries');
    setCategory('STEM & Coding');
    setDescription(
      'Create 6 modular Scratch & Python game-building tutorials for children visiting urban community branches after school.'
    );
    setLongDescription(
      'Public libraries in our neighborhood provide vital safe spaces for youth after 3:30pm. However, branch staff lack structured computational thinking curricula to guide students beyond passive web browsing. This student squad will design and pilot hands-on coding modules that branch librarians can easily run.'
    );
    setWhyItMatters(
      'Over 250 youth visit our westside branch weekly. Early exposure to computational creative expression significantly builds interest in technology careers before secondary school tracking begins.'
    );
    setExpectedOutcome(
      'At least 60 elementary and middle school attendees complete self-directed interactive game projects.'
    );
    setCompletionCriteria('All 6 modules tested in-person with student cohorts and validated for zero-cost browser execution.');
    setSkills(['Python', 'Scratch', 'Curriculum Design', 'Child Pedagogy', 'Graphic Design']);
    setDuration('6 Weeks');
    setDurationWeeks(6);
    setCommitment('4-5 hrs/week');
    setWorkMode('Hybrid');
    setTeamSize('3-4 Student Volunteers');
    setLocation('Chicago, IL (Westside Hub)');
    setErrors({});
  };

  const isVerified = verificationStatus === 'verified';

  // Prototype project object for preview modal
  const previewProjectObj: Project = {
    id: 'preview-draft',
    title: title || 'Youth STEM Coding Playbook for Community Libraries',
    organization: organizationName,
    organizationType: 'Verified Community Organization',
    organizationAvatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
    organizationCity: location || 'Chicago, IL',
    isVerified: isVerified,
    postingApproved: isVerified,
    category,
    description:
      description ||
      'Create 6 modular Scratch & Python game-building tutorials for children visiting urban community branches after school.',
    longDescription: longDescription || 'Detailed problem context and operational goals.',
    image: projectImage,
    imageAlt: imageAlt,
    skills,
    duration,
    durationWeeks,
    commitment,
    workMode,
    teamSize,
    location,
    whyItMatters: whyItMatters || 'Community challenge importance.',
    objectives: ['Pilot interactive modules', 'Deliver facilitator manual'],
    expectedOutcome: expectedOutcome || 'Community challenge outcomes.',
    deliverables,
    constraints: [constraints],
    supportingMaterials: [{ name: 'Project Brief Spec', type: 'PDF' }],
    volunteerExpectations: collaborationExpectations,
    materialExpenses,
    organizationContact: {
      name: 'Dr. Marcus Vance',
      role: 'Director of Community Programs',
      email: 'director@horizoncommunity.org',
    },
    isOwnListing: true,
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] pb-24 text-left">
      
      {/* 1. Header Navigation Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToFeed}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#14334A] hover:text-[#70A1A8] py-1.5 px-3 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Project Feed</span>
            </button>
            <span className="text-[#D1D5DB] hidden sm:inline">|</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#836527] bg-[#FAF3E5] px-2.5 py-1 rounded-full border border-[#EDD7AE] hidden sm:inline-flex items-center gap-1">
              <Building2 size={12} />
              <span>NGO Portal</span>
            </span>
          </div>

          {/* Prototype Verification State Simulator Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B] hidden sm:inline">Simulate State:</span>
            <button
              type="button"
              onClick={() => setVerificationStatus(isVerified ? 'pending' : 'verified')}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isVerified
                  ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                  : 'bg-[#FAF3E5] text-[#836527] border-[#EDD7AE]'
              }`}
            >
              {isVerified ? (
                <>
                  <ShieldCheck size={13} />
                  <span>Verified (Publish Enabled)</span>
                </>
              ) : (
                <>
                  <Clock size={13} />
                  <span>Pending (Publish Disabled)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Page Title & Intro */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14334A] tracking-tight">
              Post a Community Problem Brief
            </h1>

            {/* Auto-fill sample button */}
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-xs font-semibold text-[#70A1A8] hover:text-[#14334A] flex items-center gap-1.5 self-start sm:self-auto underline cursor-pointer"
            >
              <Sparkles size={14} className="text-[#836527]" />
              <span>Auto-fill sample STEM brief</span>
            </button>
          </div>

          <p className="text-sm text-[#64748B] leading-relaxed">
            Articulate a concrete challenge facing your community. Motivated collegiate student teams will browse your brief and apply to collaborate.
          </p>
        </div>

        {/* Verification Status Warning (If not verified) */}
        {!isVerified && (
          <div className="mb-8 bg-[#FAF3E5] border border-[#EDD7AE] rounded-3xl p-5 sm:p-6 text-[#836527] space-y-2">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={20} className="text-[#836527] shrink-0" />
              <h3 className="text-sm font-bold text-[#836527]">
                Organization Verification Pending
              </h3>
            </div>
            <p className="text-xs text-[#836527]/90 leading-relaxed">
              Your non-profit registration documents are currently under administrative review. You can draft and preview your problem brief now, but publishing to the public student feed is disabled until statutory verification is approved.
            </p>
          </div>
        )}

        {/* Draft Saved Toast */}
        {draftSavedToast && (
          <div className="mb-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 text-xs text-[#166534] flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Draft saved successfully to your organization account.</span>
          </div>
        )}

        {/* Publishing Success Banner */}
        {publishSuccess && (
          <div className="mb-8 bg-[#F0FDF4] border border-[#BBF7D0] rounded-3xl p-6 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-xl font-bold text-[#14334A]">
              Problem Brief Published Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-[#166534] max-w-md mx-auto leading-relaxed">
              Your challenge is now live on the EduSolve Shared Project Feed. Student volunteers will be able to review the deliverables and express interest.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button variant="primary" size="sm" onClick={onBackToFeed}>
                View on Project Feed
              </Button>
            </div>
          </div>
        )}

        {/* Main Unified Form Container */}
        <form onSubmit={handlePublish} className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-[0_4px_24px_rgba(20,51,74,0.04)] space-y-10" noValidate>
          
          {/* ========================================================= */}
          {/* SECTION A: BASIC INFORMATION */}
          {/* ========================================================= */}
          <div className="space-y-5">
            <div className="border-b border-[#F1F5F9] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
                Section A
              </span>
              <h2 className="text-lg font-bold text-[#14334A]">
                Basic Project Information
              </h2>
            </div>

            {/* Project Title */}
            <Input
              label="Project Title"
              required
              placeholder="e.g., Accessible Tablet & Online Banking Modules for Seniors"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              error={errors.title}
              helperText="Give your project a concise, action-oriented title"
            />

            {/* Category Selection */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
                Impact Category <span className="text-[#A57E59]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Digital Literacy', 'STEM & Coding', 'Resource Access', 'Learning Tools', 'Mentorship'] as const).map(
                  (cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`text-xs p-2.5 rounded-xl font-medium border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#14334A] text-white border-[#14334A] shadow-xs'
                            : 'bg-[#FAF9F6] text-[#64748B] border-[#E5E7EB] hover:border-[#C8B294]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Short Description for Feed */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#14334A]">
                  Short Description for Feed <span className="text-[#A57E59]">*</span>
                </label>
                <span className={`text-[11px] ${description.length > 180 ? 'text-[#EA4335] font-bold' : 'text-[#94A3B8]'}`}>
                  {description.length}/180 chars
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={200}
                placeholder="1-2 sentences summarizing the core problem and volunteer mission on the project feed..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                className={`w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl p-3 border outline-none transition-all ${
                  errors.description
                    ? 'border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                    : 'border-[#E5E7EB] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20'
                }`}
              />
              {errors.description && <p className="text-xs text-[#EA4335] mt-1">{errors.description}</p>}
            </div>

            {/* Detailed Problem Statement */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1">
                Detailed Problem Statement <span className="text-[#A57E59]">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe the operational challenge in full detail. What is the current gap, what have you tried, and what should student volunteers know before joining?"
                value={longDescription}
                onChange={(e) => {
                  setLongDescription(e.target.value);
                  if (errors.longDescription) setErrors((prev) => ({ ...prev, longDescription: '' }));
                }}
                className={`w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl p-3 border outline-none transition-all ${
                  errors.longDescription
                    ? 'border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                    : 'border-[#E5E7EB] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20'
                }`}
              />
              {errors.longDescription && <p className="text-xs text-[#EA4335] mt-1">{errors.longDescription}</p>}
            </div>

            {/* Why The Problem Matters & Beneficiaries */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1">
                Why The Problem Matters & Who Is Affected <span className="text-[#A57E59]">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Explain the local urgency and constituency impact (e.g., 400 seniors unable to access telehealth portals)..."
                value={whyItMatters}
                onChange={(e) => {
                  setWhyItMatters(e.target.value);
                  if (errors.whyItMatters) setErrors((prev) => ({ ...prev, whyItMatters: '' }));
                }}
                className={`w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl p-3 border outline-none transition-all ${
                  errors.whyItMatters
                    ? 'border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                    : 'border-[#E5E7EB] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20'
                }`}
              />
              {errors.whyItMatters && <p className="text-xs text-[#EA4335] mt-1">{errors.whyItMatters}</p>}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION B: REQUIREMENTS & WORKLOAD */}
          {/* ========================================================= */}
          <div className="space-y-5 pt-6 border-t border-[#E5E7EB]">
            <div className="border-b border-[#F1F5F9] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
                Section B
              </span>
              <h2 className="text-lg font-bold text-[#14334A]">
                Requirements & Volunteer Workload
              </h2>
            </div>

            {/* Required Skills Tag Input */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
                Required Skills (Dynamic Tags) <span className="text-[#A57E59]">*</span>
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 bg-[#FAF3E5] text-[#836527] border border-[#EDD7AE] text-xs px-3 py-1.5 rounded-xl font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[#836527] hover:text-[#EA4335] cursor-pointer"
                      title="Remove skill"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g., Python, Graphic Design, Pedagogy) and press Add..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                />
                <Button variant="outline-subtle" size="sm" type="button" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>
              {errors.skills && <p className="text-xs text-[#EA4335] mt-1">{errors.skills}</p>}
            </div>

            {/* Duration, Work Mode, Commitment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#14334A] block mb-1">
                  Expected Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    setDurationWeeks(e.target.value.includes('4') ? 4 : e.target.value.includes('6') ? 6 : 8);
                  }}
                  className="w-full bg-[#FAF9F6] text-xs text-[#183047] rounded-xl px-3 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                >
                  <option value="4 Weeks">4 Weeks (Sprint)</option>
                  <option value="6 Weeks">6 Weeks (Standard Cohort)</option>
                  <option value="8 Weeks">8 Weeks (Extended Cohort)</option>
                  <option value="Semester-long">Full Semester (12 Weeks)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#14334A] block mb-1">
                  Work Mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  className="w-full bg-[#FAF9F6] text-xs text-[#183047] rounded-xl px-3 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                >
                  <option value="Remote">100% Remote</option>
                  <option value="Hybrid">Hybrid (Remote + Site Clinics)</option>
                  <option value="In-Person">In-Person Sessions</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#14334A] block mb-1">
                  Weekly Commitment
                </label>
                <select
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  className="w-full bg-[#FAF9F6] text-xs text-[#183047] rounded-xl px-3 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                >
                  <option value="3-4 hrs/week">3-4 hrs/week (Light)</option>
                  <option value="4-5 hrs/week">4-5 hrs/week (Recommended)</option>
                  <option value="5-6 hrs/week">5-6 hrs/week (Intensive)</option>
                </select>
              </div>
            </div>

            {/* Team Size & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Team Size"
                placeholder="e.g., 3-4 Student Volunteers"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />

              <Input
                label="Operating Location / Hub"
                placeholder="e.g., Chicago, IL (Westside Community Hub)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Constraints & Dependencies */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1">
                Project Constraints or Dependencies
              </label>
              <input
                type="text"
                placeholder="e.g., Low-bandwidth Chromebook compatibility required. No paid software licenses needed."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION C: DELIVERABLES & EXPECTATIONS */}
          {/* ========================================================= */}
          <div className="space-y-5 pt-6 border-t border-[#E5E7EB]">
            <div className="border-b border-[#F1F5F9] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
                Section C
              </span>
              <h2 className="text-lg font-bold text-[#14334A]">
                Deliverables & Completion Expectations
              </h2>
            </div>

            {/* Expected Outcomes */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1">
                Expected Concrete Outcome <span className="text-[#A57E59]">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g., 50 seniors independently navigate telehealth portals with validated confidence."
                value={expectedOutcome}
                onChange={(e) => {
                  setExpectedOutcome(e.target.value);
                  if (errors.expectedOutcome) setErrors((prev) => ({ ...prev, expectedOutcome: '' }));
                }}
                className={`w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl p-3 border outline-none transition-all ${
                  errors.expectedOutcome
                    ? 'border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                    : 'border-[#E5E7EB] focus:border-[#70A1A8]'
                }`}
              />
              {errors.expectedOutcome && <p className="text-xs text-[#EA4335] mt-1">{errors.expectedOutcome}</p>}
            </div>

            {/* Deliverables List (Dynamic list) */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
                Concrete Deliverables (Itemized List)
              </label>

              <div className="space-y-2 mb-3">
                {deliverables.map((deliv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E7EB] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-[#70A1A8] shrink-0" />
                      <span className="text-[#183047] font-medium">{deliv}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx)}
                      className="text-[#94A3B8] hover:text-[#EA4335] p-1 cursor-pointer"
                      title="Remove deliverable"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add deliverable */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add another concrete output (e.g., Printable handbook, interactive demo)..."
                  value={newDeliverableInput}
                  onChange={(e) => setNewDeliverableInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDeliverable();
                    }
                  }}
                  className="flex-1 bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                />
                <Button variant="outline-subtle" size="sm" type="button" onClick={handleAddDeliverable}>
                  Add Output
                </Button>
              </div>
            </div>

            {/* Expected Communication & Mentorship */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1">
                Expected Collaboration & Mentorship Cadence
              </label>
              <input
                type="text"
                value={collaborationExpectations}
                onChange={(e) => setCollaborationExpectations(e.target.value)}
                className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>

            {/* Zero Cost Policy & Material Expenses */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1">
                Material, Hosting, or Travel Expense Policy
              </label>
              <input
                type="text"
                value={materialExpenses}
                onChange={(e) => setMaterialExpenses(e.target.value)}
                className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
              <p className="text-[11px] text-[#64748B] mt-1">
                Notice: In accordance with EduSolve policy, student volunteers must incur zero out-of-pocket costs.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION D: SINGLE PROJECT IMAGE */}
          {/* ========================================================= */}
          <div className="space-y-5 pt-6 border-t border-[#E5E7EB]">
            <div className="border-b border-[#F1F5F9] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
                Section D
              </span>
              <h2 className="text-lg font-bold text-[#14334A]">
                Project Photo (Single Feed Image)
              </h2>
            </div>

            {/* Current Image Preview Area */}
            {projectImage ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] h-64 bg-[#FAF9F6] group">
                  <img
                    src={projectImage}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#14334A]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setProjectImage(sampleImages[1].url)}
                      className="bg-white text-[#14334A] px-3.5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-[#FAF9F6]"
                    >
                      Replace Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectImage('')}
                      className="bg-[#EA4335] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-[#DC2626]"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2">
                  <span>Photo selected for vertical feed post card.</span>
                  <div className="flex gap-2">
                    {sampleImages.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setProjectImage(img.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border cursor-pointer ${
                          projectImage === img.url
                            ? 'bg-[#14334A] text-white border-[#14334A]'
                            : 'bg-[#FAF9F6] text-[#64748B] hover:border-[#70A1A8]'
                        }`}
                      >
                        Sample #{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Upload Empty State */
              <div className="border-2 border-dashed border-[#C8B294] rounded-2xl p-8 text-center space-y-3 bg-[#FAF9F6]">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] text-[#70A1A8] flex items-center justify-center mx-auto">
                  <Upload size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#14334A]">Select Project Image</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">High-resolution horizontal or vertical photo</p>
                </div>
                <div className="flex justify-center gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={() => setProjectImage(sampleImages[0].url)}
                  >
                    Select Curated Photo
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION E: PUBLISHING ACTIONS & CLEARANCE */}
          {/* ========================================================= */}
          <div className="pt-6 border-t border-[#E5E7EB] space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Draft / Preview actions */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="outline-subtle"
                  size="md"
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  leftIcon={<Eye size={15} />}
                  className="flex-1 sm:flex-none text-xs"
                >
                  Preview Feed Post
                </Button>

                <Button
                  variant="outline-subtle"
                  size="md"
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 sm:flex-none text-xs"
                >
                  Save Draft
                </Button>
              </div>

              {/* Primary Publish Button */}
              <div className="w-full sm:w-auto">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!isVerified || isSubmitting}
                  className={`w-full sm:w-auto justify-center px-8 py-3.5 shadow-md ${
                    !isVerified ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting
                    ? 'Publishing Brief...'
                    : !isVerified
                    ? 'Publishing Disabled (Verification Required)'
                    : 'Publish Problem Brief'}
                </Button>
              </div>
            </div>

            {!isVerified && (
              <p className="text-[11px] text-[#836527] text-right">
                * Publishing unlocks immediately once organization review is complete.
              </p>
            )}
          </div>

        </form>

      </div>

      {/* Preview Feed Post Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Visual Project Feed Preview"
        description="This is how student volunteers will see your problem brief in the shared Instagram-style feed."
        maxWidth="lg"
      >
        <div className="text-left -mt-2 space-y-4">
          <FeedPost
            project={previewProjectObj}
            userRole="student"
            isSaved={false}
            onToggleSave={() => {}}
            onDismiss={() => {}}
            onSelectProject={() => {}}
            onApply={() => {}}
          />

          <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
            <Button variant="outline-subtle" size="sm" onClick={() => setPreviewModalOpen(false)}>
              Back to Form
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
