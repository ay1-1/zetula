import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  FolderKanban, 
  DownloadCloud, 
  Settings, 
  Home, 
  Sparkles,
  HardDrive,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActivePage } from '../types';

interface StudioSidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenUpload: () => void;
  userProjectCount: number;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activePage,
  onNavigate,
  onOpenUpload,
  userProjectCount,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'workspace', label: 'Enhance Video', icon: Sparkles, highlight: true },
    { id: 'projects', label: 'My Projects', icon: FolderKanban, count: userProjectCount },
    { id: 'exports', label: 'Exports', icon: DownloadCloud },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0E1119] border-r border-white/10 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <BrandLogo size="sm" onClick={() => onNavigate('overview')} />
      </div>

      {/* Primary Action Button */}
      <div className="p-4">
        <button
          type="button"
          onClick={onOpenUpload}
          className="w-full py-2.5 px-4 bg-[#B8F36B] hover:bg-[#A5E452] text-[#10131C] font-bold text-sm rounded-xl transition-all shadow-md shadow-[#B8F36B]/15 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#10131C]" />
          <span>New Enhancement</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id as ActivePage)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1D2333] text-white font-semibold border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B8F36B]' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Storage and System Health */}
      <div className="p-4 mx-3 mb-3 rounded-xl bg-[#161A26] border border-white/10 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-[#B8F36B]" />
            <span className="font-medium text-slate-300">GPU Quota</span>
          </div>
          <span className="font-mono text-slate-400">42 / 120 min</span>
        </div>
        <div className="w-full bg-[#10131C] h-1.5 rounded-full overflow-hidden border border-white/5">
          <div className="bg-[#B8F36B] h-full rounded-full w-[35%]" />
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
          <span>Pro Studio Plan</span>
          <button 
            onClick={() => onNavigate('settings')} 
            className="text-[#B8F36B] hover:underline"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Return to Landing & User footer */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <button
          type="button"
          onClick={() => onNavigate('homepage')}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span>Marketing Page</span>
        </button>

        <span className="text-[11px] text-slate-600 font-mono">v2.4</span>
      </div>
    </aside>
  );
};
