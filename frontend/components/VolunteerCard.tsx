'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Star, CheckCircle, Award } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  city: string;
  skills: string[];
  availability: boolean;
  hours_available: number;
  tasks_completed: number;
  reputation_points: number;
  badges: string[];
}

interface VolunteerCardProps {
  volunteer: Volunteer;
  index?: number;
}

const badgeColors: Record<string, string> = {
  first_responder: '#EF4444',
  medic_expert:    '#F97316',
  sanitation_expert: '#10B981',
  builder:         '#F59E0B',
  mentor:          '#8B5CF6',
};

export default function VolunteerCard({ volunteer, index = 0 }: VolunteerCardProps) {
  const initials = volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const repLevel = volunteer.reputation_points >= 400 ? 'gold' : volunteer.reputation_points >= 200 ? 'silver' : 'bronze';
  const repColors = { gold: '#F59E0B', silver: '#9CA3AF', bronze: '#CD7C3A' };

  return (
    <motion.div
      className="card"
      style={{ padding: '1.25rem' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
        {/* Avatar */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: 700, color: '#fff',
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
              {volunteer.name}
            </h3>
            {/* Availability dot */}
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: volunteer.availability ? '#10B981' : '#EF4444',
              boxShadow: volunteer.availability ? '0 0 6px rgba(16,185,129,0.5)' : 'none',
              display: 'inline-block',
            }} title={volunteer.availability ? 'Available' : 'Unavailable'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <MapPin size={11} />
            {volunteer.city || 'Unknown'}
          </div>
        </div>

        {/* Reputation */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', color: repColors[repLevel], fontSize: '0.8rem', fontWeight: 700 }}>
            <Star size={12} fill={repColors[repLevel]} />
            {volunteer.reputation_points}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{repLevel}</div>
        </div>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
        {(volunteer.skills || []).map(skill => (
          <span key={skill} className="skill-tag">{skill.replace(/_/g, ' ')}</span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1rem', padding: '0.625rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{volunteer.hours_available}h</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Available</div>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
            <CheckCircle size={11} color="#10B981" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{volunteer.tasks_completed}</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Tasks Done</div>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
            <Award size={11} color="#8B5CF6" />
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{volunteer.badges?.length ?? 0}</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Badges</div>
        </div>
      </div>

      {/* Badges */}
      {volunteer.badges && volunteer.badges.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {volunteer.badges.map(badge => (
            <span key={badge} style={{
              padding: '0.15rem 0.55rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 600,
              background: `${badgeColors[badge] ?? '#8B5CF6'}18`,
              color: badgeColors[badge] ?? '#8B5CF6',
              border: `1px solid ${badgeColors[badge] ?? '#8B5CF6'}33`,
            }}>
              🏅 {badge.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
