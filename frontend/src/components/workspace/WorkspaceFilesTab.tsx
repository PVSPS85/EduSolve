import React, { useState } from 'react';
import { WorkspaceFile, WorkspaceTask } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import {
  Folder,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Search,
  Plus,
  Clock,
  User,
  X,
  AlertTriangle,
} from '../icons';

export interface WorkspaceFilesTabProps {
  files: WorkspaceFile[];
  tasks: WorkspaceTask[];
  userRole: 'student' | 'ngo';
  onUploadFile: (file: Omit<WorkspaceFile, 'id'>) => void;
  onDeleteFile: (fileId: string) => void;
}

export default function WorkspaceFilesTab({
  files,
  tasks,
  userRole,
  onUploadFile,
  onDeleteFile,
}: WorkspaceFilesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<WorkspaceFile | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Upload modal form state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState('PDF');
  const [uploadRelatedTask, setUploadRelatedTask] = useState(tasks[0]?.title || '');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState(false);

  const isStudent = userRole === 'student';

  const filteredFiles = files.filter((f) => {
    if (fileTypeFilter !== 'all' && f.fileType.toLowerCase() !== fileTypeFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q);
      const matchUploader = f.uploadedBy.name.toLowerCase().includes(q);
      const matchTask = f.relatedTask?.toLowerCase().includes(q);
      if (!matchName && !matchUploader && !matchTask) return false;
    }
    return true;
  });

  const handleSimulateDownload = (fileName: string) => {
    setDownloadToast(`Downloading ${fileName}...`);
    setTimeout(() => setDownloadToast(null), 2500);
  };

  const handleStartUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    setUploadError(false);
    setUploadProgress(20);
    const timer1 = setTimeout(() => setUploadProgress(65), 300);
    const timer2 = setTimeout(() => {
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(null);
        onUploadFile({
          name: uploadFileName.endsWith(`.${uploadFileType.toLowerCase()}`)
            ? uploadFileName
            : `${uploadFileName}.${uploadFileType.toLowerCase()}`,
          fileType: uploadFileType,
          size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
          uploadedBy: {
            name: isStudent ? 'Alex Chen' : 'Pooja Sharma',
            avatar: isStudent
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120'
              : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&w=120&h=120',
            role: isStudent ? 'Student Tech Lead' : 'NGO Project Lead',
          },
          uploadDate: 'Today',
          relatedTask: uploadRelatedTask,
          downloadUrl: '#',
        });
        setUploadModalOpen(false);
        setUploadFileName('');
      }, 400);
    }, 700);
  };

  const fileTypeBadge = (type: string) => {
    const t = type.toUpperCase();
    let color = 'bg-[#FAF9F6] text-[#64748B] border-[#E5E7EB]';
    if (t === 'PDF') color = 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]';
    if (t === 'FIG') color = 'bg-[#FDF2F8] text-[#9D174D] border-[#FBCFE8]';
    if (t === 'DOCX') color = 'bg-[#EBF4F5] text-[#1E4663] border-[#70A1A8]/40';
    if (t === 'ZIP') color = 'bg-[#FAF3E5] text-[#836527] border-[#EDD7AE]';

    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${color}`}>
        {t}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left py-6">
      
      {/* Download toast notification */}
      {downloadToast && (
        <div className="bg-[#14334A] text-white p-3 px-4 rounded-2xl text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <Download size={14} className="text-[#EDD7AE]" />
            <span>{downloadToast}</span>
          </div>
          <span className="text-[10px] text-white/60">Encrypted Workspace Download</span>
        </div>
      )}

      {/* 1. Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search & Type Filter */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search files by name or task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] placeholder-[#94A3B8] rounded-xl pl-9 pr-3 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
            className="bg-[#FAF9F6] text-xs font-semibold text-[#183047] rounded-xl px-3 py-2 border border-[#E5E7EB] focus:border-[#70A1A8] outline-none cursor-pointer"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="fig">Figma Prototypes (.fig)</option>
            <option value="docx">Word Specs (.docx)</option>
            <option value="zip">Handover Archives (.zip)</option>
          </select>
        </div>

        {/* Upload Action Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            leftIcon={<Upload size={14} />}
            className="text-xs shadow-xs"
          >
            Upload File
          </Button>
        </div>

      </div>

      {/* Security Privacy Notice Badge */}
      <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#70A1A8] shrink-0" />
          <span>
            <strong>Workspace Security:</strong> Project deliverables and files are restricted exclusively to approved team members and NGO coordinators.
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#94A3B8] hidden sm:inline">
          {filteredFiles.length} Authorized Files
        </span>
      </div>

      {/* 2. Files List Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(20,51,74,0.04)] overflow-hidden">
        
        {/* DESKTOP TABLE */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#E5E7EB]">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-4 font-bold">
                  File Name
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Type
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Related Task / Deliverable
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Uploaded By
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Date & Size
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-6 text-right font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-[#FAF9F6]/80 transition-colors group">
                  {/* File Name */}
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF9F6] border border-[#E5E7EB] text-[#70A1A8] flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        className="font-bold text-sm text-[#14334A] group-hover:text-[#70A1A8] transition-colors text-left cursor-pointer focus:outline-none truncate max-w-xs"
                      >
                        {file.name}
                      </button>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {fileTypeBadge(file.fileType)}
                  </td>

                  {/* Related Task */}
                  <td className="py-4 px-4">
                    <span className="text-xs text-[#64748B] line-clamp-1 max-w-xs">
                      {file.relatedTask || 'General Project Asset'}
                    </span>
                  </td>

                  {/* Uploaded By */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={file.uploadedBy.avatar}
                        alt={file.uploadedBy.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]"
                      />
                      <span className="text-xs text-[#183047] font-medium">
                        {file.uploadedBy.name}
                      </span>
                    </div>
                  </td>

                  {/* Date & Size */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-[#64748B]">
                    <div>{file.uploadDate}</div>
                    <span className="text-[10px] text-[#94A3B8]">{file.size}</span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        className="p-1.5 text-[#64748B] hover:text-[#14334A] hover:bg-[#FAF9F6] rounded-lg transition-colors cursor-pointer"
                        title="Preview File"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateDownload(file.name)}
                        className="p-1.5 text-[#70A1A8] hover:text-[#14334A] hover:bg-[#EBF4F5] rounded-lg transition-colors cursor-pointer"
                        title="Download File"
                      >
                        <Download size={15} />
                      </button>

                      {(!isStudent || file.uploadedBy.name.includes('Alex Chen')) && (
                        <button
                          type="button"
                          onClick={() => onDeleteFile(file.id)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#EA4335] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                          title="Remove File"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="sm:hidden divide-y divide-[#F1F5F9] p-2">
          {filteredFiles.map((file) => (
            <div key={file.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={18} className="text-[#70A1A8] shrink-0" />
                  <strong
                    onClick={() => setPreviewFile(file)}
                    className="text-xs font-bold text-[#14334A] truncate cursor-pointer"
                  >
                    {file.name}
                  </strong>
                </div>
                {fileTypeBadge(file.fileType)}
              </div>

              <div className="text-xs text-[#64748B] line-clamp-1">
                Task: {file.relatedTask || 'Project Asset'}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F1F5F9]">
                <span className="text-[11px] text-[#64748B]">
                  By {file.uploadedBy.name} • {file.size}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline-subtle"
                    size="sm"
                    onClick={() => setPreviewFile(file)}
                    className="text-xs py-1"
                  >
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSimulateDownload(file.name)}
                    className="text-xs py-1"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-[#94A3B8] flex items-center justify-center mx-auto">
              <Folder size={24} />
            </div>
            <h4 className="font-bold text-sm text-[#14334A]">No files match your filter</h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Upload project artifacts, requirements PDFs, or Figma prototypes to share with team members.
            </p>
          </div>
        )}

      </div>

      {/* 3. Upload File Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setUploadProgress(null);
        }}
        title="Upload Project Deliverable"
        description="Share files securely with approved student team members and NGO coordinators."
        maxWidth="md"
      >
        <form onSubmit={handleStartUpload} className="space-y-4 text-left -mt-2 text-xs">
          <div>
            <label className="font-semibold text-[#14334A] block mb-1">
              File Name / Document Title <span className="text-[#A57E59]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Rural_Learning_Platform_Prototype_v2"
              value={uploadFileName}
              onChange={(e) => setUploadFileName(e.target.value)}
              className="w-full bg-[#FAF9F6] text-xs sm:text-sm text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Format / File Type
              </label>
              <select
                value={uploadFileType}
                onChange={(e) => setUploadFileType(e.target.value)}
                className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              >
                <option value="PDF">PDF Document</option>
                <option value="FIG">Figma Archive (.fig)</option>
                <option value="DOCX">Word Document (.docx)</option>
                <option value="ZIP">Deliverables Archive (.zip)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#14334A] block mb-1">
                Related Project Task
              </label>
              <select
                value={uploadRelatedTask}
                onChange={(e) => setUploadRelatedTask(e.target.value)}
                className="w-full bg-[#FAF9F6] text-xs text-[#183047] p-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#70A1A8] outline-none"
              >
                {tasks.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Progress Simulation Bar */}
          {uploadError && (
            <div
              role="alert"
              className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] flex items-center gap-2"
            >
              <AlertTriangle size={14} />
              Prototype upload failed. Check the file and try again.
            </div>
          )}

          {uploadProgress !== null && (
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E7EB] space-y-1.5">
              <div className="flex justify-between font-semibold text-[#14334A]">
                <span>Uploading {uploadFileName}...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#E5E7EB]">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="h-full bg-[#70A1A8] transition-all duration-300"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setUploadProgress(null);
                setUploadError(true);
              }}
            >
              Simulate Error
            </Button>
            <Button
              variant="outline-subtle"
              size="sm"
              type="button"
              onClick={() => {
                setUploadModalOpen(false);
                setUploadProgress(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={uploadProgress !== null}
            >
              {uploadProgress !== null ? 'Uploading...' : 'Confirm Upload'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. File Preview Modal */}
      {previewFile && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewFile(null)}
          title={previewFile.name}
          description={`Uploaded by ${previewFile.uploadedBy.name} on ${previewFile.uploadDate} • ${previewFile.size}`}
          maxWidth="md"
        >
          <div className="text-left -mt-2 space-y-4 text-xs">
            {/* Mock Preview Content */}
            <div className="p-8 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5E7EB] text-[#70A1A8] flex items-center justify-center mx-auto shadow-2xs">
                <FileText size={32} />
              </div>
              <div>
                <strong className="block text-sm text-[#14334A]">{previewFile.name}</strong>
                <span className="text-xs text-[#64748B]">
                  Associated Task: {previewFile.relatedTask || 'Project Asset'}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] max-w-sm mx-auto">
                Authorized workspace preview. Deliverable satisfies Phase 2 milestone requirements.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleSimulateDownload(previewFile.name);
                  setPreviewFile(null);
                }}
                leftIcon={<Download size={14} />}
              >
                Download Document
              </Button>

              <Button variant="outline-subtle" size="sm" onClick={() => setPreviewFile(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
