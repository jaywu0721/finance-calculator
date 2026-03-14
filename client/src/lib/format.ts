export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}
