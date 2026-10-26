import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Film, 
  Clock, 
  Sparkles, 
  Play, 
  Plus, 
  RefreshCw, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Project, ProjectStatus } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenUpload: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'User' | 'Sample'>('All');

  // Filter projects
  const filtered = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.sourceFileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const matchesType = typeFilter === 'All' || (typeFilter === 'User' ? !project.isSample : project.isSample);
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return <span className="text-[#B8F36B] font-medium">Completed</span>;
      case 'Processing':
        return <span className="text-sky-400 font-medium">Processing</span>;
      case 'Queued':
        return <span className="text-amber-400 font-medium">Queued</span>;
      case 'Failed':
        return <span className="text-red-400 font-medium">Failed</span>;
      default:
        return <span className="text-slate-400 font-medium">Uploaded</span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, manage, and filter your raw phone footage uploads and cinematic master renders.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="px-4 py-2 bg-[#B8F36B] hover:bg-[#A5E452] text-[#10131C] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Footage</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#161A26] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#10131C] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B8F36B]"
          />
        </div>

        {/* Status & Type Segmented Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#B8F36B]"
          >
            <option value="All">All Statuses</option>
            <option value="Uploaded">Uploaded</option>
            <option value="Queued">Queued</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#B8F36B]"
          >
            <option value="All">All Clips</option>
            <option value="User">My Uploads Only</option>
            <option value="Sample">Sample Demo Clips</option>
          </select>
        </div>
      </div>

      {/* Projects Table / Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#161A26] border border-white/10 p-12 text-center flex flex-col items-center justify-center">
          <Film className="w-8 h-8 text-slate-500 mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">No matching projects</h3>
          <p className="text-xs text-slate-400 mb-4">
            Try adjusting your search terms or filters, or upload a new clip.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setTypeFilter('All');
            }}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-[#161A26] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10131C] border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Clip Preview</th>
                  <th className="py-3 px-4">Title & Source</th>
                  <th className="py-3 px-4">Duration & Res</th>
                  <th className="py-3 px-4">Processing Status</th>
                  <th className="py-3 px-4">Preset</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filtered.map((project) => (
                  <tr 
                    key={project.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <td className="py-3 px-4 w-28">
                      <div 
                        onClick={() => onSelectProject(project)}
                        className="relative aspect-video rounded-lg overflow-hidden bg-black cursor-pointer border border-white/10 group-hover:border-[#B8F36B]/50 transition-colors"
                      >
                        <img
                          src={project.enhancedThumbnail || project.rawThumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        {project.isSample && (
                          <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded text-[9px] font-mono bg-black/70 text-slate-300">
                            Demo
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Title & File */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="text-white font-semibold hover:text-[#B8F36B] transition-colors text-left block"
                      >
                        {project.title}
                      </button>
                      <span className="text-[11px] font-mono text-slate-400 block truncate max-w-xs">
                        {project.sourceFileName} · {project.sourceFileSizeMb} MB
                      </span>
                    </td>

                    {/* Duration & Resolution */}
                    <td className="py-3 px-4 font-mono">
                      <span>{project.duration}</span>
                      <span className="text-slate-500 block text-[11px]">{project.resolution} · {project.fps}fps</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(project.status)}
                        {project.status === 'Processing' && (
                          <span className="font-mono text-xs text-slate-400">({project.progress}%)</span>
                        )}
                      </div>
                      {project.currentStage && (
                        <span className="text-[10px] text-slate-500 truncate block max-w-xs">
                          {project.currentStage}
                        </span>
                      )}
                    </td>

                    {/* Preset */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                        {project.settings?.preset || 'Cinematic'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectProject(project)}
                          className="px-3 py-1 bg-[#B8F36B] text-[#10131C] font-semibold rounded text-[11px] hover:bg-[#A5E452] transition-colors cursor-pointer"
                        >
                          Workspace
                        </button>
                        <button
                          type="button"
                          title="Delete Project"
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
