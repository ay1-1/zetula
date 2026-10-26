import { Project, ExportRecord, EnhancementSettings } from '../types';

// Image assets generated and uploaded for Zetula
export const ASSETS = {
  logo: '/assets/aistudio/Zetula_Neon_AI_Studio_Logo_22209125.png',
  rawVideoFrame: '/src/assets/images/video_handheld_raw_1793025331126.jpg',
  enhancedVideoFrame: '/src/assets/images/video_cinematic_enhanced_1793025330928.jpg',
  fashionThumb: '/src/assets/images/sample_project_fashion_1793025332772.jpg',
  natureThumb: '/src/assets/images/sample_project_nature_1793025331927.jpg',
};

export const DEFAULT_SETTINGS: EnhancementSettings = {
  clarity: 82,
  denoise: 68,
  lighting: 74,
  colorBalance: 12,
  stabilization: 88,
  lockHorizon: true,
  preset: 'Cinematic',
  smartReframe: 'Original',
  exportResolution: '4K',
  frameInterpolation: true,
  exportCodec: 'ProRes 422',
};

export const INITIAL_SAMPLE_PROJECTS: Project[] = [
  {
    id: 'sample-prj-01',
    title: 'Neon Alley Handheld Walk',
    sourceFileName: 'IMG_4821_Handheld_Night.MOV',
    sourceFileSizeMb: 142.8,
    duration: '00:34',
    durationSec: 34,
    resolution: '1080p',
    fps: 30,
    rawThumbnail: ASSETS.rawVideoFrame,
    enhancedThumbnail: ASSETS.enhancedVideoFrame,
    status: 'Completed',
    progress: 100,
    currentStage: 'Completed master render',
    createdAt: '2026-10-25T14:20:00Z',
    updatedAt: '2026-10-25T14:23:45Z',
    isSample: true,
    settings: {
      ...DEFAULT_SETTINGS,
      preset: 'Cinematic',
      clarity: 85,
      stabilization: 90,
      exportResolution: '4K',
    },
    enhancedFileUrl: ASSETS.enhancedVideoFrame,
  },
  {
    id: 'sample-prj-02',
    title: 'Editorial Runway Movement',
    sourceFileName: 'Fashion_Runway_Gimbal_Test.mp4',
    sourceFileSizeMb: 318.4,
    duration: '01:12',
    durationSec: 72,
    resolution: '1080p',
    fps: 30,
    rawThumbnail: ASSETS.fashionThumb,
    enhancedThumbnail: ASSETS.fashionThumb,
    status: 'Completed',
    progress: 100,
    currentStage: 'Completed master render',
    createdAt: '2026-10-24T18:10:00Z',
    updatedAt: '2026-10-24T18:15:30Z',
    isSample: true,
    settings: {
      ...DEFAULT_SETTINGS,
      preset: 'Commercial',
      clarity: 78,
      smartReframe: '9:16',
      exportResolution: '4K',
    },
    enhancedFileUrl: ASSETS.fashionThumb,
  },
  {
    id: 'sample-prj-03',
    title: 'Pacific Cliff Winds & Waves',
    sourceFileName: 'Coastline_Sunset_Shaky.MOV',
    sourceFileSizeMb: 245.0,
    duration: '00:48',
    durationSec: 48,
    resolution: '1080p',
    fps: 30,
    rawThumbnail: ASSETS.natureThumb,
    enhancedThumbnail: ASSETS.natureThumb,
    status: 'Processing',
    progress: 68,
    currentStage: 'Stage 4/6: Smart subject saliency tracking & horizon reframe',
    createdAt: '2026-10-26T06:12:00Z',
    updatedAt: '2026-10-26T06:14:10Z',
    isSample: true,
    settings: {
      ...DEFAULT_SETTINGS,
      preset: 'Natural',
      stabilization: 96,
      lockHorizon: true,
      exportResolution: '4K',
    },
  },
  {
    id: 'sample-prj-04',
    title: 'Urban Street Skate Chase',
    sourceFileName: 'Skate_Run_LowLight.mp4',
    sourceFileSizeMb: 189.6,
    duration: '00:26',
    durationSec: 26,
    resolution: '1080p',
    fps: 30,
    rawThumbnail: ASSETS.rawVideoFrame,
    status: 'Queued',
    progress: 0,
    currentStage: 'Waiting for worker allocation',
    createdAt: '2026-10-26T07:10:00Z',
    updatedAt: '2026-10-26T07:10:00Z',
    isSample: true,
    settings: {
      ...DEFAULT_SETTINGS,
      preset: 'Cinematic',
      stabilization: 92,
      frameInterpolation: true,
    },
  },
];

export const INITIAL_SAMPLE_EXPORTS: ExportRecord[] = [
  {
    id: 'exp-901',
    projectId: 'sample-prj-01',
    projectTitle: 'Neon Alley Handheld Walk (Master 4K)',
    timestamp: '2026-10-25 14:24',
    resolution: '4K',
    codec: 'ProRes 422',
    fps: 60,
    duration: '00:34',
    sizeMb: 482.5,
    status: 'Ready',
    downloadUrl: ASSETS.enhancedVideoFrame,
    isSample: true,
  },
  {
    id: 'exp-902',
    projectId: 'sample-prj-02',
    projectTitle: 'Editorial Runway Movement (Reframe 9:16)',
    timestamp: '2026-10-24 18:16',
    resolution: '4K',
    codec: 'H.265',
    fps: 60,
    duration: '01:12',
    sizeMb: 194.2,
    status: 'Ready',
    downloadUrl: ASSETS.fashionThumb,
    isSample: true,
  },
];

export interface VideoWorkerConfig {
  backendMode: 'demo' | 'live';
  apiEndpoint: string;
  storageProvider: 'local' | 'supabase_storage' | 's3';
  maxConcurrentJobs: number;
}

export const WORKER_CONFIG: VideoWorkerConfig = {
  backendMode: 'demo',
  apiEndpoint: 'https://api.zetula.internal/v1',
  storageProvider: 'supabase_storage',
  maxConcurrentJobs: 3,
};

/**
 * Service providing clean integration contracts for future backend deployment
 * (Supabase Auth, PostgreSQL, Redis Job Queue, and FFmpeg/GPU enhancement workers).
 */
export const VideoApiService = {
  /**
   * Upload video binary or reference to backend object storage
   */
  async uploadSourceFile(
    file: File, 
    onProgress?: (percent: number) => void
  ): Promise<{ uploadId: string; fileUrl: string; duration: number; resolution: string }> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (onProgress) onProgress(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(interval);
          const objectUrl = URL.createObjectURL(file);
          resolve({
            uploadId: `up_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            fileUrl: objectUrl,
            duration: 30, // fallback estimate if not read by HTML5 video
            resolution: '1080p',
          });
        }
      }, 120);
    });
  },

  /**
   * Enqueue video enhancement job
   */
  async createEnhancementJob(projectId: string, settings: EnhancementSettings): Promise<{ jobId: string; queuePosition: number }> {
    // In production, sends POST to /api/v1/jobs
    return {
      jobId: `job_${Date.now()}_${projectId.slice(0, 6)}`,
      queuePosition: 1,
    };
  },

  /**
   * Format bytes to readable string
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  },
};
