import React from 'react';
import { ArrowRight, Sparkles, User, Building2 } from '../ui/icons';
import Button from '../ui/Button';

interface FinalCtaSectionProps {
  onJoinStudent: () => void;
  onRegisterNgo: () => void;
}

export default function FinalCtaSection({
  onJoinStudent,
  onRegisterNgo,
}: FinalCtaSectionProps) {
  return (
    <section className="py-20 md:py-28 bg-[#14334A] text-white relative overflow-hidden">
      {/* Subtle background decorative shapes in Muted Teal & Warm Sand */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#70A1A8]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#EDD7AE]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#EDD7AE] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Your Community Partnership</span>
        </div>

        {/* Headline strictly matching prompt */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
          Your Skills Can Make a Difference.
        </h2>

        {/* Supporting description */}
        <p className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          Whether you are an ambitious student eager to apply your learning to real civic problems, or an NGO coordinator with community challenges to solve, EduSolve brings both worlds together.
        </p>

        {/* Dual action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="sand"
            size="lg"
            onClick={onJoinStudent}
            leftIcon={<User className="w-4 h-4 mr-1 text-[#14334A]" />}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1 text-[#14334A]" />}
            className="w-full sm:w-auto justify-center"
          >
            Join as a Student
          </Button>

          <button
            onClick={onRegisterNgo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base px-6 py-3.5 font-semibold rounded-xl text-white border-2 border-white/80 hover:bg-white/10 active:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Register an NGO</span>
          </button>
        </div>

        {/* Micro note below buttons */}
        <div className="mt-8 text-xs text-white/60">
          Phase 1 Public Foundation · Open to universities, students, and community non-profits
        </div>

      </div>
    </section>
  );
}
