import React, { useState } from 'react';
import { ArrowRight, Clock, Users, MapPin, Tag, Sparkles, AlertCircle, Eye, Compass } from '../ui/icons';
import { Project } from '../../types';
import { SAMPLE_PROJECTS } from '../../data/projects';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SkillTag from '../ui/SkillTag';
import Button from '../ui/Button';

interface ExploreProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onViewFeed?: () => void;
}

export default function ExploreProjectsSection({
  onSelectProject,
  onViewFeed,
}: ExploreProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Digital Literacy',
    'STEM & Coding',
    'Resource Access',
    'Learning Tools',
    'Mentorship',
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? SAMPLE_PROJECTS
      : SAMPLE_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="explore-projects"
      className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#E5E7EB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl text-left">
            <Badge variant="taupe" size="md" className="mb-3">
              Project Experience Preview
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14334A] tracking-tight">
              Explore Community Opportunities
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#64748B] leading-relaxed">
              Browse illustrative community challenges submitted by non-profit coordinators seeking motivated university student teams.
            </p>
          </div>

          {/* Quick Action to open full Shared Project Feed */}
          {onViewFeed && (
            <Button
              variant="primary"
              size="md"
              onClick={onViewFeed}
              rightIcon={<ArrowRight size={15} />}
              className="shrink-0 shadow-sm"
            >
              Open Shared Project Feed
            </Button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-[#14334A] text-white border-[#14334A] shadow-xs'
                    : 'bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#C8B294] hover:text-[#14334A]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Project Feed: High quality card list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(20,51,74,0.04)] hover:shadow-[0_12px_32px_rgba(20,51,74,0.09)] hover:border-[#C8B294]/70 transition-all duration-300 text-left"
            >
              {/* Card Image */}
              <div
                onClick={() => onSelectProject(project)}
                className="relative h-48 w-full overflow-hidden bg-[#FAF9F6] cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                {/* Category Pill on top left */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 backdrop-blur-xs text-[#14334A] font-semibold text-[11px] px-2.5 py-1 rounded-md shadow-xs border border-white/40">
                    {project.category}
                  </span>
                </div>

                {/* Organization Label on bottom left */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <span className="text-[11px] font-medium tracking-wide uppercase text-[#EDD7AE] block mb-0.5">
                    {project.organization}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3
                    onClick={() => onSelectProject(project)}
                    className="text-lg font-bold text-[#14334A] group-hover:text-[#1E4663] transition-colors leading-snug line-clamp-2 mb-2.5 cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mb-5 pb-4 border-b border-[#F1F5F9]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#70A1A8]" />
                      {project.duration}
                    </span>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#70A1A8]" />
                      {project.teamSize}
                    </span>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#70A1A8]" />
                      {project.workMode}
                    </span>
                  </div>

                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.skills.map((skill) => (
                      <SkillTag key={skill} label={skill} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <Button
                  variant="outline-subtle"
                  size="md"
                  fullWidth
                  onClick={() => onSelectProject(project)}
                  leftIcon={<Eye className="w-4 h-4 text-[#70A1A8]" />}
                  className="group-hover:bg-[#14334A] group-hover:text-white group-hover:border-[#14334A] transition-all"
                >
                  View Project Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Feed */}
        <div className="mt-12 text-center flex flex-col items-center justify-center gap-3">
          {onViewFeed && (
            <Button
              variant="sand"
              size="lg"
              onClick={onViewFeed}
              rightIcon={<ArrowRight size={16} />}
              className="shadow-sm"
            >
              Explore Full Instagram-Style Feed & Apply
            </Button>
          )}

          <p className="text-xs text-[#64748B] max-w-xl text-center">
            All briefs shown reflect actual community problem archetypes in digital literacy and educational equity.
          </p>
        </div>

      </div>
    </section>
  );
}
