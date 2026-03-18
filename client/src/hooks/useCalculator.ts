import { useState, useMemo } from 'react';

/* ===================================================================
 * 營建雙平台資金缺口與稅務規劃試算 — 計算引擎 v6
 *
 * v7 修正：
 * - 客戶代辦費收入 = 每戶代辦費 × 總戶數 × 銷售完成率
 * - 新增「建設交屋後款項(衛浴等)」欄位，僅在情境二可延後付款
 * v6 修正：
 * - 項目3：建設總支出 = 施工成本 + 建融利息 + 撥款前代銷費用
 *   撥款前代銷費用 = 總銷 × 代銷比例 × 完成率 × (1 - 交屋後支付比例)
 * - 項目5：建融撥款欄位在建設支出與資金流入共用
 * - 項目6：營造廠成本調整 + 建設端成本調整 → 合併為「增加成本」
 *          營造廠延後付款比例 → 營造廠延後付款金額
 * - 項目7：移除稅務效益分析
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

  // ── 建設總支出（實際成本）──
  constructionCost: number;
  constructionLoanRate: number;       // 建融利率（0-1）
  constructionDurationYears: number;  // 興建時間（年）
  constructionLoanInterest: number;   // 自動計算：建融額度 × 建融利率 × 1/2 × 興建時間

  // ── 建融撥款（建設支出與資金流入共用）──
  constructionLoan: number;

  // ── 可延後付款項目 ──
  steelMaterial: number;
  publicLobby: number;
  vendorFinalPayment: number;
  registrationFees: number;
  constructorFixedExpense: number;
  agencyPostDeliveryPct: number;

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

  constructionCost: 218991554,
  constructionLoanRate: 0.045,        // 預設 4.5%
  constructionDurationYears: 2.5,     // 預設 2.5 年
  constructionLoanInterest: 4702500,  // 自動計算

  constructionLoan: 104500000,

  steelMaterial: 20703712,
  publicLobby: 3150000,
  vendorFinalPayment: 3000000,
  registrationFees: 2500000,
  constructorFixedExpense: 5600000,
  agencyPostDeliveryPct: 0.4,

  extraCost: 65000000,                // 增加成本（合併）
  constructorDeferredAmount: 9000000, // 營造廠延後付款金額
  postDeliveryBathroom: 5000000,      // 建設交屋後款項(衛浴等)

  constructorIncomeStd: 0.08,
  corpTaxRate: 0.20,
  dividendTaxRate: 0.28,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<ProjectInputs>(defaultInputs);

  const updateInput = <K extends keyof ProjectInputs>(key: K, value: ProjectInputs[K]) => {
    setInputs(prev => {
      const updated = { ...prev, [key]: value };
      // 自動計算建融利息（建融撥款 × 利率 × 0.5 × 時間）
      if (key === 'constructionLoanRate' || key === 'constructionDurationYears' || key === 'constructionLoan') {
        updated.constructionLoanInterest = updated.constructionLoan * updated.constructionLoanRate * 0.5 * updated.constructionDurationYears;
      }
      return updated;
    });
  };

  const resetInputs = () => {
    const reset = { ...defaultInputs };
    reset.constructionLoanInterest = reset.constructionLoan * reset.constructionLoanRate * 0.5 * reset.constructionDurationYears;
    setInputs(reset);
  };

  const result = useMemo<CalculationResult>(() => {
    const i = inputs;

    // ═══ 銷售參數計算 ═══
    const actualSalesAmount = i.totalSalesAmount * i.salesCompletionRate;
    const preSaleRevenue = actualSalesAmount * i.preSaleRevenueRate;
    // 代銷費用 = 建案總銷售金額 × 代銷費用比例 × 銷售完成率
    const agencyFee = i.totalSalesAmount * i.agencyFeeRate * i.salesCompletionRate;
    // 撥款前代銷費用 = 代銷費用 × (1 - 交屋後支付比例)
    const agencyFeePreDelivery = agencyFee * (1 - i.agencyPostDeliveryPct);
    // v7修正：客戶代辦費收入 = 每戶代辦費 × 總戶數 × 銷售完成率
    const agencyFeeTotal = i.agencyFeePerUnit * i.totalUnits * i.salesCompletionRate;

    // ═══ 檢查警示：增加成本是否超過施工成本 ═══
    const constructorOverflow = i.extraCost > i.constructionCost;
    const warningMessage = constructorOverflow
      ? `⚠️ 警告：增加成本 ${i.extraCost.toLocaleString()} 超過施工成本估算 ${i.constructionCost.toLocaleString()}，請檢查設定`
      : '';

    // ═══ 情境一：實際成本（資金缺口）═══
    // 項目3修正：建設總支出 = 施工成本 + 建融利息 + 撥款前代銷費用
    const actualExpense = i.constructionCost + i.constructionLoanInterest + agencyFeePreDelivery;
    // 項目5：建融撥款同時出現在支出（利息計算）和流入
    const actualRevenue = i.constructionLoan + preSaleRevenue + agencyFeeTotal;

    const agencyDeferred = agencyFee * i.agencyPostDeliveryPct;

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
      { label: '代銷交屋後支付', amount: agencyDeferred },
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
      },
      warnings: {
        constructorOverflow,
        message: warningMessage,
      },
    };
  }, [inputs]);

  return { inputs, updateInput, resetInputs, result };
}
