import React, { useState } from 'react';
import { 
  DownloadCloud, 
  Download, 
  Film, 
  CheckCircle2, 
  Trash2, 
  ExternalLink,
  Sparkles,
  FileCheck,
  HardDrive
} from 'lucide-react';
import { ExportRecord } from '../types';
import { ASSETS } from '../services/videoApi';

interface ExportsViewProps {
  exports: ExportRecord[];
  onDeleteExport: (id: string) => void;
  onOpenWorkspace: () => void;
}

export const ExportsView: React.FC<ExportsViewProps> = ({
  exports,
  onDeleteExport,
  onOpenWorkspace,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const triggerDownload = (record: ExportRecord) => {
    const filename = `${record.projectTitle.replace(/\s+/g, '_')}_${record.resolution}_${record.codec.replace(/\s+/g, '')}.jpg`;
    const link = document.createElement('a');
    link.href = record.downloadUrl || ASSETS.enhancedVideoFrame;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(`Downloaded master file: ${filename} (${record.sizeMb} MB)`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const totalSizeMb = exports.reduce((acc, curr) => acc + curr.sizeMb, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Export History & Masters</h1>
          <p className="text-xs text-slate-400 mt-1">
            Download your enhanced 4K clips in ProRes 422, H.265, and H.264 formats.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-[#161A26] border border-white/10 px-3.5 py-2 rounded-xl">
          <HardDrive className="w-3.5 h-3.5 text-[#B8F36B]" />
          <span>Total Master Files: <strong>{exports.length}</strong></span>
          <span>·</span>
          <span>Storage: <strong>{(totalSizeMb / 1024).toFixed(2)} GB</strong></span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B8F36B]" />
            <span>{downloadNotice}</span>
          </div>
          <span className="font-mono text-emerald-400 text-[10px]">SAVED TO DISK</span>
        </div>
      )}

      {/* Exports Table */}
      {exports.length === 0 ? (
        <div className="rounded-2xl bg-[#161A26] border border-white/10 p-12 text-center flex flex-col items-center justify-center">
          <DownloadCloud className="w-8 h-8 text-slate-500 mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">No completed exports yet</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm">
            Launch the enhancement workspace on any video to render and export a cinematic master file.
          </p>
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="px-4 py-2 bg-[#B8F36B] text-[#10131C] font-semibold text-xs rounded-lg hover:bg-[#A5E452] transition-colors"
          >
            Go to Workspace
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-[#161A26] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10131C] border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Master Title</th>
                  <th className="py-3 px-4">Render Date</th>
                  <th className="py-3 px-4">Resolution & Codec</th>
                  <th className="py-3 px-4">Duration & Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {exports.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#10131C] border border-white/10 flex items-center justify-center text-[#B8F36B] shrink-0">
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-white font-semibold block">{item.projectTitle}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.isSample ? 'Sample Project Master' : 'User Production Master'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      {item.timestamp}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="text-[#B8F36B] font-semibold">{item.resolution}</span>
                      <span className="text-slate-400 block text-[11px]">{item.codec} · {item.fps}fps</span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span>{item.duration}</span>
                      <span className="text-slate-400 block text-[11px]">{item.sizeMb} MB</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800 text-[11px] text-[#B8F36B]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => triggerDownload(item)}
                          className="px-3 py-1.5 bg-[#B8F36B] hover:bg-[#A5E452] text-[#10131C] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>

                        <button
                          type="button"
                          title="Remove from history"
                          onClick={() => onDeleteExport(item.id)}
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
