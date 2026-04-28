'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, BarChart3, AlertCircle } from 'lucide-react';
import PredictionCard from '@/components/PredictionCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AnalyticsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/predict`, {
          timeout: 30000, // 30s client-side timeout
        });
        setPredictions(res.data.predictions);
        setGeneratedAt(res.data.generated_at);
      } catch (err: any) {
        const msg = err?.response?.data?.error || err.message || 'Failed to load predictive analytics';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchPredictions();
  }, [retryCount]);

  return (
    <div className="fade-up" style={{ padding: '2rem 2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Predictive Analytics <Sparkles size={20} color="#8B5CF6" />
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Gemini AI analyzes the last 30 days of field reports to forecast emerging crisis hotspots and skill shortages.
          </p>
        </div>

        {generatedAt && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
            Generated: {new Date(generatedAt).toLocaleString()}
          </div>
        )}
      </div>

      {error ? (
        <div style={{ padding: '2rem', background: 'rgba(239,68,68,0.08)', color: '#EF4444', borderRadius: 'var(--radius-card)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Analytics Error</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>{error}</div>
            </div>
          </div>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
          >
            ↺ Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 1.5rem' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(10px)', animation: 'pulse-glow 2s infinite' }} />
            <LoadingSpinner size={32} color="#8B5CF6" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
            Gemini is Analyzing Patterns...
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            Crunching geospatial data, skill requirements, and urgency trends from recent field reports to generate crisis forecasts.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {predictions.map((prediction, idx) => (
              <PredictionCard key={idx} prediction={prediction} index={idx} />
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BarChart3 size={20} color="#3B82F6" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>About these insights</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                These predictions are generated dynamically by <strong>Gemini 1.5 Pro</strong>. The model looks for recurring geographic clusters, escalating urgency levels, and persistent required skills across all reports filed in the last 30 days to proactively warn coordinators of developing situations.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
