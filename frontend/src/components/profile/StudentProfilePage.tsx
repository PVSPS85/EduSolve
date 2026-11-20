import React, { useState } from 'react';
import { StudentProfileData } from '../../types';
import { SAMPLE_STUDENT_PROFILE } from '../../data/profiles';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SkillTag from '../ui/SkillTag';
import Modal from '../ui/Modal';
import {
  ArrowLeft,
  Mail,
  School,
  Briefcase,
  Award,
  Globe,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Check,
  Sparkles,
  User,
} from '../icons';

export interface StudentProfilePageProps {
  studentProfile?: StudentProfileData;
  viewerRole?: 'student' | 'ngo';
  onBack: () => void;
  onOpenConversation?: () => void;
}

export default function StudentProfilePage({
  studentProfile = SAMPLE_STUDENT_PROFILE,
  viewerRole = 'student',
  onBack,
  onOpenConversation,
}: StudentProfilePageProps) {
  // Current view mode: 'own' (student looking at own profile) or 'ngo-view' (NGO reviewing applicant)
  const [activeViewerRole, setActiveViewerRole] = useState<'student' | 'ngo'>(viewerRole);

  // Profile data in local state for editing
  const [profile, setProfile] = useState<StudentProfileData>(studentProfile);

  // Edit Modals
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [tempBio, setTempBio] = useState(profile.bio);

  const [editAvailabilityOpen, setEditAvailabilityOpen] = useState(false);
  const [tempAvailability, setTempAvailability] = useState(profile.availability);
  const [tempWorkMode, setTempWorkMode] = useState(profile.preferredWorkMode);

  const [privacySettingsOpen, setPrivacySettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isOwnView = activeViewerRole === 'student';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBio = () => {
    setProfile({ ...profile, bio: tempBio });
    setEditBioOpen(false);
    showToast('Biography updated successfully.');
  };

  const handleSaveAvailability = () => {
    setProfile({
      ...profile,
      availability: tempAvailability,
      preferredWorkMode: tempWorkMode,
    });
    setEditAvailabilityOpen(false);
    showToast('Availability settings updated.');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] pb-24 text-left">
      
      {/* Top Sub-Nav Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#14334A] hover:text-[#70A1A8] py-1.5 px-3 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Viewer Mode Switcher (Allows testing student self-view vs NGO reviewer view) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B] hidden sm:inline">Perspective:</span>
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveViewerRole('student')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  isOwnView
                    ? 'bg-[#14334A] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#14334A]'
                }`}
              >
                My Profile (Student)
              </button>
              <button
                type="button"
                onClick={() => setActiveViewerRole('ngo')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  !isOwnView
                    ? 'bg-[#836527] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#14334A]'
                }`}
              >
                NGO Reviewer View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] p-3 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header Profile Banner Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,51,74,0.04)] relative overflow-hidden">
          {/* Subtle top brand accent ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#14334A] via-[#70A1A8] to-[#EDD7AE]" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            {/* Left: Avatar & Identity */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md"
              />

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#14334A]">
                    {profile.name}
                  </h1>

                  <span className="text-[11px] font-bold text-[#1E4663] bg-[#EBF4F5] px-2.5 py-0.5 rounded-full border border-[#70A1A8]/40">
                    Verified Collegiate Volunteer
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#64748B] mt-1">
                  <School size={15} className="text-[#70A1A8] shrink-0" />
                  <span className="font-semibold text-[#183047]">{profile.institution}</span>
                </div>

                <p className="text-xs text-[#64748B] mt-0.5">
                  {profile.degree} • <strong className="text-[#14334A] font-medium">{profile.studyYear}</strong>
                </p>
              </div>
            </div>

            {/* Right: Actions based on viewer role */}
            <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
              {isOwnView ? (
                <>
                  <Button
                    variant="outline-subtle"
                    size="sm"
                    onClick={() => {
                      setTempBio(profile.bio);
                      setEditBioOpen(true);
                    }}
                    leftIcon={<Edit size={14} />}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline-subtle"
                    size="sm"
                    onClick={() => setPrivacySettingsOpen(true)}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    Privacy Settings
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onOpenConversation}
                    leftIcon={<MessageSquare size={15} />}
                    className="flex-1 sm:flex-none text-xs sm:text-sm py-2.5 px-5 shadow-sm"
                  >
                    Message Applicant
                  </Button>
                </>
              )}
            </div>

          </div>

          {/* Biography */}
          <div className="mt-6 pt-6 border-t border-[#F1F5F9] text-xs sm:text-sm text-[#183047] leading-relaxed">
            <p>{profile.bio}</p>
          </div>

          {/* Privacy badge notice */}
          <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#70A1A8]" />
              <span>Contact shielding active: Personal phone and home address remain private.</span>
            </span>
            <span className="text-[#94A3B8] hidden sm:inline">Last active today</span>
          </div>

        </div>

        {/* 2. Two-Column Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Skills, Completed EduSolve Contributions, Experience, Education */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Skills & Technologies */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#14334A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#70A1A8]" />
                  <span>Skills & Competencies</span>
                </h2>
                {isOwnView && (
                  <button
                    onClick={() => showToast('Skill management modal open')}
                    className="text-xs text-[#70A1A8] font-semibold hover:underline cursor-pointer"
                  >
                    Manage Skills
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <SkillTag key={skill} label={skill} size="md" />
                ))}
              </div>
            </section>

            {/* Platform-Verified Completed EduSolve Contributions (Clearly distinguished from self-reported) */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#14334A] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#836527]" />
                  <span>Verified EduSolve Project Contributions</span>
                </h2>
                <Badge variant="gold" size="sm">
                  Platform Verified
                </Badge>
              </div>

              <p className="text-xs text-[#64748B] mb-4">
                Completed deliverables authenticated by participating non-profit directors.
              </p>

              <div className="space-y-3">
                {profile.completedEduSolveContributions.map((contrib, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF3E5]/60 border border-[#EDD7AE] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-[#14334A] text-sm">
                        {contrib.projectTitle}
                      </h4>
                      <span className="text-[10px] font-bold text-[#836527] bg-white px-2 py-0.5 rounded-full border border-[#EDD7AE]">
                        {contrib.date}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-[#836527] block">
                      Partner: {contrib.organization}
                    </span>

                    <p className="text-[#64748B] leading-relaxed pt-1">
                      {contrib.impactSummary}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Relevant Experience */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#14334A] mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-[#70A1A8]" />
                <span>Relevant Experience & Civic Roles</span>
              </h2>

              <div className="space-y-4">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="pb-4 border-b border-[#F1F5F9] last:border-b-0 last:pb-0 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-sm text-[#14334A]">{exp.role}</h4>
                      <span className="text-[11px] text-[#94A3B8]">{exp.period}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#70A1A8] block mb-1">
                      {exp.organization}
                    </span>
                    <p className="text-[#64748B] leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education & Certifications */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#14334A] mb-4 flex items-center gap-2">
                <School size={16} className="text-[#70A1A8]" />
                <span>Academic Education & Certifications</span>
              </h2>

              <div className="space-y-4 text-xs">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="pb-3 border-b border-[#F1F5F9]">
                    <h4 className="font-bold text-[#14334A] text-sm">{edu.degree}</h4>
                    <span className="text-xs text-[#64748B] block">{edu.institution} • {edu.period}</span>
                    {edu.honors && <span className="text-[11px] text-[#836527] font-semibold mt-0.5 block">{edu.honors}</span>}
                  </div>
                ))}

                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                    Certifications:
                  </span>
                  <div className="space-y-2">
                    {profile.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#183047]">
                        <Award size={14} className="text-[#70A1A8] shrink-0" />
                        <span><strong>{cert.title}</strong> — {cert.issuer} ({cert.year})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column (4 cols): Portfolio Links, Availability & Preferred Categories */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Projects & Shared Portfolio Links */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#14334A] flex items-center gap-2">
                  <Globe size={15} className="text-[#70A1A8]" />
                  <span>Verified Portfolio Links</span>
                </h3>
                {isOwnView && (
                  <button
                    onClick={() => showToast('Portfolio link manager open')}
                    className="text-xs text-[#70A1A8] font-semibold hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {profile.portfolioLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] hover:border-[#70A1A8] hover:bg-[#EBF4F5]/40 transition-all flex items-center justify-between text-xs group"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-[#14334A] block truncate">{link.label}</span>
                      <span className="text-[10px] text-[#64748B] truncate block">{link.url}</span>
                    </div>
                    <ExternalLink size={13} className="text-[#94A3B8] group-hover:text-[#14334A] shrink-0" />
                  </a>
                ))}
              </div>
            </section>

            {/* Availability & Preferred Work Mode */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#14334A] flex items-center gap-2">
                  <Clock size={15} className="text-[#70A1A8]" />
                  <span>Availability & Preferences</span>
                </h3>
                {isOwnView && (
                  <button
                    onClick={() => {
                      setTempAvailability(profile.availability);
                      setTempWorkMode(profile.preferredWorkMode);
                      setEditAvailabilityOpen(true);
                    }}
                    className="text-xs text-[#70A1A8] font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                    Weekly Bandwidth
                  </span>
                  <strong className="text-[#14334A] text-xs sm:text-sm block mt-0.5">
                    {profile.availability}
                  </strong>
                </div>

                <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                    Preferred Format
                  </span>
                  <strong className="text-[#14334A] text-xs sm:text-sm block mt-0.5">
                    {profile.preferredWorkMode} Mode
                  </strong>
                </div>
              </div>
            </section>

            {/* Preferred Project Categories */}
            <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-3">
                Preferred Cause Categories
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.preferredCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF9F6] text-[#14334A] border border-[#E5E7EB] font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </section>

          </div>

        </div>

      </div>

      {/* Edit Bio Modal */}
      <Modal
        isOpen={editBioOpen}
        onClose={() => setEditBioOpen(false)}
        title="Edit Professional Biography"
        description="Share your background and what motivated you to volunteer for community causes."
        maxWidth="md"
      >
        <div className="text-left -mt-2 space-y-4">
          <textarea
            rows={4}
            value={tempBio}
            onChange={(e) => setTempBio(e.target.value)}
            className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-3 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
            <Button variant="outline-subtle" size="sm" onClick={() => setEditBioOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveBio}>
              Save Bio
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Availability Modal */}
      <Modal
        isOpen={editAvailabilityOpen}
        onClose={() => setEditAvailabilityOpen(false)}
        title="Availability & Work Preferences"
        description="Let NGO coordinators know your weekly capacity."
        maxWidth="md"
      >
        <div className="text-left -mt-2 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#14334A] block mb-1">
              Weekly Availability
            </label>
            <input
              type="text"
              value={tempAvailability}
              onChange={(e) => setTempAvailability(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#14334A] block mb-1">
              Preferred Format
            </label>
            <select
              value={tempWorkMode}
              onChange={(e) => setTempWorkMode(e.target.value as any)}
              className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="In-Person">In-Person</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
            <Button variant="outline-subtle" size="sm" onClick={() => setEditAvailabilityOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAvailability}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        isOpen={privacySettingsOpen}
        onClose={() => setPrivacySettingsOpen(false)}
        title="Privacy & Data Shielding"
        description="EduSolve enforces strict student safety protocols."
        maxWidth="md"
      >
        <div className="text-left -mt-2 space-y-4 text-xs text-[#64748B]">
          <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#14334A]">Personal Phone & Address:</span>
              <span className="text-[#16A34A] font-bold">Always Hidden</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#14334A]">University Email:</span>
              <span className="text-[#14334A]">Visible only upon application</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#14334A]">Portfolio Links:</span>
              <span className="text-[#14334A]">Public to verified NGOs</span>
            </div>
          </div>
          <p>
            Your private academic grades and student ID documents are stored securely and never published publicly.
          </p>
          <div className="flex justify-end pt-2 border-t border-[#E5E7EB]">
            <Button variant="primary" size="sm" onClick={() => setPrivacySettingsOpen(false)}>
              Acknowledge
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
