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
      <div className="max-w-full mx-auto">
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

        {/* 左右各半佈局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          {/* 左側：參數輸入 */}
          <div className="bg-card border border-border rounded-lg p-6 print:border print:p-4 print:text-sm">
            <h2 className="text-xl font-bold mb-4 print:text-lg">參數輸入</h2>

            {/* 基本銷售參數 */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="銷售坪數"
                  value={inputs.saleArea}
                  onChange={v => updateInput('saleArea', v)}
                  suffix="坪"
                  decimals={2}
                />
                <CurrencyInput
                  label="每坪售價"
                  value={inputs.salePrice}
                  onChange={v => updateInput('salePrice', v)}
                  suffix="元/坪"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="土地坪數"
                  value={inputs.landArea}
                  onChange={v => updateInput('landArea', v)}
                  suffix="坪"
                  decimals={2}
                />
                <CurrencyInput
                  label="土地單價"
                  value={inputs.landPrice}
                  onChange={v => updateInput('landPrice', v)}
                  suffix="元/坪"
                />
              </div>
              <CurrencyInput
                label="土地成本2（實際地主成本）"
                value={inputs.landCost2}
                onChange={v => updateInput('landCost2', v)}
                suffix="元"
              />
              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="建坪"
                  value={inputs.buildArea}
                  onChange={v => updateInput('buildArea', v)}
                  suffix="坪"
                  decimals={2}
                />
                <CurrencyInput
                  label="建物年利率"
                  value={inputs.buildRate}
                  onChange={v => updateInput('buildRate', v)}
                  hint="例0.03"
                  decimals={4}
                />
              </div>
            </div>

            {/* 滑桿參數 */}
            <div className="space-y-6 mb-6 print:hidden">
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
                  label="1/2建造時間（年）"
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
            <div className="space-y-4 print:space-y-2">
              <CurrencyInput
                label="土地年利率（用於土地利息1）"
                value={inputs.landRate}
                onChange={v => updateInput('landRate', v)}
                hint="例0.03"
                decimals={4}
              />
              <CurrencyInput
                label="建物利息2（實際貸款利息，1年）"
                value={inputs.interest2}
                onChange={v => updateInput('interest2', v)}
                suffix="元"
              />
              <CurrencyInput
                label="代銷抽成（%）"
                value={inputs.salesFeeRate * 100}
                onChange={v => updateInput('salesFeeRate', v / 100)}
                hint="例5"
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

          {/* 右側：即時計算結果 */}
          <div className="bg-card border border-border rounded-lg p-6 print:border print:p-4 print:text-sm">
            <h2 className="text-xl font-bold mb-4 print:text-lg">即時計算結果</h2>

            {/* 核心結果卡片 */}
            <div className="space-y-3 mb-6">
              <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">總銷金額</p>
                <p className="font-mono font-bold text-lg print:text-base">{formatCurrency(result.totalSales)} 元</p>
              </div>
              <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">總利潤</p>
                <p className="font-mono font-bold text-lg text-emerald-400 print:text-base print:text-foreground">{formatCurrency(result.totalProfit)} 元</p>
                <p className="text-xs text-muted-foreground mt-1">利潤率：{formatPercent(result.profitRate)}（目標：{formatPercent(inputs.targetMargin)}）</p>
              </div>
              <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">建物成本2（由目標利潤率反推）</p>
                <p className="font-mono font-bold text-lg print:text-base">{formatCurrency(result.build2)} 元</p>
                <p className="text-xs text-muted-foreground mt-1">每坪：{formatCurrency(result.build2 / inputs.buildArea)} 元/坪</p>
              </div>
              <div className="bg-accent/20 border border-accent rounded-lg p-4 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">增加成本（溢價金額）</p>
                <p className={`font-mono font-bold text-lg print:text-base ${result.extraCost >= 0 ? 'text-coral-400' : 'text-emerald-400'}`}>
                  {formatCurrency(result.extraCost)} 元
                </p>
                <p className="text-xs text-muted-foreground mt-1">建物成本2 − 建物成本1</p>
              </div>
            </div>

            {/* 詳細計算表格 */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs print:text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">項目</th>
                    <th className="text-right py-2 px-2">金額</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b border-border hover:bg-secondary/20">
                    <td className="py-2 px-2">土地成本1（現價）</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.land1)}</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/20">
                    <td className="py-2 px-2">土地利息1</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.landInterest1)}</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/20">
                    <td className="py-2 px-2">建物成本1</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.build1)}</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/20">
                    <td className="py-2 px-2">建物利息1</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.buildInterest1)}</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/20">
                    <td className="py-2 px-2">代銷費用</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.salesFee)}</td>
                  </tr>
                  <tr className="border-b border-border bg-secondary/20 font-bold">
                    <td className="py-2 px-2">內帳成本合計</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.totalCost1)}</td>
                  </tr>
                  <tr className="border-b border-border bg-secondary/20 font-bold">
                    <td className="py-2 px-2">內帳利潤</td>
                    <td className="text-right py-2 px-2 text-emerald-400">{formatCurrency(result.profit1)}</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/20">
                    <td className="py-2 px-2">建物成本2（外帳）</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.build2)}</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-secondary/20">
                    <td className="py-2 px-2">建物利息2（實際貸款）</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.interest2)}</td>
                  </tr>
                  <tr className="border-b border-border bg-secondary/20 font-bold">
                    <td className="py-2 px-2">外帳成本合計</td>
                    <td className="text-right py-2 px-2">{formatCurrency(result.totalCost2)}</td>
                  </tr>
                  <tr className="border-b border-border bg-secondary/20 font-bold">
                    <td className="py-2 px-2">外帳利潤（應稅所得）</td>
                    <td className="text-right py-2 px-2 text-emerald-400">{formatCurrency(result.profit2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 合建分配 */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-bold mb-3 print:text-sm">合建分配</h3>
              <div className="space-y-2 text-sm print:text-xs">
                <div className="flex justify-between">
                  <span>建設端利潤（內帳）</span>
                  <span className="font-mono">{formatCurrency(result.devProfit1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>地主端利潤（內帳）</span>
                  <span className="font-mono">{formatCurrency(result.landProfit1)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span>建設端利潤（外帳）</span>
                  <span className="font-mono">{formatCurrency(result.devProfit2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>地主端利潤（外帳）</span>
                  <span className="font-mono">{formatCurrency(result.landProfit2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 列印時顯示滑桿參數 */}
        <div className="hidden print:block mt-6 bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-3">滑桿參數設定</h3>
          <div className="grid grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">營造單價</p>
              <p className="font-mono font-bold">{formatCurrency(inputs.buildUnit)} 元/坪</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">土地時間</p>
              <p className="font-mono font-bold">{inputs.landYears.toFixed(1)} 年</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">1/2建造時間</p>
              <p className="font-mono font-bold">{inputs.buildYears.toFixed(1)} 年</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">合建比例</p>
              <p className="font-mono font-bold">{formatPercent(inputs.devPct)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">目標利潤率</p>
              <p className="font-mono font-bold">{formatPercent(inputs.targetMargin)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
