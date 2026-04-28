interface UrgencyBadgeProps {
  level: number;
  size?: 'sm' | 'md';
}

const labels = ['', 'Low', 'Minor', 'Moderate', 'High', 'Critical'];

export default function UrgencyBadge({ level, size = 'md' }: UrgencyBadgeProps) {
  const safeLevel = Math.min(5, Math.max(1, level));
  const padding = size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.7rem';
  const fontSize = size === 'sm' ? '0.65rem' : '0.72rem';

  return (
    <span
      className={`badge urgency-${safeLevel}`}
      style={{ padding, fontSize }}
      title={`Urgency Level ${safeLevel}`}
    >
      {safeLevel === 5 && '🔴 '}
      {safeLevel === 4 && '🟠 '}
      {safeLevel === 3 && '🟡 '}
      {safeLevel === 2 && '🟢 '}
      {safeLevel === 1 && '⚪ '}
      L{safeLevel} — {labels[safeLevel]}
    </span>
  );
}
