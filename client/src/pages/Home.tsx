import React, { useState, useCallback } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import CurrencyInput from '@/components/CurrencyInput';
import ResultCard from '@/components/ResultCard';
import SliderInput from '@/components/SliderInput';
import Navigation from '@/components/Navigation';
import { formatCurrency, formatPercent } from '@/lib/format';
import {
  RotateCcw, Building2, HardHat, TrendingDown, TrendingUp,
  AlertTriangle, ShieldCheck, Calculator, ChevronDown, ChevronUp,
  DollarSign, BarChart3, Download, Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/*
 * 設計風格：Bloomberg Terminal 金融儀表板
 * - 深色背景 + 高對比數字
 * - 翡翠綠 = 正面/節省
 * - 珊瑚紅 = 負面/缺口
 * - 金色 = 關鍵指標
 * - DM Sans + JetBrains Mono
 */

export default function Home() {
  const { inputs, updateInput, resetInputs, result } = useCalculator();
  const [showActualDeferred, setShowActualDeferred] = useState(false);
  const [showTaxSavingDeferred, setShowTaxSavingDeferred] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40 print:sticky print:top-0">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">營建雙平台資金缺口與稅務套利試算</h1>
              <p className="text-xs text-muted-foreground">建設公司 × 營造廠 ｜ 即時試算工具 ｜ 所有金額含稅</p>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              列印
            </Button>
            <Button variant="outline" size="sm" onClick={resetInputs} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              重設範例
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6 print:py-0 print:space-y-4">
        {/* 建案基本資料 */}
        <section className="bg-card border border-border rounded-xl p-5 print:border-0 print:bg-transparent print:p-0 print:mb-6">
          <h2 className="text-sm font-semibold text-accent mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            建案基本資料
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">建案名稱</label>
              <input
                type="text"
                value={inputs.projectName}
                onChange={e => updateInput('projectName', e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none print:border-0 print:bg-transparent print:p-0"
              />
            </div>
            <CurrencyInput label="總戶數" value={inputs.totalUnits} onChange={v => updateInput('totalUnits', v)} suffix="戶" />
            <CurrencyInput label="每戶代辦費" value={inputs.agencyFeePerUnit} onChange={v => updateInput('agencyFeePerUnit', v)} />
            <CurrencyInput label="代銷交屋後支付比例" value={inputs.agencyPostDeliveryPct * 100} onChange={v => updateInput('agencyPostDeliveryPct', v / 100)} suffix="%" hint="例：40 代表 40%" />
            <CurrencyInput label="建案總銷售金額" value={inputs.totalSalesAmount} onChange={v => updateInput('totalSalesAmount', v)} hint="所有戶別合約總價（含稅）" />
          </div>
        </section>

        {/* Tab 導航（螢幕顯示） */}
        <div className="bg-card border border-border rounded-t-xl p-0 print:hidden">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { value: 'sales', label: '銷售參數' },
              { value: 'expense', label: '建設支出' },
              { value: 'revenue', label: '資金流入' },
              { value: 'deferred', label: '可延後付款' },
              { value: 'taxsaving', label: '節稅操作' },
              { value: 'tax', label: '稅率參數' },
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

        {/* 銷售參數 */}
        <section className={`bg-card border border-border rounded-b-xl p-5 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:mb-6 ${activeTab !== 'sales' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            銷售參數（動態連結）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2">
            <div className="print:hidden">
              <SliderInput
                label="銀選完成率"
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
              label="銀選完成率"
              value={inputs.salesCompletionRate * 100}
              onChange={v => updateInput('salesCompletionRate', v / 100)}
              suffix="%"
              hint="100% 表示全部完銷"
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
              hint="例：15 代表 15%"
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
              hint="代銷、廣告等費用"
              decimals={1}
              className="hidden print:block"
            />
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">實際銷售金額</p>
              <p className="font-mono font-bold text-lg text-primary">{formatCurrency(result.salesInfo.actualSalesAmount)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border print:border-t print:mt-2 print:pt-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">預收房屋款（自動計算）</span>
              <span className="font-mono">{formatCurrency(result.salesInfo.preSaleRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">代銷費用（自動計算）</span>
              <span className="font-mono">{formatCurrency(result.salesInfo.agencyFee)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">客戶代辦費收入（自動計算）</span>
              <span className="font-mono">{formatCurrency(result.salesInfo.agencyFeeTotal)}</span>
            </div>
          </div>
        </section>

        {/* 建設支出 */}
        <section className={`bg-card border border-border rounded-b-xl p-5 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:mb-6 ${activeTab !== 'expense' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold text-destructive mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            建設總支出（實際成本，含税）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
            <CurrencyInput label="施工成本估算（含税）" value={inputs.constructionCost} onChange={v => updateInput('constructionCost', v)} />
            <CurrencyInput label="建融利率" value={inputs.constructionLoanRate * 100} onChange={v => updateInput('constructionLoanRate', v / 100)} suffix="%" decimals={2} hint="例：4.5" />
            <CurrencyInput label="興建時間" value={inputs.constructionDurationYears} onChange={v => updateInput('constructionDurationYears', v)} suffix="年" decimals={1} hint="例：2.5" />
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">建融利息（自動計算）</p>
              <p className="font-mono font-bold text-lg text-destructive">{formatCurrency(inputs.constructionLoanInterest)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">公式：建融 × 利率 × 0.5 × 時間</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border print:border-t print:mt-2 print:pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">建設總支出（實際）</span>
              <span className="font-mono font-bold text-lg text-destructive">{formatCurrency(result.actual.totalExpense)} 元</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">計算：施工成本 + 建融利息</p>
          </div>
        </section>

        {/* 建設資金流入 */}
        <section className={`bg-card border border-border rounded-b-xl p-5 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:mb-6 ${activeTab !== 'revenue' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            建設資金流入（至客戶貸款撥款前）
          </h2>
          <p className="text-xs text-muted-foreground mb-4 print:mb-2">
            此處為施工期間的資金流入，用於計算資金缺口。建融為借款非收入，但在施工期間可用。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
            <CurrencyInput label="建融撥款" value={inputs.constructionLoan} onChange={v => updateInput('constructionLoan', v)} />
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">預收房屋款（自動計算）</p>
              <p className="font-mono font-bold text-lg text-primary">{formatCurrency(result.salesInfo.preSaleRevenue)}</p>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">客戶代辦費（自動計算）</p>
              <p className="font-mono font-bold text-lg text-primary">{formatCurrency(result.salesInfo.agencyFeeTotal)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border print:border-t print:mt-2 print:pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">建設資金流入合計</span>
              <span className="font-mono font-bold text-lg text-primary">{formatCurrency(result.actual.totalRevenue)} 元</span>
            </div>
          </div>
        </section>

        {/* 可延後付款 */}
        <section className={`bg-card border border-border rounded-b-xl p-5 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:mb-6 ${activeTab !== 'deferred' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold text-accent mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            可延後付款費用（客戶貸款撥款後支付）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
            <CurrencyInput label="鋼筋材料" value={inputs.steelMaterial} onChange={v => updateInput('steelMaterial', v)} />
            <CurrencyInput label="公設大廳" value={inputs.publicLobby} onChange={v => updateInput('publicLobby', v)} />
            <CurrencyInput label="部分廠商交屋尾款" value={inputs.vendorFinalPayment} onChange={v => updateInput('vendorFinalPayment', v)} />
            <CurrencyInput label="建物登記費、代書費、記帳費" value={inputs.registrationFees} onChange={v => updateInput('registrationFees', v)} />
            <CurrencyInput label="營造廠固定支出" value={inputs.constructorFixedExpense} onChange={v => updateInput('constructorFixedExpense', v)} hint="營造廠自行負擔" />
            <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
              <p className="text-xs text-muted-foreground mb-1">代銷交屋後支付（自動計算）</p>
              <p className="font-mono font-bold text-lg text-accent">{formatCurrency(result.salesInfo.agencyFee * inputs.agencyPostDeliveryPct)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border print:border-t print:mt-2 print:pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">可延後付款合計（情境一）</span>
              <span className="font-mono font-bold text-lg text-accent">{formatCurrency(result.actual.deferredPayment)} 元</span>
            </div>
          </div>
        </section>

        {/* 節稅操作 */}
        <section className={`bg-card border border-border rounded-b-xl p-5 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:mb-6 ${activeTab !== 'taxsaving' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold text-accent mb-4 flex items-center gap-2">
            <HardHat className="w-4 h-4" />
            節稅操作設定
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
            <CurrencyInput label="營造廠節稅金額" value={inputs.taxSavingConstructor} onChange={v => updateInput('taxSavingConstructor', v)} hint="透過營造廠溢價發包的金額" />
            <CurrencyInput
              label="營造廠延後付款比例"
              value={inputs.constructorDeferredPct * 100}
              onChange={v => updateInput('constructorDeferredPct', v / 100)}
              suffix="%"
              hint="營造廠合約 15-20%"
              decimals={1}
            />
            <CurrencyInput label="建設端節稅金額" value={inputs.taxSavingConstruction} onChange={v => updateInput('taxSavingConstruction', v)} hint="廚具、衛浴等建設端自行發包" />
          </div>
          <div className="mt-4 pt-4 border-t border-border print:border-t print:mt-2 print:pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">節稅操作總額</span>
              <span className="font-mono font-bold text-lg text-accent">{formatCurrency(inputs.taxSavingConstructor + inputs.taxSavingConstruction)} 元</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">營造廠延後付款金額</span>
              <span className="font-mono font-bold text-accent">{formatCurrency((inputs.constructionCost + inputs.taxSavingConstructor) * inputs.constructorDeferredPct)} 元</span>
            </div>
          </div>
          {result.warnings.constructorOverflow && (
            <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive print:bg-red-100 print:border-red-300 print:text-red-700 print:p-2 print:text-[10px]">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{result.warnings.message}</p>
              </div>
            </div>
          )}
        </section>

        {/* 稅率參數 */}
        <section className={`bg-card border border-border rounded-b-xl p-5 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:mb-6 ${activeTab !== 'tax' ? 'hidden print:block' : ''}`}>
          <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            稅率參數
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
            <CurrencyInput
              label="營造廠所得額標準"
              value={inputs.constructorIncomeStd * 100}
              onChange={v => updateInput('constructorIncomeStd', v / 100)}
              suffix="%"
              hint="例：8 代表 8%"
            />
            <CurrencyInput
              label="營所稅率"
              value={inputs.corpTaxRate * 100}
              onChange={v => updateInput('corpTaxRate', v / 100)}
              suffix="%"
              hint="例：20 代表 20%"
            />
            <CurrencyInput
              label="個人股利所得稅率"
              value={inputs.dividendTaxRate * 100}
              onChange={v => updateInput('dividendTaxRate', v / 100)}
              suffix="%"
              hint="例：28 代表 28%"
            />
          </div>
        </section>

        {/* ═══ 結果面板：兩情境比較 ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          {/* 情境一 */}
          <section className="bg-card border border-border rounded-xl p-5 space-y-4 print:border print:border-gray-400 print:p-4 print:space-y-2">
            <div className="flex items-center gap-2 pb-3 border-b border-border print:border-b print:pb-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <h3 className="text-sm font-semibold">情境一：實際成本（未節稅）</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 print:gap-2">
              <ResultCard label="建設總支出" value={result.actual.totalExpense} variant="negative" />
              <ResultCard label="建設資金流入" value={result.actual.totalRevenue} variant="positive" />
              <ResultCard label="可延後付款" value={result.actual.deferredPayment} variant="default" />
              <ResultCard label="實際資金缺口" value={result.actual.fundingGap} variant={result.actual.fundingGap > 0 ? 'negative' : 'positive'} size="lg" />
            </div>

            <button
              onClick={() => setShowActualDeferred(!showActualDeferred)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors print:hidden"
            >
              {showActualDeferred ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              延後付款明細
            </button>

            {showActualDeferred && (
              <div className="bg-secondary/30 rounded-lg p-3 text-xs space-y-1 print:block print:bg-transparent print:p-0">
                <p className="text-muted-foreground">資金缺口 = 總支出 − 資金流入 − 可延後付款</p>
                <p className="font-mono text-foreground">
                  = {formatCurrency(result.actual.totalExpense)} − {formatCurrency(result.actual.totalRevenue)} − {formatCurrency(result.actual.deferredPayment)}
                </p>
                <p className="font-mono font-bold text-destructive">= {formatCurrency(result.actual.fundingGap)} 元</p>
              </div>
            )}
          </section>

          {/* 情境二 */}
          <section className="bg-card border border-border rounded-xl p-5 space-y-4 print:border print:border-gray-400 print:p-4 print:space-y-2">
            <div className="flex items-center gap-2 pb-3 border-b border-border print:border-b print:pb-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <h3 className="text-sm font-semibold">情境二：節稅操作</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 print:gap-2">
              <ResultCard label="建設總支出（含節稅）" value={result.taxSaving.totalExpense} variant="negative" />
              <ResultCard label="建設資金流入" value={result.taxSaving.totalRevenue} variant="positive" />
              <ResultCard label="可延後付款（含營造延後）" value={result.taxSaving.deferredPayment} variant="default" />
              <ResultCard label="節稅後資金缺口" value={result.taxSaving.fundingGap} variant={result.taxSaving.fundingGap > 0 ? 'negative' : 'positive'} size="lg" />
            </div>

            <button
              onClick={() => setShowTaxSavingDeferred(!showTaxSavingDeferred)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors print:hidden"
            >
              {showTaxSavingDeferred ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              延後付款明細
            </button>

            {showTaxSavingDeferred && (
              <div className="bg-secondary/30 rounded-lg p-3 text-xs space-y-1 print:block print:bg-transparent print:p-0">
                <p className="text-muted-foreground">資金缺口 = 總支出 − 資金流入 − 可延後付款</p>
                <p className="font-mono text-foreground">
                  = {formatCurrency(result.taxSaving.totalExpense)} − {formatCurrency(result.taxSaving.totalRevenue)} − {formatCurrency(result.taxSaving.deferredPayment)}
                </p>
                <p className="font-mono font-bold text-destructive">= {formatCurrency(result.taxSaving.fundingGap)} 元</p>
              </div>
            )}
          </section>
        </div>

        {/* 稅務效益分析 */}
        <section className="bg-card border border-border rounded-xl p-5 space-y-6 print:border print:border-gray-400 print:p-4 print:space-y-4">
          <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            稅務效益分析
          </h2>

          <div className="text-xs text-muted-foreground mb-4 print:mb-2">
            銷售金額：{formatCurrency(inputs.totalSalesAmount)} 元
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
            {/* 建設公司（未節稅） */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground mb-3">建設公司（未節稅）</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">銷售收入</span>
                  <span className="font-mono">{formatCurrency(result.tax.salesRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">總成本</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.baseCost)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 mt-1">
                  <span className="font-semibold">淨利</span>
                  <span className="font-mono font-bold">{formatCurrency(result.tax.cProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">營所稅 ({formatPercent(inputs.corpTaxRate)})</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.cCorpTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">股利所得稅 ({formatPercent(inputs.dividendTaxRate)})</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.cDividendTax)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 mt-1">
                  <span className="font-semibold">總稅金</span>
                  <span className="font-mono font-bold text-destructive">-{formatCurrency(result.tax.cTotalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">實質稅率</span>
                  <span className="font-mono font-bold">{formatPercent(result.tax.cEffRate)}</span>
                </div>
              </div>
            </div>

            {/* 建設公司（節稅後） */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground mb-3">建設公司（節稅後）</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">銷售收入</span>
                  <span className="font-mono">{formatCurrency(result.tax.salesRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">總成本（含節稅）</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.baseCost + inputs.taxSavingConstructor + inputs.taxSavingConstruction)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 mt-1">
                  <span className="font-semibold">淨利（降低後）</span>
                  <span className="font-mono font-bold">{formatCurrency(result.tax.cProfitAfter)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">營所稅 ({formatPercent(inputs.corpTaxRate)})</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.cCorpTaxAfter)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">股利所得稅 ({formatPercent(inputs.dividendTaxRate)})</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.cDividendTaxAfter)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 mt-1">
                  <span className="font-semibold">總稅金</span>
                  <span className="font-mono font-bold text-destructive">-{formatCurrency(result.tax.cTotalTaxAfter)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">實質稅率</span>
                  <span className="font-mono font-bold">{formatPercent(result.tax.cEffRateAfter)}</span>
                </div>
              </div>
            </div>

            {/* 營造廠（節稅部分） */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground mb-3">營造廠（節稅部分）</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">節稅營業額</span>
                  <span className="font-mono">{formatCurrency(result.tax.bRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">課稅所得 (×{formatPercent(inputs.constructorIncomeStd)})</span>
                  <span className="font-mono">{formatCurrency(result.tax.bTaxableIncome)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 mt-1">
                  <span className="text-muted-foreground">營所稅</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.bCorpTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">股利所得稅</span>
                  <span className="font-mono text-destructive">-{formatCurrency(result.tax.bDividendTax)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 mt-1">
                  <span className="font-semibold">總稅金</span>
                  <span className="font-mono font-bold text-destructive">-{formatCurrency(result.tax.bTotalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">實質稅率（以營業額計）</span>
                  <span className="font-mono font-bold">{formatPercent(result.tax.bEffRate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 淨效益總結 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2 pt-4 border-t border-border print:border-t print:pt-2">
            <div className="bg-secondary/30 rounded-lg p-3 print:bg-transparent print:p-2">
              <p className="text-xs text-muted-foreground mb-1">未節稅總稅金</p>
              <p className="font-mono font-bold text-lg text-destructive print:text-base">{formatCurrency(result.tax.totalBefore)}</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 print:bg-transparent print:p-2">
              <p className="text-xs text-muted-foreground mb-1">節稅後總稅金</p>
              <p className="font-mono font-bold text-lg text-destructive print:text-base">{formatCurrency(result.tax.totalAfter)}</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 print:bg-transparent print:p-2">
              <p className="text-xs text-muted-foreground mb-1">節省稅金</p>
              <p className="font-mono font-bold text-lg text-primary print:text-base">{formatCurrency(result.tax.taxSaved)}</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 print:bg-transparent print:p-2">
              <p className="text-xs text-muted-foreground mb-1">資金缺口增加</p>
              <p className="font-mono font-bold text-lg text-destructive print:text-base">{formatCurrency(result.tax.gapIncrease)}</p>
            </div>
          </div>

          {/* 淨效益總結 */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 print:bg-yellow-100 print:border-yellow-300 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">淨效益</span>
              <span className="font-mono font-bold text-xl text-primary print:text-lg">
                {formatCurrency(result.tax.netBenefit)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground print:text-[10px]">
              = 節省稅金 {formatCurrency(result.tax.taxSaved)} − 資金缺口增加 {formatCurrency(result.tax.gapIncrease)}
            </p>
          </div>
        </section>

        {/* 試算結論 */}
        <section className="bg-card border border-border rounded-xl p-5 print:border print:border-gray-400 print:p-4">
          <h2 className="text-sm font-semibold text-accent mb-4">試算結論</h2>
          <p className="text-sm text-foreground leading-relaxed print:text-xs print:leading-relaxed">
            透過節稅操作多出 {formatCurrency(inputs.taxSavingConstructor + inputs.taxSavingConstruction)} 元， 建設公司淨利從 {formatCurrency(result.tax.cProfit)} 降至 {formatCurrency(result.tax.cProfitAfter)} 元。 節省稅金約 {formatCurrency(result.tax.taxSaved)} 元， 但資金缺口增加 {formatCurrency(result.tax.gapIncrease)} 元。 淨效益為 {formatCurrency(result.tax.netBenefit)} 元。 {result.tax.netBenefit > 0 ? '節稅效益大於資金壓力增加，在資金調度可行的前提下，此策略具備財務效益。' : '資金壓力增加幅度較大，需實慎評估資金調度能力。'}
          </p>
        </section>
      </main>
    </div>
  );
}
