import React from 'react';
import { Phone, PhoneOff, Video, Users } from '../icons';

export interface IncomingCallDialogProps {
  callerName: string;
  callerAvatar: string;
  callType: 'audio' | 'video' | 'group';
  projectName?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallDialog({
  callerName,
  callerAvatar,
  callType,
  projectName = 'Accessible Tablet & Online Banking Modules for Seniors',
  onAccept,
  onDecline,
}: IncomingCallDialogProps) {
  const isVideo = callType === 'video' || callType === 'group';

  return (
    <div className="fixed top-6 right-4 sm:right-8 z-50 animate-bounce duration-700">
      <div className="bg-[#14334A] text-white p-4 sm:p-5 rounded-3xl border-2 border-[#EDD7AE] shadow-[0_16px_40px_rgba(20,51,74,0.35)] w-80 sm:w-96 text-left">
        
        {/* Header with Pulse indicator */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 text-[#EDD7AE] font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
            <span>{isVideo ? 'Incoming Video Call' : 'Incoming Audio Call'}</span>
          </div>

          <span className="text-[10px] text-white/60">EduSolve Gateway</span>
        </div>

        {/* Caller Info */}
        <div className="flex items-center gap-3.5 mb-4">
          <img
            src={callerAvatar}
            alt={callerName}
            className="w-13 h-13 rounded-2xl object-cover border-2 border-white/20 shadow-md"
          />

          <div className="min-w-0">
            <h4 className="font-extrabold text-base text-white truncate leading-tight">
              {callerName}
            </h4>
            <span className="text-xs text-[#70A1A8] block truncate font-medium mt-0.5">
              {projectName}
            </span>
          </div>
        </div>

        {/* Accept & Decline Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onDecline}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <PhoneOff size={15} className="text-[#EA4335]" />
            <span>Decline</span>
          </button>

          <button
            onClick={onAccept}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {isVideo ? <Video size={15} /> : <Phone size={15} />}
            <span>Accept Call</span>
          </button>
        </div>

      </div>
    </div>
  );
}
