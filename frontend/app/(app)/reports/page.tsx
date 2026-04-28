'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, FileText } from 'lucide-react';
import ReportsTable from '@/components/ReportsTable';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reports${statusFilter ? `?status=${statusFilter}` : ''}`;
        const res = await axios.get(url);
        setReports(res.data.reports);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [statusFilter]);

  return (
    <div className="fade-up" style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
            All Field Reports
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Comprehensive log of all reported incidents and their current status.
          </p>
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
            <Filter size={14} color="var(--text-muted)" style={{ marginLeft: '0.5rem' }} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ 
                background: 'transparent', border: 'none', color: 'var(--text-primary)', 
                fontSize: '0.8rem', padding: '0.4rem 0.5rem', outline: 'none', cursor: 'pointer' 
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
        </div>
      </div>

      <ReportsTable reports={reports} loading={loading} />
      
    </div>
  );
}
