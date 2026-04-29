'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, FileText, AlertTriangle, CheckCircle, 
  ArrowUpRight, Clock, MapPin, Sparkles 
} from 'lucide-react';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
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
        setReports(reportsRes.data.reports.slice(0, 6)); 
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (error) {
    return (
      <div className="mt-6">
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="font-medium text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Mission Control
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--color-text-muted)]" />
          <span>Real-time overview of NGO field operations.</span>
        </p>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-md" />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {/* Bento Grid — 1: Urgent Incidents */}
          <motion.div 
            variants={itemVariants}
            className="card flex flex-col justify-between min-h-[140px] shadow-sm bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-2">
                Urgent Incidents
              </span>
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {summary?.total_reports || 0}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Immediate triage requested.
              </p>
            </div>
          </motion.div>

          {/* Bento Grid — 2: Available Volunteers */}
          <motion.div 
            variants={itemVariants}
            className="card flex flex-col justify-between min-h-[140px] shadow-sm bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Workforce
              </span>
              <Users size={18} className="text-[var(--color-text-muted)]" />
            </div>
            <div className="mt-4">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {summary?.available_volunteers || 0}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Ready for assignment.
              </p>
            </div>
          </motion.div>

          {/* Bento Grid — 3: Pending Review */}
          <motion.div 
            variants={itemVariants}
            className="card flex flex-col justify-between min-h-[140px] shadow-sm bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                In Review
              </span>
              <FileText size={18} className="text-[var(--color-text-muted)]" />
            </div>
            <div className="mt-4">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {summary?.by_status?.pending_review || 0}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Awaiting validation.
              </p>
            </div>
          </motion.div>

          {/* Bento Grid — 4: Resolved Crises */}
          <motion.div 
            variants={itemVariants}
            className="card flex flex-col justify-between min-h-[140px] shadow-sm bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Resolved
              </span>
              <CheckCircle size={18} className="text-emerald-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {summary?.by_status?.resolved || 0}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Successfully processed.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Live Feed Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
            Live Feed
          </h2>
          <a 
            href="/reports" 
            className="px-3 py-1.5 border border-[var(--color-border)] rounded-md text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 text-[var(--color-text-secondary)] flex items-center gap-1.5 transition-colors"
          >
            View All 
            <ArrowUpRight size={14} />
          </a>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 skeleton rounded-md" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--color-border)] rounded-md text-[var(--color-text-muted)] text-xs">
            No intelligence available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/reports/${report.id}`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="mt-1 flex-shrink-0">
                    <span className={`badge text-[10px] ${
                      report.urgency_level >= 4 ? 'urgency-5' : 
                      report.urgency_level === 3 ? 'urgency-3' : 'urgency-1'
                    }`}>
                      L{report.urgency_level}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">
                      {report.issue_description || 'No description provided'}
                    </p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-[var(--color-text-secondary)] font-medium">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[var(--color-text-muted)]" />
                        {report.location_name || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[var(--color-text-muted)]" />
                        {new Date(report.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                  <div className="flex flex-wrap gap-1.5">
                    {(report.required_skills || []).slice(0, 2).map((skill: string) => (
                      <span key={skill} className="skill-tag">
                        {skill.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                  <span className={`badge text-[10px] status-${report.status}`}>
                    {report.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
