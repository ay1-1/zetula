import React, { useState } from 'react';
import { 
  User, 
  HardDrive, 
  Cpu, 
  Shield, 
  Key, 
  Check, 
  Database, 
  ExternalLink,
  Save,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { WORKER_CONFIG, VideoWorkerConfig } from '../services/videoApi';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'storage' | 'worker' | 'api'>('account');
  const [config, setConfig] = useState<VideoWorkerConfig>(WORKER_CONFIG);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Studio Settings & Architecture</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account profile, storage allocations, and background video worker API endpoints.
        </p>
      </div>

      {saveNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-[#B8F36B]" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-medium">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'account' ? 'bg-[#1D2333] text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Account & Subscription
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'storage' ? 'bg-[#1D2333] text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Object Storage
        </button>
        <button
          onClick={() => setActiveTab('worker')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'worker' ? 'bg-[#1D2333] text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Worker Engine & FFmpeg
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'api' ? 'bg-[#1D2333] text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          API Integration Points
        </button>
      </div>

      {/* Tab: Account */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#161A26] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
              Creator Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Studio Display Name</label>
                <input
                  type="text"
                  defaultValue="Zetula Creator Studio"
                  className="w-full bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#B8F36B]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Account Email</label>
                <input
                  type="email"
                  defaultValue="creator@zetula.studio"
                  className="w-full bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#B8F36B]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161A26] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                  Current Plan: Pro Cinematographer
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  120 GPU minutes/month with 4K ProRes master transcoding.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#B8F36B]/10 border border-[#B8F36B]/30 text-xs font-mono font-bold text-[#B8F36B]">
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#10131C] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>GPU Processing Minutes Quota</span>
                <span className="font-mono text-[#B8F36B]">42 / 120 min</span>
              </div>
              <div className="w-full bg-[#161A26] h-2 rounded-full overflow-hidden">
                <div className="bg-[#B8F36B] h-full w-[35%]" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Resets in 18 days</span>
                <span>Max job length: 15 minutes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Storage */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#161A26] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-[#B8F36B]" />
              <div>
                <h2 className="text-sm font-bold text-white">Private Object Storage Integration</h2>
                <p className="text-xs text-slate-400">
                  Raw uploaded video files are kept strictly segregated from enhanced masters.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs pt-2">
              <div>
                <label className="text-slate-400 block mb-1">Storage Provider Backend</label>
                <select
                  value={config.storageProvider}
                  onChange={(e) => setConfig({ ...config, storageProvider: e.target.value as any })}
                  className="w-full sm:w-80 bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#B8F36B]"
                >
                  <option value="supabase_storage">Supabase Storage (Recommended)</option>
                  <option value="s3">Amazon S3 / Cloudflare R2</option>
                  <option value="local">Client Browser Local Cache (Demo Mode)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Raw Footage Bucket</label>
                <input
                  type="text"
                  defaultValue="zetula-raw-footage-private"
                  className="w-full bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                  readOnly
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Master Output Exports Bucket</label>
                <input
                  type="text"
                  defaultValue="zetula-enhanced-masters-cdn"
                  className="w-full bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Worker Engine & FFmpeg */}
      {activeTab === 'worker' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#161A26] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-[#B8F36B]" />
              <div>
                <h2 className="text-sm font-bold text-white">FFmpeg & AI Processing Worker Architecture</h2>
                <p className="text-xs text-slate-400">
                  Configure asynchronous background job processing endpoints and concurrency limits.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs pt-2">
              <div>
                <label className="text-slate-400 block mb-1">Execution Mode</label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, backendMode: 'demo' })}
                    className={`py-2 px-3 rounded-lg border text-left font-medium transition-all ${
                      config.backendMode === 'demo'
                        ? 'border-[#B8F36B] bg-[#B8F36B]/10 text-white'
                        : 'border-white/10 bg-[#10131C] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-white">Client / Demo Mode</div>
                    <div className="text-[11px] text-slate-400">WebGL shader preview & simulated async job pipeline</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, backendMode: 'live' })}
                    className={`py-2 px-3 rounded-lg border text-left font-medium transition-all ${
                      config.backendMode === 'live'
                        ? 'border-[#B8F36B] bg-[#B8F36B]/10 text-white'
                        : 'border-white/10 bg-[#10131C] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-white">Live Remote Worker</div>
                    <div className="text-[11px] text-slate-400">Direct HTTP/WebSocket to private GPU server</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Worker API Base URL</label>
                <input
                  type="text"
                  value={config.apiEndpoint}
                  onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
                  className="w-full bg-[#10131C] border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B8F36B] text-[#10131C] font-bold text-xs rounded-lg hover:bg-[#A5E452] transition-colors flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: API Integration Points */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#161A26] border border-white/10 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Clean REST & WebSocket Integration Contract</h2>
              <p className="text-xs text-slate-400">
                The application connects to backend services through clean asynchronous job contracts:
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#10131C] border border-white/5">
                <div className="text-[#B8F36B] font-semibold">POST /api/v1/uploads</div>
                <div className="text-slate-400 mt-1">Uploads raw MP4/MOV file with presigned URL to private storage bucket.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#10131C] border border-white/5">
                <div className="text-[#B8F36B] font-semibold">POST /api/v1/jobs</div>
                <div className="text-slate-400 mt-1">Enqueues enhancement pipeline with clarity, denoise, lighting, and reframe parameters.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#10131C] border border-white/5">
                <div className="text-[#B8F36B] font-semibold">GET /api/v1/jobs/:jobId</div>
                <div className="text-slate-400 mt-1">Polls job progress (0-100%), stage message, and stream preview chunks.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#10131C] border border-white/5">
                <div className="text-[#B8F36B] font-semibold">GET /api/v1/exports/:id/download</div>
                <div className="text-slate-400 mt-1">Returns authenticated download token for rendered 4K ProRes or H.265 master video.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
