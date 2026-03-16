import { useRef, useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/format';

interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
  hint?: string;
  decimals?: number;
}

export default function CurrencyInput({ label, value, onChange, suffix = '元', className = '', hint, decimals = 0 }: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value.toString());
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(displayValue.replace(/[^0-9.-]/g, '')) || 0;
    onChange(parsed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  return (
    <div className={`group ${className}`}>
      {label && <label className="block text-xs text-muted-foreground mb-1 tracking-wide">{label}</label>}
      {hint && <p className="text-[10px] text-muted-foreground/60 mb-1">{hint}</p>}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type={isFocused ? 'number' : 'text'}
          value={isFocused ? displayValue : formatCurrency(value, decimals)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">{suffix}</span>
      </div>
    </div>
  );
}
