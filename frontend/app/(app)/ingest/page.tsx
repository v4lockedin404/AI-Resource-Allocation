'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileImage, Mic, ArrowRight } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function IngestPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'image' | 'voice'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = mode === 'image' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/reports/ingest`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/reports/ingest/voice`;

      const res = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Field report ingested and parsed successfully!');
      
      // Redirect to the newly created report detail page
      if (res.data.report?.id) {
        router.push(`/reports/${res.data.report.id}`);
      } else {
        router.push('/reports');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to ingest report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-up" style={{ padding: '2rem 2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
          Ingest Field Report
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Upload a handwritten form or a voice note from the field. Our AI will automatically extract structured data.
        </p>
      </div>

      {/* Mode Selector */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}>
        <button
          onClick={() => { setMode('image'); setFile(null); }}
          style={{
            flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
            background: mode === 'image' ? 'var(--accent-blue)' : 'transparent',
            color: mode === 'image' ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
          }}
        >
          <FileImage size={16} /> Image OCR
        </button>
        <button
          onClick={() => { setMode('voice'); setFile(null); }}
          style={{
            flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
            background: mode === 'voice' ? 'var(--accent-purple)' : 'transparent',
            color: mode === 'voice' ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
          }}
        >
          <Mic size={16} /> Voice Transcript
        </button>
      </div>

      {/* Upload Zone */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <UploadZone
          mode={mode}
          selectedFile={file}
          onFileSelect={setFile}
          onClear={() => setFile(null)}
        />
      </div>

      {/* Submit Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem', opacity: (!file || loading) ? 0.5 : 1 }}
        >
          {loading ? (
            <><LoadingSpinner size={16} color="#fff" /> Processing AI Extraction...</>
          ) : (
            <>Extract Data & Ingest <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}
