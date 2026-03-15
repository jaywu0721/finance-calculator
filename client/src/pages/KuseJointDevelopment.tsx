import { useKuseJointDevelopment } from '@/hooks/useKuseJointDevelopment';
import CurrencyInput from '@/components/CurrencyInput';
import SliderInput from '@/components/SliderInput';
import { formatCurrency, formatPercent } from '@/lib/format';
import { Printer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KuseJointDevelopment() {
  const { inputs, updateInput, resetInputs, result } = useKuseJointDevelopment();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* 標題 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">建設公司收益評估（合建）— 即時互動版</h1>
          <p className="text-muted-foreground">所有金額含稅</p>
        </div>

        {/* 頂部操作欄 */}
        <div className="flex items-center justify-between mb-6 gap-4 print:hidden">
          <div className="flex-1">
            <input
              type="text"
              value={inputs.projectName}
              onChange={e => updateInput('projectName', e.target.value)}
              placeholder="請輸入案件名稱"
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground"
            />
          </div>
          <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            🖨️ 列印報表
          </Button>
          <Button onClick={resetInputs} variant="outline" size="sm" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            重設範例
          </Button>
        </div>

        {/* 參數輸入區 */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 print:border-0 print:bg-transparent print:p-0">
          <h2 className="text-xl font-bold mb-4">參數輸入</h2>

          {/* 基本銷售參數 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 print:grid-cols-5 print:gap-2 print:text-sm">
            <CurrencyInput
              label="銷售坪數"
              value={inputs.saleArea}
              onChange={v => updateInput('saleArea', v)}
              suffix="坪"
            />
            <CurrencyInput
              label="每坪售價"
              value={inputs.salePrice}
              onChange={v => updateInput('salePrice', v)}
              suffix="元/坪"
            />
            <CurrencyInput
              label="車位數量"
              value={inputs.parkQty}
              onChange={v => updateInput('parkQty', v)}
              suffix="位"
            />
            <CurrencyInput
              label="車位單價"
              value={inputs.parkPrice}
              onChange={v => updateInput('parkPrice', v)}
              suffix="元/位"
            />
            <CurrencyInput
              label="土地坪數"
              value={inputs.landArea}
              onChange={v => updateInput('landArea', v)}
              suffix="坪"
            />
            <CurrencyInput
              label="土地單價"
              value={inputs.landPrice}
              onChange={v => updateInput('landPrice', v)}
              suffix="元/坪"
            />
            <CurrencyInput
              label="土地成本2（實際地主成本）"
              value={inputs.landCost2}
              onChange={v => updateInput('landCost2', v)}
              suffix="元"
            />
            <CurrencyInput
              label="建坪"
              value={inputs.buildArea}
              onChange={v => updateInput('buildArea', v)}
              suffix="坪"
            />
          </div>

          {/* 滑桿參數 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 print:hidden">
            <div>
              <SliderInput
                label="營造單價（建物成本1）"
                value={inputs.buildUnit}
                min={120000}
                max={260000}
                step={1000}
                onChange={v => updateInput('buildUnit', v)}
                unit="元/坪"
                decimals={0}
              />
              <p className="text-xs text-muted-foreground mt-2">滑鈕：120,000～260,000；每 1,000 一格</p>
            </div>
            <div>
              <SliderInput
                label="土地時間（年）"
                value={inputs.landYears}
                min={0}
                max={10}
                step={0.2}
                onChange={v => updateInput('landYears', v)}
                unit="年"
                decimals={1}
              />
              <p className="text-xs text-muted-foreground mt-2">滑鈕：0～10；每 0.2 年一格</p>
            </div>
            <div>
              <SliderInput
                label="建物時間（年）"
                value={inputs.buildYears}
                min={0}
                max={10}
                step={0.1}
                onChange={v => updateInput('buildYears', v)}
                unit="年"
                decimals={1}
              />
              <p className="text-xs text-muted-foreground mt-2">滑鈕：0～10；每 0.1 年一格</p>
            </div>
            <div>
              <SliderInput
                label="合建比例：建設（%）"
                value={inputs.devPct}
                min={0}
                max={1}
                step={0.01}
                onChange={v => updateInput('devPct', v)}
                isPercent={true}
                decimals={0}
              />
              <p className="text-xs text-muted-foreground mt-2">地主 {formatPercent(1 - inputs.devPct)}</p>
            </div>
            <div>
              <SliderInput
                label="目標利潤率"
                value={inputs.targetMargin}
                min={0.09}
                max={0.15}
                step={0.01}
                onChange={v => updateInput('targetMargin', v)}
                isPercent={true}
                decimals={1}
              />
              <p className="text-xs text-muted-foreground mt-2">可調 9%～15%（建設端目標利潤）</p>
            </div>
          </div>

          {/* 其他參數 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2 print:text-sm">
            <CurrencyInput
              label="土地年利率（用於土地利息1）"
              value={inputs.landRate}
              onChange={v => updateInput('landRate', v)}
              hint="例0.03"
              decimals={4}
            />
            <CurrencyInput
              label="建物年利率（用於建物利息1）"
              value={inputs.buildRate}
              onChange={v => updateInput('buildRate', v)}
              hint="例0.03"
              decimals={4}
            />
            <CurrencyInput
              label="建物利息2（實際貸款利息）"
              value={inputs.interest2}
              onChange={v => updateInput('interest2', v)}
              suffix="元"
            />
            <CurrencyInput
              label="代銷抽成（%）"
              value={inputs.salesFeeRate * 100}
              onChange={v => updateInput('salesFeeRate', v / 100)}
              hint="例0.05"
              decimals={2}
            />
            <CurrencyInput
              label="增加成本稅率"
              value={inputs.extraTaxRate}
              onChange={v => updateInput('extraTaxRate', v)}
              hint="例0.09"
              decimals={4}
            />
          </div>
        </div>

        {/* 即時計算結果 */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 print:border-0 print:bg-transparent print:p-0">
          <h2 className="text-xl font-bold mb-4">即時計算結果</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2 print:text-sm">
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">總銷金額</p>
              <p className="font-mono font-bold text-lg">{formatCurrency(result.totalSales)} 元</p>
              <p className="text-xs text-muted-foreground mt-1">銷售坪數×售價 + 車位×車位單價</p>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">總利潤</p>
              <p className="font-mono font-bold text-lg text-emerald-400">{formatCurrency(result.totalProfit)} 元</p>
              <p className="text-xs text-muted-foreground mt-1">總利潤率：{formatPercent(result.profitRate)}（目標利潤率：{formatPercent(inputs.targetMargin)}｜建設端基準）</p>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">建物成本2（由目標利潤率反推）</p>
              <p className="font-mono font-bold text-lg">{formatCurrency(result.build2)} 元</p>
              <p className="text-xs text-muted-foreground mt-1">每坪建物成本2單價：{formatCurrency(result.build2 / inputs.buildArea)} 元/坪</p>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">增加成本（建物成本2 − 建物成本1）</p>
              <p className={`font-mono font-bold text-lg ${result.extraCost >= 0 ? 'text-coral-400' : 'text-emerald-400'}`}>
                {formatCurrency(result.extraCost)} 元
              </p>
            </div>
          </div>

          {/* 詳細計算表格 */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2">項目</th>
                  <th className="text-left py-2 px-2">公式 / 說明</th>
                  <th className="text-right py-2 px-2">金額</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-secondary/20">
                  <td className="py-2 px-2">土地成本1</td>
                  <td className="py-2 px-2">土地坪數×土地單價</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.land1)}</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/20">
                  <td className="py-2 px-2">建物成本1</td>
                  <td className="py-2 px-2">建坪×營造單價</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.build1)}</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/20">
                  <td className="py-2 px-2">土地利息1</td>
                  <td className="py-2 px-2">土地成本1×土地利率×土地時間</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.landInterest1)}</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/20">
                  <td className="py-2 px-2">建物利息1</td>
                  <td className="py-2 px-2">建物成本1×建物利率×建物時間</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.buildInterest1)}</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/20">
                  <td className="py-2 px-2">銷售費用</td>
                  <td className="py-2 px-2">總銷×代銷抽成</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.salesFee)}</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/20">
                  <td className="py-2 px-2">稅金</td>
                  <td className="py-2 px-2">建設兩稅合一+ 個人分配稅+ 地主兩稅合一+ 增加成本稅</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.totalTax)}</td>
                </tr>
                <tr className="bg-primary/10 border-b border-border">
                  <td className="py-2 px-2 font-bold">利潤</td>
                  <td className="py-2 px-2 font-bold">總銷 − 土地成本1 − 建物成本1 − (土地利息1+建物利息1) − 稅金 − 銷售費用</td>
                  <td className="text-right py-2 px-2 font-mono font-bold text-primary">{formatCurrency(result.totalProfit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 合建分配與稅務明細 */}
        <div className="bg-card border border-border rounded-lg p-6 print:border-0 print:bg-transparent print:p-0">
          <h2 className="text-xl font-bold mb-4">合建分配與稅務明細</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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
                <tr className="border-b border-border hover:bg-secondary/20">
                  <td className="py-2 px-2">建設</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.devPretax)}</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.devTwoTax)}</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.devDistTax)}</td>
                  <td className="text-right py-2 px-2 font-mono font-bold text-emerald-400">{formatCurrency(result.devAfterTax)}</td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="py-2 px-2">地主</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.landlordPretax)}</td>
                  <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.landlordTwoTax)}</td>
                  <td className="text-right py-2 px-2 font-mono">—</td>
                  <td className="text-right py-2 px-2 font-mono font-bold text-emerald-400">{formatCurrency(result.landlordAfterTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <p>建物成本2反推（建設端基準）：建物成本2 = 建設端分配銷售額 − 建設端分攤代銷費 − 建物利息2 − 目標利潤率×建設端分配銷售額。</p>
            <p>其中「建設端分配銷售額」= 總銷×建設比例。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
