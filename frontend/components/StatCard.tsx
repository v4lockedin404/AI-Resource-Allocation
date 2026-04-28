'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  delta?: string;
  deltaPositive?: boolean;
  index?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = '#3B82F6',
  delta,
  deltaPositive,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      {/* Icon ring */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: `${color}18`,
        border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        <Icon size={20} color={color} />
      </div>

      {/* Value */}
      <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
        {value}
      </div>

      {/* Title */}
      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {title}
      </div>

      {/* Delta */}
      {delta && (
        <div style={{
          marginTop: '0.625rem',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: deltaPositive ? '#10B981' : '#EF4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          {deltaPositive ? '↑' : '↓'} {delta}
        </div>
      )}

      {/* Bottom accent bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${color}, transparent)`,
        borderRadius: '0 0 var(--radius-card) var(--radius-card)',
        opacity: 0.4,
      }} />
    </motion.div>
  );
}
