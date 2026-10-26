import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sliders, Maximize2, Sparkles, Smartphone, Film, Eye } from 'lucide-react';
import { EnhancementSettings } from '../types';

interface BeforeAfterSliderProps {
  rawSrc: string;
  enhancedSrc: string;
  isVideo?: boolean;
  settings?: EnhancementSettings;
  aspectRatio?: '16:9' | '9:16' | '1:1' | 'Original';
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  rawSrc,
  enhancedSrc,
  isVideo = false,
  settings,
  aspectRatio = '16:9',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'enhanced-only' | 'raw-only'>('split');
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawVideoRef = useRef<HTMLVideoElement>(null);
  const enhancedVideoRef = useRef<HTMLVideoElement>(null);

  // Synchronize videos if playing video files
  useEffect(() => {
    if (!isVideo) return;
    const raw = rawVideoRef.current;
    const enhanced = enhancedVideoRef.current;
    if (raw && enhanced) {
      if (isPlaying) {
        raw.play().catch(() => {});
        enhanced.play().catch(() => {});
      } else {
        raw.pause();
        enhanced.pause();
      }
    }
  }, [isPlaying, isVideo]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPosition(percent);
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Compute aspect ratio CSS class
  const aspectClass = 
    aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[720px] mx-auto' :
    aspectRatio === '1:1' ? 'aspect-square max-h-[640px] mx-auto' :
    'aspect-video w-full';

  // Compute live visual filter styles based on user's active settings
  const liveClarity = settings ? 1 + (settings.clarity - 50) * 0.005 : 1.15;
  const liveBrightness = settings ? 1 + (settings.lighting - 50) * 0.006 : 1.12;
  const liveDenoiseBlur = settings && settings.denoise > 80 ? 'blur(0.2px)' : 'none';
  const liveColorHue = settings ? `${(settings.colorBalance || 0) * 0.2}deg` : '0deg';
  const liveSaturation = settings ? 1 + (settings.lighting - 50) * 0.003 : 1.05;

  const rawStyle: React.CSSProperties = {
    filter: 'contrast(0.92) brightness(0.9) saturate(0.95)',
  };

  const enhancedStyle: React.CSSProperties = {
    filter: `contrast(${liveClarity}) brightness(${liveBrightness}) saturate(${liveSaturation}) hue-rotate(${liveColorHue})`,
    transform: settings?.lockHorizon ? 'scale(1.02)' : 'none',
    transition: isDragging ? 'none' : 'filter 0.2s ease, transform 0.2s ease',
  };

  return (
    <div className={`relative flex flex-col rounded-2xl bg-[#161A26] border border-white/10 overflow-hidden shadow-2xl ${className}`}>
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#10131C]/90 border-b border-white/5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">Interactive Preview</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">
            {viewMode === 'split' ? 'Drag slider to compare raw vs cinematic' : 'Dual display'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#10131C] p-1 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'split' ? 'bg-[#B8F36B] text-[#10131C] font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split Slider
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'side-by-side' ? 'bg-[#B8F36B] text-[#10131C] font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side by Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'enhanced-only' ? 'raw-only' : 'enhanced-only')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'enhanced-only' || viewMode === 'raw-only' ? 'bg-[#B8F36B] text-[#10131C] font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {viewMode === 'enhanced-only' ? 'Enhanced (100%)' : viewMode === 'raw-only' ? 'Raw (100%)' : 'Toggle 100%'}
          </button>
        </div>
      </div>

      {/* Main Visual Arena */}
      <div 
        ref={containerRef}
        className={`relative ${aspectClass} overflow-hidden bg-black select-none touch-none`}
        onPointerDown={viewMode === 'split' ? handlePointerDown : undefined}
      >
        {viewMode === 'side-by-side' ? (
          /* Side by Side Mode */
          <div className="grid grid-cols-2 h-full w-full divide-x divide-white/10">
            <div className="relative h-full w-full overflow-hidden">
              <img 
                src={rawSrc} 
                alt="Raw Phone Video"
                className="w-full h-full object-cover"
                style={rawStyle}
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-[11px] font-medium text-slate-300 border border-white/10 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                Raw Handheld
              </div>
            </div>
            <div className="relative h-full w-full overflow-hidden">
              <img 
                src={enhancedSrc} 
                alt="Enhanced Cinematic Video"
                className="w-full h-full object-cover"
                style={enhancedStyle}
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#10131C]/90 backdrop-blur-md rounded text-[11px] font-semibold text-[#B8F36B] border border-[#B8F36B]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8F36B]" />
                Zetula AI Enhanced
              </div>
            </div>
          </div>
        ) : viewMode === 'enhanced-only' ? (
          /* Enhanced Only */
          <div className="relative h-full w-full">
            <img 
              src={enhancedSrc} 
              alt="Enhanced Cinematic"
              className="w-full h-full object-cover"
              style={enhancedStyle}
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#10131C]/80 backdrop-blur-md rounded text-xs font-semibold text-[#B8F36B] border border-[#B8F36B]/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F36B]" />
              Zetula AI Master Preview
            </div>
          </div>
        ) : viewMode === 'raw-only' ? (
          /* Raw Only */
          <div className="relative h-full w-full">
            <img 
              src={rawSrc} 
              alt="Raw Smartphone"
              className="w-full h-full object-cover"
              style={rawStyle}
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded text-xs font-medium text-slate-300 border border-white/10 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              Raw Handheld Smartphone Footage
            </div>
          </div>
        ) : (
          /* Interactive Split Slider */
          <>
            {/* Base Enhanced Layer (Underneath right side) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={enhancedSrc}
                alt="Zetula AI Enhanced"
                className="w-full h-full object-cover"
                style={enhancedStyle}
              />
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#10131C]/85 backdrop-blur-md rounded-md text-xs font-bold text-[#B8F36B] border border-[#B8F36B]/30 flex items-center gap-1.5 shadow-lg pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-[#B8F36B]" />
                Zetula AI Enhanced
              </div>
            </div>

            {/* Clipped Raw Layer (Left side) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div 
                className="relative h-full"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              >
                <img
                  src={rawSrc}
                  alt="Raw Handheld Footage"
                  className="w-full h-full object-cover"
                  style={rawStyle}
                />
                <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-medium text-slate-200 border border-white/10 flex items-center gap-1.5 shadow-lg pointer-events-none">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  Raw Smartphone Footage
                </div>
              </div>
            </div>

            {/* Draggable Divider Line & Knob */}
            <div
              className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Vertical hairline glow */}
              <div className="w-[2px] h-full bg-[#B8F36B] shadow-[0_0_12px_#B8F36B]" />

              {/* Central handle button */}
              <div className="absolute w-9 h-9 rounded-full bg-[#10131C] border-2 border-[#B8F36B] shadow-xl flex items-center justify-center text-[#B8F36B] pointer-events-auto hover:scale-110 active:scale-95 transition-transform">
                <div className="flex items-center gap-0.5">
                  <div className="w-0.5 h-3.5 bg-[#B8F36B] rounded-full" />
                  <div className="w-0.5 h-3.5 bg-[#B8F36B] rounded-full" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Live Active Preset Badge in Bottom-Right */}
        {settings && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#10131C]/90 backdrop-blur-md rounded-md text-[11px] text-slate-300 border border-white/10 flex items-center gap-2">
            <Film className="w-3 h-3 text-[#B8F36B]" />
            <span>Preset: <strong className="text-white font-semibold">{settings.preset}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Res: <strong className="text-[#B8F36B] font-semibold">{settings.exportResolution}</strong></span>
            {settings.lockHorizon && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400">Horizon Lock Active</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="px-4 py-2.5 bg-[#121520] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>Resolution: <strong>3840×2160 (Master 4K)</strong></span>
          <span>·</span>
          <span>Aspect: <strong>{aspectRatio}</strong></span>
          <span>·</span>
          <span>Virtual Gimbal: <strong className="text-[#B8F36B]">{settings?.stabilization ?? 88}%</strong></span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
          DRAG TO COMPARE
        </div>
      </div>
    </div>
  );
};
