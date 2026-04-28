'use client';

import Link from 'next/link';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
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

function SkeletonRow() {
  return (
    <tr>
      {[120, 200, 80, 90, 100, 60].map((w, i) => (
        <td key={i} style={{ padding: '1rem 1.25rem' }}>
          <div className="skeleton" style={{ height: '16px', width: `${w}px` }} />
        </td>
      ))}
    </tr>
  );
}

export default function ReportsTable({ reports, loading }: ReportsTableProps) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Location', 'Issue', 'Urgency', 'Status', 'Skills Required', 'Source', ''].map(h => (
                <th key={h} style={{
                  padding: '0.75rem 1.25rem',
                  textAlign: 'left',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : reports.length === 0
              ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No reports found. Start by ingesting a field report.
                  </td>
                </tr>
              )
              : reports.map(report => (
                <tr key={report.id} className="table-row">
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      <MapPin size={12} color="var(--text-muted)" />
                      {report.location_name || '—'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={10} />
                      {new Date(report.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>

                  <td style={{ padding: '0.875rem 1.25rem', maxWidth: '260px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {report.issue_description || '—'}
                    </p>
                  </td>

                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <UrgencyBadge level={report.urgency_level} size="sm" />
                  </td>

                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <span className={`badge status-${report.status}`} style={{ fontSize: '0.68rem' }}>
                      {statusLabels[report.status] ?? report.status}
                    </span>
                  </td>

                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '180px' }}>
                      {(report.required_skills || []).slice(0, 3).map(skill => (
                        <span key={skill} className="skill-tag">{skill.replace(/_/g, ' ')}</span>
                      ))}
                      {(report.required_skills || []).length > 3 && (
                        <span className="skill-tag" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                          +{report.required_skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '0.3rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {report.ingestion_type || 'image'}
                    </span>
                  </td>

                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <Link href={`/reports/${report.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      View <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
