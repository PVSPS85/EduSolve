import React from 'react';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Users2,
  FolderKanban,
  HeartHandshake,
  Lightbulb,
} from '../ui/icons';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface BothSidesSectionProps {
  onStudentAction: () => void;
  onNgoAction: () => void;
}

export default function BothSidesSection({
  onStudentAction,
  onNgoAction,
}: BothSidesSectionProps) {
  const studentBenefits = [
    {
      title: 'Real-world civic problem solving',
      desc: 'Move beyond hypothetical textbook case studies to address tangible obstacles faced by real neighborhoods.',
    },
    {
      title: 'Interdisciplinary peer collaboration',
      desc: 'Team up with peers across software development, design, communications, and education majors.',
    },
    {
      title: 'Verified portfolio-ready credentials',
      desc: 'Receive formal documentation of completed deliverables, project hours, and verified community impact.',
    },
    {
      title: 'Direct community leadership exposure',
      desc: 'Engage with experienced non-profit directors and social workers who understand local grassroots realities.',
    },
  ];

  const ngoBenefits = [
    {
      title: 'Zero cost technical & educational support',
      desc: 'Access energetic student talent without draining limited operating budgets or writing grant allocations.',
    },
    {
      title: 'Structured, manageable project scopes',
      desc: 'EduSolve assists in scoping ambiguous challenges into concrete, achievable 4 to 6-week deliverables.',
    },
    {
      title: 'Fresh perspectives & modern toolsets',
      desc: 'Leverage cutting-edge approaches in UX accessibility, browser-based coding tools, and modern curriculum standards.',
    },
    {
      title: 'Sustainable handovers with documentation',
      desc: 'Teams provide thorough training guides and materials designed for permanent staff adoption.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="navy" size="md" className="mb-3">
            Two Sides · One Common Purpose
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14334A] tracking-tight">
            Designed for Both Sides of Impact
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            EduSolve is engineered to provide equal dignity, clarity, and value to university students and grassroots community organizations.
          </p>
        </div>

        {/* Dual Balanced Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: For Students */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-10 flex flex-col justify-between shadow-[0_8px_30px_rgba(20,51,74,0.05)] hover:border-[#70A1A8] transition-all duration-300 relative overflow-hidden group">
            {/* Top decorative accent ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#14334A] to-[#70A1A8]" />

            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#EBF4F5] border border-[#70A1A8]/30 flex items-center justify-center text-[#14334A]">
                  <GraduationCap className="w-7 h-7 text-[#14334A]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#70A1A8] bg-[#EBF4F5] px-3 py-1 rounded-full border border-[#70A1A8]/30">
                  Student Volunteers
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#14334A] mb-3">
                For Students & Academic Teams
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-8">
                Discover meaningful community projects, share your developing technical or creative skills, collaborate with peers, and build a verified portfolio of genuine civic impact.
              </p>

              {/* Benefit Checklist */}
              <div className="space-y-4 mb-8">
                {studentBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EBF4F5] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7C82]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#183047]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-[#F1F5F9]">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={onStudentAction}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="justify-center"
              >
                Join as a Student
              </Button>
            </div>
          </div>

          {/* Card 2: For NGOs */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-10 flex flex-col justify-between shadow-[0_8px_30px_rgba(20,51,74,0.05)] hover:border-[#C8B294] transition-all duration-300 relative overflow-hidden group">
            {/* Top decorative accent ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EDD7AE] to-[#A57E59]" />

            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF3E5] border border-[#EDD7AE] flex items-center justify-center text-[#836527]">
                  <Building2 className="w-7 h-7 text-[#836527]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#836527] bg-[#FAF3E5] px-3 py-1 rounded-full border border-[#EDD7AE]">
                  Community Organizations
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#14334A] mb-3">
                For Verified NGOs & Non-Profits
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-8">
                Submit pressing community problems, connect with skilled and supervised student talent, and develop sustainable educational and digital resources tailored to your constituents.
              </p>

              {/* Benefit Checklist */}
              <div className="space-y-4 mb-8">
                {ngoBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FAF3E5] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#836527]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#183047]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={onNgoAction}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="justify-center"
              >
                Register an NGO
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
