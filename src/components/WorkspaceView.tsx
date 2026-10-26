import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Download, 
  Play, 
  Film, 
  Crop, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Info,
  Maximize2,
  RefreshCw,
  Layers,
  Zap,
  HardDrive
} from 'lucide-react';
import { Project, EnhancementSettings, VideoPreset, AspectRatio, ResolutionOption, ExportCodec, ExportRecord } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ASSETS, DEFAULT_SETTINGS, VideoApiService } from '../services/videoApi';

interface WorkspaceViewProps {
  project: Project | null;
  onUpdateProject: (updated: Project) => void;
  onAddExport: (record: ExportRecord) => void;
  onOpenUpload: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  project,
  onUpdateProject,
  onAddExport,
  onOpenUpload,
}) => {
  if (!project) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-[#161A26] border border-white/10 flex items-center justify-center text-slate-400 mb-4">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No video selected for enhancement</h2>
        <p className="text-sm text-slate-400 mb-6">
          Choose a project from your library or upload new smartphone footage to launch the creative workspace.
        </p>
        <button
          type="button"
          onClick={onOpenUpload}
          className="px-6 py-2.5 bg-[#B8F36B] text-[#10131C] font-bold text-xs rounded-xl hover:bg-[#A5E452] transition-colors"
        >
          Upload Footage Now
        </button>
      </div>
    );
  }

  // Active settings state
  const [settings, setSettings] = useState<EnhancementSettings>(project.settings || DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(project.status === 'Processing');
  const [progress, setProgress] = useState(project.progress || 0);
  const [currentStage, setCurrentStage] = useState(project.currentStage || 'Ready to enhance');
  const [errorState, setErrorState] = useState<string | null>(project.status === 'Failed' ? (project.errorMessage || 'Enhancement failed') : null);
  const [simulateError, setSimulateError] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  // Sync settings when project changes
  useEffect(() => {
    setSettings(project.settings || DEFAULT_SETTINGS);
    setIsProcessing(project.status === 'Processing');
    setProgress(project.progress || 0);
    setCurrentStage(project.currentStage || 'Ready to enhance');
    setErrorState(project.status === 'Failed' ? (project.errorMessage || 'Enhancement failed') : null);
  }, [project.id]);

  // Handle Preset Switching
  const applyPreset = (preset: VideoPreset) => {
    let presetValues: Partial<EnhancementSettings> = {};
    if (preset === 'Natural') {
      presetValues = {
        clarity: 65,
        denoise: 60,
        lighting: 55,
        colorBalance: 0,
        stabilization: 75,
        lockHorizon: true,
      };
    } else if (preset === 'Commercial') {
      presetValues = {
        clarity: 88,
        denoise: 80,
        lighting: 78,
        colorBalance: 10,
        stabilization: 92,
        lockHorizon: true,
      };
    } else if (preset === 'Cinematic') {
      presetValues = {
        clarity: 82,
        denoise: 70,
        lighting: 72,
        colorBalance: 18,
        stabilization: 88,
        lockHorizon: true,
      };
    }

    const updated = { ...settings, preset, ...presetValues };
    setSettings(updated);
    onUpdateProject({ ...project, settings: updated });
  };

  const handleSettingChange = <K extends keyof EnhancementSettings>(key: K, value: EnhancementSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    onUpdateProject({ ...project, settings: updated });
  };

  // Start Asynchronous Enhancement Job
  const handleStartEnhance = () => {
    setErrorState(null);
    setIsProcessing(true);
    setProgress(5);
    setCurrentStage('Job dispatched: Allocating GPU worker & initializing sensor telemetry');

    onUpdateProject({
      ...project,
      status: 'Processing',
      progress: 5,
      currentStage: 'Allocating GPU worker',
      settings,
    });

    const stages = [
      { p: 18, msg: 'Pass 1/5: Multi-axis gyroscopic stabilization & motion vector analysis' },
      { p: 42, msg: 'Pass 2/5: Spatial-temporal AI denoise & micro-texture reconstruction' },
      { p: 68, msg: 'Pass 3/5: Dynamic range shadow recovery & virtual lighting leveling' },
      { p: 85, msg: 'Pass 4/5: 10-bit cinema tone curve rendering & subject reframe' },
      { p: 96, msg: 'Pass 5/5: Transcoding master 4K ProRes / H.265 stream' },
      { p: 100, msg: 'Completed: Master file ready for download' },
    ];

    let step = 0;
    const interval = setInterval(() => {
      // Check if user turned on error simulation
      if (simulateError && step === 2) {
        clearInterval(interval);
        setIsProcessing(false);
        setErrorState('GPU Worker Timeout: Frame rate mismatch detected in source audio/video track. Please retry.');
        onUpdateProject({
          ...project,
          status: 'Failed',
          errorMessage: 'GPU Worker Timeout: Frame rate mismatch detected in source audio/video track.',
          currentStage: 'Failed during Pass 2/5',
        });
        return;
      }

      if (step < stages.length) {
        setProgress(stages[step].p);
        setCurrentStage(stages[step].msg);
        onUpdateProject({
          ...project,
          status: stages[step].p === 100 ? 'Completed' : 'Processing',
          progress: stages[step].p,
          currentStage: stages[step].msg,
          enhancedThumbnail: project.enhancedThumbnail || ASSETS.enhancedVideoFrame,
          enhancedFileUrl: project.enhancedFileUrl || ASSETS.enhancedVideoFrame,
        });
        step++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 900);
  };

  // Trigger Download Action (with authentic client-side blob download in demo mode)
  const handleDownload = () => {
    if (project.status !== 'Completed') return;

    // Record export
    const newExport: ExportRecord = {
      id: `exp-${Date.now()}`,
      projectId: project.id,
      projectTitle: `${project.title} (${settings.exportResolution})`,
      timestamp: new Date().toLocaleString(),
      resolution: settings.exportResolution,
      codec: settings.exportCodec,
      fps: settings.frameInterpolation ? 60 : 30,
      duration: project.duration,
      sizeMb: Number((project.sourceFileSizeMb * (settings.exportResolution === '4K' ? 1.8 : 0.9)).toFixed(1)),
      status: 'Ready',
      downloadUrl: project.enhancedFileUrl || ASSETS.enhancedVideoFrame,
      isSample: project.isSample,
    };
    onAddExport(newExport);

    // Create authentic downloadable file link
    const downloadFileName = `${project.title.replace(/\s+/g, '_')}_Zetula_Master_${settings.exportResolution}.jpg`;
    const link = document.createElement('a');
    link.href = project.enhancedFileUrl || ASSETS.enhancedVideoFrame;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessNotice(`Downloaded master file: ${downloadFileName} (${newExport.sizeMb} MB)`);
    setTimeout(() => setDownloadSuccessNotice(null), 5000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Sub-header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Project</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-white font-medium">{project.title}</span>
            <span>·</span>
            <span className="font-mono text-slate-400">{project.sourceFileName}</span>
            <span>·</span>
            <span className="font-mono text-slate-400">{project.duration}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Cinematic Enhancement Workspace
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {project.status === 'Completed' && (
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all border border-white/15 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B8F36B]" />
              <span>Download Master</span>
            </button>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleStartEnhance}
            className="px-5 py-2.5 bg-[#B8F36B] hover:bg-[#A5E452] disabled:opacity-50 text-[#10131C] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing ({progress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{project.status === 'Completed' ? 'Re-enhance Video' : 'Enhance Video'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notice Banner if Download Success */}
      {downloadSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B8F36B]" />
            <span>{downloadSuccessNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
        </div>
      )}

      {/* Processing or Error Alert Banner */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-[#161A26] border border-[#B8F36B]/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8F36B] animate-pulse" />
              <span className="font-semibold text-white">{currentStage}</span>
            </div>
            <span className="font-mono text-[#B8F36B] font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-[#10131C] h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-[#B8F36B] h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {errorState && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-200">Processing Interrupted</h4>
              <p className="text-xs text-red-300/80 mt-0.5">{errorState}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartEnhance}
            className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-white rounded-lg text-xs font-medium border border-red-700 shrink-0 transition-colors"
          >
            Retry Job
          </button>
        </div>
      )}

      {/* Main Workspace Grid: Large Preview + Enhancement Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Large Interactive Before/After Visual Arena */}
        <div className="lg:col-span-8 space-y-4">
          <BeforeAfterSlider
            rawSrc={project.rawThumbnail || ASSETS.rawVideoFrame}
            enhancedSrc={project.enhancedThumbnail || ASSETS.enhancedVideoFrame}
            settings={settings}
            aspectRatio={settings.smartReframe}
          />

          {/* Saliency & Virtual Cinematographer Info strip */}
          <div className="p-3 rounded-xl bg-[#141824] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8F36B]" />
              <span className="text-slate-300">Subject Saliency Lock: Active</span>
              <span className="text-slate-600">·</span>
              <span>Horizon Level: 0.2° corrected</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>{settings.exportResolution} {settings.frameInterpolation ? '60fps' : '30fps'}</span>
              <span>·</span>
              <span>{settings.exportCodec}</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Control Deck */}
        <div className="lg:col-span-4 space-y-5">
          {/* Preset Selector */}
          <div className="p-5 rounded-2xl bg-[#161A26] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Cinematic Style Preset
              </span>
              <button
                type="button"
                onClick={() => applyPreset('Cinematic')}
                className="text-[11px] text-[#B8F36B] hover:underline"
              >
                Reset Default
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Natural', 'Commercial', 'Cinematic'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    settings.preset === preset
                      ? 'bg-[#B8F36B] text-[#10131C] shadow-sm'
                      : 'bg-[#10131C] text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Enhancement Sliders Deck */}
          <div className="p-5 rounded-2xl bg-[#161A26] border border-white/10 space-y-4">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Optical & Neural Tuning
            </span>

            {/* Clarity Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Clarity & Edge Sharpness</span>
                <span className="font-mono text-white text-[11px]">{settings.clarity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.clarity}
                onChange={(e) => handleSettingChange('clarity', Number(e.target.value))}
                className="w-full accent-[#B8F36B] cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Reconstructs lost texture details from phone sensors.</p>
            </div>

            {/* Denoise Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">3D Temporal Denoise</span>
                <span className="font-mono text-white text-[11px]">{settings.denoise}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.denoise}
                onChange={(e) => handleSettingChange('denoise', Number(e.target.value))}
                className="w-full accent-[#B8F36B] cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Cleans low-light sensor grain across frame sequences.</p>
            </div>

            {/* Lighting Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Lighting & Dynamic Range</span>
                <span className="font-mono text-white text-[11px]">{settings.lighting}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.lighting}
                onChange={(e) => handleSettingChange('lighting', Number(e.target.value))}
                className="w-full accent-[#B8F36B] cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Recovers blown highlights and lifted shadows.</p>
            </div>

            {/* Color Balance Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Color Balance (Warm / Cool)</span>
                <span className="font-mono text-white text-[11px]">{settings.colorBalance > 0 ? `+${settings.colorBalance}` : settings.colorBalance}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={settings.colorBalance}
                onChange={(e) => handleSettingChange('colorBalance', Number(e.target.value))}
                className="w-full accent-[#B8F36B] cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Harmonizes mixed artificial and daylight sources.</p>
            </div>

            {/* Stabilization Slider & Horizon Lock */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Virtual Gimbal Damping</span>
                  <span className="font-mono text-[#B8F36B] text-[11px]">{settings.stabilization}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.stabilization}
                  onChange={(e) => handleSettingChange('stabilization', Number(e.target.value))}
                  className="w-full accent-[#B8F36B] cursor-pointer"
                />
              </div>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>Lock Cinematic Horizon</span>
                <input
                  type="checkbox"
                  checked={settings.lockHorizon}
                  onChange={(e) => handleSettingChange('lockHorizon', e.target.checked)}
                  className="w-4 h-4 accent-[#B8F36B] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Smart Reframe Section */}
          <div className="p-5 rounded-2xl bg-[#161A26] border border-white/10 space-y-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Smart Reframe (Auto-Crop)
            </span>

            <div className="grid grid-cols-4 gap-2">
              {(['Original', '9:16', '1:1', '16:9'] as const).map((aspect) => (
                <button
                  key={aspect}
                  type="button"
                  onClick={() => handleSettingChange('smartReframe', aspect)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                    settings.smartReframe === aspect
                      ? 'bg-[#B8F36B] text-[#10131C] font-bold'
                      : 'bg-[#10131C] text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {aspect}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Virtual subject centering keeps the creator or primary action locked in safe zones.
            </p>
          </div>

          {/* Export Quality & Codec Specifications */}
          <div className="p-5 rounded-2xl bg-[#161A26] border border-white/10 space-y-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Master Export Settings
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Resolution</label>
                <select
                  value={settings.exportResolution}
                  onChange={(e) => handleSettingChange('exportResolution', e.target.value as ResolutionOption)}
                  className="w-full bg-[#10131C] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-[#B8F36B]"
                >
                  <option value="1080p">1080p (FHD)</option>
                  <option value="4K">4K UHD (Master)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Codec</label>
                <select
                  value={settings.exportCodec}
                  onChange={(e) => handleSettingChange('exportCodec', e.target.value as ExportCodec)}
                  className="w-full bg-[#10131C] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-[#B8F36B]"
                >
                  <option value="ProRes 422">Apple ProRes 422</option>
                  <option value="H.265">H.265 (HEVC 10-bit)</option>
                  <option value="H.264">H.264 (Broad Compatibility)</option>
                </select>
              </div>
            </div>

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-2 border-t border-white/5">
              <span>60 FPS Motion Interpolation</span>
              <input
                type="checkbox"
                checked={settings.frameInterpolation}
                onChange={(e) => handleSettingChange('frameInterpolation', e.target.checked)}
                className="w-4 h-4 accent-[#B8F36B] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* QA & Pipeline Debug Utility */}
          <div className="p-3 rounded-xl bg-[#10131C] border border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Simulate Error Condition</span>
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
              className="accent-red-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
