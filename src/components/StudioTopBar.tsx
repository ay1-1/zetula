import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  HelpCircle, 
  Upload, 
  Cpu, 
  Check, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActivePage } from '../types';

interface StudioTopBarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenUpload: () => void;
  userProjectCount: number;
}

export const StudioTopBar: React.FC<StudioTopBarProps> = ({
  activePage,
  onNavigate,
  onOpenUpload,
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const pageTitles: Record<ActivePage, { title: string; subtitle: string }> = {
    homepage: { title: 'Home', subtitle: 'Public marketing showcase' },
    overview: { title: 'Your creative studio', subtitle: 'Project management & video processing center' },
    workspace: { title: 'Video Enhancement Workspace', subtitle: 'Fine-tune neural grading, virtual gimbal, and reframing' },
    projects: { title: 'My Projects', subtitle: 'Full library of uploaded and processed clips' },
    exports: { title: 'Export History', subtitle: 'Download and manage rendered 4K masters' },
    settings: { title: 'Studio Settings', subtitle: 'Account preferences, storage, and worker API' },
  };

  const currentInfo = pageTitles[activePage] || { title: 'Studio', subtitle: 'Video enhancement' };

  return (
    <header className="h-16 bg-[#10131C] border-b border-white/10 px-6 flex items-center justify-between gap-6 shrink-0 z-30">
      {/* Left: Mobile Brand & Context Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* On smaller screens show brand logo if sidebar hidden */}
        <div className="md:hidden">
          <BrandLogo size="sm" onClick={() => onNavigate('overview')} />
        </div>

        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{currentInfo.title}</span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Action & Status Area */}
      <div className="flex items-center gap-4">
        {/* Demo Mode & Worker Engine indicator */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161A26] border border-white/10 text-xs text-slate-300 hover:border-white/20 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#B8F36B] shadow-[0_0_8px_#B8F36B]" />
            <span className="font-medium text-slate-200">AI Engine: Client & Preview Mode</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDemoInfo && (
            <div className="absolute right-0 top-full mt-2 w-80 p-4 bg-[#161A26] border border-white/10 rounded-xl shadow-2xl z-50 text-xs text-slate-300">
              <div className="flex items-center justify-between font-bold text-white mb-2">
                <span>Architecture & Processing</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#B8F36B]/20 text-[#B8F36B]">V2.4</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">
                Live workspace controls apply instant WebGL/Canvas visual grading. Background enhancement jobs are orchestrated asynchronously, ready for connection to your Supabase PostgreSQL database and FFmpeg GPU workers.
              </p>
              <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-slate-500">
                <span>Demo mode active</span>
                <button
                  onClick={() => {
                    setShowDemoInfo(false);
                    onNavigate('settings');
                  }}
                  className="text-[#B8F36B] hover:underline"
                >
                  Configure API endpoint &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Quick Button */}
        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#B8F36B] text-[#10131C] font-semibold text-xs rounded-lg hover:bg-[#A5E452] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Video</span>
        </button>

        {/* User Account Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#1D2333] border border-white/15 flex items-center justify-center font-bold text-xs text-[#B8F36B]">
              Z
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">Creator Studio</span>
              <span className="text-[10px] text-slate-400 leading-tight">Pro Plan</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showAccountMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-[#161A26] border border-white/10 rounded-xl shadow-2xl z-50 text-xs">
              <div className="p-2 border-b border-white/5 mb-1">
                <p className="font-semibold text-white">Creator Studio Account</p>
                <p className="text-slate-400 text-[11px]">creator@zetula.studio</p>
              </div>

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  onNavigate('overview');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
              >
                Studio Dashboard
              </button>

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  onNavigate('projects');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
              >
                Project Archive
              </button>

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  onNavigate('settings');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
              >
                Settings & API
              </button>

              <div className="my-1 border-t border-white/5" />

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  onNavigate('homepage');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                Back to Marketing Home
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
