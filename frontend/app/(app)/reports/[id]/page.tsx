'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Clock, AlertTriangle, Zap, CheckCircle, Cpu } from 'lucide-react';
import UrgencyBadge from '@/components/UrgencyBadge';
import MatchResultCard from '@/components/MatchResultCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [matches, setMatches] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}`);
        setReport(res.data.report);
        if (res.data.report.ai_match_result) {
          setMatches(res.data.report.ai_match_result);
        }
      } catch (err) {
        toast.error('Failed to load report details');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchReport();
  }, [id]);

  async function handleFindMatches() {
    setMatching(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/match/${id}`);
      setMatches(res.data.matches);
      toast.success(res.data.message);
      // Refresh report status
      const updated = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}`);
      setReport(updated.data.report);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to match volunteers');
    } finally {
      setMatching(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}><LoadingSpinner /></div>;
  }

  if (!report) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Report not found.</div>;
  }

  return (
    <div className="fade-up" style={{ padding: '2rem 2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Field Report Detail
            </h1>
            <span className={`badge status-${report.status}`}>
              {report.status.replace('_', ' ')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {report.location_name || 'Unknown Location'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {new Date(report.created_at).toLocaleString()}</span>
            <span>Source: <strong style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{report.ingestion_type}</strong></span>
          </div>
        </div>
        
        {/* Find Matches Button */}
        <button 
          onClick={handleFindMatches} 
          disabled={matching}
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', border: 'none', boxShadow: 'var(--shadow-glow-blue)' }}
        >
          {matching ? <><LoadingSpinner size={16} color="#fff" /> AI is Analyzing...</> : <><Cpu size={16} /> Run AI Matcher</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
        
        {/* Left Column: Report Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Issue Description</h2>
              <UrgencyBadge level={report.urgency_level} />
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, padding: '1rem', background: 'var(--bg-surface)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              {report.issue_description || 'No description provided.'}
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1rem' }}>Required Skills</h2>
            {report.required_skills && report.required_skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {report.required_skills.map((skill: string) => (
                  <span key={skill} className="skill-tag" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {skill.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No specific skills identified.</p>
            )}
          </div>

        </div>

        {/* Right Column: AI Matches */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#3B82F6" /> AI Match Results
          </h2>

          {!matches ? (
            <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'var(--bg-surface)', borderStyle: 'dashed' }}>
              <Cpu size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
                AI matching hasn't been run for this report yet.
              </p>
              <button onClick={handleFindMatches} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                Run AI Matcher Now
              </button>
            </div>
          ) : matches.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(245,158,11,0.3)' }}>
              <AlertTriangle size={24} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>No available volunteers found nearby.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matches.map((match, idx) => (
                <MatchResultCard key={match.volunteer_id} match={match} rank={idx} />
              ))}
              
              {report.status === 'assigned' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16,185,129,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
                  <CheckCircle size={20} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10B981' }}>Volunteers Assigned</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Notifications sent to selected volunteers.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
