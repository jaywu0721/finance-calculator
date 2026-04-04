import React from 'react';
import { formatCurrency } from '@/lib/format';

interface ComparisonRow {
  label: string;
  scenario1: number;
  scenario2: number;
  highlight?: boolean;
  type?: 'normal' | 'warning' | 'success';
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
  scenario1Label?: string;
  scenario2Label?: string;
  className?: string;
}

export default function ComparisonTable({
  rows,
  scenario1Label = '情境一',
  scenario2Label = '情境二',
  className = '',
}: ComparisonTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="text-left px-3 py-2 font-semibold text-foreground">項目</th>
            <th className="text-right px-3 py-2 font-semibold text-foreground">{scenario1Label}</th>
            <th className="text-right px-3 py-2 font-semibold text-foreground">{scenario2Label}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const diff = row.scenario2 - row.scenario1;
            const diffText = diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff);
            const typeClass = row.type === 'warning' ? 'text-destructive' : row.type === 'success' ? 'text-emerald-600' : 'text-foreground';

            return (
              <tr
                key={idx}
                className={`border-b border-border ${
                  row.highlight ? 'bg-primary/5' : ''
                } hover:bg-secondary/20 transition-colors`}
              >
                <td className={`px-3 py-2 font-medium ${typeClass}`}>{row.label}</td>
                <td className={`text-right px-3 py-2 font-mono ${typeClass}`}>
                  {formatCurrency(row.scenario1)}
                </td>
                <td className={`text-right px-3 py-2 font-mono ${typeClass}`}>
                  {formatCurrency(row.scenario2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 提示：對比兩種情境下的資金需求差異</p>
        </div>
      </div>
    </div>
  );
}
