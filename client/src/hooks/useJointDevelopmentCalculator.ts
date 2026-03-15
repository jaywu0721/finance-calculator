import { useState, useCallback } from 'react';

export interface JointDevInputs {
  // 銷售相關
  saleArea: number;           // 銷售坪數
  salePrice: number;          // 每坪售價
  parkQty: number;            // 車位數量
  parkPrice: number;          // 車位單價

  // 土地相關
  landArea: number;           // 土地坪數
  landPrice: number;          // 土地單價
  landCost2: number;          // 土地成本2（實際地主成本）
  landYears: number;          // 土地時間（年）
  landRate: number;           // 土地年利率

  // 建物相關
  buildArea: number;          // 建坪
  buildUnit: number;          // 營造單價（建物成本1）
  buildYears: number;         // 建物時間（年）
  buildRate: number;          // 建物年利率
  buildInterest2: number;     // 建物利息2（實際貸款利息）

  // 合建相關
  salesFeeRate: number;       // 代銷抽成（%）
  devPct: number;             // 合建比例：建設（%）
  targetMargin: number;       // 目標利潤率
  extraTaxRate: number;       // 增加成本稅率
}

export interface JointDevResult {
  // 銷售相關
  totalSales: number;         // 總銷金額
  
  // 成本相關
  landCost1: number;          // 土地成本1
  buildCost1: number;         // 建物成本1
  landInterest1: number;      // 土地利息1
  buildInterest1: number;     // 建物利息1
  salesFee: number;           // 銷售費用
  
  // 建物成本2反推
  devSalesAmount: number;     // 建設端分配銷售額
  devSalesFee: number;        // 建設端分攤代銷費
  buildCost2: number;         // 建物成本2（反推）
  buildCost2Unit: number;     // 建物成本2單價
  extraCost: number;          // 增加成本
  
  // 稅務相關
  totalTax: number;           // 總稅金
  
  // 利潤相關
  totalProfit: number;        // 總利潤
  profitRate: number;         // 利潤率
  
  // 合建分配
  devPretax: number;          // 建設稅前盈餘
  devTwoTax: number;          // 建設兩稅合一
  devDistTax: number;         // 建設個人分配額
  devAfterTax: number;        // 建設稅後盈餘
  
  landPretax: number;         // 地主稅前盈餘
  landTwoTax: number;         // 地主兩稅合一
  landDistTax: number;        // 地主個人分配額
  landAfterTax: number;       // 地主稅後盈餘
}

export const useJointDevelopmentCalculator = () => {
  const [inputs, setInputs] = useState<JointDevInputs>({
    saleArea: 1000,
    salePrice: 450000,
    parkQty: 80,
    parkPrice: 1600000,
    landArea: 300,
    landPrice: 350000,
    landCost2: 90000000,
    buildArea: 1600,
    buildUnit: 180000,
    buildYears: 3,
    landYears: 2,
    landRate: 0.03,
    buildRate: 0.03,
    buildInterest2: 12000000,
    salesFeeRate: 0.05,
    devPct: 60,
    targetMargin: 0.11,
    extraTaxRate: 0.09,
  });

  const calculate = useCallback((): JointDevResult => {
    // 1. 計算總銷金額
    const totalSales = inputs.saleArea * inputs.salePrice + inputs.parkQty * inputs.parkPrice;

    // 2. 計算成本
    const landCost1 = inputs.landArea * inputs.landPrice;
    const buildCost1 = inputs.buildArea * inputs.buildUnit;
    const landInterest1 = landCost1 * inputs.landRate * inputs.landYears;
    const buildInterest1 = buildCost1 * inputs.buildRate * inputs.buildYears;
    const salesFee = totalSales * inputs.salesFeeRate;

    // 3. 計算建設端分配
    const devSalesAmount = totalSales * (inputs.devPct / 100);
    const devSalesFee = devSalesAmount * inputs.salesFeeRate;

    // 4. 反推建物成本2
    // buildCost2 = devSalesAmount - devSalesFee - buildInterest2 - (targetMargin × devSalesAmount)
    const buildCost2 = devSalesAmount - devSalesFee - inputs.buildInterest2 - (inputs.targetMargin * devSalesAmount);
    const buildCost2Unit = inputs.buildArea > 0 ? buildCost2 / inputs.buildArea : 0;
    const extraCost = buildCost2 - buildCost1;

    // 5. 計算稅金（簡化版：基於增加成本的稅率）
    const totalTax = (landCost1 + buildCost1 + landInterest1 + buildInterest1) * 0.2 + 
                     (devSalesAmount * inputs.targetMargin) * 0.28 + 
                     (extraCost * inputs.extraTaxRate);

    // 6. 計算利潤
    const totalProfit = totalSales - landCost1 - buildCost1 - (landInterest1 + buildInterest1) - totalTax - salesFee;
    const profitRate = totalSales > 0 ? totalProfit / totalSales : 0;

    // 7. 計算合建分配
    const devPretax = totalProfit * (inputs.devPct / 100);
    const devTwoTax = devPretax * 0.2;
    const devDistTax = devPretax * 0.28;
    const devAfterTax = devPretax - devTwoTax - devDistTax;

    const landPretax = totalProfit * ((100 - inputs.devPct) / 100);
    const landTwoTax = landPretax * 0.2;
    const landDistTax = 0; // 地主通常沒有個人分配額
    const landAfterTax = landPretax - landTwoTax;

    return {
      totalSales,
      landCost1,
      buildCost1,
      landInterest1,
      buildInterest1,
      salesFee,
      devSalesAmount,
      devSalesFee,
      buildCost2,
      buildCost2Unit,
      extraCost,
      totalTax,
      totalProfit,
      profitRate,
      devPretax,
      devTwoTax,
      devDistTax,
      devAfterTax,
      landPretax,
      landTwoTax,
      landDistTax,
      landAfterTax,
    };
  }, [inputs]);

  const updateInput = useCallback((key: keyof JointDevInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const result = calculate();

  return { inputs, updateInput, result };
};
