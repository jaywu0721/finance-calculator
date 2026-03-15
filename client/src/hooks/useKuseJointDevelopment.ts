import { useState, useCallback } from 'react';

export interface KuseJDInputs {
  projectName: string;
  saleArea: number; // 銷售坪數
  salePrice: number; // 每坪售價
  parkQty: number; // 車位數量
  parkPrice: number; // 車位單價
  landArea: number; // 土地坪數
  landPrice: number; // 土地單價
  landCost2: number; // 土地成本2（實際地主成本）
  buildArea: number; // 建坪
  buildUnit: number; // 營造單價（建物成本1）- 滑桿
  landYears: number; // 土地時間（年）- 滑桿
  buildYears: number; // 建物時間（年）- 滑桿
  landRate: number; // 土地年利率
  buildRate: number; // 建物年利率
  interest2: number; // 建物利息2（實際貸款利息）
  salesFeeRate: number; // 代銷抽成（%）
  devPct: number; // 合建比例：建設（%）- 滑桿
  targetMargin: number; // 目標利潤率 - 滑桿
  extraTaxRate: number; // 增加成本稅率
}

export interface KuseJDResults {
  totalSales: number; // 總銷金額
  land1: number; // 土地成本1
  build1: number; // 建物成本1
  landInterest1: number; // 土地利息1
  buildInterest1: number; // 建物利息1
  salesFee: number; // 銷售費用
  build2: number; // 建物成本2
  extraCost: number; // 增加成本
  totalTax: number; // 稅金
  totalProfit: number; // 總利潤
  profitRate: number; // 總利潤率
  
  // 合建分配
  devSalesAlloc: number; // 建設端分配銷售額
  landlorSalesAlloc: number; // 地主分配銷售額
  devSalesFeeAlloc: number; // 建設端分攤代銷費
  
  // 建設端稅務
  devPretax: number; // 建設稅前盈餘
  devTwoTax: number; // 建設兩稅合一
  devDistTax: number; // 建設個人分配額
  devAfterTax: number; // 建設稅後盈餘
  
  // 地主端稅務
  landlordPretax: number; // 地主稅前盈餘
  landlordTwoTax: number; // 地主兩稅合一
  landlordAfterTax: number; // 地主稅後盈餘
  
  // 合建利潤分配
  devProfit1: number; // 建設端利潤（內帳）
  landProfit1: number; // 地主端利潤（內帳）
  devProfit2: number; // 建設端利潤（外帳）
  landProfit2: number; // 地主端利潤（外帳）
  
  // 成本合計
  totalCost1: number; // 內帳成本合計
  totalCost2: number; // 外帳成本合計
  profit1: number; // 內帳利潤
  profit2: number; // 外帳利潤
  interest2: number; // 建物利息2
}

const DEFAULT_INPUTS: KuseJDInputs = {
  projectName: '建案 A',
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
    // 1. 總銷金額
    const totalSales = inputs.saleArea * inputs.salePrice + inputs.parkQty * inputs.parkPrice;

    // 2. 土地成本1
    const land1 = inputs.landArea * inputs.landPrice;

    // 3. 建物成本1
    const build1 = inputs.buildArea * inputs.buildUnit;

    // 4. 土地利息1
    const landInterest1 = land1 * inputs.landRate * inputs.landYears;

    // 5. 建物利息1
    const buildInterest1 = build1 * inputs.buildRate * inputs.buildYears;

    // 6. 銷售費用
    const salesFee = totalSales * inputs.salesFeeRate;

    // 7. 合建分配
    const devSalesAlloc = totalSales * inputs.devPct;
    const landlorSalesAlloc = totalSales * (1 - inputs.devPct);
    const devSalesFeeAlloc = salesFee * inputs.devPct;

    // 8. 建物成本2（由目標利潤率反推）
    const build2 = devSalesAlloc - devSalesFeeAlloc - inputs.interest2 - (inputs.targetMargin * devSalesAlloc);

    // 9. 增加成本
    const extraCost = build2 - build1;

    // 10. 稅金計算（簡化版）
    const devPretax = devSalesAlloc - devSalesFeeAlloc - build1 - buildInterest1 - inputs.interest2;
    const landlordPretax = landlorSalesAlloc - inputs.landCost2 - landInterest1;
    
    const devTwoTax = devPretax * 0.2;
    const devDistTax = devPretax * 0.28;
    const landlordTwoTax = landlordPretax * 0.2;
    
    const extraCostTax = extraCost * inputs.extraTaxRate;
    const totalTax = devTwoTax + devDistTax + landlordTwoTax + extraCostTax;

    // 11. 總利潤
    const totalProfit = totalSales - land1 - build1 - (landInterest1 + buildInterest1) - totalTax - salesFee;

    // 12. 總利潤率
    const profitRate = totalProfit / totalSales;

    // 13. 稅後盈餘
    const devAfterTax = devPretax - devTwoTax - devDistTax;
    const landlordAfterTax = landlordPretax - landlordTwoTax;

    // 內帳成本合計
    const totalCost1 = land1 + landInterest1 + build1 + buildInterest1 + salesFee;
    const profit1 = totalSales - totalCost1;
    
    // 外帳成本合計
    const totalCost2 = inputs.landCost2 + build2 + inputs.interest2 + salesFee;
    const profit2 = totalSales - totalCost2;
    
    // 合建利潤分配
    const devProfit1 = profit1 * inputs.devPct;
    const landProfit1 = profit1 * (1 - inputs.devPct);
    const devProfit2 = profit2 * inputs.devPct;
    const landProfit2 = profit2 * (1 - inputs.devPct);

    return {
      totalSales,
      land1,
      build1,
      landInterest1,
      buildInterest1,
      salesFee,
      build2,
      extraCost,
      totalTax,
      totalProfit,
      profitRate,
      devSalesAlloc,
      landlorSalesAlloc,
      devSalesFeeAlloc,
      devPretax,
      devTwoTax,
      devDistTax,
      devAfterTax,
      landlordPretax,
      landlordTwoTax,
      landlordAfterTax,
      devProfit1,
      landProfit1,
      devProfit2,
      landProfit2,
      totalCost1,
      totalCost2,
      profit1,
      profit2,
      interest2: inputs.interest2,
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
