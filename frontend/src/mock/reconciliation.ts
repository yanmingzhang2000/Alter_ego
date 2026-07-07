export interface DataConfidence {
  id: string;
  metric: string;
  crmValue: number;
  galaxyValue: number;
  difference: number;
  status: 'match' | 'mismatch';
}

export const dataConfidenceData: DataConfidence[] = [
  { id: '1', metric: '签约额', crmValue: 15360000, galaxyValue: 15360000, difference: 0, status: 'match' },
  { id: '2', metric: '回款额', crmValue: 12800000, galaxyValue: 12650000, difference: 150000, status: 'mismatch' },
  { id: '3', metric: '财务确认收入', crmValue: 13500000, galaxyValue: 13500000, difference: 0, status: 'match' },
  { id: '4', metric: '广告投放成本', crmValue: 4200000, galaxyValue: 4350000, difference: 150000, status: 'mismatch' },
  { id: '5', metric: '外包交付成本', crmValue: 2800000, galaxyValue: 2800000, difference: 0, status: 'match' },
];

export interface SupportLedger {
  id: string;
  fromStudio: string;
  toStudio: string;
  projectName: string;
  supportDays: number;
  supportPersons: number;
  estimatedCost: number;
  month: string;
}

export const supportLedgerData: SupportLedger[] = [
  { id: '1', fromStudio: '数字营销一室', toStudio: '直播电商室', projectName: '京东618大促', supportDays: 15, supportPersons: 2, estimatedCost: 85000, month: '2026-06' },
  { id: '2', fromStudio: '内容创意室', toStudio: '数字营销二室', projectName: '阿里妈妈内容营销', supportDays: 8, supportPersons: 1, estimatedCost: 32000, month: '2026-06' },
  { id: '3', fromStudio: '直播电商室', toStudio: '数字营销一室', projectName: '美团品牌直播', supportDays: 10, supportPersons: 3, estimatedCost: 120000, month: '2026-06' },
  { id: '4', fromStudio: '数字营销二室', toStudio: '内容创意室', projectName: '腾讯游戏推广', supportDays: 5, supportPersons: 1, estimatedCost: 18000, month: '2026-06' },
];

export interface MonthlySnapshot {
  month: string;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  clientCount: number;
  newClientCount: number;
  lostClientCount: number;
  avgRevenuePerPerson: number;
}

export const monthlySnapshot: MonthlySnapshot = {
  month: '2026-06',
  totalRevenue: 13500000,
  totalCost: 9630000,
  grossProfit: 3870000,
  grossMargin: 28.7,
  clientCount: 41,
  newClientCount: 5,
  lostClientCount: 2,
  avgRevenuePerPerson: 218000,
};
