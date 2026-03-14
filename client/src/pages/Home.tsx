import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import CurrencyInput from '@/components/CurrencyInput';
import ResultCard from '@/components/ResultCard';
import { formatCurrency, formatPercent } from '@/lib/format';
import {
  RotateCcw, Building2, HardHat, TrendingDown, TrendingUp,
  AlertTriangle, ShieldCheck, Calculator, ChevronDown, ChevronUp,
  DollarSign, BarChart3,
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
  const [showInvoiceDeferred, setShowInvoiceDeferred] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
          <Button variant="outline" size="sm" onClick={resetInputs} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            重設範例
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* 建案基本資料 */}
        <section className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-accent mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            建案基本資料
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">建案名稱</label>
              <input
                type="text"
                value={inputs.projectName}
                onChange={e => updateInput('projectName', e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none"
              />
            </div>
            <CurrencyInput label="總戶數" value={inputs.totalUnits} onChange={v => updateInput('totalUnits', v)} suffix="戶" />
            <CurrencyInput label="每戶客戶代辦費" value={inputs.agencyFeePerUnit} onChange={v => updateInput('agencyFeePerUnit', v)} />
            <CurrencyInput
              label="代銷交屋後支付比例"
              value={inputs.agencyPostDeliveryPct * 100}
              onChange={v => updateInput('agencyPostDeliveryPct', v / 100)}
              suffix="%"
              hint="例：40 代表 40%"
            />
            <CurrencyInput
              label="建案總銷售金額（含稅）"
              value={inputs.totalSalesAmount}
              onChange={v => updateInput('totalSalesAmount', v)}
              hint="所有戶別合約總價，用於稅務計算"
            />
          </div>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="expense" className="space-y-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="expense">建設總支出</TabsTrigger>
            <TabsTrigger value="revenue">建設資金流入</TabsTrigger>
            <TabsTrigger value="deferred">可延後付款</TabsTrigger>
            <TabsTrigger value="invoice">多開發票設定</TabsTrigger>
            <TabsTrigger value="tax">稅率參數</TabsTrigger>
          </TabsList>

          {/* 建設總支出 */}
          <TabsContent value="expense" className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-destructive mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              建設總支出（實際成本，含稅）
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CurrencyInput label="施工成本估算（含稅）" value={inputs.constructionCost} onChange={v => updateInput('constructionCost', v)} />
              <CurrencyInput label="廣告費（含稅）" value={inputs.advertisingFee} onChange={v => updateInput('advertisingFee', v)} />
              <CurrencyInput label="建融利息支出" value={inputs.constructionLoanInterest} onChange={v => updateInput('constructionLoanInterest', v)} />
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">建設總支出（實際）</span>
                <span className="font-mono font-bold text-lg text-destructive">{formatCurrency(result.actual.totalExpense)} 元</span>
              </div>
            </div>
          </TabsContent>

          {/* 建設資金流入 */}
          <TabsContent value="revenue" className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              建設資金流入（至客戶貸款撥款前）
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              此處為施工期間的資金流入，用於計算資金缺口。建融為借款非收入，但在施工期間可用。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CurrencyInput label="建融撥款" value={inputs.constructionLoan} onChange={v => updateInput('constructionLoan', v)} />
              <CurrencyInput label="預收房屋款" value={inputs.preSaleRevenue} onChange={v => updateInput('preSaleRevenue', v)} />
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">客戶代辦費收入（自動計算）</p>
                <p className="font-mono font-bold text-lg text-primary">{formatCurrency(inputs.agencyFeePerUnit * inputs.totalUnits)} 元</p>
                <p className="text-[10px] text-muted-foreground mt-1">{formatCurrency(inputs.agencyFeePerUnit)} × {inputs.totalUnits} 戶</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">建設資金流入合計</span>
                <span className="font-mono font-bold text-lg text-primary">{formatCurrency(result.actual.totalRevenue)} 元</span>
              </div>
            </div>
          </TabsContent>

          {/* 可延後付款 */}
          <TabsContent value="deferred" className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-accent mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              可延後付款費用（客戶貸款撥款後支付）
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CurrencyInput label="鋼筋材料" value={inputs.steelMaterial} onChange={v => updateInput('steelMaterial', v)} />
              <CurrencyInput label="公設大廳" value={inputs.publicLobby} onChange={v => updateInput('publicLobby', v)} />
              <CurrencyInput label="部分廠商交屋尾款" value={inputs.vendorFinalPayment} onChange={v => updateInput('vendorFinalPayment', v)} />
              <CurrencyInput label="建物登記費、代書費、記帳費" value={inputs.registrationFees} onChange={v => updateInput('registrationFees', v)} />
              <CurrencyInput label="營造廠固定支出" value={inputs.constructorFixedExpense} onChange={v => updateInput('constructorFixedExpense', v)} hint="營造廠自行負擔" />
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">代銷交屋後支付（自動計算）</p>
                <p className="font-mono font-bold text-lg text-accent">{formatCurrency(inputs.advertisingFee * inputs.agencyPostDeliveryPct)} 元</p>
                <p className="text-[10px] text-muted-foreground mt-1">廣告費 × {(inputs.agencyPostDeliveryPct * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">可延後付款合計（情境一）</span>
                <span className="font-mono font-bold text-lg text-accent">{formatCurrency(result.actual.deferredPayment)} 元</span>
              </div>
            </div>
          </TabsContent>

          {/* 多開發票設定 */}
          <TabsContent value="invoice" className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-accent mb-4 flex items-center gap-2">
              <HardHat className="w-4 h-4" />
              多開發票設定（節稅操作）
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CurrencyInput label="營造廠多開發票金額" value={inputs.extraInvoiceConstructor} onChange={v => updateInput('extraInvoiceConstructor', v)} hint="透過營造廠溢價發包的金額" />
              <CurrencyInput
                label="營造廠延後付款比例"
                value={inputs.constructorDeferredPct * 100}
                onChange={v => updateInput('constructorDeferredPct', v / 100)}
                suffix="%"
                hint="營造廠合約 15-20%"
              />
              <CurrencyInput label="建設端多開發票金額" value={inputs.extraInvoiceConstruction} onChange={v => updateInput('extraInvoiceConstruction', v)} hint="廚具、衛浴等建設端自行發包" />
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">多開發票總額</span>
                <span className="font-mono font-bold text-lg text-accent">{formatCurrency(inputs.extraInvoiceConstructor + inputs.extraInvoiceConstruction)} 元</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">營造廠延後付款金額</span>
                <span className="font-mono font-bold text-accent">{formatCurrency(inputs.extraInvoiceConstructor * inputs.constructorDeferredPct)} 元</span>
              </div>
            </div>
          </TabsContent>

          {/* 稅率參數 */}
          <TabsContent value="tax" className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              稅率參數
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="mt-4 pt-4 border-t border-border space-y-1">
              <p className="text-xs text-muted-foreground">
                建設公司實質稅率 = 1 − (1 − 營所稅率) × (1 − 股利稅率) ={' '}
                <span className="font-mono text-destructive font-bold">
                  {formatPercent((1 - (1 - inputs.corpTaxRate) * (1 - inputs.dividendTaxRate)) * 100)}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                營造廠實質稅率（以營業額計）= 所得額標準 × 實質稅率 ={' '}
                <span className="font-mono text-primary font-bold">
                  {formatPercent(inputs.constructorIncomeStd * (1 - (1 - inputs.corpTaxRate) * (1 - inputs.dividendTaxRate)) * 100)}
                </span>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* ═══ 結果面板：兩情境比較 ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 情境一 */}
          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <h3 className="text-sm font-semibold">情境一：實際成本（未節稅）</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="建設總支出" value={result.actual.totalExpense} variant="negative" />
              <ResultCard label="建設資金流入" value={result.actual.totalRevenue} variant="positive" />
              <ResultCard label="可延後付款" value={result.actual.deferredPayment} variant="default" />
              <ResultCard label="實際資金缺口" value={result.actual.fundingGap} variant={result.actual.fundingGap > 0 ? 'negative' : 'positive'} size="lg" />
            </div>

            <button
              onClick={() => setShowActualDeferred(!showActualDeferred)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showActualDeferred ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              延後付款明細
            </button>
            {showActualDeferred && (
              <div className="bg-secondary/30 rounded-lg p-3 space-y-1">
                {result.actual.deferredBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground font-mono space-y-1">
              <p>資金缺口 = 總支出 − 資金流入 − 可延後付款</p>
              <p>= {formatCurrency(result.actual.totalExpense)} − {formatCurrency(result.actual.totalRevenue)} − {formatCurrency(result.actual.deferredPayment)}</p>
              <p className="text-foreground font-bold">= {formatCurrency(result.actual.fundingGap)} 元</p>
            </div>
          </section>

          {/* 情境二 */}
          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <h3 className="text-sm font-semibold">情境二：節稅操作</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="建設總支出（含多開）" value={result.invoice.totalExpense} variant="negative" />
              <ResultCard label="建設資金流入" value={result.invoice.totalRevenue} variant="positive" />
              <ResultCard label="可延後付款（含營造延後）" value={result.invoice.deferredPayment} variant="default" />
              <ResultCard label="多開發票後資金缺口" value={result.invoice.fundingGap} variant={result.invoice.fundingGap > 0 ? 'negative' : 'positive'} size="lg" />
            </div>

            <button
              onClick={() => setShowInvoiceDeferred(!showInvoiceDeferred)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showInvoiceDeferred ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              延後付款明細
            </button>
            {showInvoiceDeferred && (
              <div className="bg-secondary/30 rounded-lg p-3 space-y-1">
                {result.invoice.deferredBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground font-mono space-y-1">
              <p>資金缺口 = 總支出 − 資金流入 − 可延後付款</p>
              <p>= {formatCurrency(result.invoice.totalExpense)} − {formatCurrency(result.invoice.totalRevenue)} − {formatCurrency(result.invoice.deferredPayment)}</p>
              <p className="text-foreground font-bold">= {formatCurrency(result.invoice.fundingGap)} 元</p>
            </div>
          </section>
        </div>

        {/* ═══ 稅務效益分析 ═══ */}
        <section className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <DollarSign className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold">稅務效益分析</h3>
            <span className="text-xs text-muted-foreground ml-auto">
              建案總銷售金額：<span className="font-mono text-accent">{formatCurrency(inputs.totalSalesAmount)}</span> 元
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 建設公司（未節稅）*/}
            <div className="space-y-3 bg-secondary/20 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-destructive tracking-wider">建設公司（未節稅）</h4>
              <div className="space-y-2">
                <Row label="銷售收入" value={result.tax.salesRevenue} />
                <Row label="總成本" value={result.tax.baseCost} negative />
                <div className="pt-2 border-t border-border/50">
                  <Row label="淨利" value={result.tax.cProfit} bold />
                </div>
                <Row label={`營所稅 (${(inputs.corpTaxRate * 100).toFixed(0)}%)`} value={result.tax.cCorpTax} negative />
                <Row label={`股利所得稅 (${(inputs.dividendTaxRate * 100).toFixed(0)}%)`} value={result.tax.cDividendTax} negative />
                <div className="pt-2 border-t border-border/50">
                  <Row label="總稅金" value={result.tax.cTotalTax} negative bold />
                  <Row label="實質稅率" valueStr={formatPercent(result.tax.cEffRate)} negative bold />
                </div>
              </div>
            </div>

            {/* 建設公司（節稅後）*/}
            <div className="space-y-3 bg-secondary/20 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-primary tracking-wider">建設公司（多開發票後）</h4>
              <div className="space-y-2">
                <Row label="銷售收入" value={result.tax.salesRevenue} />
                <Row label="總成本（含多開）" value={result.tax.baseCost + inputs.extraInvoiceConstructor + inputs.extraInvoiceConstruction} negative />
                <div className="pt-2 border-t border-border/50">
                  <Row label="淨利（降低後）" value={result.tax.cProfitAfter} bold />
                </div>
                <Row label={`營所稅 (${(inputs.corpTaxRate * 100).toFixed(0)}%)`} value={result.tax.cCorpTaxAfter} negative />
                <Row label={`股利所得稅 (${(inputs.dividendTaxRate * 100).toFixed(0)}%)`} value={result.tax.cDividendTaxAfter} negative />
                <div className="pt-2 border-t border-border/50">
                  <Row label="總稅金" value={result.tax.cTotalTaxAfter} positive bold />
                  <Row label="實質稅率" valueStr={formatPercent(result.tax.cEffRateAfter)} positive bold />
                </div>
              </div>
            </div>

            {/* 營造廠 */}
            <div className="space-y-3 bg-secondary/20 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-primary tracking-wider">營造廠（多開發票部分）</h4>
              <div className="space-y-2">
                <Row label="多開發票營業額" value={result.tax.bRevenue} />
                <Row label={`課稅所得 (×${(inputs.constructorIncomeStd * 100).toFixed(0)}%)`} value={result.tax.bTaxableIncome} />
                <Row label="營所稅" value={result.tax.bCorpTax} negative />
                <Row label="股利所得稅" value={result.tax.bDividendTax} negative />
                <div className="pt-2 border-t border-border/50">
                  <Row label="總稅金" value={result.tax.bTotalTax} positive bold />
                  <Row label="實質稅率（以營業額計）" valueStr={formatPercent(result.tax.bEffRate)} positive bold />
                </div>
              </div>
            </div>
          </div>

          {/* 綜合效益摘要 */}
          <div className="mt-6 pt-5 border-t border-border">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <SummaryBox label="未節稅總稅金" value={result.tax.totalBefore} variant="red" />
              <SummaryBox label="節稅後總稅金" value={result.tax.totalAfter} variant="green" />
              <SummaryBox label="節省稅金" value={result.tax.taxSaved} variant="gold" />
              <SummaryBox label="資金缺口增加" value={result.tax.gapIncrease} variant="default" />
              <SummaryBox label="淨效益" value={result.tax.netBenefit} variant={result.tax.netBenefit >= 0 ? 'gold' : 'red'} />
            </div>
          </div>

          {/* 結論 */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-accent flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              試算結論
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              透過節稅操作多出 <span className="font-mono text-accent font-bold">{formatCurrency(inputs.extraInvoiceConstructor + inputs.extraInvoiceConstruction)}</span> 元，
              建設公司淨利從 <span className="font-mono font-bold">{formatCurrency(result.tax.cProfit)}</span> 降至{' '}
              <span className="font-mono font-bold">{formatCurrency(result.tax.cProfitAfter)}</span> 元。
              節省稅金約 <span className="font-mono text-primary font-bold">{formatCurrency(result.tax.taxSaved)}</span> 元，
              但資金缺口增加 <span className="font-mono text-destructive font-bold">{formatCurrency(result.tax.gapIncrease)}</span> 元。
              淨效益為 <span className={`font-mono font-bold ${result.tax.netBenefit >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(result.tax.netBenefit)}</span> 元。
              {result.tax.taxSaved > 0
                ? result.tax.netBenefit >= 0
                  ? ' 節稅效益大於資金壓力增加，在資金調度可行的前提下，此策略具備財務效益。'
                  : ' 雖然節稅有效，但資金壓力增加幅度較大，需審慎評估資金調度能力。'
                : ' 目前設定下無節稅效益，請檢查建案總銷售金額與成本設定。'}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            本試算工具僅供財務規劃參考，實際稅務操作請諮詢專業會計師與律師。所有金額皆為含稅計算。
          </p>
        </footer>
      </main>
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
      <span className={`text-xs ${bold ? 'font-semibold' : 'text-muted-foreground'}`}>{label}</span>
      <span className={`font-mono text-sm ${color} ${weight}`}>{display}</span>
    </div>
  );
}

function SummaryBox({ label, value, variant }: {
  label: string;
  value: number;
  variant: 'red' | 'green' | 'gold' | 'default';
}) {
  const styles = {
    red: 'bg-destructive/10 border-destructive/20',
    green: 'bg-primary/10 border-primary/20',
    gold: 'bg-accent/10 border-accent/20',
    default: 'bg-secondary border-border',
  };
  const textColor = {
    red: 'text-destructive',
    green: 'text-primary',
    gold: 'text-accent',
    default: 'text-foreground',
  };
  return (
    <div className={`border rounded-lg p-4 text-center ${styles[variant]}`}>
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className={`font-mono font-bold text-lg ${textColor[variant]}`}>{formatCurrency(value)}</p>
    </div>
  );
}
