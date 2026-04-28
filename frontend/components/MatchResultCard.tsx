'use client';

import { motion } from 'framer-motion';
import { MapPin, Gauge, Zap } from 'lucide-react';

interface Match {
  volunteer_id: string;
  name: string;
  city: string;
  distance_km: number | null;
  match_score: number;
  matched_skills: string[];
  reasoning: string;
}

interface MatchResultCardProps {
  match: Match;
  rank: number;
}

const rankColors = ['#F59E0B', '#9CA3AF', '#CD7C3A'];
const rankLabels = ['#1 Best Match', '#2 Runner Up', '#3 Reserve'];

export default function MatchResultCard({ match, rank }: MatchResultCardProps) {
  const color = rankColors[rank] ?? '#3B82F6';
  const scoreColor = match.match_score >= 80 ? '#10B981' : match.match_score >= 50 ? '#F59E0B' : '#EF4444';
  const initials = match.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      className="card"
      style={{ padding: '1.25rem', borderColor: `${color}33` }}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
    >
      {/* Rank badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem',
          borderRadius: '9999px', background: `${color}20`, color,
          border: `1px solid ${color}40`, letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {rankLabels[rank] ?? `#${rank + 1}`}
        </span>

        {/* Match score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Gauge size={14} color={scoreColor} />
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: scoreColor }}>{match.match_score}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/100</span>
        </div>
      </div>

      {/* Volunteer info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}88)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700, color: '#fff',
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{match.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <MapPin size={11} />
            {match.city}
            {match.distance_km !== null && match.distance_km !== undefined && (
              <span style={{ color: 'var(--accent-blue)' }}>· {match.distance_km} km away</span>
            )}
          </div>
        </div>
      </div>

      {/* Matched skills */}
      {match.matched_skills && match.matched_skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
          {match.matched_skills.map(skill => (
            <span key={skill} className="skill-tag" style={{ background: `${color}15`, color, borderColor: `${color}30` }}>
              ✓ {skill.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Score bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${match.match_score}%` }}
            transition={{ duration: 0.8, delay: rank * 0.1 + 0.3, ease: 'easeOut' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`, borderRadius: '2px' }}
          />
        </div>
      </div>

      {/* Reasoning */}
      <div style={{
        padding: '0.625rem 0.75rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '0.5rem',
        fontSize: '0.775rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        borderLeft: `2px solid ${color}50`,
      }}>
        <Zap size={11} color={color} style={{ display: 'inline', marginRight: '0.4rem' }} />
        {match.reasoning}
      </div>
    </motion.div>
  );
}
