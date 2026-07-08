export interface EfficiencyTrend {
  month: string;
  revenuePerPerson: number;
  profitPerPerson: number;
  netProfitPerPerson: number;
}

export const efficiencyTrendData: EfficiencyTrend[] = [
  { month: '2025-07', revenuePerPerson: 185000, profitPerPerson: 42000, netProfitPerPerson: 28000 },
  { month: '2025-08', revenuePerPerson: 192000, profitPerPerson: 45000, netProfitPerPerson: 30000 },
  { month: '2025-09', revenuePerPerson: 188000, profitPerPerson: 43000, netProfitPerPerson: 29000 },
  { month: '2025-10', revenuePerPerson: 195000, profitPerPerson: 47000, netProfitPerPerson: 32000 },
  { month: '2025-11', revenuePerPerson: 201000, profitPerPerson: 49000, netProfitPerPerson: 33500 },
  { month: '2025-12', revenuePerPerson: 208000, profitPerPerson: 51000, netProfitPerPerson: 35000 },
  { month: '2026-01', revenuePerPerson: 198000, profitPerPerson: 46000, netProfitPerPerson: 31000 },
  { month: '2026-02', revenuePerPerson: 185000, profitPerPerson: 41000, netProfitPerPerson: 27500 },
  { month: '2026-03', revenuePerPerson: 202000, profitPerPerson: 48000, netProfitPerPerson: 32800 },
  { month: '2026-04', revenuePerPerson: 210000, profitPerPerson: 52000, netProfitPerPerson: 36000 },
  { month: '2026-05', revenuePerPerson: 215000, profitPerPerson: 54000, netProfitPerPerson: 37500 },
  { month: '2026-06', revenuePerPerson: 218000, profitPerPerson: 55000, netProfitPerPerson: 38000 },
];

export interface CostAllocation {
  studio: string;
  directCost: number;
  middlePlatform: number;
  publicCost: number; // 营收占比法下的公共成本（原始值，切换时动态重算）
  totalCost: number;
  revenue: number;
  headcount: number;  // 当期在职人数
  workHours: number;  // 当期实际交付工时（人天 × 8h）
}

/** 公共固定成本总额，需按选定方式分摊到各工作室 */
export const TOTAL_PUBLIC_COST = 345000;

export const costAllocationData: CostAllocation[] = [
  { studio: '数字营销一室', directCost: 1200000, middlePlatform: 180000, publicCost: 95000,  totalCost: 1475000, revenue: 3650000, headcount: 17, workHours: 2992 },
  { studio: '数字营销二室', directCost: 980000,  middlePlatform: 155000, publicCost: 78000,  totalCost: 1213000, revenue: 2780000, headcount: 13, workHours: 2288 },
  { studio: '直播电商室',  directCost: 1650000, middlePlatform: 220000, publicCost: 112000, totalCost: 1982000, revenue: 4920000, headcount: 24, workHours: 4224 },
  { studio: '内容创意室',  directCost: 780000,  middlePlatform: 120000, publicCost: 60000,  totalCost: 960000,  revenue: 2150000, headcount: 11, workHours: 1936 },
];

export interface StaffingRatio {
  studio: string;
  bdCount: number;
  deliveryCount: number;
  bdRevenue: number;
  deliveryRevenue: number;
}

export const staffingRatioData: StaffingRatio[] = [
  { studio: '数字营销一室', bdCount: 5, deliveryCount: 12, bdRevenue: 1800000, deliveryRevenue: 3650000 },
  { studio: '数字营销二室', bdCount: 4, deliveryCount: 9, bdRevenue: 1400000, deliveryRevenue: 2780000 },
  { studio: '直播电商室', bdCount: 6, deliveryCount: 18, bdRevenue: 2200000, deliveryRevenue: 4920000 },
  { studio: '内容创意室', bdCount: 3, deliveryCount: 8, bdRevenue: 950000, deliveryRevenue: 2150000 },
];
