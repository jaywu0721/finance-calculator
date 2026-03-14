import { formatCurrency } from '@/lib/format';

interface ResultCardProps {
  label: string;
  value: number;
  suffix?: string;
  variant?: 'default' | 'positive' | 'negative' | 'accent';
  size?: 'sm' | 'lg';
}

export default function ResultCard({ label, value, suffix = '元', variant = 'default', size = 'sm' }: ResultCardProps) {
  const colorMap = {
    default: 'text-foreground',
    positive: 'text-primary',
    negative: 'text-destructive',
    accent: 'text-accent',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-xs text-muted-foreground mb-1 tracking-wide">{label}</p>
      <p className={`font-mono font-bold ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${colorMap[variant]}`}>
        {value < 0 ? '-' : ''}{formatCurrency(Math.abs(value))}
        <span className="text-xs text-muted-foreground ml-1 font-normal">{suffix}</span>
      </p>
    </div>
  );
}
