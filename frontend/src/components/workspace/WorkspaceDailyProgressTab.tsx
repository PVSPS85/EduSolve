import React, { useState } from 'react';
import { DailyProgressReport, WorkspaceTask } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Plus,
} from '../icons';

interface WorkspaceDailyProgressTabProps {
  reports: DailyProgressReport[];
  tasks: WorkspaceTask[];
  userRole: 'student' | 'ngo';
  onSubmit: (report: Omit<DailyProgressReport, 'id'>) => void;
  onOpenMessages: () => void;
}

export default function WorkspaceDailyProgressTab({
  reports,
  tasks,
  userRole,
  onSubmit,
  onOpenMessages,
}: WorkspaceDailyProgressTabProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [completedToday, setCompletedToday] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [blockers, setBlockers] = useState('');
  const [relatedTask, setRelatedTask] = useState('');
  const [attachment, setAttachment] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const isStudent = userRole === 'student';

  const submitReport = (status: 'draft' | 'submitted') => {
    if (!completedToday.trim() || !nextSteps.trim()) return;
    onSubmit({
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      submittedAt: status === 'draft' ? 'Draft saved just now' : 'Submitted just now',
      student: {
        name: 'Alex Chen',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
      },
      completedToday: completedToday.trim(),
      nextSteps: nextSteps.trim(),
      blockers: blockers.trim() || undefined,
      relatedTask: relatedTask || undefined,
      attachment: attachment.trim() || undefined,
      githubLink: githubLink.trim() || undefined,
      status,
    });
    setSuccess(status === 'submitted');
    setCompletedToday('');
    setNextSteps('');
    setBlockers('');
    setAttachment('');
    setGithubLink('');
    if (status === 'draft') setFormOpen(false);
  };

  return (
    <div className="space-y-6 text-left py-6">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-[#14334A] uppercase tracking-wider">
            Daily Progress Reports
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Practical evidence of work completed, next steps, and blockers. Reports do not automatically prove project completion.
          </p>
        </div>
        {isStudent ? (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => {
              setSuccess(false);
              setFormOpen(true);
            }}
          >
            Submit Daily Progress
          </Button>
        ) : (
          <Button variant="outline-subtle" size="sm" onClick={onOpenMessages}>
            Respond in Messages
          </Button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-7 shadow-xs">
        {reports.length === 0 ? (
          <div className="py-12 text-center">
            <Clock size={28} className="text-[#70A1A8] mx-auto mb-3" />
            <h4 className="font-bold text-sm text-[#14334A]">No daily progress submitted yet</h4>
            <p className="text-xs text-[#64748B] mt-1">
              Student updates will appear here after submission.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#E5E7EB] ml-3 space-y-6">
            {reports.map((report) => (
              <article key={report.id} className="relative pl-7">
                <span className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white border-3 border-[#70A1A8]" />
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={report.student.avatar}
                        alt={report.student.name}
                        className="w-9 h-9 rounded-xl object-cover"
                      />
                      <div>
                        <strong className="text-sm text-[#14334A] block">{report.student.name}</strong>
                        <span className="text-[10px] text-[#94A3B8]">{report.submittedAt}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#836527] bg-[#FAF3E5] border border-[#EDD7AE] rounded-full px-2.5 py-1">
                      {report.status === 'draft' ? 'Draft' : report.date}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3">
                      <strong className="text-[#14334A] block mb-1">Completed today</strong>
                      <p className="text-[#64748B] leading-relaxed">{report.completedToday}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3">
                      <strong className="text-[#14334A] block mb-1">Next steps</strong>
                      <p className="text-[#64748B] leading-relaxed">{report.nextSteps}</p>
                    </div>
                  </div>
                  {report.blockers && (
                    <div className="text-xs text-[#836527] bg-[#FAF3E5] border border-[#EDD7AE] rounded-xl p-3">
                      <strong>Blockers:</strong> {report.blockers}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {report.relatedTask && (
                      <span className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-[#14334A]">
                        <CheckCircle2 size={12} className="text-[#70A1A8]" />
                        {report.relatedTask}
                      </span>
                    )}
                    {report.attachment && (
                      <span className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-[#14334A]">
                        <FileText size={12} className="text-[#70A1A8]" />
                        {report.attachment}
                      </span>
                    )}
                    {report.githubLink && (
                      <a
                        href={report.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-[#14334A]"
                      >
                        <ExternalLink size={12} />
                        GitHub evidence
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={success ? 'Daily Progress Submitted' : 'Submit Daily Progress'}
        description={
          success
            ? 'Your update was added to the Daily Progress timeline.'
            : 'Share a concise record of work completed, next steps, and any blockers.'
        }
        maxWidth="lg"
      >
        {success ? (
          <div className="text-center space-y-4">
            <CheckCircle2 size={34} className="text-[#70A1A8] mx-auto" />
            <Button variant="primary" onClick={() => setFormOpen(false)}>
              Return to Daily Progress
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">Date</label>
              <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3 text-[#64748B]">
                <Calendar size={14} />
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                What did you complete today?
              </label>
              <textarea
                rows={3}
                value={completedToday}
                onChange={(event) => setCompletedToday(event.target.value)}
                className="w-full bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                What will you work on next?
              </label>
              <textarea
                rows={3}
                value={nextSteps}
                onChange={(event) => setNextSteps(event.target.value)}
                className="w-full bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Any blockers or problems?
              </label>
              <textarea
                rows={2}
                value={blockers}
                onChange={(event) => setBlockers(event.target.value)}
                className="w-full bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#14334A] block mb-1">Related task</label>
                <select
                  value={relatedTask}
                  onChange={(event) => setRelatedTask(event.target.value)}
                  className="w-full bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E7EB] outline-none"
                >
                  <option value="">No related task</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.title}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-[#14334A] block mb-1">
                  Optional attachment
                </label>
                <input
                  value={attachment}
                  onChange={(event) => setAttachment(event.target.value)}
                  placeholder="screenshot.png"
                  className="w-full bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E7EB] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Optional GitHub commit, pull request, or repository link
              </label>
              <input
                type="url"
                value={githubLink}
                onChange={(event) => setGithubLink(event.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E7EB] outline-none"
              />
            </div>
            <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline-subtle"
                disabled={!completedToday.trim() || !nextSteps.trim()}
                onClick={() => submitReport('draft')}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                disabled={!completedToday.trim() || !nextSteps.trim()}
                onClick={() => submitReport('submitted')}
              >
                Submit Update
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
