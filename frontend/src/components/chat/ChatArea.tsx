import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ChatMessage, ChatAttachment } from '../../types';
import {
  Phone,
  Video,
  Sparkles,
  MoreVertical,
  Paperclip,
  Send,
  Download,
  File,
  Reply,
  ShieldCheck,
  AlertTriangle,
  X,
  User,
  Building2,
  Users,
  CheckCircle2,
  ExternalLink,
  Upload,
  ImageIcon,
  UserCheck,
} from '../icons';
import Button from '../ui/Button';
import { FirstChatNotice } from './SafetyModals';

export interface ChatAreaProps {
  conversation: Conversation;
  userRole: 'student' | 'ngo';
  isAiPanelOpen: boolean;
  onToggleAiPanel: () => void;
  onStartAudioCall: () => void;
  onStartVideoCall: () => void;
  onOpenParticipantProfile: () => void;
  onOpenReportModal: () => void;
  onOpenBlockModal: () => void;
  onAssignProject?: () => void;
  onEnlargePhoto: (url: string, caption?: string) => void;
  onSendMessage: (message: string, attachments?: ChatAttachment[], replyTo?: any) => void;
  suggestedPromptToInsert?: string | null;
  onClearSuggestedPrompt?: () => void;
}

export default function ChatArea({
  conversation,
  userRole,
  isAiPanelOpen,
  onToggleAiPanel,
  onStartAudioCall,
  onStartVideoCall,
  onOpenParticipantProfile,
  onOpenReportModal,
  onOpenBlockModal,
  onAssignProject,
  onEnlargePhoto,
  onSendMessage,
  suggestedPromptToInsert,
  onClearSuggestedPrompt,
}: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [stagedAttachment, setStagedAttachment] = useState<ChatAttachment | null>(null);
  const [firstNoticeAcknowledged, setFirstNoticeAcknowledged] = useState(
    conversation.firstChatNoticeAcknowledged || false
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isStudent = userRole === 'student';

  // Insert suggested question from AI panel if requested
  useEffect(() => {
    if (suggestedPromptToInsert) {
      setInputText(suggestedPromptToInsert);
      onClearSuggestedPrompt?.();
      textareaRef.current?.focus();
    }
  }, [suggestedPromptToInsert, onClearSuggestedPrompt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Sensitive keywords detection check
  const sensitiveKeywords = ['password', 'otp', 'routing number', 'bank account', 'credit card', 'ssn'];
  const hasSensitiveKeyword = sensitiveKeywords.some((word) =>
    inputText.toLowerCase().includes(word)
  );

  // Simulate file upload
  const handleSimulateUpload = (type: 'image' | 'document') => {
    setAttachmentMenuOpen(false);
    setUploadProgress(15);

    const timer1 = setTimeout(() => setUploadProgress(60), 300);
    const timer2 = setTimeout(() => {
      setUploadProgress(null);
      if (type === 'image') {
        setStagedAttachment({
          id: `att-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
          name: 'workshop_curriculum_preview.jpg',
          size: '1.2 MB',
        });
      } else {
        setStagedAttachment({
          id: `att-${Date.now()}`,
          type: 'document',
          url: '#',
          name: 'Senior_Tablet_Navigation_Draft_v3.pdf',
          size: '2.1 MB',
          mimeType: 'application/pdf',
        });
      }
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !stagedAttachment) return;

    onSendMessage(
      inputText.trim(),
      stagedAttachment ? [stagedAttachment] : undefined,
      replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            text: replyingTo.content.slice(0, 60),
          }
        : undefined
    );

    setInputText('');
    setStagedAttachment(null);
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] text-left relative overflow-hidden">
      
      {/* 1. Chat Header Bar */}
      <div className="h-18 px-4 sm:px-6 bg-white border-b border-[#E5E7EB] flex items-center justify-between shrink-0 z-20 shadow-2xs">
        
        {/* Left: Participant Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenParticipantProfile}
            className="relative shrink-0 text-left cursor-pointer focus:outline-none group"
            title="View participant profile"
          >
            <img
              src={conversation.avatar}
              alt={conversation.title}
              className="w-11 h-11 rounded-2xl object-cover border border-[#E5E7EB] group-hover:border-[#70A1A8] transition-colors"
            />
            {conversation.isGroup ? (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#14334A] text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Users size={9} className="text-[#EDD7AE]" />
              </span>
            ) : conversation.isOnline ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#16A34A] border-2 border-white" />
            ) : null}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenParticipantProfile}
                className="font-extrabold text-sm sm:text-base text-[#14334A] hover:text-[#70A1A8] transition-colors truncate cursor-pointer text-left focus:outline-none"
              >
                {conversation.title}
              </button>

              {conversation.isGroup && (
                <span className="text-[10px] font-bold text-[#14334A] bg-[#FAF3E5] px-2 py-0.5 rounded-full border border-[#EDD7AE] hidden sm:inline-block">
                  Project Team
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
              <span className="truncate max-w-[200px] sm:max-w-xs">
                {conversation.projectTitle || conversation.organization || 'Community Collaboration'}
              </span>
              <span>•</span>
              <span className={conversation.isOnline ? 'text-[#16A34A] font-semibold' : 'text-[#94A3B8]'}>
                {conversation.isOnline ? 'Active now' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Profile, Call, Video, AI, Options) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Profile Shortcut */}
          <button
            onClick={onOpenParticipantProfile}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#14334A] bg-[#FAF9F6] hover:bg-[#EBF4F5] border border-[#E5E7EB] hover:border-[#70A1A8] py-1.5 px-3 rounded-xl transition-all cursor-pointer"
            title="Open Profile Page"
          >
            {conversation.isGroup ? <Users size={13} /> : <User size={13} />}
            <span>Profile</span>
          </button>

          {/* Audio Call Button */}
          <button
            onClick={onStartAudioCall}
            className="p-2.5 rounded-xl text-[#14334A] hover:bg-[#EBF4F5] border border-[#E5E7EB] hover:border-[#70A1A8] transition-all cursor-pointer shadow-2xs"
            title="Start Audio Call"
            aria-label="Start Audio Call"
          >
            <Phone size={16} />
          </button>

          {/* Video Call Button */}
          <button
            onClick={onStartVideoCall}
            className="p-2.5 rounded-xl text-[#14334A] hover:bg-[#EBF4F5] border border-[#E5E7EB] hover:border-[#70A1A8] transition-all cursor-pointer shadow-2xs"
            title={conversation.isGroup ? 'Start Team Video Sync' : 'Start Video Call'}
            aria-label="Start Video Call"
          >
            <Video size={16} />
          </button>

          {/* AI Assistant Button (Highlighted) */}
          <button
            onClick={onToggleAiPanel}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isAiPanelOpen
                ? 'bg-[#14334A] text-white shadow-sm ring-2 ring-[#70A1A8]/30'
                : 'bg-white text-[#14334A] border border-[#EDD7AE] hover:bg-[#FAF3E5]'
            }`}
            title="Toggle EduSolve AI Assistant Panel"
            aria-label="Toggle AI Assistant"
          >
            <Sparkles size={15} className={isAiPanelOpen ? 'text-[#EDD7AE]' : 'text-[#836527]'} />
            <span className="hidden md:inline">AI Assistant</span>
          </button>

          {/* Options Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
              aria-label="More options"
            >
              <MoreVertical size={18} />
            </button>

            {optionsMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-1.5 z-40 text-xs text-[#183047] space-y-1 animate-fadeIn">
                <button
                  onClick={() => {
                    setOptionsMenuOpen(false);
                    onOpenParticipantProfile();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF9F6] flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} className="text-[#70A1A8]" />
                  <span>View Participant Details</span>
                </button>

                <button
                  onClick={() => {
                    setOptionsMenuOpen(false);
                    setFirstNoticeAcknowledged(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF9F6] flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-[#836527]" />
                  <span>Show Safety Guidelines</span>
                </button>

                {!isStudent && !conversation.isGroup && conversation.projectTitle && onAssignProject && (
                  <button
                    onClick={() => {
                      setOptionsMenuOpen(false);
                      onAssignProject();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#EBF4F5] text-[#14334A] flex items-center gap-2 cursor-pointer border-y border-[#F1F5F9]"
                  >
                    <UserCheck size={14} className="text-[#70A1A8]" />
                    <span className="font-semibold">Assign Project to Student</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setOptionsMenuOpen(false);
                    onOpenReportModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FEF2F2] text-[#EA4335] flex items-center gap-2 cursor-pointer"
                >
                  <AlertTriangle size={14} />
                  <span>Report Conversation</span>
                </button>

                <button
                  onClick={() => {
                    setOptionsMenuOpen(false);
                    onOpenBlockModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FEF2F2] text-[#EA4335] flex items-center gap-2 cursor-pointer"
                >
                  <X size={14} />
                  <span>Block Participant</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Messages Thread Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        
        {/* First Chat Privacy Notice Banner */}
        {!firstNoticeAcknowledged && (
          <FirstChatNotice
            onAcknowledge={() => setFirstNoticeAcknowledged(true)}
            userRole={userRole}
          />
        )}

        {/* Date Separator */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#E5E7EB]" />
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] bg-[#FAF9F6]">
            Today, October 13
          </span>
          <div className="flex-1 border-t border-[#E5E7EB]" />
        </div>

        {/* Message Bubbles List */}
        {conversation.messages.map((msg) => {
          const isOut = msg.isOutgoing;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 group ${isOut ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Sender Avatar */}
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-[#E5E7EB]"
              />

              {/* Message Payload Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-2xs space-y-2 relative ${
                  isOut
                    ? 'bg-[#14334A] text-white rounded-br-xs'
                    : 'bg-white text-[#183047] border border-[#E5E7EB] rounded-bl-xs'
                }`}
              >
                {/* Sender Name in Group Chat */}
                {conversation.isGroup && !isOut && (
                  <span className="text-[11px] font-bold text-[#70A1A8] block">
                    {msg.senderName}
                  </span>
                )}

                {/* Quoted Reply Box */}
                {msg.replyTo && (
                  <div
                    className={`p-2.5 rounded-xl text-xs border-l-3 mb-1.5 ${
                      isOut
                        ? 'bg-white/10 border-[#EDD7AE] text-white/90'
                        : 'bg-[#FAF9F6] border-[#70A1A8] text-[#64748B]'
                    }`}
                  >
                    <span className="font-bold text-[10px] block opacity-80">
                      Replying to {msg.replyTo.senderName}:
                    </span>
                    <p className="line-clamp-1 italic text-[11px] mt-0.5">"{msg.replyTo.text}"</p>
                  </div>
                )}

                {/* Text Message Content */}
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Attachments Section */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {msg.attachments.map((att) => {
                      if (att.type === 'image') {
                        return (
                          <div
                            key={att.id}
                            onClick={() => onEnlargePhoto(att.url, att.name)}
                            className="relative rounded-xl overflow-hidden border border-white/20 cursor-pointer group/img max-w-sm"
                          >
                            <img
                              src={att.url}
                              alt={att.name}
                              className="w-full h-44 sm:h-52 object-cover transition-transform group-hover/img:scale-102"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                              <span>Click to enlarge photo</span>
                            </div>
                          </div>
                        );
                      }

                      // Document PDF Card
                      return (
                        <div
                          key={att.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                            isOut
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-[#FAF9F6] border-[#E5E7EB] text-[#183047]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#EBF4F5] text-[#1E4663] flex items-center justify-center shrink-0">
                              <File size={16} />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold truncate block text-xs">{att.name}</span>
                              <span className={`text-[10px] ${isOut ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                                {att.size || '1.8 MB'} • Authorized Participants Only
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                            title="Download project document"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Message Timestamp & Quick Reply Action */}
                <div
                  className={`flex items-center justify-between pt-1 text-[10px] ${
                    isOut ? 'text-white/60' : 'text-[#94A3B8]'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  <button
                    type="button"
                    onClick={() => setReplyingTo(msg)}
                    className="opacity-0 group-hover:opacity-100 hover:underline flex items-center gap-1 cursor-pointer transition-opacity"
                  >
                    <Reply size={11} />
                    <span>Quote</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Sensitive Keyword Inline Warning (When typing keywords like password, bank, etc.) */}
      {hasSensitiveKeyword && (
        <div className="mx-4 sm:mx-6 mb-2 p-2.5 rounded-xl bg-[#FAF3E5] border border-[#EDD7AE] text-[11px] text-[#836527] flex items-center gap-2 animate-fadeIn shadow-2xs">
          <AlertTriangle size={15} className="text-[#836527] shrink-0" />
          <span className="flex-1">
            <strong>EduSolve Safety Notice:</strong> Never share passwords, one-time verification codes, or banking details in project chat.
          </span>
        </div>
      )}

      {/* 4. Upload Progress Bar (Simulated attachment state) */}
      {uploadProgress !== null && (
        <div className="mx-4 sm:mx-6 mb-2 p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-xs space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-[#14334A]">
            <span className="flex items-center gap-1.5">
              <Upload size={13} className="text-[#70A1A8] animate-bounce" />
              <span>Uploading project asset...</span>
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E5E7EB]">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="h-full bg-[#70A1A8] transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* 5. Staged Attachment Preview (Before Sending) */}
      {stagedAttachment && (
        <div className="mx-4 sm:mx-6 mb-2 p-2.5 rounded-xl bg-white border border-[#70A1A8] shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {stagedAttachment.type === 'image' ? (
              <img
                src={stagedAttachment.url}
                alt="Upload preview"
                className="w-10 h-10 rounded-lg object-cover border border-[#E5E7EB]"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#EBF4F5] text-[#1E4663] flex items-center justify-center">
                <File size={18} />
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-[#14334A] block truncate">{stagedAttachment.name}</span>
              <span className="text-[10px] text-[#64748B]">Ready to attach • {stagedAttachment.size}</span>
            </div>
          </div>

          <button
            onClick={() => setStagedAttachment(null)}
            className="text-[#94A3B8] hover:text-[#EA4335] p-1.5 rounded-lg cursor-pointer"
            title="Remove attachment"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* 6. Replying To Banner */}
      {replyingTo && (
        <div className="mx-4 sm:mx-6 mb-2 p-2.5 rounded-xl bg-white border-l-4 border-[#70A1A8] shadow-xs flex items-center justify-between text-xs">
          <div className="min-w-0 pr-2">
            <span className="font-bold text-[#70A1A8] text-[10px] block">
              Replying to {replyingTo.senderName}:
            </span>
            <p className="text-[#64748B] truncate text-xs">"{replyingTo.content}"</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-[#94A3B8] hover:text-[#14334A] p-1 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 7. Message Composer Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#E5E7EB] shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2 relative">
          
          {/* Attachment Toggle Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
              className="p-2.5 rounded-xl text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] border border-[#E5E7EB] transition-colors cursor-pointer"
              title="Add photos or project documents"
            >
              <Paperclip size={18} />
            </button>

            {/* Attachment Options Popover */}
            {attachmentMenuOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-52 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl p-1.5 z-30 text-xs text-[#183047] space-y-1 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => handleSimulateUpload('image')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF9F6] flex items-center gap-2.5 cursor-pointer"
                >
                  <ImageIcon size={16} className="text-[#70A1A8]" />
                  <div>
                    <strong className="block font-semibold">Upload Photo</strong>
                    <span className="text-[10px] text-[#94A3B8]">PNG, JPG up to 10MB</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateUpload('document')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF9F6] flex items-center gap-2.5 cursor-pointer"
                >
                  <File size={16} className="text-[#836527]" />
                  <div>
                    <strong className="block font-semibold">Project Document</strong>
                    <span className="text-[10px] text-[#94A3B8]">PDF, DOCX, XLSX</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Multiline Auto-expanding Input Area */}
          <div className="flex-1 bg-[#FAF9F6] border border-[#E5E7EB] focus-within:border-[#70A1A8] focus-within:ring-2 focus-within:ring-[#70A1A8]/20 rounded-2xl p-2 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Type your project message... (Press Enter to send, Shift+Enter for new line)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] outline-none resize-none max-h-32 px-1 py-1"
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputText.trim() && !stagedAttachment}
            rightIcon={<Send size={15} />}
            className="py-2.5 px-4 sm:px-5 shadow-sm"
          >
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>

    </div>
  );
}
