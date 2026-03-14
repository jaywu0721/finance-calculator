import { useState, useMemo } from 'react';

/* ===================================================================
 * 營建雙平台資金缺口與稅務套利試算 — 計算引擎 v3
 *
 * 新增銷售完成率與動態連結：
 * - 銷售完成率：決定實際銷售金額
 * - 預收房屋款比例：銷售金額 × 預收比例
 * - 銷售費用比例：銷售金額 × 銷售費用比例
 * - 節稅操作：原多開發票功能改名
 * =================================================================== */

export interface ProjectInputs {
  projectName: string;
  totalUnits: number;
  agencyFeePerUnit: number;

  // ── 銷售參數（動態連結）──
  totalSalesAmount: number;         // 建案總銷售金額（含稅）
  salesCompletionRate: number;      // 銷售完成率（0-1）
  preSaleRevenueRate: number;       // 預收房屋款比例（0-1）
  salesFeeRate: number;             // 銷售費用比例（0-1）

  // ── 建設總支出（實際成本）──
  constructionCost: number;
  advertisingFee: number;
  constructionLoanInterest: number;

  // ── 建設資金流入（資金缺口用）──
  constructionLoan: number;

  // ── 可延後付款項目 ──
  steelMaterial: number;
  publicLobby: number;
  vendorFinalPayment: number;
  registrationFees: number;
  constructorFixedExpense: number;
  agencyPostDeliveryPct: number;

  // ── 節稅操作設定 ──
  taxSavingConstructor: number;
  constructorDeferredPct: number;
  taxSavingConstruction: number;

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

  // 營造廠（節稅部分）
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
  taxSaving: ScenarioResult;
  tax: TaxAnalysis;
  salesInfo: {
    actualSalesAmount: number;
    preSaleRevenue: number;
    salesFee: number;
    agencyFeeTotal: number;
  };
}

const defaultInputs: ProjectInputs = {
  projectName: '建案 A',
  totalUnits: 32,
  agencyFeePerUnit: 200000,

  totalSalesAmount: 350000000,
  salesCompletionRate: 1.0,         // 100% 完銷
  preSaleRevenueRate: 0.15,         // 預收 15%
  salesFeeRate: 0.05,               // 銷售費用 5%

  constructionCost: 218991554,
  advertisingFee: 27205750,
  constructionLoanInterest: 4702500,

  constructionLoan: 104500000,

  steelMaterial: 20703712,
  publicLobby: 3150000,
  vendorFinalPayment: 3000000,
  registrationFees: 2500000,
  constructorFixedExpense: 5600000,
  agencyPostDeliveryPct: 0.4,

  taxSavingConstructor: 60000000,
  constructorDeferredPct: 0.15,
  taxSavingConstruction: 5000000,

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

    // ═══ 銷售參數計算 ═══
    const actualSalesAmount = i.totalSalesAmount * i.salesCompletionRate;
    const preSaleRevenue = actualSalesAmount * i.preSaleRevenueRate;
    const salesFee = actualSalesAmount * i.salesFeeRate;
    const agencyFeeTotal = i.agencyFeePerUnit * i.totalUnits;

    // ═══ 情境一：實際成本（資金缺口）═══
    const actualExpense = i.constructionCost + i.advertisingFee + i.constructionLoanInterest;
    const actualRevenue = i.constructionLoan + preSaleRevenue + agencyFeeTotal;

    const agencyDeferred = i.advertisingFee * i.agencyPostDeliveryPct;

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

    // ═══ 情境二：節稅操作（資金缺口）═══
    const totalTaxSaving = i.taxSavingConstructor + i.taxSavingConstruction;
    const taxSavingExpense = actualExpense + totalTaxSaving;
    const taxSavingRevenue = actualRevenue;

    const constructorExtraDeferred = i.taxSavingConstructor * i.constructorDeferredPct;

    const taxSavingDeferredItems: DeferredItem[] = [
      { label: '鋼筋材料', amount: i.steelMaterial },
      { label: '公設大廳', amount: i.publicLobby },
      { label: '部分廠商交屋尾款', amount: i.vendorFinalPayment },
      { label: '建物登記/代書/記帳費', amount: i.registrationFees },
      { label: '營造廠固定支出', amount: i.constructorFixedExpense },
      { label: '代銷交屋後支付', amount: agencyDeferred },
      { label: '營造廠節稅延後付款', amount: constructorExtraDeferred },
      { label: '建設端節稅延後（廚具衛浴）', amount: i.taxSavingConstruction },
    ];
    const taxSavingDeferred = taxSavingDeferredItems.reduce((s, d) => s + d.amount, 0);
    const taxSavingGap = taxSavingExpense - taxSavingRevenue - taxSavingDeferred;

    // ═══ 稅務分析（使用會計收入）═══
    const salesRevenue = actualSalesAmount;
    const baseCost = i.constructionCost + i.advertisingFee + i.constructionLoanInterest;

    // 建設公司（未節稅）
    const cProfit = Math.max(salesRevenue - baseCost, 0);
    const cCorpTax = cProfit * i.corpTaxRate;
    const cDividendTax = (cProfit - cCorpTax) * i.dividendTaxRate;
    const cTotalTax = cCorpTax + cDividendTax;
    const cEffRate = cProfit > 0 ? (cTotalTax / cProfit) * 100 : 0;

    // 建設公司（節稅後）
    const cProfitAfter = Math.max(salesRevenue - baseCost - totalTaxSaving, 0);
    const cCorpTaxAfter = cProfitAfter * i.corpTaxRate;
    const cDividendTaxAfter = (cProfitAfter - cCorpTaxAfter) * i.dividendTaxRate;
    const cTotalTaxAfter = cCorpTaxAfter + cDividendTaxAfter;
    const cEffRateAfter = cProfitAfter > 0 ? (cTotalTaxAfter / cProfitAfter) * 100 : 0;

    // 營造廠（節稅部分）
    const bRevenue = totalTaxSaving;
    const bTaxableIncome = bRevenue * i.constructorIncomeStd;
    const bCorpTax = bTaxableIncome * i.corpTaxRate;
    const bDividendTax = (bTaxableIncome - bCorpTax) * i.dividendTaxRate;
    const bTotalTax = bCorpTax + bDividendTax;
    const bEffRate = bRevenue > 0 ? (bTotalTax / bRevenue) * 100 : 0;

    // 綜合
    const totalBefore = cTotalTax;
    const totalAfter = cTotalTaxAfter + bTotalTax;
    const taxSaved = totalBefore - totalAfter;
    const gapIncrease = taxSavingGap - actualGap;
    const netBenefit = taxSaved - gapIncrease;

    return {
      actual: {
        totalExpense: actualExpense,
        totalRevenue: actualRevenue,
        deferredPayment: actualDeferred,
        fundingGap: actualGap,
        deferredBreakdown: actualDeferredItems,
      },
      taxSaving: {
        totalExpense: taxSavingExpense,
        totalRevenue: taxSavingRevenue,
        deferredPayment: taxSavingDeferred,
        fundingGap: taxSavingGap,
        deferredBreakdown: taxSavingDeferredItems,
      },
      tax: {
        salesRevenue, baseCost,
        cProfit, cCorpTax, cDividendTax, cTotalTax, cEffRate,
        cProfitAfter, cCorpTaxAfter, cDividendTaxAfter, cTotalTaxAfter, cEffRateAfter,
        bRevenue, bTaxableIncome, bCorpTax, bDividendTax, bTotalTax, bEffRate,
        totalBefore, totalAfter, taxSaved, gapIncrease, netBenefit,
      },
      salesInfo: {
        actualSalesAmount,
        preSaleRevenue,
        salesFee,
        agencyFeeTotal,
      },
    };
  }, [inputs]);

  return { inputs, updateInput, resetInputs, result };
}
