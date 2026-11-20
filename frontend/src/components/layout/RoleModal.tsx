import React, { useState } from 'react';
import { User, Building2, Check, ArrowRight, ShieldCheck, Mail, Sparkles, ArrowUpRight } from '../ui/icons';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { AuthScreen } from '../../types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'student' | 'ngo' | 'sign-in' | null;
  onNavigateScreen?: (screen: AuthScreen) => void;
  onExploreProjects?: () => void;
}

export default function RoleModal({
  isOpen,
  onClose,
  initialRole,
  onNavigateScreen,
  onExploreProjects,
}: RoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'ngo'>(
    initialRole === 'ngo' ? 'ngo' : 'student'
  );
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sync with initialRole when modal opens
  React.useEffect(() => {
    if (initialRole === 'ngo') {
      setSelectedRole('ngo');
    } else if (initialRole === 'student') {
      setSelectedRole('student');
    }
    setSubmitted(false);
    setEmail('');
  }, [initialRole, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const isSignIn = initialRole === 'sign-in';

  const handleGoToAuth = (screen: AuthScreen) => {
    onClose();
    if (onNavigateScreen) {
      onNavigateScreen(screen);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isSignIn
          ? 'Platform Sign In & Account Access'
          : 'Choose Your Participation Track'
      }
      description={
        isSignIn
          ? 'Select whether you are accessing the Student Volunteer portal or the Verified NGO Partner portal.'
          : 'EduSolve provides dedicated experiences designed for student teams and community non-profits.'
      }
      maxWidth="lg"
    >
      <div>
        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('student');
              setSubmitted(false);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-[#14334A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#14334A]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>I am a Student</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('ngo');
              setSubmitted(false);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              selectedRole === 'ngo'
                ? 'bg-[#14334A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#14334A]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>I represent an NGO</span>
          </button>
        </div>

        {/* Dynamic Role Overview Card */}
        {selectedRole === 'student' ? (
          <div className="bg-[#EBF4F5]/60 border border-[#70A1A8]/30 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E4663]">
                Student Volunteer Track
              </span>
              <Badge variant="teal" size="sm">Open for University Students</Badge>
            </div>
            <p className="text-sm text-[#183047] font-medium leading-relaxed mb-3">
              Join high-impact project teams in digital literacy, STEM tutoring, and educational access.
            </p>
            <ul className="space-y-1.5 text-xs text-[#64748B] mb-5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#70A1A8]" />
                Flexible 4-6 week commitment matched to your schedule
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#70A1A8]" />
                Interdisciplinary teams with mentorship from non-profit leaders
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#70A1A8]" />
                Documented project artifacts for your professional portfolio
              </li>
            </ul>

            {/* Direct Action Buttons to Phase 2 Auth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#70A1A8]/20">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => handleGoToAuth('student-register')}
                rightIcon={<ArrowRight size={14} />}
                className="justify-center text-xs"
              >
                Create Student Account
              </Button>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => handleGoToAuth('student-login')}
                className="justify-center text-xs"
              >
                Student Sign In
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAF3E5]/70 border border-[#EDD7AE] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#836527]">
                Community Organization Track
              </span>
              <Badge variant="sand" size="sm">For Verified 501(c)(3) & NGOs</Badge>
            </div>
            <p className="text-sm text-[#183047] font-medium leading-relaxed mb-3">
              Submit your educational or digital literacy challenge and get matched with qualified student squads.
            </p>
            <ul className="space-y-1.5 text-xs text-[#64748B] mb-5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#836527]" />
                Zero financial cost to participating community organizations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#836527]" />
                Assistance from EduSolve advisors in scoping realistic briefs
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#836527]" />
                Controlled project workspaces with student privacy safeguards
              </li>
            </ul>

            {/* Direct Action Buttons to Phase 2 Auth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#EDD7AE]">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => handleGoToAuth('ngo-register')}
                rightIcon={<ArrowRight size={14} />}
                className="justify-center text-xs bg-[#14334A]"
              >
                Register Organization
              </Button>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => handleGoToAuth('ngo-login')}
                className="justify-center text-xs"
              >
                Partner Sign In
              </Button>
            </div>
          </div>
        )}

        {/* Quick Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#64748B]">
            Want to explore available community briefs first?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreProjects?.();
              }}
              className="text-[#14334A] font-semibold underline cursor-pointer"
            >
              Browse Explore Projects
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
