import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import CurrencyInput from '@/components/CurrencyInput';
import ResultCard from '@/components/ResultCard';
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 print:sticky print:top-0">
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

        {/* Tabs */}
        <Tabs defaultValue="sales" className="space-y-4 print:space-y-2">
          <TabsList className="bg-card border border-border print:hidden">
            <TabsTrigger value="sales">銷售參數</TabsTrigger>
            <TabsTrigger value="expense">建設支出</TabsTrigger>
            <TabsTrigger value="revenue">資金流入</TabsTrigger>
            <TabsTrigger value="deferred">可延後付款</TabsTrigger>
            <TabsTrigger value="taxsaving">節稅操作</TabsTrigger>
            <TabsTrigger value="tax">稅率參數</TabsTrigger>
          </TabsList>

          {/* 銷售參數 */}
          <TabsContent value="sales" className="bg-card border border-border rounded-xl p-5 print:border-0 print:bg-transparent print:p-0">
            <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              銷售參數（動態連結）
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
              <CurrencyInput
                label="銷售完成率"
                value={inputs.salesCompletionRate * 100}
                onChange={v => updateInput('salesCompletionRate', v / 100)}
                suffix="%"
                hint="100% 表示全部完銷"
              />
              <CurrencyInput
                label="預收房屋款比例"
                value={inputs.preSaleRevenueRate * 100}
                onChange={v => updateInput('preSaleRevenueRate', v / 100)}
                suffix="%"
                hint="施工期間預收比例"
              />
              <CurrencyInput
                label="代銷費用比例"
                value={inputs.agencyFeeRate * 100}
                onChange={v => updateInput('agencyFeeRate', v / 100)}
                suffix="%"
                hint="代銷、廣告等費用"
              />
              <div className="bg-secondary/30 border border-border rounded-lg p-4 print:border-0 print:bg-transparent">
                <p className="text-xs text-muted-foreground mb-1">實際銷售金額</p>
                <p className="font-mono font-bold text-lg text-primary">{formatCurrency(result.salesInfo.actualSalesAmount)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border print:border-t print:mt-2 print:pt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">預收房屋款</span>
                <span className="font-mono">{formatCurrency(result.salesInfo.preSaleRevenue)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">代銷費用</span>
                <span className="font-mono">{formatCurrency(result.salesInfo.agencyFee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">客戶代辦費收入</span>
                <span className="font-mono">{formatCurrency(result.salesInfo.agencyFeeTotal)}</span>
              </div>
            </div>
          </TabsContent>

          {/* 建設支出 */}
          <TabsContent value="expense" className="bg-card border border-border rounded-xl p-5 print:border-0 print:bg-transparent print:p-0">
            <h2 className="text-sm font-semibold text-destructive mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              建設總支出（實際成本，含稅）
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
              <CurrencyInput label="施工成本估算（含稅）" value={inputs.constructionCost} onChange={v => updateInput('constructionCost', v)} />
              <CurrencyInput label="建融利息支出" value={inputs.constructionLoanInterest} onChange={v => updateInput('constructionLoanInterest', v)} />
            </div>
            <div className="mt-4 pt-4 border-t border-border print:border-t print:mt-2 print:pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">建設總支出（實際）</span>
                <span className="font-mono font-bold text-lg text-destructive">{formatCurrency(result.actual.totalExpense)} 元</span>
              </div>
            </div>
          </TabsContent>

          {/* 建設資金流入 */}
          <TabsContent value="revenue" className="bg-card border border-border rounded-xl p-5 print:border-0 print:bg-transparent print:p-0">
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
          </TabsContent>

          {/* 可延後付款 */}
          <TabsContent value="deferred" className="bg-card border border-border rounded-xl p-5 print:border-0 print:bg-transparent print:p-0">
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
          </TabsContent>

          {/* 節稅操作 */}
          <TabsContent value="taxsaving" className="bg-card border border-border rounded-xl p-5 print:border-0 print:bg-transparent print:p-0">
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
          </TabsContent>

          {/* 稅率參數 */}
          <TabsContent value="tax" className="bg-card border border-border rounded-xl p-5 print:border-0 print:bg-transparent print:p-0">
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
          </TabsContent>
        </Tabs>

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
            {(showActualDeferred || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
              <div className="bg-secondary/30 rounded-lg p-3 space-y-1 print:bg-transparent print:p-0">
                {result.actual.deferredBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs print:text-[10px]">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground font-mono space-y-1 print:bg-transparent print:p-0 print:text-[10px]">
              <p>資金缺口 = 總支出 − 資金流入 − 可延後付款</p>
              <p>= {formatCurrency(result.actual.totalExpense)} − {formatCurrency(result.actual.totalRevenue)} − {formatCurrency(result.actual.deferredPayment)}</p>
              <p className="text-foreground font-bold">= {formatCurrency(result.actual.fundingGap)} 元</p>
            </div>
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
            {(showTaxSavingDeferred || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
              <div className="bg-secondary/30 rounded-lg p-3 space-y-1 print:bg-transparent print:p-0">
                {result.taxSaving.deferredBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs print:text-[10px]">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground font-mono space-y-1 print:bg-transparent print:p-0 print:text-[10px]">
              <p>資金缺口 = 總支出 − 資金流入 − 可延後付款</p>
              <p>= {formatCurrency(result.taxSaving.totalExpense)} − {formatCurrency(result.taxSaving.totalRevenue)} − {formatCurrency(result.taxSaving.deferredPayment)}</p>
              <p className="text-foreground font-bold">= {formatCurrency(result.taxSaving.fundingGap)} 元</p>
            </div>
          </section>
        </div>

        {/* ═══ 稅務效益分析 ═══ */}
        <section className="bg-card border border-border rounded-xl p-5 space-y-5 print:border print:border-gray-400 print:p-4 print:space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-border print:border-b print:pb-2">
            <DollarSign className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold">稅務效益分析</h3>
            <span className="text-xs text-muted-foreground ml-auto print:text-[10px]">
              銷售金額：<span className="font-mono text-accent">{formatCurrency(result.tax.salesRevenue)}</span> 元
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 print:grid-cols-3 print:gap-3">
            {/* 建設公司（未節稅）*/}
            <div className="space-y-3 bg-secondary/20 rounded-lg p-4 print:bg-gray-100 print:p-3 print:space-y-1">
              <h4 className="text-xs font-semibold text-destructive tracking-wider print:text-[11px]">建設公司（未節稅）</h4>
              <div className="space-y-2 print:space-y-1">
                <Row label="銷售收入" value={result.tax.salesRevenue} />
                <Row label="總成本" value={result.tax.baseCost} negative />
                <div className="pt-2 border-t border-border/50 print:pt-1">
                  <Row label="淨利" value={result.tax.cProfit} bold />
                </div>
                <Row label={`營所稅 (${(inputs.corpTaxRate * 100).toFixed(0)}%)`} value={result.tax.cCorpTax} negative />
                <Row label={`股利所得稅 (${(inputs.dividendTaxRate * 100).toFixed(0)}%)`} value={result.tax.cDividendTax} negative />
                <div className="pt-2 border-t border-border/50 print:pt-1">
                  <Row label="總稅金" value={result.tax.cTotalTax} negative bold />
                  <Row label="實質稅率" valueStr={formatPercent(result.tax.cEffRate)} negative bold />
                </div>
              </div>
            </div>

            {/* 建設公司（節稅後）*/}
            <div className="space-y-3 bg-secondary/20 rounded-lg p-4 print:bg-gray-100 print:p-3 print:space-y-1">
              <h4 className="text-xs font-semibold text-primary tracking-wider print:text-[11px]">建設公司（節稅後）</h4>
              <div className="space-y-2 print:space-y-1">
                <Row label="銷售收入" value={result.tax.salesRevenue} />
                <Row label="總成本（含節稅）" value={result.tax.baseCost + inputs.taxSavingConstructor + inputs.taxSavingConstruction} negative />
                <div className="pt-2 border-t border-border/50 print:pt-1">
                  <Row label="淨利（降低後）" value={result.tax.cProfitAfter} bold />
                </div>
                <Row label={`營所稅 (${(inputs.corpTaxRate * 100).toFixed(0)}%)`} value={result.tax.cCorpTaxAfter} negative />
                <Row label={`股利所得稅 (${(inputs.dividendTaxRate * 100).toFixed(0)}%)`} value={result.tax.cDividendTaxAfter} negative />
                <div className="pt-2 border-t border-border/50 print:pt-1">
                  <Row label="總稅金" value={result.tax.cTotalTaxAfter} positive bold />
                  <Row label="實質稅率" valueStr={formatPercent(result.tax.cEffRateAfter)} positive bold />
                </div>
              </div>
            </div>

            {/* 營造廠 */}
            <div className="space-y-3 bg-secondary/20 rounded-lg p-4 print:bg-gray-100 print:p-3 print:space-y-1">
              <h4 className="text-xs font-semibold text-primary tracking-wider print:text-[11px]">營造廠（節稅部分）</h4>
              <div className="space-y-2 print:space-y-1">
                <Row label="節稅營業額" value={result.tax.bRevenue} />
                <Row label={`課稅所得 (×${(inputs.constructorIncomeStd * 100).toFixed(0)}%)`} value={result.tax.bTaxableIncome} />
                <Row label="營所稅" value={result.tax.bCorpTax} negative />
                <Row label="股利所得稅" value={result.tax.bDividendTax} negative />
                <div className="pt-2 border-t border-border/50 print:pt-1">
                  <Row label="總稅金" value={result.tax.bTotalTax} positive bold />
                  <Row label="實質稅率（以營業額計）" valueStr={formatPercent(result.tax.bEffRate)} positive bold />
                </div>
              </div>
            </div>
          </div>

          {/* 綜合效益摘要 */}
          <div className="mt-6 pt-5 border-t border-border print:mt-3 print:pt-3 print:border-t">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2">
              <SummaryBox label="未節稅總稅金" value={result.tax.totalBefore} variant="red" />
              <SummaryBox label="節稅後總稅金" value={result.tax.totalAfter} variant="green" />
              <SummaryBox label="節省稅金" value={result.tax.taxSaved} variant="gold" />
              <SummaryBox label="資金缺口增加" value={result.tax.gapIncrease} variant="default" />
              <SummaryBox label="淨效益" value={result.tax.netBenefit} variant={result.tax.netBenefit >= 0 ? 'gold' : 'red'} />
            </div>
          </div>

          {/* 結論 */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2 print:bg-gray-100 print:p-3 print:space-y-1">
            <p className="text-sm font-semibold text-accent flex items-center gap-2 print:text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              試算結論
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed print:text-[10px] print:leading-tight">
              透過節稅操作多出 <span className="font-mono text-accent font-bold">{formatCurrency(inputs.taxSavingConstructor + inputs.taxSavingConstruction)}</span> 元，
              建設公司淨利從 <span className="font-mono font-bold">{formatCurrency(result.tax.cProfit)}</span> 降至{' '}
              <span className="font-mono font-bold">{formatCurrency(result.tax.cProfitAfter)}</span> 元。
              節省稅金約 <span className="font-mono text-primary font-bold">{formatCurrency(result.tax.taxSaved)}</span> 元，
              但資金缺口增加 <span className="font-mono text-destructive font-bold">{formatCurrency(result.tax.gapIncrease)}</span> 元。
              淨效益為 <span className={`font-mono font-bold ${result.tax.netBenefit >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(result.tax.netBenefit)}</span> 元。
              {result.tax.taxSaved > 0
                ? result.tax.netBenefit >= 0
                  ? ' 節稅效益大於資金壓力增加，在資金調度可行的前提下，此策略具備財務效益。'
                  : ' 雖然節稅有效，但資金壓力增加幅度較大，需審慎評估資金調度能力。'
                : ' 目前設定下無節稅效益，請檢查銷售金額與成本設定。'}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border print:py-3 print:border-t print:text-[10px]">
          <p className="text-xs text-muted-foreground">
            本試算工具僅供財務規劃參考，實際稅務操作請諮詢專業會計師與律師。所有金額皆為含稅計算。
          </p>
        </footer>
      </main>

      {/* 列印樣式 */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .print\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .print\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .print\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
          .print\\:gap-2 { gap: 0.5rem; }
          .print\\:gap-3 { gap: 0.75rem; }
          .print\\:gap-4 { gap: 1rem; }
          .print\\:p-0 { padding: 0; }
          .print\\:p-3 { padding: 0.75rem; }
          .print\\:p-4 { padding: 1rem; }
          .print\\:py-0 { padding-top: 0; padding-bottom: 0; }
          .print\\:py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .print\\:mb-2 { margin-bottom: 0.5rem; }
          .print\\:mb-6 { margin-bottom: 1.5rem; }
          .print\\:mt-2 { margin-top: 0.5rem; }
          .print\\:mt-3 { margin-top: 0.75rem; }
          .print\\:pt-1 { padding-top: 0.25rem; }
          .print\\:pt-2 { padding-top: 0.5rem; }
          .print\\:pt-3 { padding-top: 0.75rem; }
          .print\\:pb-2 { padding-bottom: 0.5rem; }
          .print\\:space-y-1 > * + * { margin-top: 0.25rem; }
          .print\\:space-y-2 > * + * { margin-top: 0.5rem; }
          .print\\:space-y-3 > * + * { margin-top: 0.75rem; }
          .print\\:space-y-4 > * + * { margin-top: 1rem; }
          .print\\:text-\\[10px\\] { font-size: 10px; }
          .print\\:text-\\[11px\\] { font-size: 11px; }
          .print\\:leading-tight { line-height: 1.25; }
          .print\\:border { border: 1px solid currentColor; }
          .print\\:border-0 { border: none; }
          .print\\:border-t { border-top: 1px solid currentColor; }
          .print\\:border-b { border-bottom: 1px solid currentColor; }
          .print\\:border-gray-400 { border-color: #9ca3af; }
          .print\\:bg-transparent { background-color: transparent; }
          .print\\:bg-gray-100 { background-color: #f3f4f6; }
          .print\\:sticky { position: sticky; }
          .print\\:top-0 { top: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── 輔助元件 ── */

function Row({ label, value, valueStr, negative, positive, bold }: {
  label: string;
  value?: number;
  valueStr?: string;
  negative?: boolean;
  positive?: boolean;
  bold?: boolean;
}) {
  const color = negative ? 'text-destructive' : positive ? 'text-primary' : 'text-foreground';
  const weight = bold ? 'font-bold' : '';
  const display = valueStr
    ? valueStr
    : negative && value !== undefined
      ? `-${formatCurrency(Math.abs(value))}`
      : formatCurrency(value ?? 0);
  return (
    <div className="flex justify-between items-center">
      <span className={`text-xs ${bold ? 'font-semibold' : 'text-muted-foreground'} print:text-[10px]`}>{label}</span>
      <span className={`font-mono text-sm ${color} ${weight} print:text-[10px]`}>{display}</span>
    </div>
  );
}

function SummaryBox({ label, value, variant }: {
  label: string;
  value: number;
  variant: 'red' | 'green' | 'gold' | 'default';
}) {
  const styles = {
    red: 'bg-destructive/10 border-destructive/20 print:bg-red-100 print:border-red-300',
    green: 'bg-primary/10 border-primary/20 print:bg-green-100 print:border-green-300',
    gold: 'bg-accent/10 border-accent/20 print:bg-yellow-100 print:border-yellow-300',
    default: 'bg-secondary border-border print:bg-gray-200 print:border-gray-400',
  };
  const textColor = {
    red: 'text-destructive print:text-red-700',
    green: 'text-primary print:text-green-700',
    gold: 'text-accent print:text-yellow-700',
    default: 'text-foreground print:text-gray-700',
  };
  return (
    <div className={`border rounded-lg p-4 text-center ${styles[variant]} print:p-2 print:rounded`}>
      <p className="text-[11px] text-muted-foreground mb-1 print:text-[9px] print:mb-0.5">{label}</p>
      <p className={`font-mono font-bold text-lg ${textColor[variant]} print:text-[11px]`}>{formatCurrency(value)}</p>
    </div>
  );
}
