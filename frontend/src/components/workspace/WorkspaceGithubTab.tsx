import React from 'react';
import { GithubActivityEvent } from '../../types';
import Button from '../ui/Button';
import {
  Activity,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
} from '../icons';

interface WorkspaceGithubTabProps {
  connected: boolean;
  repository?: string;
  events: GithubActivityEvent[];
  onConnect: () => void;
}

export default function WorkspaceGithubTab({
  connected,
  repository,
  events,
  onConnect,
}: WorkspaceGithubTabProps) {
  return (
    <div className="space-y-6 text-left py-6">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={17} className="text-[#70A1A8]" />
            <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
              GitHub Activity
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Illustrative repository events appear only after the prototype connection is enabled.
          </p>
        </div>
        <Button
          variant={connected ? 'outline-subtle' : 'primary'}
          size="sm"
          onClick={onConnect}
          leftIcon={connected ? <RefreshCw size={14} /> : <ExternalLink size={14} />}
        >
          {connected ? 'Repository Connected' : 'Connect GitHub Repository'}
        </Button>
      </div>

      {!connected ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#C8B294] p-10 text-center">
          <ExternalLink size={30} className="text-[#70A1A8] mx-auto mb-3" />
          <h4 className="font-bold text-sm text-[#14334A]">No repository connected</h4>
          <p className="text-xs text-[#64748B] mt-1 max-w-lg mx-auto">
            A future implementation can receive authorized repository events. No live GitHub synchronization is active in this prototype.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-xs text-[#14334A]">
              <CheckCircle2 size={15} className="text-[#70A1A8]" />
              <strong>{repository}</strong>
            </div>
            <span className="text-[10px] text-[#94A3B8]">Illustrative connection state</span>
          </div>
          <div className="space-y-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 text-xs"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <strong className="text-[#14334A]">{event.type}</strong>
                  <span className="text-[10px] text-[#94A3B8]">{event.timestamp}</span>
                </div>
                <p className="text-[#64748B] mt-1 leading-relaxed">{event.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[10px] font-semibold text-[#836527]">
                    {event.contributor}
                  </span>
                  {event.relatedTask && (
                    <span className="text-[10px] bg-white border border-[#E5E7EB] rounded-lg px-2 py-0.5">
                      {event.relatedTask}
                    </span>
                  )}
                  <a
                    href={event.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-[#14334A]"
                  >
                    Repository link <ExternalLink size={11} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
