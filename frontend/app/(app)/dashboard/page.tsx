'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ReportsTable from '@/components/ReportsTable';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, reportsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/summary`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`),
        ]);
        
        setSummary(summaryRes.data.summary);
        setReports(reportsRes.data.reports.slice(0, 5)); // Show latest 5
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="fade-up" style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
          Mission Control
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Real-time overview of NGO field operations and volunteer readiness.
        </p>
      </div>

      {error ? (
        <div style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', borderRadius: 'var(--radius-card)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      ) : (
        <>
          {/* KPI Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <StatCard
              title="Active Incidents"
              value={loading ? '-' : summary?.total_reports || 0}
              icon={AlertTriangle}
              color="#F59E0B"
              index={0}
            />
            <StatCard
              title="Available Volunteers"
              value={loading ? '-' : summary?.available_volunteers || 0}
              icon={Users}
              color="#3B82F6"
              index={1}
            />
            <StatCard
              title="Pending Review"
              value={loading ? '-' : summary?.by_status?.pending_review || 0}
              icon={FileText}
              color="#8B5CF6"
              index={2}
            />
            <StatCard
              title="Resolved Crises"
              value={loading ? '-' : summary?.by_status?.resolved || 0}
              icon={CheckCircle}
              color="#10B981"
              index={3}
            />
          </div>

          {/* Recent Reports Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Recent Field Reports
            </h2>
            <a href="/reports" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
              View All
            </a>
          </div>
          
          <ReportsTable reports={reports} loading={loading} />
        </>
      )}
    </div>
  );
}
