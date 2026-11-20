import React from 'react';
import { ClipboardList, Compass, Layers, CheckCircle2, ArrowRight } from '../ui/icons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface HowItWorksSectionProps {
  onLearnMore?: () => void;
}

export default function HowItWorksSection({ onLearnMore }: HowItWorksSectionProps) {
  const steps = [
    {
      number: '01',
      title: 'NGOs share meaningful community problems.',
      description:
        'Verified non-profits articulate urgent challenges in digital literacy, tutoring, or community resource access into concrete, well-scoped project briefs.',
      icon: ClipboardList,
      highlight: 'Structured problem scoping',
      tagVariant: 'taupe' as const,
    },
    {
      number: '02',
      title: 'Students discover projects that match their interests and skills.',
      description:
        'Undergraduate and graduate volunteers filter open briefs by relevant disciplines—from computer science and UX design to pedagogy and community translation.',
      icon: Compass,
      highlight: 'Skill-based matching',
      tagVariant: 'teal' as const,
    },
    {
      number: '03',
      title: 'Approved teams collaborate and deliver solutions.',
      description:
        'Matched squads work directly with community coordinators over 4 to 6-week sprints, delivering usable materials, digital toolkits, or interactive workshops.',
      icon: Layers,
      highlight: 'Milestone-driven delivery',
      tagVariant: 'sand' as const,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#E5E7EB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="teal" size="md" className="mb-3">
            The Collaborative Pathway
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14334A] tracking-tight">
            How EduSolve Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            A transparent, three-stage framework connecting community missions with student capability to produce lasting local impact.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Subtle connecting line across desktop */}
          <div
            className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#EDD7AE] via-[#70A1A8] to-[#EDD7AE] -translate-y-8 -z-0 opacity-40"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card
                key={step.number}
                hoverable
                padding="lg"
                className="relative z-10 flex flex-col justify-between h-full bg-white border border-[#E5E7EB]"
              >
                <div>
                  {/* Step Header: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-[#EDD7AE] tracking-tight">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E5E7EB] flex items-center justify-center text-[#14334A] shadow-xs">
                      <IconComponent className="w-6 h-6 text-[#14334A]" />
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-xl font-bold text-[#14334A] leading-snug mb-3">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Highlight Tag */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#70A1A8] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#70A1A8]" />
                    {step.highlight}
                  </span>
                  <span className="text-xs text-[#94A3B8] font-medium">
                    Step {index + 1} of 3
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Supporting workflow summary banner */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-[#F4EFE9]/70 border border-[#C8B294]/40 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#C8B294]/50 flex items-center justify-center shrink-0 hidden sm:flex">
              <span className="text-sm font-bold text-[#836527]">✓</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#14334A]">
                Guided Project Scoping for Community Organizations
              </h4>
              <p className="text-sm text-[#64748B] mt-0.5">
                EduSolve project leads review every brief to ensure goals are realistic for university terms and community needs.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#836527] bg-[#EDD7AE]/50 px-3.5 py-1.5 rounded-full shrink-0 border border-[#836527]/20">
            Cohort Model
          </span>
        </div>

      </div>
    </section>
  );
}
