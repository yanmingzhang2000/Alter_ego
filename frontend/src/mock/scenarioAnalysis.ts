import { DIVISION } from './organization';

export interface RoleConfig {
  role: string;
  label: string;
  avgMonthlyCost: number;
  avgMonthlyRevenue: number;
}

export const ROLE_CONFIGS: RoleConfig[] = [
  { role: 'bd',   label: 'BD销售',    avgMonthlyCost: 25000, avgMonthlyRevenue: 180000 },
  { role: 'cm',   label: 'CM客户经理', avgMonthlyCost: 22000, avgMonthlyRevenue: 0 },
  { role: 'ao',   label: 'AO优化师',   avgMonthlyCost: 18000, avgMonthlyRevenue: 0 },
  { role: 'pm',   label: 'PM项目经理', avgMonthlyCost: 24000, avgMonthlyRevenue: 0 },
  { role: 'kol',  label: 'KOL运营',    avgMonthlyCost: 20000, avgMonthlyRevenue: 0 },
];

export interface StudioBaseline {
  studio: string;
  headcount: number;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  businessLines: {
    name: string;
    code: string;
    headcount: number;
    monthlyRevenue: number;
    monthlyCost: number;
    monthlyProfit: number;
  }[];
}

function buildStudioBaselines(): StudioBaseline[] {
  const raw: Record<string, Omit<StudioBaseline, 'businessLines'>> = {
    '数字营销一室': { studio: '数字营销一室', headcount: 17, monthlyRevenue: 3650000, monthlyCost: 1475000, monthlyProfit: 2175000 },
    '数字营销二室': { studio: '数字营销二室', headcount: 13, monthlyRevenue: 2780000, monthlyCost: 1213000, monthlyProfit: 1567000 },
    '直播电商室':   { studio: '直播电商室',   headcount: 24, monthlyRevenue: 4920000, monthlyCost: 1982000, monthlyProfit: 2938000 },
    '内容创意室':   { studio: '内容创意室',   headcount: 11, monthlyRevenue: 2150000, monthlyCost: 960000,  monthlyProfit: 1190000 },
  };

  const blSplit: Record<string, Record<string, { headcount: number; monthlyRevenue: number; monthlyCost: number }>> = {
    '数字营销一室': {
      DMC: { headcount: 17, monthlyRevenue: 3650000, monthlyCost: 1475000 },
    },
    '数字营销二室': {
      DMC: { headcount: 13, monthlyRevenue: 2780000, monthlyCost: 1213000 },
    },
    '直播电商室': {
      ECP:  { headcount: 14, monthlyRevenue: 2950000, monthlyCost: 1180000 },
      LIVE: { headcount: 10, monthlyRevenue: 1970000, monthlyCost: 802000 },
    },
    '内容创意室': {
      CMC: { headcount: 11, monthlyRevenue: 2150000, monthlyCost: 960000 },
    },
  };

  return DIVISION.studios.map((studio) => {
    const r = raw[studio.name];
    const splits = blSplit[studio.name] || {};
    const businessLines = studio.businessLines.map((bl) => {
      const s = splits[bl.code] || { headcount: 0, monthlyRevenue: 0, monthlyCost: 0 };
      return {
        name: bl.name,
        code: bl.code,
        ...s,
        monthlyProfit: s.monthlyRevenue - s.monthlyCost,
      };
    });
    return { ...r, businessLines };
  });
}

export const STUDIO_BASELINES: StudioBaseline[] = buildStudioBaselines();

export interface ClientProject {
  id: string;
  name: string;
  studio: string;
  businessLine: string;
  monthlyRevenue: number;
  monthlyCost: number;
  grossMargin: number;
}

export const CLIENT_PROJECTS: ClientProject[] = [
  { id: '1',  name: '华为技术有限公司',   studio: '数字营销一室', businessLine: 'DMC', monthlyRevenue: 237500, monthlyCost: 165000, grossMargin: 30.5 },
  { id: '2',  name: '字节跳动科技',       studio: '直播电商室',   businessLine: 'ECP', monthlyRevenue: 181700, monthlyCost: 141500, grossMargin: 22.1 },
  { id: '3',  name: '阿里巴巴集团',       studio: '数字营销二室', businessLine: 'DMC', monthlyRevenue: 163300, monthlyCost: 112500, grossMargin: 31.1 },
  { id: '4',  name: '腾讯科技',           studio: '内容创意室',   businessLine: 'CMC', monthlyRevenue: 137500, monthlyCost: 85000,  grossMargin: 38.2 },
  { id: '5',  name: '京东集团',           studio: '直播电商室',   businessLine: 'LIVE', monthlyRevenue: 118300, monthlyCost: 91000,  grossMargin: 23.1 },
  { id: '6',  name: '美团点评',           studio: '数字营销一室', businessLine: 'DMC', monthlyRevenue: 106700, monthlyCost: 78000,  grossMargin: 26.9 },
  { id: '7',  name: '小红书',             studio: '内容创意室',   businessLine: 'CMC', monthlyRevenue: 81700,  monthlyCost: 52000,  grossMargin: 36.3 },
  { id: '8',  name: '拼多多',             studio: '直播电商室',   businessLine: 'ECP', monthlyRevenue: 93300,  monthlyCost: 71000,  grossMargin: 23.9 },
  { id: '9',  name: '网易',               studio: '数字营销二室', businessLine: 'DMC', monthlyRevenue: 71700,  monthlyCost: 49000,  grossMargin: 31.7 },
  { id: '10', name: '快手',               studio: '直播电商室',   businessLine: 'LIVE', monthlyRevenue: 58300,  monthlyCost: 44000,  grossMargin: 24.5 },
];
