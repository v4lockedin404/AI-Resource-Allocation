'use client';

import { motion } from 'framer-motion';
import { MapPin, Star, Clock, CheckSquare } from 'lucide-react';

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
}

const softColors = [
  'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
];

export default function VolunteerCard({ volunteer }: VolunteerCardProps) {
  const initials = volunteer.name
    ? volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'VO';

  const colorIndex = (volunteer.name?.charCodeAt(0) || 0) % softColors.length;
  const avatarColor = softColors[colorIndex];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-5 flex flex-col justify-between min-h-[220px] bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
    >
      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor}`}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                {volunteer.name}
              </h3>
              <span 
                className={`w-2 h-2 rounded-full flex-shrink-0 ${volunteer.availability ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} 
                title={volunteer.availability ? 'Available' : 'Assigned'}
              />
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-[var(--color-text-secondary)]">
              <MapPin size={12} className="text-[var(--color-text-muted)]" />
              <span className="truncate">{volunteer.city || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {(volunteer.skills || []).slice(0, 3).map((skill) => (
            <span 
              key={skill} 
              className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
            >
              {skill.replace(/_/g, ' ')}
            </span>
          ))}
          {(volunteer.skills || []).length > 3 && (
            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
              +{(volunteer.skills || []).length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs font-medium text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-1.5" title="Available Hours">
          <Clock size={14} className="text-[var(--color-text-muted)]" />
          <span className="text-[var(--color-text-primary)] font-semibold">{volunteer.hours_available || 0}h</span>
        </div>
        <div className="flex items-center gap-1.5" title="Tasks Completed">
          <CheckSquare size={14} className="text-[var(--color-text-muted)]" />
          <span className="text-[var(--color-text-primary)] font-semibold">{volunteer.tasks_completed || 0} jobs</span>
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-bold" title="Reputation Points">
          <Star size={14} className="fill-amber-500 text-amber-500" />
          <span>{volunteer.reputation_points || 0}</span>
        </div>
      </div>
    </motion.div>
  );
}
