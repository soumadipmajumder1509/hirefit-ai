import { useEffect, useRef, useState } from 'react';

const COLORS = {
  strong_match: '#10b981',  // emerald
  good_match: '#3b82f6',    // blue
  partial_match: '#f59e0b', // amber
  poor_match: '#ef4444',    // red
};

const LABELS = {
  strong_match: 'Strong Match',
  good_match: 'Good Match',
  partial_match: 'Partial Match',
  poor_match: 'Poor Match',
};

export default function ScoreCircle({ score, recommendation }) {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  const color = COLORS[recommendation] || COLORS.partial_match;
  const label = LABELS[recommendation] || 'Match Result';

  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const target = score;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    }

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        <svg width={radius * 2} height={radius * 2} className="-rotate-90">
          {/* Track */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring-progress"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold leading-none" style={{ color }}>
            {displayed}
          </span>
          <span className="text-xs text-slate-500 font-medium mt-1">/ 100</span>
        </div>
      </div>
      <div
        className="px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
      >
        {label}
      </div>
    </div>
  );
}
