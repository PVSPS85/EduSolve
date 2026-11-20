import React, { useState } from 'react';
import { WorkspaceTask, TaskStatus, WorkspaceTeamMember } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Edit,
  Trash2,
  Check,
  X,
  FileText,
  AlertCircle,
  Building2,
} from '../icons';

export interface WorkspaceTasksTabProps {
  tasks: WorkspaceTask[];
  teamMembers: WorkspaceTeamMember[];
  userRole: 'student' | 'ngo';
  onAddTask: (task: Omit<WorkspaceTask, 'id'>) => void;
  onUpdateTask: (task: WorkspaceTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function WorkspaceTasksTab({
  tasks,
  teamMembers,
  userRole,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: WorkspaceTasksTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WorkspaceTask | null>(null);
  const [detailsTask, setDetailsTask] = useState<WorkspaceTask | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(teamMembers[1]?.id || teamMembers[0]?.id);
  const [newDeadline, setNewDeadline] = useState('Nov 5, 2026');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newStatus, setNewStatus] = useState<TaskStatus>('todo');

  // Student completion note state for details modal
  const [completionNoteInput, setCompletionNoteInput] = useState('');

  const isStudent = userRole === 'student';

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (assigneeFilter !== 'all' && t.assignedTo.id !== assigneeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchAssignee = t.assignedTo.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee) return false;
    }
    return true;
  });

  const statusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
            <CheckCircle2 size={12} className="text-[#16A34A]" />
            <span>Completed</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14334A] bg-[#EBF4F5] px-2.5 py-1 rounded-full border border-[#70A1A8]/40">
            <Clock size={12} className="text-[#70A1A8]" />
            <span>In Progress</span>
          </span>
        );
      case 'todo':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] bg-[#FAF9F6] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
            To Do
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#991B1B] bg-[#FEF2F2] px-2.5 py-1 rounded-full border border-[#FCA5A5]">
            <AlertCircle size={12} className="text-[#DC2626]" />
            <span>Blocked</span>
          </span>
        );
    }
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assignedMember = teamMembers.find((m) => m.id === newAssigneeId) || teamMembers[0];

    onAddTask({
      title: newTitle.trim(),
      description: newDescription.trim() || 'No additional description provided.',
      assignedTo: {
        id: assignedMember.id,
        name: assignedMember.name,
        avatar: assignedMember.avatar,
        role: assignedMember.role,
      },
      deadline: newDeadline,
      status: newStatus,
      priority: newPriority,
      updatedAt: 'Just now',
    });

    setNewTitle('');
    setNewDescription('');
    setAddTaskModalOpen(false);
  };

  const handleEditTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    onUpdateTask(editingTask);
    setEditingTask(null);
  };

  const handleQuickStatusChange = (task: WorkspaceTask, nextStatus: TaskStatus) => {
    onUpdateTask({
      ...task,
      status: nextStatus,
      updatedAt: 'Just now',
    });
  };

  const handleAddCompletionNote = () => {
    if (!detailsTask || !completionNoteInput.trim()) return;
    const updated = {
      ...detailsTask,
      completionNotes: completionNoteInput.trim(),
      updatedAt: 'Just now',
    };
    onUpdateTask(updated);
    setDetailsTask(updated);
    setCompletionNoteInput('');
  };

  return (
    <div className="space-y-6 text-left py-6">
      
      {/* 1. Top Controls Bar: Search, Filters, Role Notice & Add Task */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search tasks by name or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl pl-9 pr-3 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF9F6] text-xs font-semibold text-[#183047] rounded-xl px-3 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Assignee Filter Dropdown */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-[#FAF9F6] text-xs font-semibold text-[#183047] rounded-xl px-3 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none cursor-pointer"
          >
            <option value="all">All Assignees</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.isNgoLead ? 'NGO' : 'Student'})
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions: Add Task Button (Role-Aware) */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748B] hidden sm:inline">
            Showing <strong>{filteredTasks.length}</strong> of {tasks.length} tasks
          </span>

          {!isStudent ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddTaskModalOpen(true)}
              leftIcon={<Plus size={15} />}
              className="text-xs shadow-xs"
            >
              Add New Task
            </Button>
          ) : (
            <div className="text-[11px] text-[#64748B] bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
              Student view: update your assigned tasks
            </div>
          )}
        </div>

      </div>

      {/* 2. Main Desktop Tasks Table / Mobile Tasks Cards (NO KANBAN) */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(20,51,74,0.04)] overflow-hidden">
        
        {/* DESKTOP TABLE VIEW (Visible on sm and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#E5E7EB]">
            {/* Table Header */}
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-4 font-bold">
                  Task & Milestone Details
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Assigned To
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Deadline
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Status
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Last Updated
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-6 text-right font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {filteredTasks.map((task) => {
                const isAssignedToCurrentUser =
                  isStudent && task.assignedTo.name.includes('Alex Chen');

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-[#FAF9F6]/80 transition-colors group"
                  >
                    {/* Column 1: Task Title & Description */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => setDetailsTask(task)}
                          className="font-bold text-sm text-[#14334A] group-hover:text-[#70A1A8] transition-colors text-left cursor-pointer focus:outline-none"
                        >
                          {task.title}
                        </button>
                        <p className="text-[#64748B] line-clamp-1 max-w-md text-xs">
                          {task.description}
                        </p>
                      </div>
                    </td>

                    {/* Column 2: Assigned To */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignedTo.avatar}
                          alt={task.assignedTo.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB]"
                        />
                        <div>
                          <strong className="block text-[#14334A] leading-tight text-xs">
                            {task.assignedTo.name}
                          </strong>
                          <span className="text-[10px] text-[#94A3B8] block">
                            {task.assignedTo.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Deadline */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-[#183047]">
                        <Calendar size={13} className="text-[#70A1A8]" />
                        <span className="font-semibold">{task.deadline}</span>
                      </div>
                    </td>

                    {/* Column 4: Status (Quick change for permitted user) */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {!isStudent || isAssignedToCurrentUser ? (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleQuickStatusChange(task, e.target.value as TaskStatus)
                          }
                          className="text-xs font-semibold bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-2.5 py-1 outline-none cursor-pointer hover:border-[#70A1A8]"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      ) : (
                        statusBadge(task.status)
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-[11px] text-[#64748B]">
                      {task.updatedAt || 'Not updated yet'}
                    </td>

                    {/* Column 5: Actions */}
                    <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailsTask(task)}
                          className="p-1.5 text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                          title="View Task Details"
                        >
                          Details
                        </button>

                        {!isStudent && (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingTask(task)}
                              className="p-1.5 text-[#70A1A8] hover:text-[#14334A] hover:bg-[#EBF4F5] rounded-lg transition-colors cursor-pointer"
                              title="Edit Task"
                            >
                              <Edit size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1.5 text-[#94A3B8] hover:text-[#EA4335] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW (Visible on xs screens) */}
        <div className="sm:hidden divide-y divide-[#F1F5F9] p-2">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4
                  onClick={() => setDetailsTask(task)}
                  className="font-bold text-sm text-[#14334A] leading-snug cursor-pointer"
                >
                  {task.title}
                </h4>
                {statusBadge(task.status)}
              </div>

              <p className="text-xs text-[#64748B]">{task.description}</p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <img
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-medium text-[#183047]">{task.assignedTo.name}</span>
                </div>

                <div className="flex items-center gap-1 text-[#836527] font-semibold text-[11px]">
                  <Calendar size={12} />
                  <span>{task.deadline}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <span className="mr-auto text-[10px] text-[#94A3B8] self-center">
                  Updated {task.updatedAt || 'not yet'}
                </span>
                <Button
                  variant="outline-subtle"
                  size="sm"
                  onClick={() => setDetailsTask(task)}
                  className="text-xs py-1"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-[#94A3B8] flex items-center justify-center mx-auto">
              <CheckSquare size={24} />
            </div>
            <h4 className="font-bold text-sm text-[#14334A]">No tasks match your filter</h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Reset status and assignee filters or create a new task to continue milestone planning.
            </p>
          </div>
        )}

      </div>

      {/* 3. Add Task Modal (NGO Role) */}
      <Modal
        isOpen={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        title="Add New Project Task"
        description="Assign a clear milestone task to an approved student volunteer."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-left -mt-2 text-xs">
          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              Task Title <span className="text-[#A57E59]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Build the offline-first authentication & login flow"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              Task Description & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              placeholder="Clarify what deliverables and testing outputs are expected..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Assign To Team Member
              </label>
              <select
                value={newAssigneeId}
                onChange={(e) => setNewAssigneeId(e.target.value)}
                className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none cursor-pointer"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Target Deadline
              </label>
              <input
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Initial Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
            <Button variant="outline-subtle" size="sm" type="button" onClick={() => setAddTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Edit Task Modal */}
      {editingTask && (
        <Modal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          title="Edit Project Task"
          description="Update task details, deadline, and assignment."
          maxWidth="md"
        >
          <form onSubmit={handleEditTaskSubmit} className="space-y-4 text-left -mt-2 text-xs">
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Task Title
              </label>
              <input
                type="text"
                required
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#14334A] block mb-1">
                  Status
                </label>
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                  className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#14334A] block mb-1">
                  Deadline
                </label>
                <input
                  type="text"
                  value={editingTask.deadline}
                  onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
              <Button variant="outline-subtle" size="sm" type="button" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Task Details Modal (With Completion Notes) */}
      {detailsTask && (
        <Modal
          isOpen={true}
          onClose={() => setDetailsTask(null)}
          title={detailsTask.title}
          description={`Assigned to ${detailsTask.assignedTo.name} (${detailsTask.assignedTo.role})`}
          maxWidth="md"
        >
          <div className="text-left -mt-2 space-y-4 text-xs">
            {/* Status & Deadline Header Card */}
            <div className="p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Status:</span>
                {statusBadge(detailsTask.status)}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#14334A] font-semibold">
                <Calendar size={13} className="text-[#70A1A8]" />
                <span>Deadline: {detailsTask.deadline}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h5 className="font-bold uppercase tracking-wider text-[#14334A] text-[10px] mb-1">
                Description & Deliverable Context
              </h5>
              <p className="text-sm text-[#183047] leading-relaxed bg-white border border-[#E5E7EB] p-3.5 rounded-2xl">
                {detailsTask.description}
              </p>
            </div>

            {/* Completion Notes Section */}
            <div>
              <h5 className="font-bold uppercase tracking-wider text-[#14334A] text-[10px] mb-1.5">
                Volunteer Progress & Completion Notes
              </h5>

              {detailsTask.completionNotes ? (
                <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] space-y-1 mb-2">
                  <div className="flex items-center gap-1 font-bold">
                    <CheckCircle2 size={13} />
                    <span>Latest Update:</span>
                  </div>
                  <p>{detailsTask.completionNotes}</p>
                </div>
              ) : (
                <p className="text-[11px] text-[#94A3B8] italic mb-2">No completion notes logged yet.</p>
              )}

              {/* Add completion note input */}
              <div className="space-y-2 pt-1">
                <textarea
                  rows={2}
                  placeholder="Add a progress update, test finding, or completion confirmation..."
                  value={completionNoteInput}
                  onChange={(e) => setCompletionNoteInput(e.target.value)}
                  className="w-full bg-[#FAF9F6] text-xs text-[#183047] placeholder-[#94A3B8] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    variant="outline-subtle"
                    size="sm"
                    disabled={!completionNoteInput.trim()}
                    onClick={handleAddCompletionNote}
                    className="text-xs"
                  >
                    Post Progress Note
                  </Button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              {!isStudent && (
                <Button
                  variant="outline-subtle"
                  size="sm"
                  onClick={() => {
                    const t = detailsTask;
                    setDetailsTask(null);
                    setEditingTask(t);
                  }}
                  leftIcon={<Edit size={13} />}
                  className="text-xs"
                >
                  Edit Task
                </Button>
              )}

              <Button variant="primary" size="sm" onClick={() => setDetailsTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
