'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface Prediction {
  region: string;
  prediction: string;
  probability: number;
  recommended_action: string;
  urgency_forecast: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface PredictionCardProps {
  prediction: Prediction;
  index?: number;
}

const urgencyColors = ['', '#10B981', '#84CC16', '#F59E0B', '#F97316', '#EF4444'];
const trendConfig = {
  increasing: { icon: TrendingUp,   color: '#EF4444', label: 'Increasing' },
  stable:     { icon: Minus,        color: '#F59E0B', label: 'Stable'     },
  decreasing: { icon: TrendingDown, color: '#10B981', label: 'Decreasing' },
};

export default function PredictionCard({ prediction, index = 0 }: PredictionCardProps) {
  const urgencyColor = urgencyColors[prediction.urgency_forecast] ?? '#F59E0B';
  const trend = trendConfig[prediction.trend] ?? trendConfig.stable;
  const TrendIcon = trend.icon;

  const probColor = prediction.probability >= 70 ? '#EF4444' : prediction.probability >= 40 ? '#F59E0B' : '#10B981';

  return (
    <motion.div
      className="card"
      style={{ padding: '1.5rem', borderLeft: `3px solid ${urgencyColor}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={14} color={urgencyColor} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {prediction.region}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Trend */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem',
            borderRadius: '9999px', background: `${trend.color}15`,
            color: trend.color, border: `1px solid ${trend.color}30`,
          }}>
            <TrendIcon size={11} /> {trend.label}
          </span>
        </div>
      </div>

      {/* Prediction text */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1rem' }}>
        {prediction.prediction}
      </p>

      {/* Probability bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Confidence</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: probColor }}>{prediction.probability}%</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.probability}%` }}
            transition={{ duration: 0.9, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${probColor}, ${probColor}88)` }}
          />
        </div>
      </div>

      {/* Urgency forecast */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <AlertTriangle size={13} color={urgencyColor} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Urgency Forecast:</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: urgencyColor }}>Level {prediction.urgency_forecast}/5</span>
      </div>

      {/* Recommended action */}
      <div style={{
        padding: '0.75rem',
        background: 'rgba(16,185,129,0.05)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: '0.5rem',
        display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
      }}>
        <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600, color: '#10B981' }}>Action: </span>
          {prediction.recommended_action}
        </p>
      </div>
    </motion.div>
  );
}
