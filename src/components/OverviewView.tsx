import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Clock, 
  Film, 
  ArrowUpRight, 
  Play, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Filter,
  HardDrive
} from 'lucide-react';
import { Project, ActivePage } from '../types';
import { ASSETS } from '../services/videoApi';

interface OverviewViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenUpload: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects,
  onSelectProject,
  onOpenUpload,
  onNavigate,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'user' | 'samples'>('all');

  const filteredProjects = projects.filter((p) => {
    if (filterMode === 'user') return !p.isSample;
    if (filterMode === 'samples') return p.isSample;
    return true;
  });

  const userProjectsCount = projects.filter((p) => !p.isSample).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Your creative studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload raw phone footage to enhance resolution, stabilize motion, and master in cinematic 4K.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenUpload}
            className="px-5 py-2.5 bg-[#B8F36B] hover:bg-[#A5E452] text-[#10131C] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Footage</span>
          </button>
        </div>
      </div>

      {/* Large Upload Drop Banner */}
      <div 
        onClick={onOpenUpload}
        className="rounded-2xl border-2 border-dashed border-white/15 hover:border-[#B8F36B]/60 bg-[#141824] hover:bg-[#161B29] p-8 transition-all cursor-pointer group"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#1D2333] border border-white/10 flex items-center justify-center text-[#B8F36B] group-hover:scale-105 transition-transform shrink-0">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-[#B8F36B] transition-colors">
                Drop your handheld smartphone clips here
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Fast browser upload for MP4 and MOV files. Our virtual cinematographer stabilizes jitter, enhances lighting, and renders cinema tone curves.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-xs font-mono text-slate-500">
              MP4 · MOV · 4K / 60FPS
            </span>
            <span className="px-4 py-2 bg-white/10 group-hover:bg-[#B8F36B] text-white group-hover:text-[#10131C] font-semibold text-xs rounded-xl transition-all whitespace-nowrap">
              Select Video
            </span>
          </div>
        </div>
      </div>

      {/* Metrics & Quota Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#161A26] border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">Active Projects</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{projects.length}</span>
            <span className="text-xs text-slate-500">({userProjectsCount} uploaded by you)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161A26] border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">AI Processing Time Used</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#B8F36B]">42m</span>
            <span className="text-xs text-slate-500">/ 120m available</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161A26] border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">Master Output Storage</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">1.8 GB</span>
            <span className="text-xs text-slate-500">of 50 GB secure tier</span>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Projects</h2>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-[#10131C] p-1 rounded-lg border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterMode === 'all' ? 'bg-[#1D2333] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('user')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterMode === 'user' ? 'bg-[#1D2333] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                My Uploads ({userProjectsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('samples')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterMode === 'samples' ? 'bg-[#1D2333] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sample Footage ({projects.length - userProjectsCount})
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="text-xs text-[#B8F36B] hover:underline flex items-center gap-1"
          >
            <span>View all in project archive</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          /* Empty State for user uploads */
          <div className="rounded-2xl bg-[#161A26] border border-white/10 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 mb-3">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No user projects uploaded yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Select your own phone video file (.mp4 or .mov) to begin enhancing with Zetula AI.
            </p>
            <button
              type="button"
              onClick={onOpenUpload}
              className="px-4 py-2 bg-[#B8F36B] text-[#10131C] font-semibold text-xs rounded-lg hover:bg-[#A5E452] transition-colors"
            >
              Upload your first video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProjects.map((project) => {
              const isProcessing = project.status === 'Processing';
              const isQueued = project.status === 'Queued';
              const isCompleted = project.status === 'Completed';

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="group rounded-xl bg-[#161A26] border border-white/10 hover:border-white/25 overflow-hidden transition-all cursor-pointer flex flex-col hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={project.enhancedThumbnail || project.rawThumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badge: Sample vs User Upload */}
                    <div className="absolute top-2.5 left-2.5">
                      {project.isSample ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#10131C]/80 backdrop-blur-md text-slate-300 border border-white/10">
                          Demo Sample
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#B8F36B] text-[#10131C]">
                          User Upload
                        </span>
                      )}
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{project.duration}</span>
                    </div>

                    {/* Status Overlay if processing */}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
                        <div className="w-6 h-6 border-2 border-[#B8F36B] border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-[11px] font-semibold text-white">Enhancing... {project.progress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#B8F36B] transition-colors truncate mb-1">
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate font-mono">
                        {project.sourceFileName}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{project.resolution} · {project.fps}fps</span>
                      <span className={`font-medium ${
                        isCompleted ? 'text-[#B8F36B]' :
                        isProcessing ? 'text-sky-400' :
                        isQueued ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
