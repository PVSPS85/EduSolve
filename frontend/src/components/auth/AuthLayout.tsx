import React from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, GraduationCap, Building2, Sparkles } from '../icons';

export interface AuthLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'ngo';
  title: string;
  subtitle: string;
  onNavigateHome: () => void;
  onSwitchRole?: () => void;
  switchRoleLabel?: string;
}

export default function AuthLayout({
  children,
  role,
  title,
  subtitle,
  onNavigateHome,
  onSwitchRole,
  switchRoleLabel,
}: AuthLayoutProps) {
  const isStudent = role === 'student';

  const studentHighlights = [
    {
      title: 'Real-world civic problem solving',
      desc: 'Collaborate with verified local non-profits on digital literacy and education initiatives.',
    },
    {
      title: 'Interdisciplinary student squads',
      desc: 'Team up with peers across software, UI/UX, pedagogy, and community organizing.',
    },
    {
      title: 'Documented portfolio credits',
      desc: 'Receive formal verification of your community deliverables and project hours.',
    },
  ];

  const ngoHighlights = [
    {
      title: 'Vetted student talent & energy',
      desc: 'Connect with motivated university students ready to build educational toolkits and digital curricula.',
    },
    {
      title: 'Structured, manageable briefs',
      desc: 'EduSolve assists in scoping your community needs into clear 4 to 6-week deliverables.',
    },
    {
      title: 'Zero cost to community partners',
      desc: 'All student collaboration is provided free to verified non-profit organizations.',
    },
  ];

  const highlights = isStudent ? studentHighlights : ngoHighlights;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#183047] flex flex-col justify-between selection:bg-[#EDD7AE] selection:text-[#14334A]">
      {/* Top Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Back */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#14334A] py-1.5 px-2.5 rounded-lg hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
              aria-label="Back to Homepage"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            <div className="h-4 w-px bg-[#E5E7EB] hidden sm:block" />

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#14334A] flex items-center justify-center shadow-xs group-hover:bg-[#1E4663] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="7" cy="8" r="3.5" fill="#EDD7AE" />
                  <circle cx="17" cy="16" r="3.5" fill="#70A1A8" />
                  <path d="M9.5 9.5L14.5 14.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[#14334A]">
                  EduSolve
                </span>
                <span className="text-[9px] font-semibold text-[#64748B] tracking-wider uppercase -mt-0.5">
                  {isStudent ? 'Student Portal' : 'Community Partner Portal'}
                </span>
              </div>
            </button>
          </div>

          {/* Role Switcher Pill */}
          {onSwitchRole && switchRoleLabel && (
            <button
              onClick={onSwitchRole}
              className="text-xs font-semibold text-[#14334A] bg-[#FAF9F6] hover:bg-[#EBF4F5] border border-[#E5E7EB] hover:border-[#70A1A8] py-2 px-3 sm:px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
            >
              {isStudent ? (
                <Building2 size={14} className="text-[#836527]" />
              ) : (
                <GraduationCap size={14} className="text-[#70A1A8]" />
              )}
              <span>{switchRoleLabel}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-5xl">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-[0_8px_30px_rgba(20,51,74,0.04)]">
              {/* Header inside card */}
              <div className="mb-6 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
                  isStudent
                    ? 'bg-[#EBF4F5] text-[#1E4663] border-[#70A1A8]/40'
                    : 'bg-[#FAF3E5] text-[#836527] border-[#EDD7AE]'
                }">
                  {isStudent ? (
                    <>
                      <GraduationCap size={13} className="text-[#70A1A8]" />
                      <span>Student Volunteers</span>
                    </>
                  ) : (
                    <>
                      <Building2 size={13} className="text-[#836527]" />
                      <span>Verified NGO Partner</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14334A] tracking-tight">
                  {title}
                </h1>
                <p className="mt-1.5 text-sm text-[#64748B] leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Form Content */}
              {children}
            </div>
          </div>

          {/* Right Visual / Illustration & Value Pillar Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full border relative overflow-hidden ${
                isStudent
                  ? 'bg-gradient-to-br from-[#14334A] to-[#1E4663] text-white border-[#14334A]'
                  : 'bg-gradient-to-br from-[#14334A] via-[#1A3D58] to-[#254F6F] text-white border-[#14334A]'
              }`}
            >
              {/* Subtle background ambient blur */}
              <div
                className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30 ${
                  isStudent ? 'bg-[#70A1A8]' : 'bg-[#EDD7AE]'
                }`}
                aria-hidden="true"
              />

              <div>
                {/* Illustration Banner */}
                <div className="relative mb-6 rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black/20">
                  <img
                    src={
                      isStudent
                        ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBsYXB0b3AlMjBjb2xsYWJvcmF0aW5nJTIwdGVhbXdvcmslMjBsaWJyYXJ5JTIwd29ya3Nob3B8ZW58MXx8fHwxNzkxODk2MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080'
                        : 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHZvbHVudGVlcmluZyUyMHRlYWNoaW5nJTIwY29tbXVuaXR5JTIwZWR1Y2F0aW9uJTIwZGlnaXRhbCUyMGxpdGVyYWN5fGVufDF8fHx8MTc5MTg5NjIyOXww&ixlib=rb-4.1.0&q=80&w=1080'
                    }
                    alt={isStudent ? 'Students collaborating on laptops' : 'Community workshop collaboration'}
                    className="w-full h-44 object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14334A] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#EDD7AE] font-semibold">
                    <span>{isStudent ? 'Academic Civic Action' : 'Community Capacity Building'}</span>
                    <span className="flex items-center gap-1 text-[11px] text-white/80">
                      <Sparkles size={12} className="text-[#EDD7AE]" />
                      Verified Impact
                    </span>
                  </div>
                </div>

                {/* Narrative Quote / Headline */}
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {isStudent
                    ? 'Put classroom theory to work where your community needs it most.'
                    : 'Transform operational challenges into structured student initiatives.'}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed mb-6 font-normal">
                  {isStudent
                    ? 'Join interdisciplinary collegiate squads working alongside grassroots directors to solve real problems in education and digital literacy.'
                    : 'Connect with supervised undergraduate and graduate teams to produce usable digital curricula, toolkits, and workshop materials.'}
                </p>

                {/* 3 Core Value Points */}
                <div className="space-y-3.5 mb-6">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-left">
                      <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={13} className={isStudent ? 'text-[#70A1A8]' : 'text-[#EDD7AE]'} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white/95">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-white/60 mt-0.5 leading-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Verification / Trust Shield */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-white/70">
                <ShieldCheck size={18} className="text-[#EDD7AE] shrink-0" />
                <span className="text-[11px] leading-tight">
                  {isStudent
                    ? 'Student safety protocols & protected university communications.'
                    : 'Multi-point documentation review before project workspace access.'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-6 text-center text-xs text-[#64748B] border-t border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} EduSolve. Authentication & Account Access.</span>
          <span className="text-[11px] text-[#94A3B8]">
            Organization verification indicates review of submitted documents and does not constitute government endorsement.
          </span>
        </div>
      </footer>
    </div>
  );
}
