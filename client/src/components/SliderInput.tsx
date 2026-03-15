import { useState, useEffect } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  showValue?: boolean;
  isPercent?: boolean;
  decimals?: number;
}

export default function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  showValue = true,
  isPercent = false,
  decimals = 0,
}: SliderInputProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const displayValue = isPercent
    ? (localValue * 100).toFixed(decimals)
    : localValue.toFixed(decimals);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {showValue && (
          <span className="text-sm font-semibold text-primary">
            {displayValue}
            {isPercent ? '%' : unit}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleSliderChange}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
            ((localValue - min) / (max - min)) * 100
          }%, hsl(var(--secondary)) ${((localValue - min) / (max - min)) * 100}%, hsl(var(--secondary)) 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {isPercent ? (min * 100).toFixed(0) : min}
          {isPercent ? '%' : unit}
        </span>
        <span>
          {isPercent ? (max * 100).toFixed(0) : max}
          {isPercent ? '%' : unit}
        </span>
      </div>
    </div>
  );
}
