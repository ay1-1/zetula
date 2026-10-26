export type ProjectStatus = 'Uploaded' | 'Queued' | 'Processing' | 'Completed' | 'Failed';

export type VideoPreset = 'Natural' | 'Commercial' | 'Cinematic';

export type AspectRatio = '16:9' | '9:16' | '1:1' | 'Original';

export type ResolutionOption = '1080p' | '4K';

export type ExportCodec = 'H.264' | 'H.265' | 'ProRes 422';

export interface EnhancementSettings {
  clarity: number; // 0 - 100
  denoise: number; // 0 - 100
  lighting: number; // 0 - 100
  colorBalance: number; // -50 to +50 (warm/cool)
  stabilization: number; // 0 - 100
  lockHorizon: boolean;
  preset: VideoPreset;
  smartReframe: AspectRatio;
  exportResolution: ResolutionOption;
  frameInterpolation: boolean; // e.g. 60fps
  exportCodec: ExportCodec;
}

export interface Project {
  id: string;
  title: string;
  sourceFileName: string;
  sourceFileUrl?: string;
  sourceFileSizeMb: number;
  duration: string; // e.g., "00:48"
  durationSec: number;
  resolution: string;
  fps: number;
  rawThumbnail: string;
  enhancedThumbnail?: string;
  status: ProjectStatus;
  progress: number; // 0 - 100
  currentStage?: string;
  createdAt: string;
  updatedAt: string;
  isSample: boolean;
  settings: EnhancementSettings;
  enhancedFileUrl?: string;
  errorMessage?: string;
}

export interface ExportRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  timestamp: string;
  resolution: ResolutionOption;
  codec: ExportCodec;
  fps: number;
  duration: string;
  sizeMb: number;
  status: 'Ready' | 'Processing' | 'Archived';
  downloadUrl?: string;
  isSample: boolean;
}

export type ActivePage = 
  | 'homepage' 
  | 'overview' 
  | 'projects' 
  | 'workspace' 
  | 'exports' 
  | 'settings';
