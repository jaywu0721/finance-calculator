import React from 'react';
import { ArrowDown, ArrowUp, Zap, Settings, Hash } from 'lucide-react';

export type ParameterType = 'income' | 'expense' | 'interest' | 'ratio' | 'result';

interface ParameterTagProps {
  type: ParameterType;
  label: string;
  value?: string | number;
  showValue?: boolean;
  className?: string;
}

const typeConfig = {
  income: {
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    icon: ArrowDown,
    label: '收入',
    bgColor: 'bg-emerald-100',
  },
  expense: {
    color: 'bg-red-50 border-red-200 text-red-700',
    icon: ArrowUp,
    label: '支出',
    bgColor: 'bg-red-100',
  },
  interest: {
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    icon: Zap,
    label: '利息',
    bgColor: 'bg-orange-100',
  },
  ratio: {
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    icon: Settings,
    label: '比例/時間',
    bgColor: 'bg-blue-100',
  },
  result: {
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    icon: Hash,
    label: '計算結果',
    bgColor: 'bg-gray-100',
  },
};

export default function ParameterTag({
  type,
  label,
  value,
  showValue = false,
  className = '',
}: ParameterTagProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{config.label}</span>
      </div>
      {showValue && value !== undefined && (
        <span className="text-xs text-muted-foreground">{value}</span>
      )}
    </div>
  );
}

// 左邊色帶版本（用於輸入框）
export function ParameterTagBand({
  type,
  children,
  className = '',
}: {
  type: ParameterType;
  children: React.ReactNode;
  className?: string;
}) {
  const config = typeConfig[type];
  const colorMap = {
    income: 'border-l-emerald-500',
    expense: 'border-l-red-500',
    interest: 'border-l-orange-500',
    ratio: 'border-l-blue-500',
    result: 'border-l-gray-500',
  };

  return (
    <div className={`border-l-4 pl-3 ${colorMap[type]} ${className}`}>
      {children}
    </div>
  );
}
