import React from 'react';
import { Search, SlidersHorizontal, X, BookmarkFilled, RotateCcw, Check } from '../icons';

export interface FeedFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedSkill: string;
  selectedWorkMode: string;
  selectedDuration: string;
  sortBy: 'newest' | 'duration-asc';
  showSavedOnly: boolean;
  showVerifiedOnly: boolean;
}

export interface FeedFiltersProps {
  filters: FeedFilterState;
  onFilterChange: (newFilters: Partial<FeedFilterState>) => void;
  onResetFilters: () => void;
  availableSkills: string[];
  totalResults: number;
}

export default function FeedFilters({
  filters,
  onFilterChange,
  onResetFilters,
  availableSkills,
  totalResults,
}: FeedFiltersProps) {
  const categories = [
    'All',
    'Digital Literacy',
    'STEM & Coding',
    'Resource Access',
    'Learning Tools',
    'Mentorship',
  ];

  const workModes = ['All', 'Remote', 'Hybrid', 'In-Person'];

  const durations = [
    { value: 'all', label: 'All Durations' },
    { value: '1-4', label: '1 - 4 Weeks' },
    { value: '5-8', label: '5 - 8 Weeks' },
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedCategory !== 'All' ||
    filters.selectedSkill !== 'All' ||
    filters.selectedWorkMode !== 'All' ||
    filters.selectedDuration !== 'all' ||
    filters.showSavedOnly ||
    !filters.showVerifiedOnly;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(20,51,74,0.04)] space-y-4 text-left">
      {/* Top Search Input */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search by title, skill, or organization..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl pl-10 pr-9 py-2.5 border border-[#E5E7EB] focus:border-[#70A1A8] focus:ring-2 focus:ring-[#70A1A8]/20 outline-none transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#14334A] p-0.5 rounded cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#14334A] block mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = filters.selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ selectedCategory: cat })}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#14334A] text-white border-[#14334A] shadow-2xs'
                    : 'bg-[#FAF9F6] text-[#64748B] border-[#E5E7EB] hover:border-[#C8B294] hover:text-[#14334A]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Skill & Duration & Work Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-1 border-t border-[#F1F5F9]">
        {/* Skill Dropdown */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#14334A] block mb-1.5">
            Required Skill
          </label>
          <select
            value={filters.selectedSkill}
            onChange={(e) => onFilterChange({ selectedSkill: e.target.value })}
            className="w-full bg-[#FAF9F6] text-xs text-[#183047] rounded-xl px-3 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none cursor-pointer"
          >
            <option value="All">All Required Skills</option>
            {availableSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#14334A] block mb-1.5">
            Work Mode
          </label>
          <div className="grid grid-cols-4 gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#E5E7EB]">
            {workModes.map((mode) => {
              const isSelected = filters.selectedWorkMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => onFilterChange({ selectedWorkMode: mode })}
                  className={`text-[11px] py-1 text-center rounded-lg font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#14334A] font-bold shadow-2xs border border-[#E5E7EB]'
                      : 'text-[#64748B] hover:text-[#14334A]'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#14334A] block mb-1.5">
            Project Duration
          </label>
          <select
            value={filters.selectedDuration}
            onChange={(e) => onFilterChange({ selectedDuration: e.target.value })}
            className="w-full bg-[#FAF9F6] text-xs text-[#183047] rounded-xl px-3 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none cursor-pointer"
          >
            {durations.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Listing toggles & Results Summary */}
      <div className="pt-3 border-t border-[#F1F5F9] space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#183047] font-semibold">
            <input
              type="checkbox"
              checked={filters.showSavedOnly}
              onChange={(e) => onFilterChange({ showSavedOnly: e.target.checked })}
              className="rounded border-[#D1D5DB] text-[#14334A] focus:ring-[#70A1A8]"
            />
            <span className="flex items-center gap-1.5">
              <BookmarkFilled size={13} className="text-[#836527]" />
              Show Saved Only
            </span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] text-[#A57E59] hover:text-[#14334A] font-medium flex items-center gap-1 cursor-pointer hover:underline"
            >
              <RotateCcw size={12} />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#183047] font-semibold">
          <input
            type="checkbox"
            checked={filters.showVerifiedOnly}
            onChange={(e) => onFilterChange({ showVerifiedOnly: e.target.checked })}
            className="rounded border-[#D1D5DB] text-[#14334A] focus:ring-[#70A1A8]"
          />
          <span className="flex items-center gap-1.5">
            <Check size={13} className="text-[#70A1A8]" />
            Verified NGOs
          </span>
        </label>
      </div>

      {/* Result Counter Pill */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-[#64748B]">
        <span>Showing {totalResults} community {totalResults === 1 ? 'brief' : 'briefs'}</span>
        <span className="text-[#70A1A8] font-medium">Verified NGO listings</span>
      </div>
    </div>
  );
}
