import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail, MapPin } from '../ui/icons';

interface FooterProps {
  onOpenPolicyModal?: (policyName: string) => void;
}

export default function Footer({ onOpenPolicyModal }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-white border-t border-[#E5E7EB] pt-16 pb-12 text-sm text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E5E7EB]">
          
          {/* Brand info (2 cols wide on desktop) */}
          <div className="lg:col-span-2 flex flex-col items-start pr-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#14334A] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="7" cy="8" r="3.5" fill="#EDD7AE" />
                  <circle cx="17" cy="16" r="3.5" fill="#70A1A8" />
                  <path d="M9.5 9.5L14.5 14.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-lg text-[#14334A] tracking-tight block">
                  EduSolve
                </span>
                <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase block -mt-1">
                  Students · NGOs · Real Impact
                </span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed max-w-sm mb-5">
              EduSolve connects verified non-profit organizations with student volunteers who collaborate to solve real-world community problems in education, digital literacy, and civic opportunity.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#836527] bg-[#FAF3E5] px-3 py-1.5 rounded-lg border border-[#EDD7AE]/70">
              <ShieldCheck className="w-4 h-4 text-[#836527] shrink-0" />
              <span>Independent Civic Collaboration Platform</span>
            </div>
          </div>

          {/* Nav Column: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleLinkClick(e, '#home')}
                  className="hover:text-[#14334A] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleLinkClick(e, '#how-it-works')}
                  className="hover:text-[#14334A] transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#explore-projects"
                  onClick={(e) => handleLinkClick(e, '#explore-projects')}
                  className="hover:text-[#14334A] transition-colors"
                >
                  Explore Projects
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleLinkClick(e, '#about')}
                  className="hover:text-[#14334A] transition-colors"
                >
                  About Both Sides
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Column: Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-[#183047] font-medium">Student Volunteer Guide</span>
              </li>
              <li>
                <span className="text-[#183047] font-medium">NGO Project Scoping</span>
              </li>
              <li>
                <span className="text-[#183047] font-medium">University Partnerships</span>
              </li>
              <li>
                <span className="text-[#183047] font-medium">Digital Literacy Playbooks</span>
              </li>
            </ul>
          </div>

          {/* Nav Column: Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14334A] mb-4">
              Trust & Governance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="#privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPolicyModal) onOpenPolicyModal('Privacy Policy');
                  }}
                  className="hover:text-[#14334A] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms-of-service"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPolicyModal) onOpenPolicyModal('Terms of Service');
                  }}
                  className="hover:text-[#14334A] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#verification-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPolicyModal) onOpenPolicyModal('Verification Guidelines');
                  }}
                  className="hover:text-[#14334A] transition-colors"
                >
                  Verification Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPolicyModal) onOpenPolicyModal('Contact & Inquiries');
                  }}
                  className="hover:text-[#14334A] transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Platform Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>
            © {currentYear} EduSolve. All rights reserved. Students · NGOs · Real Impact.
          </p>

          <p className="text-center md:text-right max-w-md text-[11px] leading-normal">
            EduSolve is a community platform. Organization verification indicates review of submitted non-profit documentation and does not constitute governmental endorsement.
          </p>
        </div>

      </div>
    </footer>
  );
}
