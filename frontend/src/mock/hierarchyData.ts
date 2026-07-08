import { DIVISION, BusinessLine } from './organization';
import { topClients, SKAClient } from './skaData';
import { costAllocationData, staffingRatioData } from './humanEfficiency';

// 业务线级汇总
export interface BusinessLineSummary {
  code: string;
  name: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  clientCount: number;
  headcount: number;
  bdCount: number;
  deliveryCount: number;
}

// 工作室级汇总
export interface StudioDetail {
  name: string;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  clientCount: number;
  headcount: number;
  bdCount: number;
  deliveryCount: number;
  businessLines: BusinessLineSummary[];
}

// 事业部级汇总
export interface DivisionDetail {
  name: string;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  clientCount: number;
  headcount: number;
  bdCount: number;
  deliveryCount: number;
  studios: StudioDetail[];
}

// 工作室×业务线交叉矩阵数据
export interface CrossMatrixCell {
  studioName: string;
  businessLineCode: string;
  businessLineName: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  clientCount: number;
  headcount: number;
}

export interface CrossMatrix {
  studios: string[];
  businessLines: { code: string; name: string }[];
  cells: CrossMatrixCell[];
  rowTotals: Record<string, { revenue: number; cost: number; profit: number; clientCount: number }>;
  colTotals: Record<string, { revenue: number; cost: number; profit: number; clientCount: number }>;
  grandTotal: { revenue: number; cost: number; profit: number; clientCount: number };
}

function getStudioCost(studioName: string) {
  return costAllocationData.find((c) => c.studio === studioName);
}

function getStudioStaffing(studioName: string) {
  return staffingRatioData.find((s) => s.studio === studioName);
}

function getBusinessLineCost(studioName: string, blCode: string) {
  const studioCost = getStudioCost(studioName);
  return studioCost?.businessLines.find((bl) => bl.code === blCode);
}

function getBusinessLineStaffing(studioName: string, blCode: string) {
  const studioStaffing = getStudioStaffing(studioName);
  return studioStaffing?.businessLines.find((bl) => bl.code === blCode);
}

function getStudioClients(studioName: string): SKAClient[] {
  return topClients.filter((c) => c.studio === studioName);
}

function getBusinessLineClients(studioName: string, blCode: string): SKAClient[] {
  return topClients.filter((c) => c.studio === studioName && c.businessLine === blCode);
}

// 计算业务线级汇总
function buildBusinessLineSummary(studioName: string, bl: BusinessLine): BusinessLineSummary {
  const clients = getBusinessLineClients(studioName, bl.code);
  const costData = getBusinessLineCost(studioName, bl.code);
  const staffingData = getBusinessLineStaffing(studioName, bl.code);

  const revenue = clients.reduce((sum, c) => sum + c.financeRevenue, 0);
  const cost = costData?.directCost ?? 0;
  const profit = clients.reduce((sum, c) => sum + c.grossProfit, 0);
  const margin = revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0;

  return {
    code: bl.code,
    name: bl.name,
    revenue,
    cost,
    profit,
    margin,
    clientCount: clients.length,
    headcount: staffingData?.deliveryCount ?? 0,
    bdCount: staffingData?.bdCount ?? 0,
    deliveryCount: staffingData?.deliveryCount ?? 0,
  };
}

// 计算工作室级汇总
function buildStudioDetail(studio: typeof DIVISION.studios[0]): StudioDetail {
  const studioCost = getStudioCost(studio.name);
  const studioStaffing = getStudioStaffing(studio.name);
  const clients = getStudioClients(studio.name);

  const totalRevenue = studioCost?.revenue ?? clients.reduce((sum, c) => sum + c.financeRevenue, 0);
  const totalCost = studioCost?.totalCost ?? 0;
  const grossProfit = clients.reduce((sum, c) => sum + c.grossProfit, 0);
  const grossMargin = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0;

  return {
    name: studio.name,
    totalRevenue,
    totalCost,
    grossProfit,
    grossMargin,
    clientCount: clients.length,
    headcount: studioCost?.headcount ?? 0,
    bdCount: studioStaffing?.bdCount ?? 0,
    deliveryCount: studioStaffing?.deliveryCount ?? 0,
    businessLines: studio.businessLines.map((bl) => buildBusinessLineSummary(studio.name, bl)),
  };
}

// 计算事业部级汇总
export function buildDivisionDetail(): DivisionDetail {
  const studios = DIVISION.studios.map(buildStudioDetail);

  const totalRevenue = studios.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalCost = studios.reduce((sum, s) => sum + s.totalCost, 0);
  const grossProfit = studios.reduce((sum, s) => sum + s.grossProfit, 0);
  const grossMargin = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0;
  const clientCount = studios.reduce((sum, s) => sum + s.clientCount, 0);
  const headcount = studios.reduce((sum, s) => sum + s.headcount, 0);
  const bdCount = studios.reduce((sum, s) => sum + s.bdCount, 0);
  const deliveryCount = studios.reduce((sum, s) => sum + s.deliveryCount, 0);

  return {
    name: DIVISION.name,
    totalRevenue,
    totalCost,
    grossProfit,
    grossMargin,
    clientCount,
    headcount,
    bdCount,
    deliveryCount,
    studios,
  };
}

// 构建工作室×业务线交叉矩阵
export function buildCrossMatrix(): CrossMatrix {
  const studioNames = DIVISION.studios.map((s) => s.name);
  const allBusinessLines = Array.from(
    new Map(
      DIVISION.studios.flatMap((s) => s.businessLines).map((bl) => [bl.code, bl])
    ).values()
  );

  const cells: CrossMatrixCell[] = [];
  const rowTotals: Record<string, { revenue: number; cost: number; profit: number; clientCount: number }> = {};
  const colTotals: Record<string, { revenue: number; cost: number; profit: number; clientCount: number }> = {};

  studioNames.forEach((studioName) => {
    rowTotals[studioName] = { revenue: 0, cost: 0, profit: 0, clientCount: 0 };
  });
  allBusinessLines.forEach((bl) => {
    colTotals[bl.code] = { revenue: 0, cost: 0, profit: 0, clientCount: 0 };
  });

  const grandTotal = { revenue: 0, cost: 0, profit: 0, clientCount: 0 };

  DIVISION.studios.forEach((studio) => {
    studio.businessLines.forEach((bl) => {
      const clients = getBusinessLineClients(studio.name, bl.code);
      const costData = getBusinessLineCost(studio.name, bl.code);

      const revenue = clients.reduce((sum, c) => sum + c.financeRevenue, 0);
      const cost = costData?.directCost ?? 0;
      const profit = clients.reduce((sum, c) => sum + c.grossProfit, 0);
      const margin = revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0;
      const headcount = costData?.headcount ?? 0;

      cells.push({
        studioName: studio.name,
        businessLineCode: bl.code,
        businessLineName: bl.name,
        revenue,
        cost,
        profit,
        margin,
        clientCount: clients.length,
        headcount,
      });

      rowTotals[studio.name].revenue += revenue;
      rowTotals[studio.name].cost += cost;
      rowTotals[studio.name].profit += profit;
      rowTotals[studio.name].clientCount += clients.length;

      colTotals[bl.code].revenue += revenue;
      colTotals[bl.code].cost += cost;
      colTotals[bl.code].profit += profit;
      colTotals[bl.code].clientCount += clients.length;

      grandTotal.revenue += revenue;
      grandTotal.cost += cost;
      grandTotal.profit += profit;
      grandTotal.clientCount += clients.length;
    });
  });

  return {
    studios: studioNames,
    businessLines: allBusinessLines,
    cells,
    rowTotals,
    colTotals,
    grandTotal,
  };
}

// 根据筛选条件构建层级数据
export function buildFilteredHierarchy(
  studioFilter: string | null,
  businessLineFilter: string | null
): { division: DivisionDetail; crossMatrix: CrossMatrix } {
  const division = buildDivisionDetail();
  const crossMatrix = buildCrossMatrix();

  if (studioFilter) {
    const filteredStudio = division.studios.find((s) => s.name === studioFilter);
    if (filteredStudio) {
      return {
        division: {
          ...division,
          totalRevenue: filteredStudio.totalRevenue,
          totalCost: filteredStudio.totalCost,
          grossProfit: filteredStudio.grossProfit,
          grossMargin: filteredStudio.grossMargin,
          clientCount: filteredStudio.clientCount,
          headcount: filteredStudio.headcount,
          bdCount: filteredStudio.bdCount,
          deliveryCount: filteredStudio.deliveryCount,
          studios: [filteredStudio],
        },
        crossMatrix: {
          ...crossMatrix,
          studios: [studioFilter],
          cells: crossMatrix.cells.filter((c) => c.studioName === studioFilter),
          rowTotals: { [studioFilter]: crossMatrix.rowTotals[studioFilter] },
        },
      };
    }
  }

  if (businessLineFilter) {
    const filteredStudios = division.studios
      .map((s) => ({
        ...s,
        businessLines: s.businessLines.filter((bl) => bl.code === businessLineFilter),
        totalRevenue: s.businessLines
          .filter((bl) => bl.code === businessLineFilter)
          .reduce((sum, bl) => sum + bl.revenue, 0),
        totalCost: s.businessLines
          .filter((bl) => bl.code === businessLineFilter)
          .reduce((sum, bl) => sum + bl.cost, 0),
        grossProfit: s.businessLines
          .filter((bl) => bl.code === businessLineFilter)
          .reduce((sum, bl) => sum + bl.profit, 0),
        clientCount: s.businessLines
          .filter((bl) => bl.code === businessLineFilter)
          .reduce((sum, bl) => sum + bl.clientCount, 0),
      }))
      .filter((s) => s.businessLines.length > 0);

    const totalRevenue = filteredStudios.reduce((sum, s) => sum + s.totalRevenue, 0);
    const totalCost = filteredStudios.reduce((sum, s) => sum + s.totalCost, 0);
    const grossProfit = filteredStudios.reduce((sum, s) => sum + s.grossProfit, 0);

    return {
      division: {
        ...division,
        totalRevenue,
        totalCost,
        grossProfit,
        grossMargin: totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0,
        clientCount: filteredStudios.reduce((sum, s) => sum + s.clientCount, 0),
        studios: filteredStudios,
      },
      crossMatrix: {
        ...crossMatrix,
        cells: crossMatrix.cells.filter((c) => c.businessLineCode === businessLineFilter),
        colTotals: { [businessLineFilter]: crossMatrix.colTotals[businessLineFilter] },
      },
    };
  }

  return { division, crossMatrix };
}
