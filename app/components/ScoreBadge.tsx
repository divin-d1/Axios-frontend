import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export default function ScoreBadge({ score, size = 'md', showLabel = false, label = 'Match' }: ScoreBadgeProps) {
  // Determine color based on score
  let colorClass = 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  let shadowClass = '';
  
  if (score >= 80) {
    colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    shadowClass = 'shadow-[0_0_15px_rgba(16,185,129,0.3)]';
  } else if (score >= 60) {
    colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    shadowClass = 'shadow-[0_0_15px_rgba(59,130,246,0.3)]';
  } else if (score >= 40) {
    colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    shadowClass = 'shadow-[0_0_15px_rgba(245,158,11,0.3)]';
  } else {
    colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    shadowClass = 'shadow-[0_0_15px_rgba(244,63,94,0.3)]';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-xl px-4 py-1.5 font-bold',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${colorClass} ${shadowClass} ${sizeClasses[size]}`}>
      {!showLabel && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {showLabel && <span className="font-medium opacity-80">{label}:</span>}
      <span className="font-bold">{Math.round(score)}</span>
    </div>
  );
}
