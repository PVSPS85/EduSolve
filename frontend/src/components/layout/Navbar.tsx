import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, Building2 } from '../ui/icons';
import Button from '../ui/Button';

interface NavbarProps {
  onOpenRoleModal: (role?: 'student' | 'ngo' | 'sign-in') => void;
  activePath: string;
  onNavigate: (path: '/' | '/how-it-works' | '/explore' | '/about') => void;
}

export default function Navbar({ onOpenRoleModal, activePath, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' as const },
    { label: 'How It Works', href: '/how-it-works' as const },
    { label: 'Explore Projects', href: '/explore' as const },
    { label: 'About', href: '/about' as const },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: '/' | '/how-it-works' | '/explore' | '/about',
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-xs border-b border-[#E5E7EB]'
          : 'bg-[#FAF9F6] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-20 gap-6 lg:gap-10">
          {/* Logo & Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="EduSolve Home"
          >
            {/* Custom geometric logo mark */}
            <div className="relative w-10 h-10 rounded-xl bg-[#14334A] flex items-center justify-center shadow-sm group-hover:bg-[#1E4663] transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform transition-transform duration-200 group-hover:scale-105"
              >
                {/* Node representing NGO community */}
                <circle cx="7" cy="8" r="3.5" fill="#EDD7AE" />
                {/* Node representing Student volunteer */}
                <circle cx="17" cy="16" r="3.5" fill="#70A1A8" />
                {/* Connecting arc / bridge */}
                <path
                  d="M9.5 9.5L14.5 14.5"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#14334A]">
                EduSolve
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase -mt-0.5">
                Students · NGOs · Real Impact
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = activePath === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium transition-colors duration-150 relative py-1 ${
                    isActive
                      ? 'text-[#14334A] font-semibold'
                      : 'text-[#64748B] hover:text-[#14334A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#70A1A8] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center justify-end gap-4">
            <button
              onClick={() => onOpenRoleModal('sign-in')}
              className="text-sm font-medium text-[#183047] hover:text-[#14334A] px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <Button
              variant="primary"
              size="md"
              onClick={() => onOpenRoleModal()}
              rightIcon={<ArrowRight className="w-4 h-4 ml-0.5" />}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center justify-end gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#14334A] hover:bg-[#FAF3E5] rounded-xl transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] shadow-lg px-4 pt-3 pb-6 animate-fadeIn">
          <nav className="flex flex-col gap-2 pb-4 border-b border-[#E5E7EB]" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-medium text-[#183047] hover:text-[#14334A] hover:bg-[#FAF9F6] px-3 py-2.5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRoleModal('sign-in');
              }}
              className="text-left text-base font-medium text-[#183047] hover:bg-[#FAF9F6] px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </nav>

          {/* Quick Dual Access in Mobile Menu */}
          <div className="pt-4 flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] px-1">
              Choose your path
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRoleModal('student');
                }}
                leftIcon={<User className="w-4 h-4" />}
              >
                For Students
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRoleModal('ngo');
                }}
                leftIcon={<Building2 className="w-4 h-4" />}
              >
                For NGOs
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
