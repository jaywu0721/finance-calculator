import { useState } from 'react';
import { useJointDevelopmentCalculator } from '@/hooks/useJointDevelopmentCalculator';
import CurrencyInput from '@/components/CurrencyInput';
import { formatCurrency, formatPercent } from '@/lib/format';
import { Printer } from 'lucide-react';

export default function JointDevelopment() {
  const { inputs, updateInput, result } = useJointDevelopmentCalculator();
  const [activeTab, setActiveTab] = useState('sales');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* 標題和列印按鈕 */}
        <div className="flex items-center justify-between mb-8 print:mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2 print:text-2xl">
              建設公司收益評估（合建）
            </h1>
            <p className="text-muted-foreground print:text-sm">即時互動版 — 溢價金額與稅務分析</p>
          </div>
          <button
            onClick={handlePrint}
            className="hidden print:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            <Printer className="w-4 h-4" />
            列印報表
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1">
          {/* 左側：輸入參數 */}
          <div className="lg:col-span-1 space-y-4 print:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4 print:border-0 print:bg-transparent print:p-0">
              <h2 className="text-sm font-semibold text-primary mb-4">參數輸入</h2>

              {/* Tab 導航 */}
              <div className="flex gap-2 mb-4 print:hidden flex-wrap">
                {['sales', 'land', 'build', 'joint'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs rounded transition ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {tab === 'sales' && '銷售'}
                    {tab === 'land' && '土地'}
                    {tab === 'build' && '建物'}
                    {tab === 'joint' && '合建'}
                  </button>
                ))}
              </div>

              {/* 銷售參數 */}
              <div className={activeTab !== 'sales' ? 'hidden print:block' : ''}>
                <div className="space-y-3 mb-4 print:mb-2">
                  <CurrencyInput
                    label="銷售坪數"
                    value={inputs.saleArea}
                    onChange={(v: number) => updateInput('saleArea', v)}
                    suffix="坪"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="每坪售價"
                    value={inputs.salePrice}
                    onChange={(v: number) => updateInput('salePrice', v)}
                    suffix="元/坪"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="車位數量"
                    value={inputs.parkQty}
                    onChange={(v: number) => updateInput('parkQty', v)}
                    suffix="位"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="車位單價"
                    value={inputs.parkPrice}
                    onChange={(v: number) => updateInput('parkPrice', v)}
                    suffix="元/位"
                    decimals={0}
                  />
                </div>
              </div>

              {/* 土地參數 */}
              <div className={activeTab !== 'land' ? 'hidden print:block' : ''}>
                <div className="space-y-3 mb-4 print:mb-2">
                  <CurrencyInput
                    label="土地坪數"
                    value={inputs.landArea}
                    onChange={(v: number) => updateInput('landArea', v)}
                    suffix="坪"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="土地單價"
                    value={inputs.landPrice}
                    onChange={(v: number) => updateInput('landPrice', v)}
                    suffix="元/坪"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="土地成本2（實際）"
                    value={inputs.landCost2}
                    onChange={(v: number) => updateInput('landCost2', v)}
                    suffix="元"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="土地時間"
                    value={inputs.landYears}
                    onChange={(v: number) => updateInput('landYears', v)}
                    suffix="年"
                    decimals={1}
                  />
                  <CurrencyInput
                    label="土地年利率"
                    value={inputs.landRate * 100}
                    onChange={(v: number) => updateInput('landRate', v / 100)}
                    suffix="%"
                    decimals={2}
                  />
                </div>
              </div>

              {/* 建物參數 */}
              <div className={activeTab !== 'build' ? 'hidden print:block' : ''}>
                <div className="space-y-3 mb-4 print:mb-2">
                  <CurrencyInput
                    label="建坪"
                    value={inputs.buildArea}
                    onChange={(v: number) => updateInput('buildArea', v)}
                    suffix="坪"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="營造單價（成本1）"
                    value={inputs.buildUnit}
                    onChange={(v: number) => updateInput('buildUnit', v)}
                    suffix="元/坪"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="建物時間"
                    value={inputs.buildYears}
                    onChange={(v: number) => updateInput('buildYears', v)}
                    suffix="年"
                    decimals={1}
                  />
                  <CurrencyInput
                    label="建物年利率"
                    value={inputs.buildRate * 100}
                    onChange={(v: number) => updateInput('buildRate', v / 100)}
                    suffix="%"
                    decimals={2}
                  />
                  <CurrencyInput
                    label="建物利息2（實際貸款）"
                    value={inputs.buildInterest2}
                    onChange={(v: number) => updateInput('buildInterest2', v)}
                    suffix="元"
                    decimals={0}
                  />
                </div>
              </div>

              {/* 合建參數 */}
              <div className={activeTab !== 'joint' ? 'hidden print:block' : ''}>
                <div className="space-y-3 print:mb-2">
                  <CurrencyInput
                    label="代銷抄成"
                    value={inputs.salesFeeRate * 100}
                    onChange={(v: number) => updateInput('salesFeeRate', v / 100)}
                    suffix="%"
                    decimals={2}
                  />
                  <CurrencyInput
                    label="合建比例（建設）"
                    value={inputs.devPct}
                    onChange={(v: number) => updateInput('devPct', v)}
                    suffix="%"
                    decimals={0}
                  />
                  <CurrencyInput
                    label="目標利潤率"
                    value={inputs.targetMargin * 100}
                    onChange={(v: number) => updateInput('targetMargin', v / 100)}
                    suffix="%"
                    decimals={2}
                  />
                  <CurrencyInput
                    label="增加成本稅率"
                    value={inputs.extraTaxRate * 100}
                    onChange={(v: number) => updateInput('extraTaxRate', v / 100)}
                    suffix="%"
                    decimals={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右側：計算結果 */}
          <div className="lg:col-span-2 space-y-4 print:col-span-1">
            {/* 即時計算結果 */}
            <div className="bg-card border border-border rounded-lg p-4 print:border-0 print:bg-transparent print:p-0">
              <h2 className="text-sm font-semibold text-primary mb-4">即時計算結果</h2>

              <div className="grid grid-cols-2 gap-4 mb-4 print:grid-cols-2 print:gap-2">
                <div className="bg-secondary/30 rounded-lg p-3 print:bg-transparent print:border-b print:border-border print:pb-2">
                  <p className="text-xs text-muted-foreground mb-1">總銷金額</p>
                  <p className="font-mono font-bold text-lg text-primary">{formatCurrency(result.totalSales)}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 print:bg-transparent print:border-b print:border-border print:pb-2">
                  <p className="text-xs text-muted-foreground mb-1">總利潤</p>
                  <p className="font-mono font-bold text-lg text-primary">{formatCurrency(result.totalProfit)}</p>
                  <p className="text-xs text-muted-foreground mt-1">利潤率：{formatPercent(result.profitRate * 100)}%</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 print:bg-transparent print:border-b print:border-border print:pb-2">
                  <p className="text-xs text-muted-foreground mb-1">建物成本2（反推）</p>
                  <p className="font-mono font-bold text-lg text-primary">{formatCurrency(result.buildCost2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(result.buildCost2Unit)}/坪</p>
                </div>
                <div className={`rounded-lg p-3 print:bg-transparent print:border-b print:border-border print:pb-2 ${result.extraCost >= 0 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                  <p className="text-xs text-muted-foreground mb-1">增加成本</p>
                  <p className={`font-mono font-bold text-lg ${result.extraCost >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(result.extraCost)}
                  </p>
                </div>
              </div>
            </div>

            {/* 成本明細表 */}
            <div className="bg-card border border-border rounded-lg p-4 print:border-0 print:bg-transparent print:p-0 overflow-x-auto">
              <h3 className="text-sm font-semibold text-primary mb-3">成本明細</h3>
              <table className="w-full text-xs print:text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">項目</th>
                    <th className="text-right py-2 px-2">金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">土地成本1</td>
                    <td className="text-right font-mono">{formatCurrency(result.landCost1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">建物成本1</td>
                    <td className="text-right font-mono">{formatCurrency(result.buildCost1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">土地利息1</td>
                    <td className="text-right font-mono">{formatCurrency(result.landInterest1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">建物利息1</td>
                    <td className="text-right font-mono">{formatCurrency(result.buildInterest1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">銷售費用</td>
                    <td className="text-right font-mono">{formatCurrency(result.salesFee)}</td>
                  </tr>
                  <tr className="border-b border-border font-semibold">
                    <td className="py-2 px-2">稅金</td>
                    <td className="text-right font-mono">{formatCurrency(result.totalTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 合建分配表 */}
            <div className="bg-card border border-border rounded-lg p-4 print:border-0 print:bg-transparent print:p-0 overflow-x-auto">
              <h3 className="text-sm font-semibold text-primary mb-3">合建分配與稅務明細</h3>
              <table className="w-full text-xs print:text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">角色</th>
                    <th className="text-right py-2 px-2">稅前盈餘</th>
                    <th className="text-right py-2 px-2">兩稅合一(20%)</th>
                    <th className="text-right py-2 px-2">個人分配額(28%)</th>
                    <th className="text-right py-2 px-2">稅後盈餘</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">建設</td>
                    <td className="text-right font-mono">{formatCurrency(result.devPretax)}</td>
                    <td className="text-right font-mono">{formatCurrency(result.devTwoTax)}</td>
                    <td className="text-right font-mono">{formatCurrency(result.devDistTax)}</td>
                    <td className="text-right font-mono font-semibold">{formatCurrency(result.devAfterTax)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">地主</td>
                    <td className="text-right font-mono">{formatCurrency(result.landPretax)}</td>
                    <td className="text-right font-mono">{formatCurrency(result.landTwoTax)}</td>
                    <td className="text-right font-mono">—</td>
                    <td className="text-right font-mono font-semibold">{formatCurrency(result.landAfterTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
