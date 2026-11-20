import React, { useState } from 'react';
import {
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldCheck,
  Check,
  Tag,
  AlertCircle,
} from '../ui/icons';
import { Project } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SkillTag from '../ui/SkillTag';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onExpressInterest?: (project: Project) => void;
}

export default function ProjectDetailModal({
  isOpen,
  onClose,
  project,
  onExpressInterest,
}: ProjectDetailModalProps) {
  const [interestExpressed, setInterestExpressed] = useState(false);

  React.useEffect(() => {
    setInterestExpressed(false);
  }, [project, isOpen]);

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
    >
      <div className="-mt-2">
        
        {/* Header Media */}
        <div className="relative h-56 -mx-6 -mt-4 mb-6 overflow-hidden bg-[#FAF9F6]">
          <img
            src={project.image}
            alt={project.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14334A]/80 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/95 text-[#14334A] text-xs font-semibold px-3 py-1 rounded-md shadow-xs">
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs uppercase font-bold tracking-wider text-[#EDD7AE] block">
              {project.organization}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Illustrative Notice Pill */}
        <div className="mb-6 p-3 rounded-xl bg-[#FAF3E5] border border-[#EDD7AE] flex items-center gap-2.5 text-xs text-[#836527]">
          <AlertCircle className="w-4 h-4 text-[#836527] shrink-0" />
          <span>
            <strong>Illustrative Example:</strong> Demonstrates real project scoping parameters. Registration opens with Phase 2 verified partners.
          </span>
        </div>

        {/* Quick Specs Bar */}
        <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl text-center mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">
              Duration
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#14334A]">
              {project.duration}
            </span>
          </div>
          <div className="border-x border-[#E5E7EB]">
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">
              Team Size
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#14334A]">
              {project.teamSize}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">
              Location
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#14334A] truncate block px-1">
              {project.location}
            </span>
          </div>
        </div>

        {/* Long Description / Problem Context */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-2">
            Community Context & Problem Brief
          </h4>
          <p className="text-sm text-[#64748B] leading-relaxed">
            {project.longDescription || project.description}
          </p>
        </div>

        {/* Deliverables */}
        {project.deliverables && project.deliverables.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-3">
              Core Deliverables Expected
            </h4>
            <div className="space-y-2">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#183047]">
                  <CheckCircle2 className="w-4 h-4 text-[#70A1A8] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Outcomes */}
        {project.learningOutcomes && project.learningOutcomes.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-3">
              Student Learning & Experience Outcomes
            </h4>
            <div className="space-y-2">
              {project.learningOutcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#64748B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDD7AE] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Skills */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-2.5">
            Target Skill Profile
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <SkillTag key={skill} label={skill} size="md" />
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-5 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline-subtle"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close Preview
          </Button>

          {!interestExpressed ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setInterestExpressed(true);
                if (onExpressInterest) onExpressInterest(project);
              }}
              className="w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Express Interest in This Brief
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-[#4F7C82] bg-[#EBF4F5] px-4 py-2.5 rounded-xl border border-[#70A1A8]/30">
              <Check className="w-4 h-4" />
              <span>Interest Saved for Pilot Onboarding</span>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}
