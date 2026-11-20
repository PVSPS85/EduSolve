import React, { useEffect, useState } from 'react';
import {
  Conversation,
  ChatMessage,
  ChatAttachment,
  CallState,
  ProjectAssignment,
} from '../../types';
import { SAMPLE_CONVERSATIONS } from '../../data/chatData';
import ChatConversationsList from './ChatConversationsList';
import ChatArea from './ChatArea';
import ChatAiPanel from './ChatAiPanel';
import ChatContextPanel from './ChatContextPanel';
import CallModal from './CallModal';
import IncomingCallDialog from './IncomingCallDialog';
import { ReportModal, BlockModal, PhotoEnlargeModal } from './SafetyModals';
import AssignProjectDialog from './AssignProjectDialog';

export interface MessagesPageProps {
  userRole: 'student' | 'ngo';
  onToggleRole: () => void;
  onNavigateFeed: () => void;
  onOpenStudentProfile?: (studentName?: string) => void;
  onOpenNgoProfile?: (orgName?: string) => void;
  onOpenWorkspace?: () => void;
  onProjectAssigned?: (assignment: ProjectAssignment) => void;
  autoStartProjectCall?: boolean;
  onProjectCallStarted?: () => void;
  initialProjectTitle?: string;
}

export default function MessagesPage({
  userRole,
  onToggleRole,
  onNavigateFeed,
  onOpenStudentProfile,
  onOpenNgoProfile,
  onOpenWorkspace,
  onProjectAssigned,
  autoStartProjectCall = false,
  onProjectCallStarted,
  initialProjectTitle,
}: MessagesPageProps) {
  // Active conversations data
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    SAMPLE_CONVERSATIONS.find(
      (conversation) => conversation.projectTitle === initialProjectTitle,
    )?.id || SAMPLE_CONVERSATIONS[0].id,
  );

  // Right-side Panel State: OPEN BY DEFAULT as specified in prompt
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'ai' | 'context'>('ai');

  // Suggested prompt from AI to insert into composer
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(null);

  // Calling States
  const [callState, setCallState] = useState<CallState>({
    isOpen: false,
    type: 'audio',
    status: 'connected',
    isScreenSharing: false,
    isMuted: false,
    isVideoOff: false,
    durationSeconds: 18,
    callerName: 'Dr. Marcus Vance',
    callerAvatar:
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=240&h=240',
  });

  // Simulated Incoming Call Dialog
  const [incomingCallVisible, setIncomingCallVisible] = useState(false);

  // Safety Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<{ url: string; caption?: string } | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  // Mobile layout drawer states ('list' | 'chat')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');

  // Currently selected conversation object
  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  // Send message handler
  const handleSendMessage = (content: string, attachments?: ChatAttachment[], replyTo?: any) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: userRole === 'student' ? 'user-alex-chen' : 'user-dr-vance',
      senderName: userRole === 'student' ? 'Alex Chen' : 'Dr. Marcus Vance',
      senderRole: userRole,
      senderAvatar:
        userRole === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160'
          : 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=160&h=160',
      content,
      timestamp: 'Just now',
      isOutgoing: true,
      replyTo,
      attachments,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversationId) {
          return {
            ...c,
            lastMessage: content || (attachments ? `[Attachment: ${attachments[0].name}]` : ''),
            timestamp: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );
  };

  // Start outgoing calls
  const handleStartAudioCall = () => {
    setCallState({
      isOpen: true,
      type: 'audio',
      status: 'connected',
      isScreenSharing: false,
      isMuted: false,
      isVideoOff: false,
      durationSeconds: 1,
      callerName: activeConversation.title,
      callerAvatar: activeConversation.avatar,
    });
  };

  const handleStartVideoCall = () => {
    setCallState({
      isOpen: true,
      type: activeConversation.isGroup ? 'group' : 'video',
      status: 'connected',
      isScreenSharing: false,
      isMuted: false,
      isVideoOff: false,
      durationSeconds: 1,
      callerName: activeConversation.title,
      callerAvatar: activeConversation.avatar,
    });
  };

  useEffect(() => {
    if (!autoStartProjectCall) return;
    handleStartVideoCall();
    onProjectCallStarted?.();
  }, [autoStartProjectCall]);

  // Profile navigation handler
  const handleOpenParticipantProfile = () => {
    if (activeConversation.isGroup) {
      if (onOpenNgoProfile) onOpenNgoProfile(activeConversation.organization);
    } else if (userRole === 'student') {
      if (onOpenNgoProfile) onOpenNgoProfile(activeConversation.organization || activeConversation.title);
    } else {
      if (onOpenStudentProfile) onOpenStudentProfile(activeConversation.title);
    }
  };

  return (
    <div className="h-screen w-full bg-[#FAF9F6] text-[#183047] flex flex-col overflow-hidden selection:bg-[#EDD7AE] selection:text-[#14334A]">
      
      {/* Three-Column Main Container (~1440px desktop frame) */}
      <div className="flex-1 flex overflow-hidden w-full max-w-[1536px] mx-auto border-x border-[#E5E7EB] shadow-xs">
        
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT CONVERSATIONS LIST */}
        {/* ========================================================= */}
        <div className={`h-full ${mobileView === 'chat' ? 'hidden md:flex' : 'flex w-full'}`}>
          <ChatConversationsList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => {
              setSelectedConversationId(id);
              setMobileView('chat');
            }}
            userRole={userRole}
            onToggleRole={onToggleRole}
            onNavigateFeed={onNavigateFeed}
          />
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER ACTIVE CHAT AREA */}
        {/* ========================================================= */}
        <div className={`h-full flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          <ChatArea
            conversation={activeConversation}
            userRole={userRole}
            isAiPanelOpen={isAiPanelOpen}
            onToggleAiPanel={() => setIsAiPanelOpen(!isAiPanelOpen)}
            onStartAudioCall={handleStartAudioCall}
            onStartVideoCall={handleStartVideoCall}
            onOpenParticipantProfile={handleOpenParticipantProfile}
            onOpenReportModal={() => setReportModalOpen(true)}
            onOpenBlockModal={() => setBlockModalOpen(true)}
            onAssignProject={() => setAssignmentDialogOpen(true)}
            onEnlargePhoto={(url, caption) => setEnlargedPhoto({ url, caption })}
            onSendMessage={handleSendMessage}
            suggestedPromptToInsert={suggestedPrompt}
            onClearSuggestedPrompt={() => setSuggestedPrompt(null)}
          />
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT AI ASSISTANT / CONTEXT PANEL (OPEN BY DEFAULT) */}
        {/* ========================================================= */}
        {isAiPanelOpen && (
          <div className="h-full hidden lg:flex shrink-0">
            {rightPanelTab === 'ai' ? (
              <ChatAiPanel
                conversation={activeConversation}
                userRole={userRole}
                onClose={() => setIsAiPanelOpen(false)}
                onInsertSuggestedQuestion={(q) => {
                  setSuggestedPrompt(q);
                }}
              />
            ) : (
              <ChatContextPanel
                conversation={activeConversation}
                onClose={() => setIsAiPanelOpen(false)}
                onOpenAiPanel={() => setRightPanelTab('ai')}
                onSelectParticipantProfile={(p) => {
                  if (p.role === 'student') {
                    onOpenStudentProfile?.(p.name);
                  } else {
                    onOpenNgoProfile?.(p.name);
                  }
                }}
                onOpenReportModal={() => setReportModalOpen(true)}
              />
            )}
          </div>
        )}

      </div>

      {/* Interactive Simulation Controls Bar for Reviewers at Base */}
      <div className="h-10 bg-white border-t border-[#E5E7EB] px-4 flex items-center justify-between text-xs text-[#64748B] shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#14334A] hidden sm:inline">Testing Controls:</span>
          <button
            onClick={() => setIncomingCallVisible(true)}
            className="text-[11px] font-semibold text-[#70A1A8] hover:text-[#14334A] hover:underline cursor-pointer"
          >
            Simulate Incoming Call
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setCallState({
                isOpen: true,
                type: 'video',
                status: 'connected',
                isScreenSharing: true,
                isMuted: false,
                isVideoOff: false,
                durationSeconds: 45,
                callerName: 'Dr. Marcus Vance',
                callerAvatar: activeConversation.avatar,
              });
            }}
            className="text-[11px] font-semibold text-[#70A1A8] hover:text-[#14334A] hover:underline cursor-pointer"
          >
            Simulate Screen Share
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setCallState({
                isOpen: true,
                type: 'group',
                status: 'connected',
                isScreenSharing: false,
                isMuted: false,
                isVideoOff: false,
                durationSeconds: 120,
              });
            }}
            className="text-[11px] font-semibold text-[#70A1A8] hover:text-[#14334A] hover:underline cursor-pointer"
          >
            Simulate Team Group Call
          </button>
        </div>

        <div className="flex items-center gap-3">
          {onOpenWorkspace && (
            <button
              onClick={onOpenWorkspace}
              className="text-[11px] font-bold text-[#836527] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Project Workspace →</span>
            </button>
          )}
          <span>•</span>
          <button
            onClick={() => setRightPanelTab(rightPanelTab === 'ai' ? 'context' : 'ai')}
            className="text-[11px] font-semibold text-[#14334A] hover:text-[#70A1A8] cursor-pointer"
          >
            {rightPanelTab === 'ai' ? 'Context' : 'AI'}
          </button>
          <span>•</span>
          <button
            onClick={onNavigateFeed}
            className="text-[11px] font-bold text-[#14334A] hover:underline cursor-pointer"
          >
            Feed
          </button>
        </div>
      </div>

      {/* Active Call Overlay Modal */}
      <CallModal
        callState={callState}
        onClose={() => setCallState((prev) => ({ ...prev, isOpen: false }))}
        onToggleMute={() => setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
        onToggleVideo={() => setCallState((prev) => ({ ...prev, isVideoOff: !prev.isVideoOff }))}
        onToggleScreenShare={() =>
          setCallState((prev) => ({ ...prev, isScreenSharing: !prev.isScreenSharing }))
        }
        projectName={activeConversation.projectTitle}
      />

      {/* Simulated Incoming Call Notification */}
      {incomingCallVisible && (
        <IncomingCallDialog
          callerName={activeConversation.title}
          callerAvatar={activeConversation.avatar}
          callType="video"
          projectName={activeConversation.projectTitle}
          onAccept={() => {
            setIncomingCallVisible(false);
            handleStartVideoCall();
          }}
          onDecline={() => setIncomingCallVisible(false)}
        />
      )}

      {/* Report User Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedName={activeConversation.title}
      />

      {/* Block User Modal */}
      <BlockModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        userName={activeConversation.title}
        onConfirmBlock={() => {
          // Removes conversation or marks blocked
          setConversations((prev) => prev.filter((c) => c.id !== selectedConversationId));
        }}
      />

      {/* Enlarged Photo Modal */}
      {enlargedPhoto && (
        <PhotoEnlargeModal
          isOpen={true}
          onClose={() => setEnlargedPhoto(null)}
          imageUrl={enlargedPhoto.url}
          caption={enlargedPhoto.caption}
        />
      )}

      <AssignProjectDialog
        isOpen={assignmentDialogOpen}
        conversation={activeConversation}
        onClose={() => setAssignmentDialogOpen(false)}
        onAssigned={(assignment) => onProjectAssigned?.(assignment)}
        onOpenWorkspace={() => {
          setAssignmentDialogOpen(false);
          onOpenWorkspace?.();
        }}
      />

    </div>
  );
}
