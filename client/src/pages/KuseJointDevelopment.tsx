import { useState } from 'react';
import { useKuseJointDevelopment, KuseJDInputs, KuseJDResults } from '@/hooks/useKuseJointDevelopment';
import CurrencyInput from '@/components/CurrencyInput';
import SliderInput from '@/components/SliderInput';
import { formatCurrency } from '@/lib/format';
import { Printer, RotateCcw, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedScenario {
  id: number;
  name: string;
  timestamp: string;
  inputs: KuseJDInputs;
  result: KuseJDResults;
}

export default function KuseJointDevelopment() {
  const { inputs, updateInput, resetInputs, result } = useKuseJointDevelopment();
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [showScenarios, setShowScenarios] = useState(false);
  const [nextId, setNextId] = useState(1);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveScenario = () => {
    const scenario: SavedScenario = {
      id: nextId,
      name: inputs.projectName || `方案 ${nextId}`,
      timestamp: new Date().toLocaleString('zh-TW'),
      inputs: { ...inputs },
      result: { ...result },
    };
    setSavedScenarios(prev => [...prev, scenario]);
    setNextId(prev => prev + 1);
    setShowScenarios(true);
  };

  const handleDeleteScenario = (id: number) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  };

  const fmtPct = (v: number, decimals = 1) => `${(v * 100).toFixed(decimals)}%`;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 print:p-0 print:min-h-0 print:break-inside-avoid">
      <div className="max-w-full mx-auto">
        {/* 標題 */}
        <div className="mb-4 print:mb-1">
          <h1 className="text-2xl font-bold print:text-base print:mb-0">建設公司收益評估（合建）— 即時互動版</h1>
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
          <Button onClick={handleSaveScenario} variant="outline" size="sm" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
            <Save className="w-4 h-4" />
            儲存方案
          </Button>
          <Button onClick={resetInputs} variant="outline" size="sm" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            重設
          </Button>
        </div>

        {/* 列印時顯示案件名稱 */}
        <div className="hidden print:block mb-1">
          <p className="text-xs"><strong>案件名稱：</strong>{inputs.projectName || '（未填寫）'}</p>
        </div>

        {/* 左右各半佈局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-2">
          {/* ===== 左側：參數輸入 ===== */}
          <div className="bg-card border border-border rounded-lg p-6 print:border print:border-gray-300 print:p-2 print:text-[9px]">
            <h2 className="text-xl font-bold mb-4 print:text-xs print:mb-1">參數輸入</h2>

            <div className="space-y-3 print:space-y-0">
              {/* 銷售坪數 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">銷售坪數</label>
                <span className="hidden print:inline font-mono text-[9px]">{inputs.saleArea.toFixed(2)} 坪</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.saleArea} onChange={v => updateInput('saleArea', v)} suffix="坪" decimals={2} /></div>
              </div>
              {/* 每坪售價 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">每坪售價</label>
                <span className="hidden print:inline font-mono text-[9px]">{formatCurrency(inputs.salePrice)} 元/坪</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.salePrice} onChange={v => updateInput('salePrice', v)} suffix="元/坪" /></div>
              </div>
              {/* 車位數量 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">車位數量</label>
                <span className="hidden print:inline font-mono text-[9px]">{formatCurrency(inputs.parkQty)} 位</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.parkQty} onChange={v => updateInput('parkQty', v)} suffix="位" /></div>
              </div>
              {/* 車位單價 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">車位單價</label>
                <span className="hidden print:inline font-mono text-[9px]">{formatCurrency(inputs.parkPrice)} 元/位</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.parkPrice} onChange={v => updateInput('parkPrice', v)} suffix="元/位" /></div>
              </div>
              {/* 土地坪數 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">土地坪數</label>
                <span className="hidden print:inline font-mono text-[9px]">{inputs.landArea.toFixed(2)} 坪</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.landArea} onChange={v => updateInput('landArea', v)} suffix="坪" decimals={2} /></div>
              </div>
              {/* 土地單價 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">土地單價</label>
                <span className="hidden print:inline font-mono text-[9px]">{formatCurrency(inputs.landPrice)} 元/坪</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.landPrice} onChange={v => updateInput('landPrice', v)} suffix="元/坪" /></div>
              </div>
              {/* 土地成本2 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">土地成本2</label>
                <span className="hidden print:inline font-mono text-[9px]">{formatCurrency(inputs.landCost2)} 元</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.landCost2} onChange={v => updateInput('landCost2', v)} suffix="元" /></div>
              </div>
              {/* 建坪 */}
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">建坪</label>
                <span className="hidden print:inline font-mono text-[9px]">{inputs.buildArea.toFixed(2)} 坪</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.buildArea} onChange={v => updateInput('buildArea', v)} suffix="坪" decimals={2} /></div>
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
            <div className="space-y-3 mt-5 print:space-y-0 print:mt-1">
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">土地年利率</label>
                <span className="hidden print:inline font-mono text-[9px]">{inputs.landRate}</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.landRate} onChange={v => updateInput('landRate', v)} suffix="（例0.03）" decimals={4} /></div>
              </div>
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">建物年利率</label>
                <span className="hidden print:inline font-mono text-[9px]">{inputs.buildRate}</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.buildRate} onChange={v => updateInput('buildRate', v)} suffix="（例0.03）" decimals={4} /></div>
              </div>
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">建物利息2</label>
                <span className="hidden print:inline font-mono text-[9px]">{formatCurrency(inputs.interest2)} 元</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.interest2} onChange={v => updateInput('interest2', v)} suffix="元" /></div>
              </div>
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">代銷抽成</label>
                <span className="hidden print:inline font-mono text-[9px]">{inputs.salesFeeRate}</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.salesFeeRate} onChange={v => updateInput('salesFeeRate', v)} suffix="（例0.05）" decimals={4} /></div>
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
                  step={0.1}
                  onChange={v => updateInput('targetMargin', v / 100)}
                  unit="%"
                  decimals={1}
                />
                <p className="text-xs text-muted-foreground mt-1">可調 9%～15%（建設端目標利潤）</p>
              </div>
            </div>

            {/* 增加成本稅率 */}
            <div className="mt-5 print:mt-1">
              <div className="flex items-center gap-2 print:py-[1px]">
                <label className="text-sm w-40 shrink-0 print:w-28 print:text-[9px]">增加成本稅率</label>
                <span className="hidden print:inline font-mono text-[9px]">{inputs.extraTaxRate}</span>
                <div className="print:hidden flex-1"><CurrencyInput value={inputs.extraTaxRate} onChange={v => updateInput('extraTaxRate', v)} suffix="（例0.09）" decimals={4} /></div>
              </div>
            </div>
          </div>

          {/* ===== 右側：即時計算結果 ===== */}
          <div className="bg-card border border-border rounded-lg p-6 print:border print:border-gray-300 print:p-2 print:text-[9px]">
            <h2 className="text-xl font-bold mb-4 print:text-xs print:mb-1">即時計算結果</h2>

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
                <p className="text-xs text-muted-foreground mt-1">
                  增加成本 / 建物成本1：{result.build1 > 0 ? (result.extraCost / result.build1 * 100).toFixed(2) : '0.00'}%
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
                    <td className="py-2 px-2 text-muted-foreground">建物成本1×建物利率×0.5×建物時間</td>
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
            <h3 className="font-bold mb-3 text-base print:text-[7px] print:mb-0">合建分配與稅務明細</h3>
            <div className="overflow-x-auto print:overflow-visible print:break-inside-avoid">
              <table className="w-full text-sm print:text-[7px] print:break-inside-avoid">
                <thead>
                  <tr className="border-b-2 border-border print:py-0">
                    <th className="text-left py-2 px-2 font-semibold print:py-0 print:px-1">角色</th>
                    <th className="text-right py-2 px-2 font-semibold print:py-0 print:px-1">稅前盈餘</th>
                    <th className="text-right py-2 px-2 font-semibold print:py-0 print:px-1">兩稅合一(20%)</th>
                    <th className="text-right py-2 px-2 font-semibold print:py-0 print:px-1">個人分配額(28%)</th>
                    <th className="text-right py-2 px-2 font-semibold print:py-0 print:px-1">稅後盈餘</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border print:py-0">
                    <td className="py-2 px-2 print:py-0 print:px-1">建設</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">{formatCurrency(result.devPretax)}</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">{formatCurrency(result.devTwoTax)}</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">{formatCurrency(result.devDistTax)}</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">{formatCurrency(result.devAfterTax)}</td>
                  </tr>
                  <tr className="border-b border-border print:py-0">
                    <td className="py-2 px-2 print:py-0 print:px-1">地主</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">{formatCurrency(result.landlordPretax)}</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">{formatCurrency(result.landlordTwoTax)}</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">—</td>
                    <td className="text-right py-2 px-2 font-mono print:py-0 print:px-1">{formatCurrency(result.landlordAfterTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 底部說明 */}
            <div className="mt-4 p-3 bg-secondary/20 rounded-lg text-xs text-muted-foreground print:bg-transparent print:border print:border-border print:mt-1 print:p-1 print:break-inside-avoid">
              <p>
                建物成本2反推（建設端基準）：建物成本2 = 建設端分配銷售額 − 建設端分攤代銷費 − 建物利息2 − 目標利潤率×建設端分配銷售額。
                其中「建設端分配銷售額」= 總銷×建設比例。
              </p>
            </div>
          </div>
        </div>

        {/* 列印時顯示滑桿參數 */}
        <div className="hidden print:block mt-1 bg-card border border-gray-300 rounded-lg p-2 print:break-inside-avoid print:page-break-inside-avoid">
          <h3 className="font-bold mb-1 text-[9px]">滑桿參數設定</h3>
          <div className="grid grid-cols-5 gap-2 text-[9px]">
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

        {/* 方案比較表格 */}
        {savedScenarios.length > 0 && (
          <div className="mt-6 bg-card border border-border rounded-lg p-6 print:border print:p-4 print:mt-2 print:break-inside-avoid">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="flex items-center gap-2 text-lg font-bold hover:text-primary transition-colors print:pointer-events-none"
              >
                {showScenarios ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                方案比較表（已儲存 {savedScenarios.length} 筆）
              </button>
            </div>
            {showScenarios && (
              <div className="overflow-x-auto print:overflow-visible print:break-inside-avoid">
                <table className="w-full text-sm print:break-inside-avoid">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-2 px-2 font-semibold">方案</th>
                      <th className="text-right py-2 px-2 font-semibold">營造單價</th>
                      <th className="text-right py-2 px-2 font-semibold">目標利潤率</th>
                      <th className="text-right py-2 px-2 font-semibold">建物成本2</th>
                      <th className="text-right py-2 px-2 font-semibold">增加成本</th>
                      <th className="text-right py-2 px-2 font-semibold">增加成本/建物成本1</th>
                      <th className="text-right py-2 px-2 font-semibold">總利潤</th>
                      <th className="text-right py-2 px-2 font-semibold">總稅金</th>
                      <th className="text-right py-2 px-2 font-semibold">建設稅後盈餘</th>
                      <th className="text-right py-2 px-2 font-semibold">增加成本稅</th>
                      <th className="text-center py-2 px-2 font-semibold print:hidden">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedScenarios.map(s => (
                      <tr key={s.id} className="border-b border-border hover:bg-secondary/20">
                        <td className="py-2 px-2">
                          <div className="text-sm font-medium">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground">{s.timestamp}</div>
                        </td>
                        <td className="text-right py-2 px-2 font-mono">{formatCurrency(s.inputs.buildUnit)}</td>
                        <td className="text-right py-2 px-2 font-mono">{fmtPct(s.inputs.targetMargin)}</td>
                        <td className="text-right py-2 px-2 font-mono">{formatCurrency(s.result.build2)}</td>
                        <td className={`text-right py-2 px-2 font-mono ${s.result.extraCost >= 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                          {formatCurrency(s.result.extraCost)}
                        </td>
                        <td className="text-right py-2 px-2 font-mono">
                          {s.result.build1 > 0 ? (s.result.extraCost / s.result.build1 * 100).toFixed(2) : '0.00'}%
                        </td>
                        <td className={`text-right py-2 px-2 font-mono ${s.result.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formatCurrency(s.result.totalProfit)}
                        </td>
                        <td className="text-right py-2 px-2 font-mono text-destructive">{formatCurrency(s.result.totalTax)}</td>
                        <td className="text-right py-2 px-2 font-mono">{formatCurrency(s.result.devAfterTax)}</td>
                        <td className="text-right py-2 px-2 font-mono">{formatCurrency(s.result.extraCostTax)}</td>
                        <td className="text-center py-2 px-2 print:hidden">
                          <button
                            onClick={() => handleDeleteScenario(s.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="刪除此方案"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
