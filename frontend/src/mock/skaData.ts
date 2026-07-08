import { DIVISION, getStudioByName } from './organization';

export type BusinessLineCode = 'CMC' | 'DMC' | 'ECP' | 'LIVE';

export interface SKAClient {
  id: string;
  name: string;
  studio: string;
  businessLine: BusinessLineCode;
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
    businessLine: 'DMC',
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
    businessLine: 'ECP',
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
    businessLine: 'DMC',
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
    businessLine: 'CMC',
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
    businessLine: 'LIVE',
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
    businessLine: 'DMC',
    contractAmount: 1280000,
    financeRevenue: 1150000,
    serviceCost: 820000,
    grossProfit: 330000,
    grossMargin: 28.7,
    lastOrderDays: 15,
    isSilent: false,
    isNewClient: true,
  },
  {
    id: '7',
    name: '小红书',
    studio: '内容创意室',
    businessLine: 'CMC',
    contractAmount: 980000,
    financeRevenue: 870000,
    serviceCost: 580000,
    grossProfit: 290000,
    grossMargin: 33.3,
    lastOrderDays: 20,
    isSilent: false,
    isNewClient: false,
  },
  {
    id: '8',
    name: '拼多多',
    studio: '直播电商室',
    businessLine: 'ECP',
    contractAmount: 1150000,
    financeRevenue: 1020000,
    serviceCost: 780000,
    grossProfit: 240000,
    grossMargin: 23.5,
    lastOrderDays: 35,
    isSilent: false,
    isNewClient: false,
  },
  {
    id: '9',
    name: '网易',
    studio: '数字营销二室',
    businessLine: 'DMC',
    contractAmount: 860000,
    financeRevenue: 750000,
    serviceCost: 520000,
    grossProfit: 230000,
    grossMargin: 30.7,
    lastOrderDays: 10,
    isSilent: false,
    isNewClient: false,
  },
  {
    id: '10',
    name: '快手',
    studio: '直播电商室',
    businessLine: 'LIVE',
    contractAmount: 720000,
    financeRevenue: 630000,
    serviceCost: 480000,
    grossProfit: 150000,
    grossMargin: 23.8,
    lastOrderDays: 88,
    isSilent: false,
    isNewClient: true,
  },
];

export interface StudioSummary {
  name: string;
  clientCount: number;
  totalContract: number;
  totalRevenue: number;
  avgMargin: number;
  businessLines: {
    name: string;
    code: string;
    clientCount: number;
    totalContract: number;
    totalRevenue: number;
    avgMargin: number;
  }[];
}

function buildStudioSummary(): StudioSummary[] {
  return DIVISION.studios.map((studio) => {
    const clients = topClients.filter((c) => c.studio === studio.name);
    const totalContract = clients.reduce((s, c) => s + c.contractAmount, 0);
    const totalRevenue = clients.reduce((s, c) => s + c.financeRevenue, 0);
    const avgMargin = clients.length
      ? clients.reduce((s, c) => s + c.grossMargin, 0) / clients.length
      : 0;

    const businessLines = studio.businessLines.map((bl) => {
      const blClients = clients.filter((c) => c.businessLine === bl.code);
      const blContract = blClients.reduce((s, c) => s + c.contractAmount, 0);
      const blRevenue = blClients.reduce((s, c) => s + c.financeRevenue, 0);
      const blMargin = blClients.length
        ? blClients.reduce((s, c) => s + c.grossMargin, 0) / blClients.length
        : 0;
      return {
        name: bl.name,
        code: bl.code,
        clientCount: blClients.length,
        totalContract: blContract,
        totalRevenue: blRevenue,
        avgMargin: Math.round(blMargin * 10) / 10,
      };
    });

    return {
      name: studio.name,
      clientCount: clients.length,
      totalContract,
      totalRevenue,
      avgMargin: Math.round(avgMargin * 10) / 10,
      businessLines,
    };
  });
}

export const studioSummary: StudioSummary[] = buildStudioSummary();

export const totalClients = topClients.length;
export const totalContract = topClients.reduce((s, c) => s + c.contractAmount, 0);
export const totalRevenue = topClients.reduce((s, c) => s + c.financeRevenue, 0);
