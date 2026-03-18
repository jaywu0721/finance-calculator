import { useState, useCallback } from 'react';

export interface KuseJDInputs {
  projectName: string;
  saleArea: number;    // 銷售坪數
  salePrice: number;   // 每坪售價
  parkQty: number;     // 車位數量
  parkPrice: number;   // 車位單價
  landArea: number;    // 土地坪數
  landPrice: number;   // 土地單價
  landCost2: number;   // 土地成本2（實際地主成本）
  buildArea: number;   // 建坪
  buildUnit: number;   // 營造單價（建物成本1）- 滑桿
  landYears: number;   // 土地時間（年）- 滑桿
  buildYears: number;  // 建物時間（年）- 滑桿
  landRate: number;    // 土地年利率（用於土地利息1）
  buildRate: number;   // 建物年利率（用於建物利息1）
  interest2: number;   // 建物利息2（實際貸款利息）
  salesFeeRate: number; // 代銷抽成（%），例 0.05
  devPct: number;      // 合建比例：建設（%）- 滑桿，例 0.60
  targetMargin: number; // 目標利潤率 - 滑桿，例 0.11
  extraTaxRate: number; // 增加成本稅率，例 0.09
}

export interface KuseJDResults {
  // 核心結果
  totalSales: number;       // 總銷金額
  totalProfit: number;      // 總利潤
  profitRate: number;       // 總利潤率
  build2: number;           // 建物成本2（由目標利潤率反推）
  build2PerUnit: number;    // 每坪建物成本2單價
  extraCost: number;        // 增加成本（建物成本2 - 建物成本1）

  // 計算明細
  land1: number;            // 土地成本1
  build1: number;           // 建物成本1
  landInterest1: number;    // 土地利息1
  buildInterest1: number;   // 建物利息1
  salesFee: number;         // 銷售費用
  totalTax: number;         // 稅金合計

  // 合建分配與稅務
  devPretax: number;        // 建設稅前盈餘
  devTwoTax: number;        // 建設兩稅合一(20%)
  devDistTax: number;       // 建設個人分配額(28%)
  devAfterTax: number;      // 建設稅後盈餘

  landlordPretax: number;   // 地主稅前盈餘
  landlordTwoTax: number;   // 地主兩稅合一(20%)
  landlordAfterTax: number; // 地主稅後盈餘

  // 中間值（用於顯示）
  extraCostTax: number;     // 增加成本稅
}

const DEFAULT_INPUTS: KuseJDInputs = {
  projectName: '',
  saleArea: 1000,
  salePrice: 450000,
  parkQty: 80,
  parkPrice: 1600000,
  landArea: 300,
  landPrice: 350000,
  landCost2: 90000000,
  buildArea: 1600,
  buildUnit: 180000,
  landYears: 2,
  buildYears: 3,
  landRate: 0.03,
  buildRate: 0.03,
  interest2: 12000000,
  salesFeeRate: 0.05,
  devPct: 0.6,
  targetMargin: 0.11,
  extraTaxRate: 0.09,
};

export function useKuseJointDevelopment() {
  const [inputs, setInputs] = useState<KuseJDInputs>(DEFAULT_INPUTS);

  const updateInput = useCallback((key: keyof KuseJDInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetInputs = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  const calculate = useCallback((): KuseJDResults => {
    // ===== 完全按照 KUSE 原始 JavaScript 邏輯 =====

    // 1) 總銷金額
    const totalSales = inputs.saleArea * inputs.salePrice + inputs.parkQty * inputs.parkPrice;

    // 2) 成本
    const land1 = inputs.landArea * inputs.landPrice;
    const build1 = inputs.buildArea * inputs.buildUnit;

    // 3) 利息1（分別計算）
    const landInterest1 = land1 * inputs.landRate * inputs.landYears;
    const buildInterest1 = build1 * inputs.buildRate * 0.5 * inputs.buildYears;

    // 4) 銷售費用
    const salesFee = totalSales * inputs.salesFeeRate;

    // 5) 建物成本2 反推（建設端基準）
    // 公式：buildCost2 = devSales - devSalesFee - interest2 - targetMargin * devSales
    const devSales = totalSales * inputs.devPct;
    const devSalesFee = salesFee * inputs.devPct;
    const build2 = devSales - devSalesFee - inputs.interest2 - (inputs.targetMargin * devSales);

    const extraCost = build2 - build1;
    const extraCostTax = Math.max(0, extraCost) * inputs.extraTaxRate;

    // 6) 各方稅前盈餘
    const devPretax = devSales - build2 - devSalesFee - inputs.interest2;
    const landlordPretax = (totalSales * (1 - inputs.devPct)) - inputs.landCost2 - (salesFee * (1 - inputs.devPct));

    // 7) 稅務計算
    const devTwoTax = Math.max(0, devPretax) * 0.20;
    const landlordTwoTax = Math.max(0, landlordPretax) * 0.20;
    // 關鍵：個人分配稅 = (稅前盈餘 - 兩稅合一) × 28%
    const devDistTax = Math.max(0, devPretax - devTwoTax) * 0.28;

    const devAfterTax = devPretax - devTwoTax - devDistTax;
    const landlordAfterTax = landlordPretax - landlordTwoTax;

    // 8) 總稅金
    const totalTax = devTwoTax + landlordTwoTax + devDistTax + extraCostTax;

    // 9) 總利潤
    const totalProfit = totalSales - land1 - build1 - (landInterest1 + buildInterest1) - totalTax - salesFee;
    const profitRate = totalSales > 0 ? totalProfit / totalSales : 0;

    // 每坪建物成本2
    const build2PerUnit = inputs.buildArea > 0 ? build2 / inputs.buildArea : 0;

    return {
      totalSales,
      totalProfit,
      profitRate,
      build2,
      build2PerUnit,
      extraCost,
      land1,
      build1,
      landInterest1,
      buildInterest1,
      salesFee,
      totalTax,
      devPretax,
      devTwoTax,
      devDistTax,
      devAfterTax,
      landlordPretax,
      landlordTwoTax,
      landlordAfterTax,
      extraCostTax,
    };
  }, [inputs]);

  const result = calculate();

  return {
    inputs,
    updateInput,
    resetInputs,
    result,
  };
}
