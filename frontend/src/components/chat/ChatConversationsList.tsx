import React, { useState } from 'react';
import { Conversation } from '../../types';
import {
  Search,
  Users,
  User,
  Building2,
  CheckCircle2,
  X,
  Compass,
  ArrowLeft,
} from '../icons';

export interface ChatConversationsListProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
  userRole: 'student' | 'ngo';
  onToggleRole: () => void;
  onNavigateFeed: () => void;
}

export default function ChatConversationsList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  userRole,
  onToggleRole,
  onNavigateFeed,
}: ChatConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group' | 'unread'>('all');

  const isStudent = userRole === 'student';

  const filteredConversations = conversations.filter((c) => {
    // Filter by tab
    if (activeTab === 'direct' && c.isGroup) return false;
    if (activeTab === 'group' && !c.isGroup) return false;
    if (activeTab === 'unread' && c.unreadCount === 0) return false;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = c.title.toLowerCase().includes(q);
      const matchesProject = c.projectTitle?.toLowerCase().includes(q);
      const matchesLastMsg = c.lastMessage.toLowerCase().includes(q);
      return matchesTitle || matchesProject || matchesLastMsg;
    }

    return true;
  });

  return (
    <div className="w-full sm:w-80 md:w-88 lg:w-96 bg-white border-r border-[#E5E7EB] flex flex-col h-full text-left shrink-0">
      
      {/* 1. Header with EduSolve Brand & Return to Projects */}
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-[#FAF9F6] space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateFeed}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            aria-label="Back to Project Feed"
          >
            <div className="w-8 h-8 rounded-xl bg-[#14334A] flex items-center justify-center text-white shadow-2xs group-hover:bg-[#1E4663] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="7" cy="8" r="3.5" fill="#EDD7AE" />
                <circle cx="17" cy="16" r="3.5" fill="#70A1A8" />
                <path d="M9.5 9.5L14.5 14.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base text-[#14334A] block leading-tight">
                EduSolve
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block -mt-0.5">
                Messaging Workspace
              </span>
            </div>
          </button>

          {/* Quick Perspective Switcher */}
          <button
            onClick={onToggleRole}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#70A1A8] text-[#14334A] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Toggle between Student and NGO perspective"
          >
            {isStudent ? <User size={12} className="text-[#70A1A8]" /> : <Building2 size={12} className="text-[#836527]" />}
            <span>{isStudent ? 'Student' : 'NGO'}</span>
          </button>
        </div>

        {/* Search Conversations Input */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search conversations & projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl pl-9 pr-8 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#14334A] p-0.5 rounded cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'direct', label: 'Direct' },
            { id: 'group', label: 'Project Teams' },
            { id: 'unread', label: 'Unread' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#14334A] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#14334A] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedConversationId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-4 flex items-start gap-3.5 text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#EBF4F5]/60 border-l-4 border-[#70A1A8]'
                    : 'hover:bg-[#FAF9F6] border-l-4 border-transparent'
                }`}
              >
                {/* Avatar with Group indicator & Online status */}
                <div className="relative shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.title}
                    className="w-12 h-12 rounded-2xl object-cover border border-[#E5E7EB] shadow-2xs"
                  />

                  {conv.isGroup && (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#14334A] text-white flex items-center justify-center border-2 border-white shadow-xs"
                      title="Project Team Chat"
                    >
                      <Users size={9} className="text-[#EDD7AE]" />
                    </span>
                  )}

                  {!conv.isGroup && conv.isOnline && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#16A34A] border-2 border-white"
                      title="Active now"
                    />
                  )}
                </div>

                {/* Info & Snippet */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4
                      className={`text-xs sm:text-sm truncate leading-tight ${
                        isSelected ? 'font-extrabold text-[#14334A]' : 'font-bold text-[#183047]'
                      }`}
                    >
                      {conv.title}
                    </h4>
                    <span className="text-[10px] text-[#94A3B8] shrink-0 font-medium">
                      {conv.timestamp}
                    </span>
                  </div>

                  {/* Project Context Chip */}
                  {conv.projectTitle && (
                    <span className="text-[10px] font-semibold text-[#70A1A8] block truncate mb-1">
                      {conv.projectTitle}
                    </span>
                  )}

                  {/* Last message preview */}
                  <p
                    className={`text-xs truncate leading-normal ${
                      conv.unreadCount > 0 ? 'font-semibold text-[#14334A]' : 'text-[#64748B]'
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Unread badge */}
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#14334A] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-[#94A3B8] space-y-2">
            <p>No conversations found.</p>
          </div>
        )}
      </div>

      {/* 3. Footer Back to Project Feed */}
      <div className="p-3 bg-[#FAF9F6] border-t border-[#E5E7EB] text-center">
        <button
          onClick={onNavigateFeed}
          className="text-xs font-semibold text-[#14334A] hover:text-[#70A1A8] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Return to Shared Project Feed</span>
        </button>
      </div>

    </div>
  );
}
