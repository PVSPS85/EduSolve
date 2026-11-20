import React, { useState } from 'react';
import { Project, ApplicationSubmission } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import AlertBanner from '../auth/AlertBanner';
import { CheckCircle2, ArrowRight, MessageSquare, Briefcase, FileText, Check, Sparkles } from '../icons';

export interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onApplicationSubmitted: (submission: ApplicationSubmission) => void;
  onOpenConversation: (submission: ApplicationSubmission) => void;
}

export default function QuickApplyModal({
  isOpen,
  onClose,
  project,
  onApplicationSubmitted,
  onOpenConversation,
}: QuickApplyModalProps) {
  const [introMessage, setIntroMessage] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [committedHours, setCommittedHours] = useState(true);
  const [errors, setErrors] = useState<{ message?: string; skills?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<ApplicationSubmission | null>(null);

  // Auto-populate all project skills on modal open
  React.useEffect(() => {
    if (project) {
      setSelectedSkills(project.skills.slice(0, 3));
      setIntroMessage('');
      setPortfolioLink('https://github.com/alexchen-student');
      setErrors({});
      setSubmittedData(null);
    }
  }, [project, isOpen]);

  if (!project) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    if (errors.skills) setErrors((prev) => ({ ...prev, skills: undefined }));
  };

  const validate = () => {
    const newErrors: { message?: string; skills?: string } = {};

    if (!introMessage.trim()) {
      newErrors.message = 'Please write a brief introduction (at least 20 characters).';
    } else if (introMessage.trim().length < 20) {
      newErrors.message = 'Introductory note is too short. Please add a sentence about your interest.';
    }

    if (selectedSkills.length === 0) {
      newErrors.skills = 'Please select at least one skill you will contribute.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newSubmission: ApplicationSubmission = {
        id: `app-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        organization: project.organization,
        studentName: 'Alex Chen',
        studentEmail: 'alex.chen@university.edu',
        introMessage: introMessage.trim(),
        selectedSkills,
        portfolioLink: portfolioLink.trim() || undefined,
        committedHoursWeekly: committedHours,
        submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Under Review',
      };

      setSubmittedData(newSubmission);
      onApplicationSubmitted(newSubmission);
    }, 750);
  };

  const handleFillSampleIntro = () => {
    setIntroMessage(
      `Hello! I'm an undergraduate junior passionate about educational equity. I have experience designing accessible user flows and run hands-on tutoring workshops. I'm eager to help ${project.organization} deliver this community project.`
    );
    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={submittedData ? undefined : "I'm Interested — Quick Application"}
      description={
        submittedData
          ? undefined
          : 'Introduce yourself directly to the non-profit coordinator. No lengthy cover letters.'
      }
      maxWidth="lg"
    >
      <div className="text-left -mt-1">
        
        {/* Project Thumbnail Bar */}
        {!submittedData && (
          <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-3.5 mb-5 flex items-center gap-3">
            <img
              src={project.image}
              alt={project.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E5E7EB]"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
                {project.organization}
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-[#14334A] truncate">
                {project.title}
              </h4>
              <span className="text-[11px] text-[#64748B]">
                {project.duration} · {project.commitment}
              </span>
            </div>
          </div>
        )}

        {/* Application Form View */}
        {!submittedData ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Student Profile Quick Identification */}
            <div className="flex items-center justify-between text-xs text-[#64748B] pb-2 border-b border-[#F1F5F9]">
              <span>
                Applying as <strong className="text-[#14334A]">Alex Chen</strong> (B.S. Computer Science)
              </span>
              <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                Profile Active
              </span>
            </div>

            {/* Introductory Note */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="intro-message" className="text-xs font-semibold text-[#14334A]">
                  Short Introductory Message <span className="text-[#A57E59]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleFillSampleIntro}
                  className="text-[11px] font-semibold text-[#70A1A8] hover:text-[#14334A] underline cursor-pointer"
                >
                  Insert sample introduction
                </button>
              </div>

              <textarea
                id="intro-message"
                rows={3}
                placeholder="Share why this challenge matters to you and what relevant skills or project experience you bring..."
                value={introMessage}
                onChange={(e) => {
                  setIntroMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                }}
                className={`w-full bg-white text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl p-3 border outline-none transition-all ${
                  errors.message
                    ? 'border-[#EA4335] focus:ring-2 focus:ring-[#EA4335]/20'
                    : 'border-[#E5E7EB] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20'
                }`}
              />

              {errors.message ? (
                <p className="text-xs text-[#EA4335] mt-1 font-medium">{errors.message}</p>
              ) : (
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  Keep it brief (2-4 sentences). The coordinator will read this directly.
                </p>
              )}
            </div>

            {/* Relevant Skills Selection */}
            <div>
              <label className="text-xs font-semibold text-[#14334A] block mb-1.5">
                Highlight Your Relevant Skills <span className="text-[#A57E59]">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#14334A] text-white border-[#14334A] shadow-2xs'
                          : 'bg-[#FAF9F6] text-[#64748B] border-[#E5E7EB] hover:border-[#C8B294]'
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-[#EDD7AE]" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
              {errors.skills && (
                <p className="text-xs text-[#EA4335] mt-1 font-medium">{errors.skills}</p>
              )}
            </div>

            {/* Optional Portfolio / GitHub Link */}
            <div>
              <label htmlFor="portfolio-link" className="text-xs font-semibold text-[#14334A] block mb-1">
                Portfolio or Work Sample Link <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <input
                id="portfolio-link"
                type="url"
                placeholder="https://github.com/your-username or portfolio URL"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                className="w-full bg-white text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20 outline-none"
              />
            </div>

            {/* Weekly Commitment Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#64748B] pt-1 select-none">
              <input
                type="checkbox"
                checked={committedHours}
                onChange={(e) => setCommittedHours(e.target.checked)}
                className="mt-0.5 rounded border-[#D1D5DB] text-[#14334A] focus:ring-[#70A1A8]"
              />
              <span>
                I confirm that I can commit approximately <strong>{project.commitment}</strong> for the{' '}
                <strong>{project.duration}</strong> duration of this community project.
              </span>
            </label>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
              <Button variant="outline-subtle" size="md" onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                rightIcon={
                  !isLoading ? (
                    <ArrowRight size={15} />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )
                }
                className="py-2.5 px-6 shadow-sm"
              >
                {isLoading ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        ) : (
          /* Success Confirmation View */
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={30} />
              </div>

              <h3 className="text-xl font-extrabold text-[#14334A] mb-1">
                Application Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-[#166534] max-w-md mx-auto leading-relaxed">
                Your introduction has been sent to <strong>{project.organization}</strong>.
              </p>
            </div>

            {/* Summary card */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                <span className="text-[#64748B]">Project:</span>
                <strong className="text-[#14334A]">{project.title}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                <span className="text-[#64748B]">Highlighted Skills:</span>
                <span className="font-semibold text-[#183047]">{submittedData.selectedSkills.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Status:</span>
                <span className="font-bold text-[#836527] bg-[#FAF3E5] px-2 py-0.5 rounded-full border border-[#EDD7AE]">
                  Under Review by Coordinator
                </span>
              </div>
            </div>

            {/* Post-submit Guidance */}
            <p className="text-xs text-[#64748B] leading-relaxed">
              You can now discuss preliminary questions directly with the organization coordinator through the project conversation thread.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  onClose();
                  onOpenConversation(submittedData);
                }}
                leftIcon={<MessageSquare size={16} />}
                className="justify-center py-3 shadow-md"
              >
                Go to Conversation Thread
              </Button>

              <Button
                variant="outline-subtle"
                size="md"
                fullWidth
                onClick={onClose}
                className="justify-center"
              >
                Return to Project Feed
              </Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}
