export interface SKAClient {
  id: string;
  name: string;
  studio: string;
  contractAmount: number;
  financeRevenue: number;
  serviceCost: number;
  grossProfit: number;
  grossMargin: number;
  lastOrderDays: number;
  isSilent: boolean;
  isNewClient: boolean;
}

export const topClients: SKAClient[] = [
  {
    id: '1',
    name: '华为技术有限公司',
    studio: '数字营销一室',
    contractAmount: 2850000,
    financeRevenue: 2420000,
    serviceCost: 1680000,
    grossProfit: 740000,
    grossMargin: 30.6,
    lastOrderDays: 12,
    isSilent: false,
    isNewClient: false,
  },
  {
    id: '2',
    name: '字节跳动科技',
    studio: '直播电商室',
    contractAmount: 2180000,
    financeRevenue: 1950000,
    serviceCost: 1520000,
    grossProfit: 430000,
    grossMargin: 22.1,
    lastOrderDays: 5,
    isSilent: false,
    isNewClient: true,
  },
  {
    id: '3',
    name: '阿里巴巴集团',
    studio: '数字营销二室',
    contractAmount: 1960000,
    financeRevenue: 1780000,
    serviceCost: 1350000,
    grossProfit: 430000,
    grossMargin: 24.2,
    lastOrderDays: 105,
    isSilent: true,
    isNewClient: false,
  },
  {
    id: '4',
    name: '腾讯科技',
    studio: '内容创意室',
    contractAmount: 1650000,
    financeRevenue: 1480000,
    serviceCost: 1020000,
    grossProfit: 460000,
    grossMargin: 31.1,
    lastOrderDays: 8,
    isSilent: false,
    isNewClient: false,
  },
  {
    id: '5',
    name: '京东集团',
    studio: '直播电商室',
    contractAmount: 1420000,
    financeRevenue: 1280000,
    serviceCost: 980000,
    grossProfit: 300000,
    grossMargin: 23.4,
    lastOrderDays: 95,
    isSilent: true,
    isNewClient: false,
  },
  {
    id: '6',
    name: '美团点评',
    studio: '数字营销一室',
    contractAmount: 1280000,
    financeRevenue: 1150000,
    serviceCost: 820000,
    grossProfit: 330000,
    grossMargin: 28.7,
    lastOrderDays: 15,
    isSilent: false,
    isNewClient: true,
  },
];

export const studioSummary = [
  { name: '数字营销一室', clientCount: 12, totalContract: 4200000, totalRevenue: 3650000, avgMargin: 27.5 },
  { name: '数字营销二室', clientCount: 8, totalContract: 3100000, totalRevenue: 2780000, avgMargin: 25.8 },
  { name: '直播电商室', clientCount: 15, totalContract: 5600000, totalRevenue: 4920000, avgMargin: 22.3 },
  { name: '内容创意室', clientCount: 6, totalContract: 2400000, totalRevenue: 2150000, avgMargin: 29.1 },
];
