import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InfoFlowSectionProps {
  title: string;
  icon?: React.ReactNode;
  type: 'input' | 'calculation' | 'result';
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const typeConfig = {
  input: {
    bgColor: 'bg-white border-border',
    titleColor: 'text-foreground',
    titleBg: 'bg-secondary/30',
    borderColor: 'border-l-4 border-l-blue-500',
  },
  calculation: {
    bgColor: 'bg-secondary/20 border-border',
    titleColor: 'text-foreground',
    titleBg: 'bg-secondary/40',
    borderColor: 'border-l-4 border-l-orange-500',
  },
  result: {
    bgColor: 'bg-primary/5 border-primary/20',
    titleColor: 'text-primary',
    titleBg: 'bg-primary/10',
    borderColor: 'border-l-4 border-l-primary',
  },
};

export default function InfoFlowSection({
  title,
  icon,
  type,
  children,
  defaultOpen = true,
  className = '',
}: InfoFlowSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const config = typeConfig[type];

  return (
    <div className={`border rounded-lg overflow-hidden ${config.bgColor} ${config.borderColor} ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between ${config.titleBg} hover:opacity-80 transition-opacity`}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className={`font-semibold text-sm ${config.titleColor}`}>{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}
