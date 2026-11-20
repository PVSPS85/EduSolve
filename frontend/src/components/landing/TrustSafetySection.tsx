import React from 'react';
import { ShieldCheck, Lock, EyeOff, AlertTriangle, CheckCircle, FileCheck } from '../ui/icons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function TrustSafetySection() {
  const trustPillars = [
    {
      icon: FileCheck,
      title: 'Organization Verification',
      description:
        'EduSolve conducts multi-point documentation reviews for all participating non-profits—including tax status checks, registered organizational identity, and community references before project publication.',
      detail: 'Mandatory documentation check before project briefs go live.',
    },
    {
      icon: Lock,
      title: 'Controlled Access Workspaces',
      description:
        'Student squads collaborate inside sandboxed project environments with role-based permission boundaries. Access is restricted exclusively to approved team members and vetted organizational mentors.',
      detail: 'Protected digital environments without unauthorized public exposure.',
    },
    {
      icon: EyeOff,
      title: 'Privacy-Conscious Communication',
      description:
        'Personal contact information (personal mobile numbers, physical addresses) remains protected. All student-NGO correspondence is conducted through privacy-conscious platform messaging channels.',
      detail: 'Safeguards designed in alignment with university privacy norms.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="taupe" size="md" className="mb-3">
            Integrity & Responsible Governance
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14334A] tracking-tight">
            Trust & Safety at Every Step
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Building ethical, secure environments where students and community leaders can focus entirely on delivering tangible community outcomes.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={idx}
                padding="lg"
                className="bg-white flex flex-col justify-between border border-[#E5E7EB] hover:border-[#70A1A8] transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EBF4F5] border border-[#70A1A8]/30 flex items-center justify-center text-[#14334A] mb-6">
                    <Icon className="w-6 h-6 text-[#14334A]" />
                  </div>

                  <h3 className="text-xl font-bold text-[#14334A] mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 text-xs font-semibold text-[#70A1A8]">
                  <CheckCircle className="w-4 h-4 shrink-0 text-[#70A1A8]" />
                  <span>{pillar.detail}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Responsible Disclaimer Box (Strict Prompt Compliance) */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] border border-[#EDD7AE] flex items-center justify-center text-[#836527] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#836527]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14334A] uppercase tracking-wide">
                Verification Scope & Platform Standards
              </h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                EduSolve independently reviews submitted non-profit documentation, mission alignment, and community references. EduSolve is an independent civic technology platform and does not claim official government endorsement or guarantee the legal status or continuous performance of any participating independent entity. All participants agree to our community standards and privacy protocols.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
