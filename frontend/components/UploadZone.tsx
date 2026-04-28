'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Mic, X, FileAudio } from 'lucide-react';

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
      <div style={{
        border: '1px solid rgba(16,185,129,0.4)',
        borderRadius: 'var(--radius-card)',
        background: 'rgba(16,185,129,0.05)',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          background: 'rgba(16,185,129,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {mode === 'image' ? <Image size={20} color="#10B981" /> : <FileAudio size={20} color="#10B981" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedFile.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {(selectedFile.size / 1024).toFixed(1)} KB · Ready to process
          </div>
        </div>
        <button
          onClick={onClear}
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <X size={14} color="#EF4444" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`upload-zone${isDragActive ? ' drag-active' : ''}`}
      style={{ padding: '3rem 2rem', textAlign: 'center' }}
    >
      <input {...getInputProps()} />
      <div style={{
        width: '64px', height: '64px', margin: '0 auto 1.25rem',
        borderRadius: '16px',
        background: isDragActive ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.25s ease',
        border: `1px solid ${isDragActive ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.15)'}`,
      }}>
        {mode === 'image'
          ? <Image size={28} color="#3B82F6" />
          : <Mic size={28} color="#3B82F6" />
        }
      </div>

      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        {isDragActive ? 'Drop your file here' : `Drop a ${mode === 'image' ? 'field report image' : 'voice recording'} here`}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        {mode === 'image'
          ? 'Supports JPG, PNG, WebP up to 20MB — handwritten or printed'
          : 'Supports WAV, MP3, OGG, M4A up to 20MB'
        }
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ margin: '0 auto' }}
      >
        <Upload size={14} />
        Browse File
      </button>
    </div>
  );
}
