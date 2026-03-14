import { useState, useMemo } from 'react';

/* ===================================================================
 * 營建雙平台資金缺口與稅務套利試算 — 計算引擎 v2
 *
 * 關鍵區分：
 * - 「資金流」：建融、預收款、代辦費 → 用於計算資金缺口
 * - 「會計收入」：建案總銷售金額 → 用於計算稅務
 *
 * 建融是借款不是收入，客戶貸款撥款後歸還建融。
 * 建案總銷售金額 = 所有戶別的合約總價（含稅）
 * =================================================================== */

export interface ProjectInputs {
  projectName: string;
  totalUnits: number;
  agencyFeePerUnit: number;

  // ── 建案銷售（會計用）──
  totalSalesAmount: number;       // 建案總銷售金額（含稅）- 用於稅務計算

  // ── 建設總支出（實際成本）──
  constructionCost: number;
  advertisingFee: number;
  constructionLoanInterest: number;

  // ── 建設資金流入（資金缺口用）──
  constructionLoan: number;
  preSaleRevenue: number;

  // ── 可延後付款項目 ──
  steelMaterial: number;
  publicLobby: number;
  vendorFinalPayment: number;
  registrationFees: number;
  constructorFixedExpense: number;
  agencyPostDeliveryPct: number;

  // ── 多開發票設定 ──
  extraInvoiceConstructor: number;
  constructorDeferredPct: number;
  extraInvoiceConstruction: number;

  // ── 稅率參數 ──
  constructorIncomeStd: number;
  corpTaxRate: number;
  dividendTaxRate: number;
}

export interface DeferredItem {
  label: string;
  amount: number;
}

export interface ScenarioResult {
  totalExpense: number;
  totalRevenue: number;
  deferredPayment: number;
  fundingGap: number;
  deferredBreakdown: DeferredItem[];
}

export interface TaxAnalysis {
  // 建設公司（未節稅）
  salesRevenue: number;
  baseCost: number;
  cProfit: number;
  cCorpTax: number;
  cDividendTax: number;
  cTotalTax: number;
  cEffRate: number;

  // 建設公司（節稅後）
  cProfitAfter: number;
  cCorpTaxAfter: number;
  cDividendTaxAfter: number;
  cTotalTaxAfter: number;
  cEffRateAfter: number;

  // 營造廠（多開部分）
  bRevenue: number;
  bTaxableIncome: number;
  bCorpTax: number;
  bDividendTax: number;
  bTotalTax: number;
  bEffRate: number;

  // 綜合
  totalBefore: number;
  totalAfter: number;
  taxSaved: number;
  gapIncrease: number;
  netBenefit: number;
}

export interface CalculationResult {
  actual: ScenarioResult;
  invoice: ScenarioResult;
  tax: TaxAnalysis;
}

const defaultInputs: ProjectInputs = {
  projectName: '建案 A',
  totalUnits: 32,
  agencyFeePerUnit: 200000,

  totalSalesAmount: 350000000,  // 建案總銷售金額（含稅）

  constructionCost: 218991554,
  advertisingFee: 27205750,
  constructionLoanInterest: 4702500,

  constructionLoan: 104500000,
  preSaleRevenue: 74820000,

  steelMaterial: 20703712,
  publicLobby: 3150000,
  vendorFinalPayment: 3000000,
  registrationFees: 2500000,
  constructorFixedExpense: 5600000,
  agencyPostDeliveryPct: 0.4,

  extraInvoiceConstructor: 60000000,
  constructorDeferredPct: 0.15,
  extraInvoiceConstruction: 5000000,

  constructorIncomeStd: 0.08,
  corpTaxRate: 0.20,
  dividendTaxRate: 0.28,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<ProjectInputs>(defaultInputs);

  const updateInput = <K extends keyof ProjectInputs>(key: K, value: ProjectInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const resetInputs = () => setInputs(defaultInputs);

  const result = useMemo<CalculationResult>(() => {
    const i = inputs;
    const agencyFeeTotal = i.agencyFeePerUnit * i.totalUnits;
    const agencyDeferred = i.advertisingFee * i.agencyPostDeliveryPct;

    // ═══ 情境一：實際成本（資金缺口）═══
    const actualExpense = i.constructionCost + i.advertisingFee + i.constructionLoanInterest;
    const actualRevenue = i.constructionLoan + i.preSaleRevenue + agencyFeeTotal;

    const actualDeferredItems: DeferredItem[] = [
      { label: '鋼筋材料', amount: i.steelMaterial },
      { label: '公設大廳', amount: i.publicLobby },
      { label: '部分廠商交屋尾款', amount: i.vendorFinalPayment },
      { label: '建物登記/代書/記帳費', amount: i.registrationFees },
      { label: '營造廠固定支出', amount: i.constructorFixedExpense },
      { label: '代銷交屋後支付', amount: agencyDeferred },
    ];
    const actualDeferred = actualDeferredItems.reduce((s, d) => s + d.amount, 0);
    const actualGap = actualExpense - actualRevenue - actualDeferred;

    // ═══ 情境二：多開發票（資金缺口）═══
    const totalExtra = i.extraInvoiceConstructor + i.extraInvoiceConstruction;
    const invoiceExpense = actualExpense + totalExtra;
    const invoiceRevenue = actualRevenue;

    const constructorExtraDeferred = i.extraInvoiceConstructor * i.constructorDeferredPct;

    const invoiceDeferredItems: DeferredItem[] = [
      { label: '鋼筋材料', amount: i.steelMaterial },
      { label: '公設大廳', amount: i.publicLobby },
      { label: '部分廠商交屋尾款', amount: i.vendorFinalPayment },
      { label: '建物登記/代書/記帳費', amount: i.registrationFees },
      { label: '營造廠固定支出', amount: i.constructorFixedExpense },
      { label: '代銷交屋後支付', amount: agencyDeferred },
      { label: '營造廠多開延後付款', amount: constructorExtraDeferred },
      { label: '建設端多開延後（廚具衛浴）', amount: i.extraInvoiceConstruction },
    ];
    const invoiceDeferred = invoiceDeferredItems.reduce((s, d) => s + d.amount, 0);
    const invoiceGap = invoiceExpense - invoiceRevenue - invoiceDeferred;

    // ═══ 稅務分析（使用會計收入）═══
    // 建設公司銷售收入 = 建案總銷售金額（會計上的營業收入）
    const salesRevenue = i.totalSalesAmount;
    // 建設公司成本（不含多開）
    const baseCost = i.constructionCost + i.advertisingFee + i.constructionLoanInterest;

    // 建設公司（未節稅）
    const cProfit = Math.max(salesRevenue - baseCost, 0);
    const cCorpTax = cProfit * i.corpTaxRate;
    const cDividendTax = (cProfit - cCorpTax) * i.dividendTaxRate;
    const cTotalTax = cCorpTax + cDividendTax;
    const cEffRate = cProfit > 0 ? (cTotalTax / cProfit) * 100 : 0;

    // 建設公司（節稅後）
    const cProfitAfter = Math.max(salesRevenue - baseCost - totalExtra, 0);
    const cCorpTaxAfter = cProfitAfter * i.corpTaxRate;
    const cDividendTaxAfter = (cProfitAfter - cCorpTaxAfter) * i.dividendTaxRate;
    const cTotalTaxAfter = cCorpTaxAfter + cDividendTaxAfter;
    const cEffRateAfter = cProfitAfter > 0 ? (cTotalTaxAfter / cProfitAfter) * 100 : 0;

    // 營造廠（多開部分）
    const bRevenue = totalExtra;
    const bTaxableIncome = bRevenue * i.constructorIncomeStd;
    const bCorpTax = bTaxableIncome * i.corpTaxRate;
    const bDividendTax = (bTaxableIncome - bCorpTax) * i.dividendTaxRate;
    const bTotalTax = bCorpTax + bDividendTax;
    const bEffRate = bRevenue > 0 ? (bTotalTax / bRevenue) * 100 : 0;

    // 綜合
    const totalBefore = cTotalTax;
    const totalAfter = cTotalTaxAfter + bTotalTax;
    const taxSaved = totalBefore - totalAfter;
    const gapIncrease = invoiceGap - actualGap;
    const netBenefit = taxSaved - gapIncrease;

    return {
      actual: {
        totalExpense: actualExpense,
        totalRevenue: actualRevenue,
        deferredPayment: actualDeferred,
        fundingGap: actualGap,
        deferredBreakdown: actualDeferredItems,
      },
      invoice: {
        totalExpense: invoiceExpense,
        totalRevenue: invoiceRevenue,
        deferredPayment: invoiceDeferred,
        fundingGap: invoiceGap,
        deferredBreakdown: invoiceDeferredItems,
      },
      tax: {
        salesRevenue, baseCost,
        cProfit, cCorpTax, cDividendTax, cTotalTax, cEffRate,
        cProfitAfter, cCorpTaxAfter, cDividendTaxAfter, cTotalTaxAfter, cEffRateAfter,
        bRevenue, bTaxableIncome, bCorpTax, bDividendTax, bTotalTax, bEffRate,
        totalBefore, totalAfter, taxSaved, gapIncrease, netBenefit,
      },
    };
  }, [inputs]);

  return { inputs, updateInput, resetInputs, result };
}
