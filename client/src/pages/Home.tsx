import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import CurrencyInput from '@/components/CurrencyInput';
import SliderInput from '@/components/SliderInput';
import Navigation from '@/components/Navigation';
import { formatCurrency } from '@/lib/format';
import { Printer, RotateCcw, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

/*
 * 設計理念：簡潔實用的試算工具
 * - 頂部固定卡片：情境一、情境二、結論（始終可見）
 * - 中間頁籤導航：銷售參數、建設支出、資金流入、可延後付款、成本優化
 * - 每個結果下方直接顯示計算式
 * - 「增加成本」紅色突出
 * - 最小化視覺元素，專注於數據
 */

export default function Home() {
  const { inputs, updateInput, resetInputs, clearMemory, result } = useCalculator();
  const [activeTab, setActiveTab] = useState('sales');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background print:min-h-0">
      <Navigation />

      {/* Header */}
      <header className="border-b border-border bg-card/50 sticky top-16 z-40 print:static print:top-0">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">營建雙平台資金缺口與稅務規劃試算</h1>
              <p className="text-xs text-muted-foreground">即時試算工具 | 所有金額含稅</p>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              列印
            </Button>
            <Button variant="outline" size="sm" onClick={resetInputs} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              重設
            </Button>
            <Button variant="outline" size="sm" onClick={clearMemory} className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50">
              <RotateCcw className="w-3.5 h-3.5" />
              清除記憶
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6 print:py-2 print:space-y-2">
        {/* 建案基本資料 */}
        <section className="bg-card border border-border rounded-lg p-4 print:border-gray-300 print:p-2">
          <h2 className="text-sm font-semibold mb-3">建案基本資料</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">建案名稱</label>
              <input
                type="text"
                value={inputs.projectName}
                onChange={e => updateInput('projectName', e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded px-2 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none print:border-0 print:bg-transparent print:p-0"
              />
            </div>
            <CurrencyInput label="總戶數" value={inputs.totalUnits} onChange={v => updateInput('totalUnits', v)} suffix="戶" />
            <CurrencyInput label="每戶代辦費" value={inputs.agencyFeePerUnit} onChange={v => updateInput('agencyFeePerUnit', v)} />
            <CurrencyInput label="建案總銷売金額" value={inputs.totalSalesAmount} onChange={v => updateInput('totalSalesAmount', v)} />
          </div>
        </section>

        {/* 頂部固定卡片：情境一、情境二 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2 print:mb-2">
          {/* 情境一 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:border-gray-300 print:p-2">
            <h3 className="text-xs font-semibold text-blue-900 mb-2">情境一（實際）</h3>
            <div className="space-y-2 text-sm print:text-xs">
              <div className="flex justify-between">
                <span className="text-blue-700">建設總支出</span>
                <span className="font-mono font-bold text-blue-900">{formatCurrency(result.actual.totalExpense)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">資金流入</span>
                <span className="font-mono font-bold text-blue-900">{formatCurrency(result.actual.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">可延後付款</span>
                <span className="font-mono font-bold text-blue-900">{formatCurrency(result.actual.deferredPayment)}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="text-blue-900 font-semibold">資金缺口</span>
                <span className={`font-mono font-bold text-lg ${result.actual.fundingGap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatCurrency(result.actual.fundingGap)}
                </span>
              </div>
            </div>
          </div>

          {/* 情境二 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 print:border-gray-300 print:p-2">
            <h3 className="text-xs font-semibold text-green-900 mb-2">情境二（優化）</h3>
            <div className="space-y-2 text-sm print:text-xs">
              <div className="flex justify-between">
                <span className="text-green-700">建設總支出</span>
                <span className="font-mono font-bold text-green-900">{formatCurrency(result.costOptimized.totalExpense)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">資金流入</span>
                <span className="font-mono font-bold text-green-900">{formatCurrency(result.costOptimized.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">可延後付款</span>
                <span className="font-mono font-bold text-green-900">{formatCurrency(result.costOptimized.deferredPayment)}</span>
              </div>
              <div className="border-t border-green-200 pt-2 flex justify-between">
                <span className="text-green-900 font-semibold">資金缺口</span>
                <span className={`font-mono font-bold text-lg ${result.costOptimized.fundingGap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatCurrency(result.costOptimized.fundingGap)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 頁籤導航 */}
        <div className="bg-card border border-border rounded-t-lg p-0 print:hidden">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { value: 'sales', label: '銷售參數' },
              { value: 'expense', label: '建設支出' },
              { value: 'revenue', label: '資金流入' },
              { value: 'deferred', label: '可延後付款' },
              { value: 'taxsaving', label: '成本優化' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 銷售參數頁籤 */}
        <section className={`bg-card border border-border rounded-b-lg p-4 print:border-gray-300 print:p-2 print:rounded-none space-y-4 ${activeTab !== 'sales' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold mb-4">銷售參數</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="print:hidden">
              <SliderInput
                label="銷售完成率"
                value={inputs.salesCompletionRate}
                min={0}
                max={1}
                step={0.01}
                onChange={v => updateInput('salesCompletionRate', v)}
                isPercent={true}
                decimals={1}
              />
            </div>
            <CurrencyInput
              label="銷售完成率"
              value={inputs.salesCompletionRate * 100}
              onChange={v => updateInput('salesCompletionRate', v / 100)}
              suffix="%"
              decimals={1}
              className="hidden print:block"
            />
            <div className="print:hidden">
              <SliderInput
                label="預收房屋款比例"
                value={inputs.preSaleRevenueRate}
                min={0}
                max={0.5}
                step={0.01}
                onChange={v => updateInput('preSaleRevenueRate', v)}
                isPercent={true}
                decimals={1}
              />
            </div>
            <CurrencyInput
              label="預收房屋款比例"
              value={inputs.preSaleRevenueRate * 100}
              onChange={v => updateInput('preSaleRevenueRate', v / 100)}
              suffix="%"
              decimals={1}
              className="hidden print:block"
            />
            <div className="print:hidden">
              <SliderInput
                label="代銷費用比例"
                value={inputs.agencyFeeRate}
                min={0}
                max={0.1}
                step={0.001}
                onChange={v => updateInput('agencyFeeRate', v)}
                isPercent={true}
                decimals={1}
              />
            </div>
            <CurrencyInput
              label="代銷費用比例"
              value={inputs.agencyFeeRate * 100}
              onChange={v => updateInput('agencyFeeRate', v / 100)}
              suffix="%"
              decimals={1}
              className="hidden print:block"
            />
          </div>

          {/* 計算結果 */}
          <div className="bg-secondary/30 border border-border rounded p-3 space-y-2 text-sm print:border-gray-300 print:p-1 print:text-xs">
            <div className="flex justify-between">
              <span>實際銷售金額</span>
              <span className="font-mono font-bold">{formatCurrency(result.salesInfo.actualSalesAmount)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：建案總銷售金額 × 銷售完成率 = {formatCurrency(inputs.totalSalesAmount)} × {(inputs.salesCompletionRate * 100).toFixed(1)}% = {formatCurrency(result.salesInfo.actualSalesAmount)}
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span>預收房屋款</span>
              <span className="font-mono font-bold text-emerald-600">{formatCurrency(result.salesInfo.preSaleRevenue)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：實際銷售金額 × 預收房屋款比例 = {formatCurrency(result.salesInfo.actualSalesAmount)} × {(inputs.preSaleRevenueRate * 100).toFixed(1)}% = {formatCurrency(result.salesInfo.preSaleRevenue)}
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span>代銷費用總額</span>
              <span className="font-mono font-bold text-red-600">{formatCurrency(result.salesInfo.agencyFee)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：實際銷售金額 × 代銷費用比例 = {formatCurrency(result.salesInfo.actualSalesAmount)} × {(inputs.agencyFeeRate * 100).toFixed(2)}% = {formatCurrency(result.salesInfo.agencyFee)}
            </div>
          </div>

          {/* 撥款前代銷費用設定 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">撥款前代銷費用計算模式</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateInput('agencyPreDeliveryMode', 'ratio')}
                className={`px-3 py-1.5 text-xs rounded transition-colors font-medium ${
                  inputs.agencyPreDeliveryMode === 'ratio'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                比例計算
              </button>
              <button
                onClick={() => updateInput('agencyPreDeliveryMode', 'manual')}
                className={`px-3 py-1.5 text-xs rounded transition-colors font-medium ${
                  inputs.agencyPreDeliveryMode === 'manual'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                直接輸入
              </button>
            </div>
            {inputs.agencyPreDeliveryMode === 'manual' && (
              <CurrencyInput
                label="撥款前代銷費用（直接輸入）"
                value={inputs.agencyFeePreDeliveryManual}
                onChange={v => updateInput('agencyFeePreDeliveryManual', v)}
              />
            )}
            <div className="bg-secondary/30 border border-border rounded p-2 text-xs print:border-gray-300 print:p-1">
              <p className="text-muted-foreground mb-1">撥款前代銷費用（自動計算）</p>
              <p className="font-mono font-bold text-destructive">{formatCurrency(result.salesInfo.agencyFeePreDelivery)}</p>
              <p className="text-muted-foreground mt-1">
                計算式：代銷費用總額 = {formatCurrency(result.salesInfo.agencyFeePreDelivery)}
              </p>
            </div>
          </div>
        </section>

        {/* 建設支出頁籤 */}
        <section className={`bg-card border border-border rounded-b-lg p-4 print:border-gray-300 print:p-2 print:rounded-none space-y-4 ${activeTab !== 'expense' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold mb-4">建設支出</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CurrencyInput label="施工成本估算（含稅）" value={inputs.constructionCost} onChange={v => updateInput('constructionCost', v)} />
            <CurrencyInput label="建融撥款" value={inputs.constructionLoan} onChange={v => updateInput('constructionLoan', v)} />
            <CurrencyInput label="建融利率" value={inputs.constructionLoanRate * 100} onChange={v => updateInput('constructionLoanRate', v / 100)} suffix="%" decimals={2} />
            <CurrencyInput label="興建時間" value={inputs.constructionDurationYears} onChange={v => updateInput('constructionDurationYears', v)} suffix="年" decimals={1} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CurrencyInput label="土融撥款" value={inputs.landLoan} onChange={v => updateInput('landLoan', v)} />
            <CurrencyInput label="土融利率" value={inputs.landLoanRate * 100} onChange={v => updateInput('landLoanRate', v / 100)} suffix="%" decimals={2} />
            <CurrencyInput label="土地時間" value={inputs.landDurationYears} onChange={v => updateInput('landDurationYears', v)} suffix="年" decimals={1} />
          </div>

          {/* 計算結果 */}
          <div className="bg-secondary/30 border border-border rounded p-3 space-y-3 text-sm print:border-gray-300 print:p-1 print:text-xs">
            <div className="flex justify-between">
              <span>建融利息</span>
              <span className="font-mono font-bold text-orange-600">{formatCurrency(inputs.constructionLoanInterest)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：建融撥款 × 建融利率 × 0.5 × 興建時間 = {formatCurrency(inputs.constructionLoan)} × {(inputs.constructionLoanRate * 100).toFixed(2)}% × 0.5 × {inputs.constructionDurationYears} = {formatCurrency(inputs.constructionLoanInterest)}
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span>土融利息</span>
              <span className="font-mono font-bold text-orange-600">{formatCurrency(inputs.landLoanInterest)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：土融撥款 × 土融利率 × 土地時間 = {formatCurrency(inputs.landLoan)} × {(inputs.landLoanRate * 100).toFixed(2)}% × {inputs.landDurationYears} = {formatCurrency(inputs.landLoanInterest)}
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span>撥款前代銷費用</span>
              <span className="font-mono font-bold text-red-600">{formatCurrency(result.salesInfo.agencyFeePreDelivery)}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-border font-semibold">
              <span>建設總支出</span>
              <span className="font-mono font-bold text-lg text-destructive">{formatCurrency(result.actual.totalExpense)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：施工成本 + 建融利息 + 土融利息 + 撥款前代銷費用 = {formatCurrency(inputs.constructionCost)} + {formatCurrency(inputs.constructionLoanInterest)} + {formatCurrency(inputs.landLoanInterest)} + {formatCurrency(result.salesInfo.agencyFeePreDelivery)} = {formatCurrency(result.actual.totalExpense)}
            </div>
          </div>
        </section>

        {/* 資金流入頁籤 */}
        <section className={`bg-card border border-border rounded-b-lg p-4 print:border-gray-300 print:p-2 print:rounded-none space-y-4 ${activeTab !== 'revenue' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold mb-4">資金流入</h2>

          {/* 計算結果 */}
          <div className="bg-secondary/30 border border-border rounded p-3 space-y-3 text-sm print:border-gray-300 print:p-1 print:text-xs">
            <div className="flex justify-between">
              <span>建融撥款</span>
              <span className="font-mono font-bold text-emerald-600">{formatCurrency(inputs.constructionLoan)}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span>預收房屋款</span>
              <span className="font-mono font-bold text-emerald-600">{formatCurrency(result.salesInfo.preSaleRevenue)}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span>客戶代辦費收入</span>
              <span className="font-mono font-bold text-emerald-600">{formatCurrency(result.salesInfo.agencyFeeTotal)}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-border font-semibold">
              <span>資金流入合計</span>
              <span className="font-mono font-bold text-lg text-emerald-600">{formatCurrency(result.actual.totalRevenue)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：建融撥款 + 預收房屋款 + 客戶代辦費收入 = {formatCurrency(inputs.constructionLoan)} + {formatCurrency(result.salesInfo.preSaleRevenue)} + {formatCurrency(result.salesInfo.agencyFeeTotal)} = {formatCurrency(result.actual.totalRevenue)}
            </div>
          </div>
        </section>

        {/* 可延後付款頁籤 */}
        <section className={`bg-card border border-border rounded-b-lg p-4 print:border-gray-300 print:p-2 print:rounded-none space-y-4 ${activeTab !== 'deferred' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold mb-4">可延後付款項目（情境一）</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CurrencyInput label="鋼筋材料" value={inputs.steelMaterial} onChange={v => updateInput('steelMaterial', v)} />
            <CurrencyInput label="公設大廳" value={inputs.publicLobby} onChange={v => updateInput('publicLobby', v)} />
            <CurrencyInput label="部分廠商交屋尾款" value={inputs.vendorFinalPayment} onChange={v => updateInput('vendorFinalPayment', v)} />
            <CurrencyInput label="建物登記/代書費" value={inputs.registrationFees} onChange={v => updateInput('registrationFees', v)} />
            <CurrencyInput label="營造廠固定支出" value={inputs.constructorFixedExpense} onChange={v => updateInput('constructorFixedExpense', v)} />
          </div>

          {/* 計算結果 */}
          <div className="bg-secondary/30 border border-border rounded p-3 space-y-3 text-sm print:border-gray-300 print:p-1 print:text-xs">
            <div className="space-y-2">
              {result.actual.deferredBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.label}</span>
                  <span className="font-mono font-bold">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span>可延後付款合計</span>
              <span className="font-mono font-bold text-lg">{formatCurrency(result.actual.deferredPayment)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：鋼筋材料 + 公設大廳 + 廠商尾款 + 登記費 + 固定支出 + 代銷交屋後支付 = {formatCurrency(inputs.steelMaterial)} + {formatCurrency(inputs.publicLobby)} + {formatCurrency(inputs.vendorFinalPayment)} + {formatCurrency(inputs.registrationFees)} + {formatCurrency(inputs.constructorFixedExpense)} + {formatCurrency(result.actual.deferredBreakdown.find(x => x.label.includes('代銷'))?.amount || 0)} = {formatCurrency(result.actual.deferredPayment)}
            </div>
          </div>
        </section>

        {/* 成本優化頁籤 */}
        <section className={`bg-card border border-border rounded-b-lg p-4 print:border-gray-300 print:p-2 print:rounded-none space-y-4 ${activeTab !== 'taxsaving' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold mb-4">成本優化（情境二）</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CurrencyInput label="增加成本" value={inputs.extraCost} onChange={v => updateInput('extraCost', v)} />
            <CurrencyInput label="營造廠延後付款金額" value={inputs.constructorDeferredAmount} onChange={v => updateInput('constructorDeferredAmount', v)} />
            <CurrencyInput label="建設交屋後款項(衛浴等)" value={inputs.postDeliveryBathroom} onChange={v => updateInput('postDeliveryBathroom', v)} />
          </div>

          {/* 計算結果 */}
          <div className="bg-secondary/30 border border-border rounded p-3 space-y-3 text-sm print:border-gray-300 print:p-1 print:text-xs">
            <div className="flex justify-between font-semibold">
              <span>情境二建設總支出</span>
              <span className="font-mono font-bold text-lg text-destructive">{formatCurrency(result.costOptimized.totalExpense)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：情境一建設總支出 + 增加成本 = {formatCurrency(result.actual.totalExpense)} + {formatCurrency(inputs.extraCost)} = {formatCurrency(result.costOptimized.totalExpense)}
            </div>

            <div className="flex justify-between pt-2 border-t border-border font-semibold">
              <span>情境二可延後付款</span>
              <span className="font-mono font-bold text-lg">{formatCurrency(result.costOptimized.deferredPayment)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：情境一可延後付款 + 營造廠延後付款 + 建設交屋後款項 = {formatCurrency(result.actual.deferredPayment)} + {formatCurrency(inputs.constructorDeferredAmount)} + {formatCurrency(inputs.postDeliveryBathroom)} = {formatCurrency(result.costOptimized.deferredPayment)}
            </div>

            <div className="flex justify-between pt-2 border-t border-border font-semibold">
              <span>情境二資金缺口</span>
              <span className={`font-mono font-bold text-lg ${result.costOptimized.fundingGap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatCurrency(result.costOptimized.fundingGap)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              計算式：建設總支出 - 資金流入 - 可延後付款 = {formatCurrency(result.costOptimized.totalExpense)} - {formatCurrency(result.costOptimized.totalRevenue)} - {formatCurrency(result.costOptimized.deferredPayment)} = {formatCurrency(result.costOptimized.fundingGap)}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
