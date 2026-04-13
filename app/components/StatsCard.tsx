import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string | null;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'purple' | 'green' | 'orange';
}

export default function StatsCard({ title, value, icon, trend, color = 'blue' }: StatsCardProps) {
  const colors = {
    blue: 'from-blue-500 to-indigo-500 shadow-blue-500/20 text-blue-400 bg-blue-500/10',
    purple: 'from-purple-500 to-pink-500 shadow-purple-500/20 text-purple-400 bg-purple-500/10',
    green: 'from-emerald-500 to-teal-500 shadow-emerald-500/20 text-emerald-400 bg-emerald-500/10',
    orange: 'from-orange-500 to-amber-500 shadow-orange-500/20 text-orange-400 bg-orange-500/10',
  };

  const currentColors = colors[color];
  const [gradient, , iconColor, iconBg] = currentColors.split(' ');

  return (
    <div className="glass-card p-6 relative overflow-hidden group hover-lift transition-all duration-300">
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor} border border-white/5 text-xl`}>
            {icon || '📈'}
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
              trend.isPositive 
                ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' 
                : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </div>
          )}
        </div>
        
        <h3 className="text-3xl font-bold font-outfit text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">
          {value}
        </h3>
        <p className="text-neutral-400 text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}
