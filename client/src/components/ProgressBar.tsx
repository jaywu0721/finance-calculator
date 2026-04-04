import React from 'react';
import { formatCurrency } from '@/lib/format';

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color?: 'emerald' | 'red' | 'orange' | 'blue' | 'gray';
  showPercentage?: boolean;
  showAmount?: boolean;
  className?: string;
}

const colorMap = {
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
};

const bgColorMap = {
  emerald: 'bg-emerald-100',
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  blue: 'bg-blue-100',
  gray: 'bg-gray-100',
};

export default function ProgressBar({
  label,
  value,
  total,
  color = 'blue',
  showPercentage = true,
  showAmount = true,
  className = '',
}: ProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const displayPercentage = Math.min(percentage, 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        {showPercentage && (
          <span className="text-xs font-semibold text-foreground">{displayPercentage.toFixed(1)}%</span>
        )}
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${bgColorMap[color]}`}>
        <div
          className={`h-full ${colorMap[color]} transition-all duration-300`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      {showAmount && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(value)}</span>
          <span>/</span>
          <span>{formatCurrency(total)}</span>
        </div>
      )}
    </div>
  );
}
