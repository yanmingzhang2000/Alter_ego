import { DIVISION } from './organization';

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
  publicCost: number;
  totalCost: number;
  revenue: number;
  headcount: number;
  workHours: number;
  businessLines: {
    name: string;
    code: string;
    directCost: number;
    revenue: number;
    headcount: number;
    workHours: number;
  }[];
}

export const TOTAL_PUBLIC_COST = 345000;

function buildCostAllocationData(): CostAllocation[] {
  const studioRaw: Record<string, Omit<CostAllocation, 'businessLines'>> = {
    '数字营销一室': { studio: '数字营销一室', directCost: 1200000, middlePlatform: 180000, publicCost: 95000,  totalCost: 1475000, revenue: 3650000, headcount: 17, workHours: 2992 },
    '数字营销二室': { studio: '数字营销二室', directCost: 980000,  middlePlatform: 155000, publicCost: 78000,  totalCost: 1213000, revenue: 2780000, headcount: 13, workHours: 2288 },
    '直播电商室':   { studio: '直播电商室',   directCost: 1650000, middlePlatform: 220000, publicCost: 112000, totalCost: 1982000, revenue: 4920000, headcount: 24, workHours: 4224 },
    '内容创意室':   { studio: '内容创意室',   directCost: 780000,  middlePlatform: 120000, publicCost: 60000,  totalCost: 960000,  revenue: 2150000, headcount: 11, workHours: 1936 },
  };

  const blSplit: Record<string, Record<string, { revenue: number; headcount: number; workHours: number; directCost: number }>> = {
    '数字营销一室': {
      DMC: { revenue: 3650000, headcount: 17, workHours: 2992, directCost: 1200000 },
    },
    '数字营销二室': {
      DMC: { revenue: 2780000, headcount: 13, workHours: 2288, directCost: 980000 },
    },
    '直播电商室': {
      ECP:  { revenue: 2950000, headcount: 14, workHours: 2464, directCost: 980000 },
      LIVE: { revenue: 1970000, headcount: 10, workHours: 1760, directCost: 670000 },
    },
    '内容创意室': {
      CMC: { revenue: 2150000, headcount: 11, workHours: 1936, directCost: 780000 },
    },
  };

  return DIVISION.studios.map((studio) => {
    const raw = studioRaw[studio.name];
    const splits = blSplit[studio.name] || {};
    const businessLines = studio.businessLines.map((bl) => {
      const s = splits[bl.code] || { revenue: 0, headcount: 0, workHours: 0, directCost: 0 };
      return {
        name: bl.name,
        code: bl.code,
        directCost: s.directCost,
        revenue: s.revenue,
        headcount: s.headcount,
        workHours: s.workHours,
      };
    });
    return { ...raw, businessLines };
  });
}

export const costAllocationData: CostAllocation[] = buildCostAllocationData();

export interface StaffingRatio {
  studio: string;
  bdCount: number;
  deliveryCount: number;
  bdRevenue: number;
  deliveryRevenue: number;
  businessLines: {
    name: string;
    code: string;
    bdCount: number;
    deliveryCount: number;
    bdRevenue: number;
    deliveryRevenue: number;
  }[];
}

function buildStaffingRatioData(): StaffingRatio[] {
  const studioRaw: Record<string, Omit<StaffingRatio, 'businessLines'>> = {
    '数字营销一室': { studio: '数字营销一室', bdCount: 5, deliveryCount: 12, bdRevenue: 1800000, deliveryRevenue: 3650000 },
    '数字营销二室': { studio: '数字营销二室', bdCount: 4, deliveryCount: 9,  bdRevenue: 1400000, deliveryRevenue: 2780000 },
    '直播电商室':   { studio: '直播电商室',   bdCount: 6, deliveryCount: 18, bdRevenue: 2200000, deliveryRevenue: 4920000 },
    '内容创意室':   { studio: '内容创意室',   bdCount: 3, deliveryCount: 8,  bdRevenue: 950000,  deliveryRevenue: 2150000 },
  };

  const blSplit: Record<string, Record<string, { bdCount: number; deliveryCount: number; bdRevenue: number; deliveryRevenue: number }>> = {
    '数字营销一室': {
      DMC: { bdCount: 5, deliveryCount: 12, bdRevenue: 1800000, deliveryRevenue: 3650000 },
    },
    '数字营销二室': {
      DMC: { bdCount: 4, deliveryCount: 9, bdRevenue: 1400000, deliveryRevenue: 2780000 },
    },
    '直播电商室': {
      ECP:  { bdCount: 4, deliveryCount: 10, bdRevenue: 1500000, deliveryRevenue: 2950000 },
      LIVE: { bdCount: 2, deliveryCount: 8,  bdRevenue: 700000,  deliveryRevenue: 1970000 },
    },
    '内容创意室': {
      CMC: { bdCount: 3, deliveryCount: 8, bdRevenue: 950000, deliveryRevenue: 2150000 },
    },
  };

  return DIVISION.studios.map((studio) => {
    const raw = studioRaw[studio.name];
    const splits = blSplit[studio.name] || {};
    const businessLines = studio.businessLines.map((bl) => {
      const s = splits[bl.code] || { bdCount: 0, deliveryCount: 0, bdRevenue: 0, deliveryRevenue: 0 };
      return {
        name: bl.name,
        code: bl.code,
        ...s,
      };
    });
    return { ...raw, businessLines };
  });
}

export const staffingRatioData: StaffingRatio[] = buildStaffingRatioData();
