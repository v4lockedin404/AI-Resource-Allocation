'use client';

import Link from 'next/link';
import { MapPin, Clock, ChevronRight, Image, Mic } from 'lucide-react';
import UrgencyBadge from './UrgencyBadge';

interface Report {
  id: string;
  location_name: string;
  issue_description: string;
  urgency_level: number;
  status: string;
  required_skills: string[];
  ingestion_type: string;
  created_at: string;
}

interface ReportsTableProps {
  reports: Report[];
  loading?: boolean;
}

const statusLabels: Record<string, string> = {
  pending_review: 'Pending Review',
  open: 'Open',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export default function ReportsTable({ reports, loading }: ReportsTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-text-muted)] text-sm">
        No reports found. Start by ingesting a field report.
      </div>
    );
  }

  return (
    <div>
      {/* ── Mobile View: Stacked Cards (Visible on mobile/tablet) ── */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {reports.map((report) => (
          <div 
            key={report.id} 
            className="card p-5 relative flex flex-col justify-between gap-4 border-[var(--color-border-subtle)] shadow-sm bg-[var(--color-card)]"
          >
            {/* Top Critical Info */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
                  <MapPin size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                  <span className="truncate">{report.location_name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mt-1">
                  <Clock size={12} />
                  <span>{new Date(report.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <UrgencyBadge level={report.urgency_level} size="sm" />
            </div>

            {/* Issue description */}
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 mt-1 leading-relaxed">
              {report.issue_description || '—'}
            </p>

            {/* Secondary Info */}
            <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                {(report.required_skills || []).slice(0, 2).map((skill) => (
                  <span key={skill} className="skill-tag text-[10px] py-1 px-2.5">
                    {skill.replace(/_/g, ' ')}
                  </span>
                ))}
                {(report.required_skills || []).length > 2 && (
                  <span className="text-[10px] text-[var(--color-text-muted)] bg-white/5 border border-[var(--color-border)] px-2 py-0.5 rounded-full font-medium">
                    +{(report.required_skills || []).length - 2}
                  </span>
                )}
              </div>
              
              <Link 
                href={`/reports/${report.id}`} 
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop View: Modern Table (Visible on md and up) ── */}
      <div className="hidden md:block card overflow-hidden bg-[var(--color-card)] shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-white/[0.01]">
                {['Location', 'Issue', 'Urgency', 'Status', 'Skills Required', 'Source', ''].map(h => (
                  <th key={h} className="py-5 px-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="feed-row border-b border-[var(--color-border-subtle)] hover:bg-white/[0.03] transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                      <MapPin size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                      {report.location_name || '—'}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] mt-1.5">
                      <Clock size={11} />
                      {new Date(report.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>

                  <td className="py-5 px-4 max-w-[220px]">
                    <p className="text-xs text-[var(--color-text-secondary)] truncate leading-relaxed">
                      {report.issue_description || '—'}
                    </p>
                  </td>

                  <td className="py-5 px-4">
                    <UrgencyBadge level={report.urgency_level} size="sm" />
                  </td>

                  <td className="py-5 px-4">
                    <span className={`badge text-[10px] status-${report.status}`}>
                      {statusLabels[report.status] ?? report.status}
                    </span>
                  </td>

                  <td className="py-5 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                      {(report.required_skills || []).slice(0, 2).map(skill => (
                        <span key={skill} className="skill-tag text-[10px]">{skill.replace(/_/g, ' ')}</span>
                      ))}
                      {(report.required_skills || []).length > 2 && (
                        <span className="skill-tag text-[10px] bg-white/5 text-[var(--color-text-muted)] font-medium">
                          +{report.required_skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-5 px-4">
                    {report.ingestion_type === 'voice' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">
                        <Mic size={12} />
                        Voice
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                        <Image size={12} />
                        Vision
                      </span>
                    )}
                  </td>

                  <td className="py-5 px-4">
                    <Link 
                      href={`/reports/${report.id}`} 
                      className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer h-9 shadow-sm"
                    >
                      View <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
