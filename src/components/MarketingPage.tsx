import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  Maximize2, 
  ShieldCheck, 
  Zap, 
  Video, 
  CheckCircle2, 
  Crop, 
  Layers, 
  Smartphone,
  Play,
  RotateCw
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ASSETS, DEFAULT_SETTINGS } from '../services/videoApi';
import { EnhancementSettings, ActivePage } from '../types';

interface MarketingPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenUpload: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({
  onNavigate,
  onOpenUpload,
}) => {
  // Interactive feature preview tab
  const [activeFeatureTab, setActiveFeatureTab] = useState<'enhance' | 'stabilize' | 'reframe' | 'looks' | 'export'>('enhance');

  // Interactive demo settings state
  const [demoSettings, setDemoSettings] = useState<EnhancementSettings>({
    ...DEFAULT_SETTINGS,
    preset: 'Cinematic',
    clarity: 85,
    lighting: 72,
    stabilization: 90,
    smartReframe: 'Original',
  });

  return (
    <div className="min-h-screen bg-[#10131C] text-white flex flex-col">
      {/* 3-Zone Top Navigation Contract */}
      <header className="sticky top-0 z-50 bg-[#10131C]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark / Official Logo */}
          <div className="shrink-0">
            <BrandLogo size="md" onClick={() => onNavigate('homepage')} />
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Features
            </a>
            <a href="#demo" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Live Comparison
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              How It Works
            </a>
            <button 
              onClick={() => onNavigate('overview')}
              className="hover:text-[#B8F36B] transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Studio Dashboard
            </button>
            <button 
              onClick={() => onNavigate('workspace')}
              className="hover:text-[#B8F36B] transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Workspace
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenUpload}
              className="px-5 py-2.5 bg-[#B8F36B] text-[#10131C] font-semibold text-sm rounded-lg hover:bg-[#A5E452] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 shadow-lg shadow-[#B8F36B]/15"
            >
              Start enhancing
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#B8F36B]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Hero Typography & Value Proposition */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs text-slate-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8F36B]" />
              <span>Zetula AI Cinematography Engine 2.4</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.12] text-balance">
              Turn ordinary footage into extraordinary video.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal mb-8 leading-relaxed text-balance">
              Transform handheld smartphone clips into cleaner, steadier, better-lit, and professionally framed footage. Your phone. Your vision. A cinematic finish.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenUpload}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#B8F36B] text-[#10131C] font-bold text-base rounded-xl hover:bg-[#A5E452] transition-all shadow-xl shadow-[#B8F36B]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start enhancing</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#161A26] text-white font-semibold text-base rounded-xl border border-white/15 hover:border-white/30 hover:bg-[#1D2333] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore the studio</span>
              </button>
            </div>
          </div>

          {/* Interactive Before & After Showcase */}
          <div id="demo" className="mt-8 max-w-5xl mx-auto">
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-[#B8F36B] font-semibold">Interactive Technology Demonstration</span>
                <span>·</span>
                <span>Shot on iPhone 15 Pro handheld in low-light alley</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span>NEURAL UPSCALED TO 4K</span>
                <span>·</span>
                <span>60 FPS SMOOTH</span>
              </div>
            </div>

            <BeforeAfterSlider
              rawSrc={ASSETS.rawVideoFrame}
              enhancedSrc={ASSETS.enhancedVideoFrame}
              settings={demoSettings}
              aspectRatio="16:9"
            />

            {/* Interactive Control Strip underneath preview */}
            <div className="mt-4 p-4 rounded-xl bg-[#161A26] border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Clarity & Sharpness</span>
                  <span className="font-mono text-white text-[11px]">{demoSettings.clarity}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={demoSettings.clarity}
                  onChange={(e) => setDemoSettings({ ...demoSettings, clarity: Number(e.target.value) })}
                  className="w-full accent-[#B8F36B] cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Lighting & Dynamic Range</span>
                  <span className="font-mono text-white text-[11px]">{demoSettings.lighting}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={demoSettings.lighting}
                  onChange={(e) => setDemoSettings({ ...demoSettings, lighting: Number(e.target.value) })}
                  className="w-full accent-[#B8F36B] cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Virtual Gimbal</span>
                  <span className="font-mono text-[#B8F36B] text-[11px]">{demoSettings.stabilization}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={demoSettings.stabilization}
                  onChange={(e) => setDemoSettings({ ...demoSettings, stabilization: Number(e.target.value) })}
                  className="w-full accent-[#B8F36B] cursor-pointer"
                />
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className="w-full">
                  <span className="block text-xs text-slate-400 mb-1.5">Cinematic Style</span>
                  <div className="grid grid-cols-3 gap-1 bg-[#10131C] p-1 rounded-lg border border-white/10 text-[11px]">
                    {(['Natural', 'Commercial', 'Cinematic'] as const).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDemoSettings({ ...demoSettings, preset })}
                        className={`py-1 rounded text-center font-medium transition-colors ${
                          demoSettings.preset === preset
                            ? 'bg-[#B8F36B] text-[#10131C] font-semibold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="py-20 px-6 border-t border-white/10 bg-[#0C0E15]">
        <div className="max-w-7xl mx-auto">
          {/* Section Kicker & Title */}
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-widest text-[#B8F36B] font-semibold">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
              A complete virtual cinematography suite in your browser.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Engineered specifically for creators shooting on iPhones, Android flagships, and compact mirrorless gear. No clunky desktop plugins required.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Enhance (Large 2-col span) */}
            <div className="md:col-span-2 rounded-2xl bg-[#161A26] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#B8F36B]/10 border border-[#B8F36B]/30 flex items-center justify-center text-[#B8F36B] mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  01. Neural Resolution & Dynamic Lighting
                </h3>
                <p className="text-slate-300 text-base leading-relaxed mb-6">
                  Recover lost shadow textures, eliminate muddy mobile digital noise, and reconstruct crisp sub-pixel details. Our dual-pass neural pipeline separates high-frequency noise from true edge definitions, producing razor-sharp 4K masters without the plastic airbrushed look.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Clarity Boost</span>
                  <strong className="text-white font-mono text-sm">Up to 4K UHD</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Noise Reduction</span>
                  <strong className="text-[#B8F36B] font-mono text-sm">Temporal 3D</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Dynamic Range</span>
                  <strong className="text-white font-mono text-sm">+2.8 EV Recovered</strong>
                </div>
              </div>
            </div>

            {/* Feature 2: Stabilize */}
            <div className="rounded-2xl bg-[#161A26] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-6">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  02. Multi-Axis Virtual Gimbal
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Smooth out aggressive footstep bobbing, panning stutter, and accidental jitters. Zetula calculates smooth virtual camera trajectories while locking the true horizon line.
                </p>
              </div>

              <div className="bg-[#10131C] p-3 rounded-lg border border-white/10 text-xs text-slate-400 flex items-center justify-between">
                <span>Active Roll & Pitch Damping</span>
                <span className="text-[#B8F36B] font-mono font-semibold">94% Stable</span>
              </div>
            </div>

            {/* Feature 3: Smart Reframe */}
            <div className="rounded-2xl bg-[#161A26] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                  <Crop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  03. Smart Reframe & Subject Lock
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Repurpose horizontal master footage into 9:16 vertical TikToks and Reels or 1:1 feed clips with zero manual keyframing. The AI keeps subjects perfectly framed.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">9:16 Vertical</span>
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">1:1 Square</span>
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">16:9 Scope</span>
              </div>
            </div>

            {/* Feature 4: Cinematic Looks */}
            <div className="rounded-2xl bg-[#161A26] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  04. 35mm & Commercial Looks
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Apply curated 10-bit cinema tone curves, subtle film stock halation, and organic grain textures calibrated from real motion picture cameras.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Color Science</span>
                <span className="text-purple-400 font-medium">Rec.709 & DCI-P3</span>
              </div>
            </div>

            {/* Feature 5: Export & Codecs */}
            <div className="rounded-2xl bg-[#161A26] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  05. Broadcast-Ready Export
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Export master files in Apple ProRes 422 or high-efficiency H.265 at up to 60fps. Ready for immediate client handoff, broadcast, or social publishing.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Supported Formats</span>
                <span className="text-[#B8F36B] font-mono">ProRes / MP4 / MOV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-[#10131C] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B8F36B] font-semibold">
              Simple 4-Step Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
              From raw phone recording to finished cinema cut.
            </h2>
            <p className="text-slate-400 text-base">
              No complex timelines or keyframe curves. Let the virtual cinematographer do the heavy lifting while you stay in full creative control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col">
              <span className="font-mono text-4xl font-bold text-[#B8F36B] mb-4">01</span>
              <h3 className="text-lg font-bold text-white mb-2">Upload Mobile Footage</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drag and drop any MP4 or MOV file directly from your camera roll or desktop. Up to 4K resolution supported.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-4xl font-bold text-white/40 mb-4">02</span>
              <h3 className="text-lg font-bold text-white mb-2">Neural Cinematographer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Zetula analyzes motion jitter, sensor noise, dynamic range limits, and subject position across every frame.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-4xl font-bold text-white/40 mb-4">03</span>
              <h3 className="text-lg font-bold text-white mb-2">Interactive Fine-Tuning</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Preview with the interactive before/after split slider. Dial in your look with Natural, Commercial, or Cinematic presets.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-4xl font-bold text-white/40 mb-4">04</span>
              <h3 className="text-lg font-bold text-white mb-2">Export Pristine Master</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Render at 60fps in ProRes 422 or H.265. Download instantly or archive to your creative project library.
              </p>
            </div>
          </div>

          {/* Banner CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#161A26] to-[#1E2333] border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Ready to transform your phone footage?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base">
                Join independent creators, social videographers, and commercial filmmakers who turn everyday mobile shoots into cinema-grade content.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={onOpenUpload}
                className="px-6 py-3.5 bg-[#B8F36B] text-[#10131C] font-bold text-sm sm:text-base rounded-xl hover:bg-[#A5E452] transition-colors shadow-lg shadow-[#B8F36B]/20 cursor-pointer"
              >
                Upload video now
              </button>
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="px-6 py-3.5 bg-white/5 text-white font-medium text-sm sm:text-base rounded-xl hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
              >
                View demo projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="mt-auto bg-[#0B0D14] border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <BrandLogo size="md" onClick={() => onNavigate('homepage')} />
            <p className="text-xs text-slate-500 mt-2">
              Your phone. Your vision. A cinematic finish.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button onClick={() => onNavigate('homepage')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('overview')} className="hover:text-white transition-colors">
              Studio
            </button>
            <button onClick={() => onNavigate('workspace')} className="hover:text-white transition-colors">
              Workspace
            </button>
            <button onClick={() => onNavigate('projects')} className="hover:text-white transition-colors">
              Projects
            </button>
            <button onClick={() => onNavigate('exports')} className="hover:text-white transition-colors">
              Exports
            </button>
            <button onClick={() => onNavigate('settings')} className="hover:text-white transition-colors">
              Settings & API
            </button>
          </div>

          <div className="text-xs text-slate-600 font-mono">
            &copy; {new Date().getFullYear()} Zetula AI Video Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
