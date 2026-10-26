import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileVideo, 
  CheckCircle2, 
  AlertCircle, 
  Film, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Project, EnhancementSettings } from '../types';
import { DEFAULT_SETTINGS, VideoApiService, ASSETS } from '../services/videoApi';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoResolution, setVideoResolution] = useState<string>('1080p');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.mp4', '.mov', '.m4v'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage('Please select a supported video format (.MP4 or .MOV).');
      return;
    }

    if (file.size > 1024 * 1024 * 500) {
      setErrorMessage('File size exceeds the 500MB browser evaluation limit.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);

    // Read duration and resolution using temporary video element
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      setVideoDuration(tempVideo.duration || 15);
      const res = tempVideo.videoWidth >= 2160 ? '4K' : tempVideo.videoHeight >= 1080 ? '1080p' : '720p';
      setVideoResolution(res);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const startUploadAndCreateProject = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const uploadResult = await VideoApiService.uploadSourceFile(selectedFile, (percent) => {
        setUploadProgress(percent);
      });

      // Format duration mm:ss
      const mins = Math.floor(videoDuration / 60);
      const secs = Math.floor(videoDuration % 60);
      const formattedDuration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      // Create new user project
      const newProject: Project = {
        id: `user-prj-${Date.now()}`,
        title: selectedFile.name.replace(/\.[^/.]+$/, ''),
        sourceFileName: selectedFile.name,
        sourceFileUrl: uploadResult.fileUrl,
        sourceFileSizeMb: Number((selectedFile.size / (1024 * 1024)).toFixed(1)),
        duration: formattedDuration,
        durationSec: Math.round(videoDuration) || 20,
        resolution: videoResolution,
        fps: 30,
        rawThumbnail: uploadResult.fileUrl, // HTML5 video can poster or play
        status: 'Uploaded',
        progress: 0,
        currentStage: 'Ready for AI enhancement tuning',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSample: false,
        settings: {
          ...DEFAULT_SETTINGS,
        },
      };

      onProjectCreated(newProject);
      onClose();
    } catch (err) {
      setErrorMessage('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#161A26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B8F36B]" />
            <h2 className="text-base font-bold text-white">Upload Footage to Zetula</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!selectedFile ? (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-[#B8F36B] bg-[#B8F36B]/5'
                  : 'border-white/15 hover:border-white/30 bg-[#10131C]/60 hover:bg-[#10131C]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.mov,.m4v"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-[#1D2333] border border-white/10 flex items-center justify-center text-[#B8F36B] mb-4">
                <Upload className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                Drag and drop your phone video here
              </h3>
              <p className="text-xs text-slate-400 mb-4 max-w-xs leading-relaxed">
                Supports MP4 and QuickTime MOV recordings. High bitrates, 10-bit HDR, and 4K accepted.
              </p>

              <button
                type="button"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors border border-white/10 cursor-pointer"
              >
                Browse local files
              </button>

              <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                <span>MP4 / MOV</span>
                <span>·</span>
                <span>Up to 4K 60fps</span>
                <span>·</span>
                <span>Max 500MB</span>
              </div>
            </div>
          ) : (
            /* Selected File Card & Info */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#10131C] border border-white/10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1D2333] flex items-center justify-center text-[#B8F36B] shrink-0">
                  <Film className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate mb-1">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                    <span>·</span>
                    <span>{videoResolution}</span>
                    {videoDuration > 0 && (
                      <>
                        <span>·</span>
                        <span>{Math.round(videoDuration)}s duration</span>
                      </>
                    )}
                  </div>
                </div>

                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setVideoPreviewUrl(null);
                    }}
                    className="text-slate-500 hover:text-white p-1 text-xs"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Uploading to private project storage...</span>
                    <span className="font-mono text-[#B8F36B]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#10131C] h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-[#B8F36B] h-full transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Pre-load sample file helper */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Want to test with sample phone footage?</span>
            <button
              type="button"
              onClick={() => {
                // Use sample raw video frame as project
                const sampleProject: Project = {
                  id: `user-prj-${Date.now()}`,
                  title: 'Night Street Walk (My Test)',
                  sourceFileName: 'Handheld_Night_Clip.MOV',
                  sourceFileUrl: ASSETS.rawVideoFrame,
                  sourceFileSizeMb: 84.5,
                  duration: '00:28',
                  durationSec: 28,
                  resolution: '1080p',
                  fps: 30,
                  rawThumbnail: ASSETS.rawVideoFrame,
                  status: 'Uploaded',
                  progress: 0,
                  currentStage: 'Ready for AI enhancement tuning',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  isSample: false,
                  settings: { ...DEFAULT_SETTINGS },
                };
                onProjectCreated(sampleProject);
                onClose();
              }}
              className="text-[#B8F36B] hover:underline font-medium"
            >
              Load Sample Clip &rarr;
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#10131C] border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile || isUploading}
            onClick={startUploadAndCreateProject}
            className="px-5 py-2.5 bg-[#B8F36B] hover:bg-[#A5E452] disabled:opacity-50 disabled:cursor-not-allowed text-[#10131C] font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            {isUploading ? (
              <span>Uploading footage...</span>
            ) : (
              <>
                <span>Open in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
