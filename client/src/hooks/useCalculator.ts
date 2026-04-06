import { useState, useMemo } from 'react';

/* ===================================================================
 * 營建雙平台資金缺口與稅務規劃試算 — 計算引擎 v8
 *
 * v8 修正：
 * - 新增土融撥款與土融利率參數
 * - 土融利息 = 土融撥款 × 土融利率 × 土地時間（僅在建設支出中計算）
 * - 撥款前代銷費用支援兩種計算模式：
 *   模式1：代銷費用 × (1 - 交屋後支付比例)
 *   模式2：直接輸入撥款前代銷費用
 * - 代銷交屋後支付支援兩種計算方式：
 *   方式1：代銷費用 × 交屋後支付比例
 *   方式2：總銷金額 × 代銷費用比例 - 撥款前代銷費用
 * - 建設總支出新增土融利息
 * v9 新增：
 * - 參數記憶功能：使用 localStorage 自動保存和恢復用戶輸入
 * v7 修正：
 * - 客戶代辦費收入 = 每戶代辦費 × 總戶數 × 銷售完成率
 * - 新增「建設交屋後款項(衛浴等)」欄位，僅在情境二可延後付款
 * =================================================================== */

export interface ProjectInputs {
  projectName: string;
  totalUnits: number;
  agencyFeePerUnit: number;

  // ── 銷售參數（動態連結）──
  totalSalesAmount: number;         // 建案總銷售金額（含稅）
  salesCompletionRate: number;      // 銷售完成率（0-1）
  preSaleRevenueRate: number;       // 預收房屋款比例（0-1）- 可自訂
  agencyFeeRate: number;            // 代銷費用比例（0-1）- 自動成為廣告費

  // ── 撥款前代銷費用計算模式 ──
  agencyPreDeliveryMode: 'ratio' | 'manual';  // 'ratio' = 用比例計算, 'manual' = 直接輸入
  agencyPostDeliveryMode: 'ratio' | 'formula'; // 'ratio' = 用比例計算, 'formula' = 用公式計算
  agencyFeePreDeliveryManual: number;  // 直接輸入的撥款前代銷費用

  // ── 建設總支出（實際成本）──
  constructionCost: number;
  constructionLoanRate: number;       // 建融利率（0-1）
  constructionDurationYears: number;  // 興建時間（年）
  constructionLoanInterest: number;   // 自動計算：建融額度 × 建融利率 × 1/2 × 興建時間

  // ── 土融撥款與土融利息 ──
  landLoan: number;                   // 土融撥款
  landLoanRate: number;               // 土融利率（0-1）
  landDurationYears: number;          // 土地時間（年）
  landLoanInterest: number;           // 自動計算：土融撥款 × 土融利率 × 土地時間

  // ── 建融撥款（建設支出與資金流入共用）──
  constructionLoan: number;

  // ── 可延後付款項目 ──
  steelMaterial: number;
  publicLobby: number;
  vendorFinalPayment: number;
  registrationFees: number;
  constructorFixedExpense: number;

  // ── 成本優化設定（合併為增加成本 + 營造廠延後付款金額）──
  extraCost: number;                   // 增加成本（原營造廠+建設端合併）
  constructorDeferredAmount: number;   // 營造廠延後付款金額（直接輸入金額）
  postDeliveryBathroom: number;        // 建設交屋後款項(衛浴等)，僅情境二可延後

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

export interface CalculationResult {
  actual: ScenarioResult;
  costOptimized: ScenarioResult;
  salesInfo: {
    actualSalesAmount: number;
    preSaleRevenue: number;
    agencyFee: number;
    agencyFeePreDelivery: number;
    agencyFeeTotal: number;
    landLoanInterest: number;
  };
  warnings: {
    constructorOverflow: boolean;
    message: string;
  };
}

const defaultInputs: ProjectInputs = {
  projectName: '建案 A',
  totalUnits: 32,
  agencyFeePerUnit: 200000,

  totalSalesAmount: 350000000,
  salesCompletionRate: 1.0,         // 100% 完銷
  preSaleRevenueRate: 0.15,         // 預收 15%
  agencyFeeRate: 0.05,              // 代銷費用 5%

  agencyPreDeliveryMode: 'ratio',    // 預設使用比例計算
  agencyPostDeliveryMode: 'ratio',   // 預設使用比例計算
  agencyFeePreDeliveryManual: 0,     // 直接輸入的撥款前代銷費用

  constructionCost: 218991554,
  constructionLoanRate: 0.045,        // 預設 4.5%
  constructionDurationYears: 2.5,     // 預設 2.5 年
  constructionLoanInterest: 4702500,  // 自動計算

  landLoan: 0,                        // 土融撥款
  landLoanRate: 0.045,                // 土融利率 4.5%
  landDurationYears: 2,               // 土地時間 2 年
  landLoanInterest: 0,                // 自動計算

  constructionLoan: 104500000,

  steelMaterial: 20703712,
  publicLobby: 3150000,
  vendorFinalPayment: 3000000,
  registrationFees: 2500000,
  constructorFixedExpense: 5600000,


  extraCost: 65000000,                // 增加成本（合併）
  constructorDeferredAmount: 9000000, // 營造廠延後付款金額
  postDeliveryBathroom: 5000000,      // 建設交屋後款項(衛浴等)

  constructorIncomeStd: 0.08,
  corpTaxRate: 0.20,
  dividendTaxRate: 0.28,
};

// ═══ localStorage 參數記憶功能 ═══
const STORAGE_KEY = 'tax_calculator_inputs_v9';

function loadInputsFromStorage(): ProjectInputs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 合併存儲的數據與默認值，確保新增的字段有默認值
      return { ...defaultInputs, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load inputs from storage:', error);
  }
  return defaultInputs;
}

function saveInputsToStorage(inputs: ProjectInputs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch (error) {
    console.error('Failed to save inputs to storage:', error);
  }
}

export interface UseCalculatorReturn {
  inputs: ProjectInputs;
  updateInput: <K extends keyof ProjectInputs>(key: K, value: ProjectInputs[K]) => void;
  resetInputs: () => void;
  clearMemory: () => void;
  result: CalculationResult;
}

export function useCalculator(): UseCalculatorReturn {
  const [inputs, setInputs] = useState<ProjectInputs>(() => loadInputsFromStorage());

  const updateInput = <K extends keyof ProjectInputs>(key: K, value: ProjectInputs[K]) => {
    setInputs(prev => {
      const updated = { ...prev, [key]: value };
      // 自動計算建融利息（建融撥款 × 利率 × 0.5 × 時間）
      if (key === 'constructionLoanRate' || key === 'constructionDurationYears' || key === 'constructionLoan') {
        updated.constructionLoanInterest = updated.constructionLoan * updated.constructionLoanRate * 0.5 * updated.constructionDurationYears;
      }
      // 自動計算土融利息（土融撥款 × 土融利率 × 土地時間）
      if (key === 'landLoan' || key === 'landLoanRate' || key === 'landDurationYears') {
        updated.landLoanInterest = updated.landLoan * updated.landLoanRate * updated.landDurationYears;
      }
      // 自動保存到 localStorage
      saveInputsToStorage(updated);
      return updated;
    });
  };

  const resetInputs = () => {
    const reset = { ...defaultInputs };
    reset.constructionLoanInterest = reset.constructionLoan * reset.constructionLoanRate * 0.5 * reset.constructionDurationYears;
    reset.landLoanInterest = reset.landLoan * reset.landLoanRate * reset.landDurationYears;
    setInputs(reset);
    // 清除 localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  const clearMemory = () => {
    resetInputs();
  };

  const result = useMemo<CalculationResult>(() => {
    const i = inputs;

    // ═══ 銷售參數計算 ═══
    const actualSalesAmount = i.totalSalesAmount * i.salesCompletionRate;
    const preSaleRevenue = actualSalesAmount * i.preSaleRevenueRate;
    // 代銷費用 = 建案總銷售金額 × 代銷費用比例 × 銷售完成率
    const agencyFee = i.totalSalesAmount * i.agencyFeeRate * i.salesCompletionRate;
    
    // 撥款前代銷費用 - 支援兩種計算模式
    const agencyFeePreDelivery = i.agencyPreDeliveryMode === 'manual'
      ? i.agencyFeePreDeliveryManual
      : agencyFee * 0.6;  // 預設不可延後支付比例為 60%
    
    // 代銷交屋後支付 - 支援兩種計算方式
    const agencyDeferred = i.agencyPostDeliveryMode === 'formula'
      ? (i.totalSalesAmount * i.agencyFeeRate * i.salesCompletionRate) - agencyFeePreDelivery
      : agencyFee - agencyFeePreDelivery;
    
    // 客戶代辦費收入 = 每戶代辦費 × 總戶數 × 銷售完成率
    const agencyFeeTotal = i.agencyFeePerUnit * i.totalUnits * i.salesCompletionRate;

    // ═══ 檢查警示：增加成本是否超過施工成本 ═══
    const constructorOverflow = i.extraCost > i.constructionCost;
    const warningMessage = constructorOverflow
      ? `⚠️ 警告：增加成本 ${i.extraCost.toLocaleString()} 超過施工成本估算 ${i.constructionCost.toLocaleString()}，請檢查設定`
      : '';

    // ═══ 情境一：實際成本（資金缺口）═══
    // 項目3修正：建設總支出 = 施工成本 + 建融利息 + 土融利息 + 撥款前代銷費用
    const actualExpense = i.constructionCost + i.constructionLoanInterest + i.landLoanInterest + agencyFeePreDelivery;
    // 項目5：建融撥款同時出現在支出（利息計算）和流入
    const actualRevenue = i.constructionLoan + preSaleRevenue + agencyFeeTotal;

    const actualDeferredItems: DeferredItem[] = [
      { label: '鋼筋材料', amount: i.steelMaterial },
      { label: '公設大廳', amount: i.publicLobby },
      { label: '部分廠商交屋尾款', amount: i.vendorFinalPayment },
      { label: '建物登記/代書/記帳費', amount: i.registrationFees },
      { label: '營造廠固定支出', amount: i.constructorFixedExpense },
    ];
    const actualDeferred = actualDeferredItems.reduce((s, d) => s + d.amount, 0);
    const actualGap = actualExpense - actualRevenue - actualDeferred;

    // ═══ 情境二：成本優化（資金缺口）═══
    // 項目6：使用合併的增加成本
    const costOptimizedExpense = actualExpense + i.extraCost;
    const costOptimizedRevenue = actualRevenue;

    const costOptimizedDeferredItems: DeferredItem[] = [
      { label: '鋼筋材料', amount: i.steelMaterial },
      { label: '公設大廳', amount: i.publicLobby },
      { label: '部分廠商交屋尾款', amount: i.vendorFinalPayment },
      { label: '建物登記/代書/記帳費', amount: i.registrationFees },
      { label: '營造廠固定支出', amount: i.constructorFixedExpense },
      { label: '營造廠延後付款金額', amount: i.constructorDeferredAmount },
      { label: '建設交屋後款項(衛浴等)', amount: i.postDeliveryBathroom },
    ];
    const costOptimizedDeferred = costOptimizedDeferredItems.reduce((s, d) => s + d.amount, 0);
    const costOptimizedGap = costOptimizedExpense - costOptimizedRevenue - costOptimizedDeferred;

    return {
      actual: {
        totalExpense: actualExpense,
        totalRevenue: actualRevenue,
        deferredPayment: actualDeferred,
        fundingGap: actualGap,
        deferredBreakdown: actualDeferredItems,
      },
      costOptimized: {
        totalExpense: costOptimizedExpense,
        totalRevenue: costOptimizedRevenue,
        deferredPayment: costOptimizedDeferred,
        fundingGap: costOptimizedGap,
        deferredBreakdown: costOptimizedDeferredItems,
      },
      salesInfo: {
        actualSalesAmount,
        preSaleRevenue,
        agencyFee,
        agencyFeePreDelivery,
        agencyFeeTotal,
        landLoanInterest: i.landLoanInterest,
      },
      warnings: {
        constructorOverflow,
        message: warningMessage,
      },
    };
  }, [inputs]);

  return {
    inputs,
    updateInput,
    resetInputs,
    clearMemory,
    result,
  };
}
