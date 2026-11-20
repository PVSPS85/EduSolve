import React from 'react';
import { ArrowRight } from '../ui/icons';
import Button from '../ui/Button';

interface HeroSectionProps {
  onJoinStudent: () => void;
  onRegisterNgo: () => void;
}

export default function HeroSection({
  onJoinStudent,
  onRegisterNgo,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-[#FAF9F6] flex items-center"
    >
      {/* Subtle organic background glow in Warm Sand and Muted Teal */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#EDD7AE]/25 via-[#70A1A8]/10 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#14334A] leading-[1.12] tracking-tight">
              Turn Your Skills Into Real-World Impact
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-lg sm:text-xl text-[#64748B] leading-relaxed max-w-2xl font-normal">
              Connect with verified community organizations, collaborate with student volunteers, and build solutions that make a difference.
            </p>

            {/* Dual Calls to Action */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={onJoinStudent}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="justify-center"
              >
                Join as a Student
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onRegisterNgo}
                className="justify-center"
              >
                Register an NGO
              </Button>
            </div>

          </div>

          {/* Right Column: Visually strong authentic education/community collaboration image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative warm backdrop frame */}
              <div className="absolute -inset-2.5 bg-gradient-to-tr from-[#EDD7AE]/40 via-[#C8B294]/30 to-[#70A1A8]/30 rounded-3xl -rotate-1 transform" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_16px_40px_rgba(20,51,74,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBsYXB0b3AlMjBjb2xsYWJvcmF0aW5nJTIwdGVhbXdvcmslMjBsaWJyYXJ5JTIwd29ya3Nob3B8ZW58MXx8fHwxNzkxODk2MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Student volunteers collaborating together over laptop and community curriculum"
                  className="w-full h-[400px] sm:h-[460px] object-cover object-center"
                  loading="eager"
                />

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
