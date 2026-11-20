import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

const defaultProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const Menu = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export const X = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const ArrowRight = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const ArrowUpRight = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export const ShieldCheck = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const Sparkles = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export const User = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Building2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);

export const Users = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const Users2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M14 19a6 6 0 0 0-12 0" />
    <circle cx="8" cy="9" r="4" />
    <path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8" />
  </svg>
);

export const BookOpen = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const CheckCircle2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const CheckCircle = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const Check = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const ClipboardList = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

export const Compass = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const Layers = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </svg>
);

export const Clock = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const MapPin = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const Tag = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
);

export const AlertCircle = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

export const AlertTriangle = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

export const Eye = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOff = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.35a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 2.899-4.225" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export const GraduationCap = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </svg>
);

export const Award = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export const FolderKanban = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M8 10v4" />
    <path d="M12 10v2" />
    <path d="M16 10v6" />
  </svg>
);

export const HeartHandshake = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
    <path d="m18 15-2-2" />
    <path d="m15 18-2-2" />
  </svg>
);

export const Lightbulb = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export const Lock = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const FileCheck = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

export const FileText = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

export const Mail = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const ArrowLeft = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export const RefreshCw = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

export const School = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
    <path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10" />
    <path d="M18 5v17" />
    <path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6l-8 4Z" />
    <path d="M6 5v17" />
  </svg>
);

export const Briefcase = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
  </svg>
);

export const KeyRound = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
);

export const Info = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export const GoogleIcon = ({ size = 20, className = '' }: { size?: number | string; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96Z"
    />
  </svg>
);

export const Bookmark = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

export const BookmarkFilled = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} fill="currentColor" className={className} {...props}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

export const Search = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const SlidersHorizontal = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <line x1="21" x2="14" y1="4" y2="4" />
    <line x1="10" x2="3" y1="4" y2="4" />
    <line x1="21" x2="12" y1="12" y2="12" />
    <line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="20" y2="20" />
    <line x1="12" x2="3" y1="20" y2="20" />
    <line x1="14" x2="14" y1="2" y2="6" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="16" x2="16" y1="18" y2="22" />
  </svg>
);

export const Filter = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const Plus = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const MessageSquare = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const Share2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);

export const ExternalLink = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

export const ThumbsDown = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
);

export const Undo2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
  </svg>
);

export const Send = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const RotateCcw = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const ChevronUp = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const ChevronDown = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ChevronLeft = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRight = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const Edit = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const Trash2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export const Upload = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

export const ImageIcon = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const Globe = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const Phone = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const PhoneOff = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export const Video = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

export const VideoOff = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m2 2 20 20" />
    <path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l3.42-2.28a1 1 0 0 1 1.58.83v7.9" />
    <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
  </svg>
);

export const Mic = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

export const MicOff = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <line x1="2" x2="22" y1="2" y2="22" />
    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
    <path d="M5 10v2a7 7 0 0 0 12 5" />
    <line x1="12" x2="12" y1="19" y2="22" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.68-1.33" />
  </svg>
);

export const Volume2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const VolumeX = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" x2="16" y1="9" y2="15" />
    <line x1="16" x2="22" y1="9" y2="15" />
  </svg>
);

export const Monitor = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

export const Paperclip = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l7.9-7.9" />
  </svg>
);

export const MoreVertical = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export const Download = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

export const File = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

export const Reply = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="9 17 4 12 9 7" />
    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
);

export const Flag = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" x2="4" y1="22" y2="15" />
  </svg>
);

export const Ban = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
  </svg>
);

export const Maximize2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" x2="14" y1="3" y2="10" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </svg>
);

export const Minimize2 = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" x2="21" y1="10" y2="3" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </svg>
);

export const Bot = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export const HelpCircle = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

export const Calendar = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export const CheckSquare = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const Activity = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const TrendingUp = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export const Folder = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
);

export const UserCheck = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

export const PlusCircle = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="16" />
    <line x1="8" x2="16" y1="12" y2="12" />
  </svg>
);

export const Bell = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const Settings = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Shield = ({ size, className = '', ...props }: IconProps) => (
  <svg {...defaultProps} width={size || 24} height={size || 24} className={className} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);
