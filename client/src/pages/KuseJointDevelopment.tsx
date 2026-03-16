import { useKuseJointDevelopment } from '@/hooks/useKuseJointDevelopment';
import CurrencyInput from '@/components/CurrencyInput';
import SliderInput from '@/components/SliderInput';
import { formatCurrency } from '@/lib/format';
import { Printer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KuseJointDevelopment() {
  const { inputs, updateInput, resetInputs, result } = useKuseJointDevelopment();

  const handlePrint = () => {
    window.print();
  };

  const fmtPct = (v: number, decimals = 1) => `${(v * 100).toFixed(decimals)}%`;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-full mx-auto">
        {/* 標題 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">建設公司收益評估（合建）— 即時互動版</h1>
        </div>

        {/* 頂部操作欄 */}
        <div className="flex items-center gap-4 mb-6 print:hidden">
          <span className="text-sm font-semibold whitespace-nowrap">案件名稱：</span>
          <input
            type="text"
            value={inputs.projectName}
            onChange={e => updateInput('projectName', e.target.value)}
            placeholder="請輸入案件名稱"
            className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground"
          />
          <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            列印報表
          </Button>
          <Button onClick={resetInputs} variant="outline" size="sm" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            重設
          </Button>
        </div>

        {/* 列印時顯示案件名稱 */}
        <div className="hidden print:block mb-4">
          <p className="text-sm"><strong>案件名稱：</strong>{inputs.projectName || '（未填寫）'}</p>
        </div>

        {/* 左右各半佈局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          {/* ===== 左側：參數輸入 ===== */}
          <div className="bg-card border border-border rounded-lg p-6 print:border print:p-4 print:text-sm">
            <h2 className="text-xl font-bold mb-4 print:text-lg">參數輸入</h2>

            <div className="space-y-3">
              {/* 銷售坪數 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">銷售坪數</label>
                <CurrencyInput
                  value={inputs.saleArea}
                  onChange={v => updateInput('saleArea', v)}
                  suffix="坪"
                  decimals={2}
                />
              </div>
              {/* 每坪售價 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">每坪售價</label>
                <CurrencyInput
                  value={inputs.salePrice}
                  onChange={v => updateInput('salePrice', v)}
                  suffix="元/坪"
                />
              </div>
              {/* 車位數量 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">車位數量</label>
                <CurrencyInput
                  value={inputs.parkQty}
                  onChange={v => updateInput('parkQty', v)}
                  suffix="位"
                />
              </div>
              {/* 車位單價 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">車位單價</label>
                <CurrencyInput
                  value={inputs.parkPrice}
                  onChange={v => updateInput('parkPrice', v)}
                  suffix="元/位"
                />
              </div>
              {/* 土地坪數 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">土地坪數</label>
                <CurrencyInput
                  value={inputs.landArea}
                  onChange={v => updateInput('landArea', v)}
                  suffix="坪"
                  decimals={2}
                />
              </div>
              {/* 土地單價 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">土地單價</label>
                <CurrencyInput
                  value={inputs.landPrice}
                  onChange={v => updateInput('landPrice', v)}
                  suffix="元/坪"
                />
              </div>
              {/* 土地成本2 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">土地成本2（實際地主成本）</label>
                <CurrencyInput
                  value={inputs.landCost2}
                  onChange={v => updateInput('landCost2', v)}
                  suffix="元"
                />
              </div>
              {/* 建坪 */}
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">建坪</label>
                <CurrencyInput
                  value={inputs.buildArea}
                  onChange={v => updateInput('buildArea', v)}
                  suffix="坪"
                  decimals={2}
                />
              </div>
            </div>

            {/* 滑桿參數 */}
            <div className="space-y-5 mt-5 print:hidden">
              <div>
                <SliderInput
                  label="營造單價（建物成本1）"
                  value={inputs.buildUnit}
                  min={120000}
                  max={260000}
                  step={1000}
                  onChange={v => updateInput('buildUnit', v)}
                  unit=" 元/坪"
                  decimals={0}
                />
                <p className="text-xs text-muted-foreground mt-1">滑鈕：120,000～260,000；每 1,000 一格</p>
              </div>
              <div>
                <SliderInput
                  label="土地時間（年）"
                  value={inputs.landYears}
                  min={0}
                  max={10}
                  step={0.2}
                  onChange={v => updateInput('landYears', v)}
                  unit=" 年"
                  decimals={1}
                />
                <p className="text-xs text-muted-foreground mt-1">滑鈕：0～10；每 0.2 年一格</p>
              </div>
              <div>
                <SliderInput
                  label="建物時間（年）"
                  value={inputs.buildYears}
                  min={0}
                  max={10}
                  step={0.1}
                  onChange={v => updateInput('buildYears', v)}
                  unit=" 年"
                  decimals={1}
                />
                <p className="text-xs text-muted-foreground mt-1">滑鈕：0～10；每 0.1 年一格</p>
              </div>
            </div>

            {/* 其他數值參數 */}
            <div className="space-y-3 mt-5">
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">土地年利率（用於土地利息1）</label>
                <CurrencyInput
                  value={inputs.landRate}
                  onChange={v => updateInput('landRate', v)}
                  suffix="（例0.03）"
                  decimals={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">建物年利率（用於建物利息1）</label>
                <CurrencyInput
                  value={inputs.buildRate}
                  onChange={v => updateInput('buildRate', v)}
                  suffix="（例0.03）"
                  decimals={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">建物利息2（實際貸款利息）</label>
                <CurrencyInput
                  value={inputs.interest2}
                  onChange={v => updateInput('interest2', v)}
                  suffix="元"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">代銷抽成（%）</label>
                <CurrencyInput
                  value={inputs.salesFeeRate}
                  onChange={v => updateInput('salesFeeRate', v)}
                  suffix="（例0.05）"
                  decimals={4}
                />
              </div>
            </div>

            {/* 合建比例與目標利潤率滑桿 */}
            <div className="space-y-5 mt-5 print:hidden">
              <div>
                <SliderInput
                  label="合建比例：建設（%）"
                  value={inputs.devPct * 100}
                  min={0}
                  max={100}
                  step={1}
                  onChange={v => updateInput('devPct', v / 100)}
                  unit="%"
                  decimals={0}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(inputs.devPct * 100)}%（地主 {Math.round((1 - inputs.devPct) * 100)}%）
                </p>
              </div>
              <div>
                <SliderInput
                  label="目標利潤率（反推建物成本2）"
                  value={inputs.targetMargin * 100}
                  min={9}
                  max={15}
                  step={0.5}
                  onChange={v => updateInput('targetMargin', v / 100)}
                  unit="%"
                  decimals={1}
                />
                <p className="text-xs text-muted-foreground mt-1">可調 9%～15%（建設端目標利潤）</p>
              </div>
            </div>

            {/* 增加成本稅率 */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <label className="text-sm w-40 shrink-0">增加成本稅率</label>
                <CurrencyInput
                  value={inputs.extraTaxRate}
                  onChange={v => updateInput('extraTaxRate', v)}
                  suffix="（例0.09）"
                  decimals={4}
                />
              </div>
            </div>
          </div>

          {/* ===== 右側：即時計算結果 ===== */}
          <div className="bg-card border border-border rounded-lg p-6 print:border print:p-4 print:text-sm">
            <h2 className="text-xl font-bold mb-4 print:text-lg">即時計算結果</h2>

            {/* 四大核心結果卡片 - 2x2 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* 總銷金額 */}
              <div className="bg-secondary/30 border border-border rounded-lg p-3 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">總銷金額</p>
                <p className="font-mono font-bold text-lg print:text-base">{formatCurrency(result.totalSales)} 元</p>
                <p className="text-xs text-muted-foreground mt-1">銷售坪數×售價 + 車位×車位單價</p>
              </div>
              {/* 總利潤 */}
              <div className="bg-secondary/30 border border-border rounded-lg p-3 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">總利潤</p>
                <p className={`font-mono font-bold text-lg print:text-base ${result.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(result.totalProfit)} 元
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  總利潤率：{fmtPct(result.profitRate)}（目標利潤率：{fmtPct(inputs.targetMargin)}｜建設端基準）
                </p>
              </div>
              {/* 建物成本2 */}
              <div className="bg-secondary/30 border border-border rounded-lg p-3 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">建物成本2（由目標利潤率反推）</p>
                <p className="font-mono font-bold text-lg print:text-base">{formatCurrency(result.build2)} 元</p>
                <p className="text-xs text-muted-foreground mt-1">
                  每坪建物成本2單價：{formatCurrency(Math.round(result.build2PerUnit))} 元/坪
                </p>
              </div>
              {/* 增加成本 */}
              <div className="bg-secondary/30 border border-border rounded-lg p-3 print:border print:bg-transparent print:p-2">
                <p className="text-xs text-muted-foreground mb-1">增加成本（建物成本2 − 建物成本1）</p>
                <p className={`font-mono font-bold text-lg print:text-base ${result.extraCost >= 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                  {formatCurrency(result.extraCost)} 元
                </p>
              </div>
            </div>

            {/* 計算明細表格 - 完全按照 KUSE 格式 */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm print:text-xs">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-2 px-2 font-semibold">項目</th>
                    <th className="text-left py-2 px-2 font-semibold">公式 / 說明</th>
                    <th className="text-right py-2 px-2 font-semibold">金額</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">土地成本1</td>
                    <td className="py-2 px-2 text-muted-foreground">土地坪數×土地單價</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.land1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">建物成本1</td>
                    <td className="py-2 px-2 text-muted-foreground">建坪×營造單價</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.build1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">土地利息1</td>
                    <td className="py-2 px-2 text-muted-foreground">土地成本1×土地利率×土地時間</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.landInterest1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">建物利息1</td>
                    <td className="py-2 px-2 text-muted-foreground">建物成本1×建物利率×建物時間</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.buildInterest1)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">銷售費用</td>
                    <td className="py-2 px-2 text-muted-foreground">總銷×代銷抽成</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.salesFee)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">稅金</td>
                    <td className="py-2 px-2 text-muted-foreground">建設兩稅合一+ 個人分配稅+ 地主兩稅合一+ 增加成本稅</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.totalTax)}</td>
                  </tr>
                  <tr className="border-b-2 border-border font-bold">
                    <td className="py-2 px-2">利潤</td>
                    <td className="py-2 px-2 text-muted-foreground">總銷 − 土地成本1 − 建物成本1 − (土地利息1+建物利息1) − 稅金 − 銷售費用</td>
                    <td className={`text-right py-2 px-2 font-mono ${result.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(result.totalProfit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 合建分配與稅務明細 */}
            <h3 className="font-bold mb-3 text-base print:text-sm">合建分配與稅務明細</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm print:text-xs">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-2 px-2 font-semibold">角色</th>
                    <th className="text-right py-2 px-2 font-semibold">稅前盈餘</th>
                    <th className="text-right py-2 px-2 font-semibold">兩稅合一(20%)</th>
                    <th className="text-right py-2 px-2 font-semibold">個人分配額(28%)</th>
                    <th className="text-right py-2 px-2 font-semibold">稅後盈餘</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">建設</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.devPretax)}</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.devTwoTax)}</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.devDistTax)}</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.devAfterTax)}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">地主</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.landlordPretax)}</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.landlordTwoTax)}</td>
                    <td className="text-right py-2 px-2 font-mono">—</td>
                    <td className="text-right py-2 px-2 font-mono">{formatCurrency(result.landlordAfterTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 底部說明 */}
            <div className="mt-4 p-3 bg-secondary/20 rounded-lg text-xs text-muted-foreground print:bg-transparent print:border print:border-border">
              <p>
                建物成本2反推（建設端基準）：建物成本2 = 建設端分配銷售額 − 建設端分攤代銷費 − 建物利息2 − 目標利潤率×建設端分配銷售額。
                其中「建設端分配銷售額」= 總銷×建設比例。
              </p>
            </div>
          </div>
        </div>

        {/* 列印時顯示滑桿參數 */}
        <div className="hidden print:block mt-4 bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-3 text-sm">滑桿參數設定</h3>
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
              <p className="text-xs text-muted-foreground">建物時間</p>
              <p className="font-mono font-bold">{inputs.buildYears.toFixed(1)} 年</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">合建比例（建設）</p>
              <p className="font-mono font-bold">{Math.round(inputs.devPct * 100)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">目標利潤率</p>
              <p className="font-mono font-bold">{fmtPct(inputs.targetMargin)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
