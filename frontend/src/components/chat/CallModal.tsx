import React, { useState, useEffect } from 'react';
import { CallState } from '../../types';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Monitor,
  Users,
  ShieldCheck,
  CheckCircle2,
  X,
  Maximize2,
  Minimize2,
} from '../icons';
import Button from '../ui/Button';

export interface CallModalProps {
  callState: CallState;
  onClose: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  projectName?: string;
}

export default function CallModal({
  callState,
  onClose,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  projectName = 'Accessible Tablet & Online Banking Modules for Seniors',
}: CallModalProps) {
  const [callDuration, setCallDuration] = useState(callState.durationSeconds || 14);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer for connected call
  useEffect(() => {
    if (!callState.isOpen || callState.status !== 'connected') return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState.isOpen, callState.status]);

  if (!callState.isOpen) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const isVideo = callState.type === 'video' || callState.type === 'group';
  const isGroup = callState.type === 'group';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      {/* Main Calling Container */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-7xl h-[92vh]' : 'max-w-4xl h-[82vh]'
        } bg-[#0D2232] rounded-3xl border border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden text-white transition-all`}
      >
        
        {/* 1. Call Top Navigation Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/30 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#14334A] border border-white/20 flex items-center justify-center text-[#70A1A8]">
              {isGroup ? <Users size={16} /> : isVideo ? <Video size={16} /> : <Phone size={16} />}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">
                  {isGroup
                    ? 'Sprint Squad Alpha — Team Sync'
                    : callState.callerName || 'Dr. Marcus Vance'}
                </span>
                <span className="text-[10px] font-semibold text-[#EDD7AE] bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                  {callState.status === 'connected' ? 'Encrypted Call' : 'Connecting...'}
                </span>
              </div>
              <span className="text-[11px] text-white/60 block truncate max-w-sm">
                Project: {projectName}
              </span>
            </div>
          </div>

          {/* Right Header Status: Timer & Maximize */}
          <div className="flex items-center gap-3">
            {callState.status === 'connected' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 font-mono text-xs text-white/90">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>{formatTimer(callDuration)}</span>
              </div>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit full width' : 'Full width'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* 2. Main Call Canvas Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
          
          {/* SCREEN SHARING VIEW */}
          {callState.isScreenSharing ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/20 bg-[#14334A]/80 flex flex-col justify-between relative p-4 animate-fadeIn">
              {/* Green Screen Sharing Banner */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#16A34A] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <Monitor size={14} />
                <span>You are sharing your screen (Figma Wireframe Presentation)</span>
                <button
                  onClick={onToggleScreenShare}
                  className="ml-2 bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded text-[10px] cursor-pointer"
                >
                  Stop Sharing
                </button>
              </div>

              {/* Mock Screen Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#70A1A8]">
                  <Monitor size={32} />
                </div>
                <div className="max-w-md">
                  <h4 className="font-bold text-lg text-white">
                    Presenting: Senior Tablet UI Layout v2.4
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Other participants are viewing your live prototype viewport and large-font navigation cards.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-white/50 text-center">
                Secure screen transmission encrypted by EduSolve Video Gateway.
              </div>
            </div>
          ) : isGroup ? (
            /* GROUP CALL 4-TILE GRID */
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-2">
              
              {/* Tile 1: Dr. Marcus Vance (Active Speaker) */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#70A1A8] bg-[#14334A] shadow-lg flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=640&h=480"
                  alt="Dr. Marcus Vance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                  <span>Dr. Marcus Vance (Speaking)</span>
                </div>
              </div>

              {/* Tile 2: Alex Chen (You) */}
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#14334A] flex items-center justify-center">
                {!callState.isVideoOff ? (
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=640&h=480"
                    alt="Alex Chen"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xl">
                    AC
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <span>Alex Chen (You)</span>
                  {callState.isMuted && <MicOff size={12} className="text-[#EA4335]" />}
                </div>
              </div>

              {/* Tile 3: Maya Lin */}
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#14334A] flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&w=640&h=480"
                  alt="Maya Lin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold">
                  Maya Lin (RISD)
                </div>
              </div>

              {/* Tile 4: David Park */}
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#14334A] flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&w=640&h=480"
                  alt="David Park"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold">
                  David Park (UIUC)
                </div>
              </div>

            </div>
          ) : isVideo ? (
            /* ONE-ON-ONE VIDEO CALL */
            <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/15 bg-[#14334A] flex items-center justify-center">
              {/* Main remote video */}
              <img
                src={
                  callState.callerAvatar ||
                  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=1280&h=720'
                }
                alt={callState.callerName || 'Participant'}
                className="w-full h-full object-cover"
              />

              {/* Remote name tag bottom left */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                <span>{callState.callerName || 'Dr. Marcus Vance'}</span>
              </div>

              {/* Local PiP camera preview in bottom-right */}
              <div className="absolute bottom-4 right-4 w-32 sm:w-44 h-24 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-black">
                {!callState.isVideoOff ? (
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=320&h=240"
                    alt="Your camera preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-[10px]">
                    <VideoOff size={18} className="mb-1" />
                    <span>Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white/90">
                  You
                </div>
              </div>
            </div>
          ) : (
            /* AUDIO ONLY CALL VIEW */
            <div className="flex flex-col items-center justify-center space-y-6 text-center animate-fadeIn">
              <div className="relative">
                <img
                  src={
                    callState.callerAvatar ||
                    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=crop&w=240&h=240'
                  }
                  alt={callState.callerName || 'Audio Call'}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
                />
                <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#14334A] border-2 border-white flex items-center justify-center text-[#70A1A8]">
                  <Phone size={15} />
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {callState.callerName || 'Dr. Marcus Vance'}
                </h3>
                <p className="text-xs text-[#EDD7AE] mt-1 font-semibold uppercase tracking-wider">
                  {callState.status === 'connected' ? 'High-Fidelity Audio Connected' : 'Calling Participant...'}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Director of Community Programs · Horizon Community Services
                </p>
              </div>

              {/* Audio Wave Visualizer Simulation */}
              <div className="flex items-center gap-1.5 h-8">
                {[12, 24, 16, 32, 28, 14, 20, 26, 18, 30, 22, 10].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-[#70A1A8] rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 3. Call Bottom Controls Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-center gap-3 sm:gap-4 z-20">
          
          {/* Mute Mic Toggle */}
          <button
            onClick={onToggleMute}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              callState.isMuted
                ? 'bg-[#EA4335] text-white shadow-lg'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={callState.isMuted ? 'Unmute microphone' : 'Mute microphone'}
            aria-label="Toggle mute"
          >
            {callState.isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Camera On/Off (if video call) */}
          {isVideo && (
            <button
              onClick={onToggleVideo}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                callState.isVideoOff
                  ? 'bg-[#EA4335] text-white shadow-lg'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title={callState.isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              aria-label="Toggle camera"
            >
              {callState.isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          )}

          {/* Screen Share Toggle */}
          <button
            onClick={onToggleScreenShare}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              callState.isScreenSharing
                ? 'bg-[#16A34A] text-white shadow-lg'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={callState.isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
            aria-label="Toggle screen share"
          >
            <Monitor size={20} />
          </button>

          {/* Speaker / Device Volume Toggle */}
          <button
            onClick={() => setSpeakerMuted(!speakerMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              speakerMuted
                ? 'bg-[#836527] text-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={speakerMuted ? 'Unmute audio device' : 'Mute audio device'}
            aria-label="Toggle speaker"
          >
            {speakerMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {/* End Call Button (Primary Red) */}
          <button
            onClick={onClose}
            className="w-14 h-12 rounded-2xl bg-[#EA4335] hover:bg-[#DC2626] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ml-2"
            title="End call"
            aria-label="End call"
          >
            <PhoneOff size={22} />
          </button>

        </div>

      </div>

    </div>
  );
}
