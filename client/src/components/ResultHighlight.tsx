import React from 'react';
import { formatCurrency } from '@/lib/format';
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

type ResultType = 'positive' | 'negative' | 'warning' | 'neutral';

interface ResultHighlightProps {
  label: string;
  value: number;
  type?: ResultType;
  formula?: string;
  icon?: React.ReactNode;
  className?: string;
  showFormula?: boolean;
}

const typeConfig = {
  positive: {
    bgColor: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-900',
    valueColor: 'text-emerald-600',
    icon: TrendingUp,
    iconColor: 'text-emerald-500',
  },
  negative: {
    bgColor: 'bg-red-50 border-red-200',
    textColor: 'text-red-900',
    valueColor: 'text-red-600',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
  },
  warning: {
    bgColor: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-900',
    valueColor: 'text-orange-600',
    icon: AlertTriangle,
    iconColor: 'text-orange-500',
  },
  neutral: {
    bgColor: 'bg-gray-50 border-gray-200',
    textColor: 'text-gray-900',
    valueColor: 'text-gray-600',
    icon: CheckCircle,
    iconColor: 'text-gray-500',
  },
};

export default function ResultHighlight({
  label,
  value,
  type = 'neutral',
  formula,
  icon,
  className = '',
  showFormula = true,
}: ResultHighlightProps) {
  const config = typeConfig[type];
  const DefaultIcon = config.icon;

  return (
    <div className={`border rounded-lg p-4 ${config.bgColor} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${config.iconColor}`}>
          {icon || <DefaultIcon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>{label}</p>
          <p className={`text-2xl font-bold font-mono mt-1 ${config.valueColor}`}>
            {formatCurrency(value)}
          </p>
          {showFormula && formula && (
            <p className={`text-xs mt-2 ${config.textColor} opacity-70`}>
              公式：{formula}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
