import React from 'react';
import { Conversation, Project } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  FileText,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  ExternalLink,
  Download,
  X,
  User,
  Building2,
  MapPin,
  Sparkles,
  Flag,
} from '../icons';

export interface ChatContextPanelProps {
  conversation: Conversation;
  onClose: () => void;
  onOpenAiPanel: () => void;
  onSelectParticipantProfile: (participant: any) => void;
  onOpenReportModal: () => void;
}

export default function ChatContextPanel({
  conversation,
  onClose,
  onOpenAiPanel,
  onSelectParticipantProfile,
  onOpenReportModal,
}: ChatContextPanelProps) {
  // Extract all attachments across messages in this conversation
  const allAttachments = conversation.messages.flatMap((m) => m.attachments || []);

  return (
    <aside className="w-80 sm:w-96 bg-white border-l border-[#E5E7EB] flex flex-col justify-between h-full text-left shadow-xs overflow-hidden animate-fadeIn">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-[#FAF9F6] flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#14334A] leading-tight">
            Project & Team Context
          </h3>
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
            {conversation.isGroup ? 'Collaborative Sprint Space' : 'Direct Project Discussion'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-[#14334A] p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
          aria-label="Close Context Panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Context Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
        
        {/* AI Assistant Banner Shortcut */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#14334A] to-[#1E4663] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#EDD7AE]" />
            <div>
              <strong className="block text-xs">AI Fit Assistant</strong>
              <span className="text-[10px] text-white/70">Analyze skills & project expectations</span>
            </div>
          </div>
          <Button variant="sand" size="sm" onClick={onOpenAiPanel} className="text-[11px] py-1 px-2.5">
            Open AI
          </Button>
        </div>

        {/* 1. Associated Project Brief */}
        {conversation.projectTitle && (
          <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#70A1A8] block">
              Associated Problem Brief
            </span>
            <h4 className="font-bold text-sm text-[#14334A] leading-snug">
              {conversation.projectTitle}
            </h4>

            <div className="space-y-1.5 pt-1 text-[11px] text-[#64748B]">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-[#70A1A8]" />
                <span>4-Week Sprint • 4-5 hrs/week</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-[#70A1A8]" />
                <span>Hybrid (Chicago Westside Hub)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-[#16A34A]" />
                <span className="text-[#16A34A] font-medium">Zero Student Expenses Policy</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Team Participants Roster */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] flex items-center gap-1.5">
              <Users size={14} className="text-[#70A1A8]" />
              <span>Project Team Roster ({conversation.participants.length})</span>
            </h4>
          </div>

          <div className="space-y-2">
            {conversation.participants.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectParticipantProfile(p)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#70A1A8] hover:bg-[#FAF9F6] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 border border-[#E5E7EB]"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-[#14334A] block truncate text-xs group-hover:text-[#70A1A8]">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#64748B] block truncate">
                      {p.affiliation}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-[#70A1A8] bg-[#EBF4F5] px-2 py-0.5 rounded-md shrink-0">
                  View
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Shared Project Attachments Gallery */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-[#14334A] text-[11px] mb-2.5 flex items-center gap-1.5">
            <FileText size={14} className="text-[#70A1A8]" />
            <span>Shared Project Files ({allAttachments.length})</span>
          </h4>

          {allAttachments.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-[#E5E7EB] text-center text-[#94A3B8] text-[11px]">
              No documents shared in this thread yet.
            </div>
          ) : (
            <div className="space-y-2">
              {allAttachments.map((att) => (
                <div
                  key={att.id}
                  className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={16} className="text-[#70A1A8] shrink-0" />
                    <div className="min-w-0">
                      <span className="font-semibold text-[#14334A] block truncate text-xs">
                        {att.name}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">{att.size || '1.4 MB'}</span>
                    </div>
                  </div>

                  <button
                    className="p-1 text-[#64748B] hover:text-[#14334A] rounded cursor-pointer"
                    title="Download document"
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Safety & Reporting */}
        <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
          <div className="p-3 bg-[#FAF3E5] border border-[#EDD7AE] rounded-xl text-[11px] text-[#836527] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck size={13} />
              <span>EduSolve Safe Collaboration</span>
            </div>
            <p className="leading-snug">
              Encrypted channel. Personal identity numbers, bank passwords, and OTPs must never be exchanged.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="w-full text-center py-2 text-xs text-[#EA4335] hover:underline font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Flag size={13} />
            <span>Report conversation or policy concern</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
