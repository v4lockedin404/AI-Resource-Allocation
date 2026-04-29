'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Mic, X, FileAudio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  mode: 'image' | 'voice';
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function UploadZone({ mode, onFileSelect, selectedFile, onClear }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const accept: Record<string, string[]> = mode === 'image'
    ? { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }
    : { 'audio/*': ['.wav', '.mp3', '.ogg', '.m4a', '.webm'] };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
    setIsDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (selectedFile) {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="border border-emerald-500/30 rounded-xl bg-emerald-500/5 p-5 flex items-center gap-4 relative overflow-hidden"
        >
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            {mode === 'image' ? <Image size={20} className="text-emerald-400" /> : <FileAudio size={20} className="text-emerald-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {selectedFile.name}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-2">
              <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
              <span className="text-emerald-400">Ready to process</span>
            </div>
          </div>
          <button
            onClick={onClear}
            className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            title="Remove file"
          >
            <X size={14} className="text-red-400" />
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      animate={{
        scale: isDragActive ? 1.02 : 1,
        borderColor: isDragActive ? 'rgba(59, 130, 246, 0.65)' : 'rgba(59, 130, 246, 0.28)',
        backdropFilter: isDragActive ? 'blur(16px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`upload-zone py-8 md:py-12 px-4 md:px-6 text-center flex flex-col items-center justify-center relative cursor-pointer group`}
    >
      <input {...getInputProps()} />
      
      {/* Dashed SVG border animation */}
      <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
        <svg className="w-full h-full absolute inset-0">
          <rect 
            x="0" y="0" width="100%" height="100%" 
            fill="none" 
            stroke="rgba(59, 130, 246, 0.3)" 
            strokeWidth="2" 
            strokeDasharray="12 12" 
            className={`transition-all duration-300 ${isDragActive ? 'stroke-blue-500/80 animate-[dash-flow_2s_linear_infinite]' : 'group-hover:stroke-blue-500/50'}`}
          />
        </svg>
      </div>

      <div className={`w-12 h-12 md:w-16 md:h-16 mb-4 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 border ${
        isDragActive 
          ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
          : 'bg-blue-500/5 border-blue-500/10 text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20'
      }`}>
        {mode === 'image' ? <Image size={24} className="md:w-7 md:h-7" /> : <Mic size={24} className="md:w-7 md:h-7" />}
      </div>

      <div className="text-xs md:text-sm font-semibold text-[var(--color-text-primary)] mb-1">
        {isDragActive ? 'Drop the file to upload' : `Drop a ${mode === 'image' ? 'field report image' : 'voice recording'} here`}
      </div>
      <div className="text-[10px] md:text-xs text-[var(--color-text-muted)] max-w-xs mb-4 md:mb-6">
        {mode === 'image'
          ? 'Supports JPG, PNG, WebP up to 20MB'
          : 'Supports WAV, MP3, OGG, M4A up to 20MB'
        }
      </div>

      <button
        type="button"
        className="btn btn-primary text-xs flex items-center gap-2 group cursor-pointer h-11 md:h-10 px-4"
      >
        <Upload size={14} className="group-hover:translate-y-[-2px] transition-transform" />
        Browse Files
      </button>

      <style jsx>{`
        @keyframes dash-flow {
          to { stroke-dashoffset: -24; }
        }
      `}</style>
    </motion.div>
  );
}
