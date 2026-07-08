import { topClients } from './skaData';
import { efficiencyTrendData, costAllocationData, staffingRatioData } from './humanEfficiency';
import { monthlySnapshot, dataConfidenceData, supportLedgerData } from './reconciliation';

export type InsightSeverity = 'critical' | 'warning' | 'info' | 'positive';

export interface Insight {
  id: string;
  category: string;
  icon: string;
  severity: InsightSeverity;
  title: string;
  content: string;
  detail: string;
}

function generateInsights(): Insight[] {
  const insights: Insight[] = [];

  // ── 经营总览 ──
  const latest = efficiencyTrendData[efficiencyTrendData.length - 1];
  const prev = efficiencyTrendData[efficiencyTrendData.length - 2];
  const revenueGrowth = prev
    ? ((latest.revenuePerPerson - prev.revenuePerPerson) / prev.revenuePerPerson * 100).toFixed(1)
    : '0';

  const marginTrend = latest.profitPerPerson > prev?.profitPerPerson ? '向好' : '下滑';

  insights.push({
    id: 'overview-1',
    category: '经营总览',
    icon: '📊',
    severity: 'info',
    title: '本月经营概览',
    content: `本月营收 ¥${(monthlySnapshot.totalRevenue / 10000).toFixed(0)}万，毛利率 ${monthlySnapshot.grossMargin}%，管理 ${monthlySnapshot.clientCount} 家客户。人均营收 ¥${(latest.revenuePerPerson / 10000).toFixed(1)}万，环比增长 ${revenueGrowth}%，效能趋势${marginTrend}。`,
    detail: `毛利 ¥${(monthlySnapshot.grossProfit / 10000).toFixed(0)}万，新增客户 ${monthlySnapshot.newClientCount} 家，流失 ${monthlySnapshot.lostClientCount} 家。`,
  });

  // ── 客户风险 ──
  const silentClients = topClients.filter((c) => c.isSilent);
  if (silentClients.length > 0) {
    const silentRevenue = silentClients.reduce((s, c) => s + c.financeRevenue, 0);
    insights.push({
      id: 'risk-silent',
      category: '客户风险',
      icon: '🚨',
      severity: 'critical',
      title: `${silentClients.length} 家核心客户进入沉默状态`,
      content: `${silentClients.map((c) => `${c.name}（${c.lastOrderDays}天未下单）`).join('、')}，合计营收 ¥${(silentRevenue / 10000).toFixed(0)}万面临流失风险。`,
      detail: `沉默客户占 SKA 客户总数的 ${Math.round(silentClients.length / topClients.length * 100)}%，贡献营收占比 ${Math.round(silentRevenue / monthlySnapshot.totalRevenue * 100)}%。建议本周安排客户成功团队主动回访，了解客户最新需求动态。`,
    });
  }

  const negativeClients = topClients.filter((c) => c.grossMargin < 0);
  if (negativeClients.length > 0) {
    insights.push({
      id: 'risk-negative',
      category: '客户风险',
      icon: '⚠️',
      severity: 'warning',
      title: `${negativeClients.length} 家客户毛利为负`,
      content: `${negativeClients.map((c) => `${c.name}（毛利率 ${c.grossMargin}%）`).join('、')}，正在亏损服务。`,
      detail: `负毛利客户意味着服务成本超过收入，长期持续将侵蚀整体利润。建议评估是否需要调整报价或优化交付流程以降低成本。`,
    });
  }

  // ── 效能趋势 ──
  const sixMonthsAgo = efficiencyTrendData[efficiencyTrendData.length - 7];
  const revenueGrowth6m = ((latest.revenuePerPerson - sixMonthsAgo.revenuePerPerson) / sixMonthsAgo.revenuePerPerson * 100).toFixed(1);
  const profitGrowth6m = ((latest.netProfitPerPerson - sixMonthsAgo.netProfitPerPerson) / sixMonthsAgo.netProfitPerPerson * 100).toFixed(1);

  insights.push({
    id: 'efficiency-trend',
    category: '效能趋势',
    icon: '📈',
    severity: Number(revenueGrowth6m) > 10 ? 'positive' : 'info',
    title: '人均效能半年持续提升',
    content: `人均营收近6个月从 ¥${(sixMonthsAgo.revenuePerPerson / 10000).toFixed(1)}万增长至 ¥${(latest.revenuePerPerson / 10000).toFixed(1)}万，增幅 ${revenueGrowth6m}%；人均净利增幅 ${profitGrowth6m}%。`,
    detail: `效能提升主要来源于业务结构优化和交付效率改善。建议继续保持当前的人力配置策略，同时关注边际效益递减风险。`,
  });

  // ── 成本结构 ──
  const sortedByCost = [...costAllocationData].sort((a, b) => b.totalCost - a.totalCost);
  const highestCostStudio = sortedByCost[0];
  const totalCostAll = costAllocationData.reduce((s, d) => s + d.totalCost, 0);
  const costRatio = Math.round(highestCostStudio.totalCost / totalCostAll * 100);

  insights.push({
    id: 'cost-structure',
    category: '成本结构',
    icon: '💰',
    severity: costRatio > 35 ? 'warning' : 'info',
    title: `${highestCostStudio.studio}成本占比最高`,
    content: `${highestCostStudio.studio}总成本 ¥${(highestCostStudio.totalCost / 10000).toFixed(0)}万，占全部工作室成本的 ${costRatio}%。`,
    detail: `该工作室直接成本 ¥${(highestCostStudio.directCost / 10000).toFixed(0)}万，中台成本 ¥${(highestCostStudio.middlePlatform / 10000).toFixed(0)}万，分摊公共成本 ¥${(highestCostStudio.publicCost / 10000).toFixed(0)}万。其营收 ¥${(highestCostStudio.revenue / 10000).toFixed(0)}万，成本收入比 ${Math.round(highestCostStudio.totalCost / highestCostStudio.revenue * 100)}%。`,
  });

  // ── 人效诊断 ──
  const imbalanced = staffingRatioData.filter((s) => {
    const ratio = s.deliveryCount / s.bdCount;
    return ratio > 3 || ratio < 1.5;
  });

  if (imbalanced.length > 0) {
    insights.push({
      id: 'staffing-issue',
      category: '人效诊断',
      icon: '👥',
      severity: 'warning',
      title: `${imbalanced.length} 个工作室BD:交付比失衡`,
      content: imbalanced.map((s) => {
        const ratio = (s.deliveryCount / s.bdCount).toFixed(1);
        return `${s.studio}（${s.bdCount}:${s.deliveryCount}，即1:${ratio}）`;
      }).join('、'),
      detail: `理想的 BD:交付比为 1:2~1:3。比值过高意味着销售产能不足，可能导致商机转化瓶颈；比值过低则意味着交付资源闲置。建议根据各工作室业务量动态调整人员配比。`,
    });
  }

  const bestStudio = [...staffingRatioData].sort((a, b) => {
    const ratioA = a.bdRevenue / a.bdCount;
    const ratioB = b.bdRevenue / b.bdCount;
    return ratioB - ratioA;
  })[0];

  insights.push({
    id: 'best-bd',
    category: '人效诊断',
    icon: '🏆',
    severity: 'positive',
    title: `${bestStudio.studio}BD人效最高`,
    content: `BD人均营收 ¥${(bestStudio.bdRevenue / bestStudio.bdCount / 10000).toFixed(1)}万，领先其他工作室。`,
    detail: `该工作室 ${bestStudio.bdCount} 名BD贡献了 ¥${(bestStudio.bdRevenue / 10000).toFixed(0)}万营收，人均产出优异。建议将其BD打法（客户开拓策略、转化流程）沉淀为最佳实践，向其他工作室推广。`,
  });

  // ── 数据质量 ──
  const mismatched = dataConfidenceData.filter((d) => d.status === 'mismatch');
  if (mismatched.length > 0) {
    const totalDiff = mismatched.reduce((s, d) => s + d.difference, 0);
    insights.push({
      id: 'data-quality',
      category: '数据质量',
      icon: '🔍',
      severity: mismatched.length >= 2 ? 'warning' : 'info',
      title: `CRM与财务系统 ${mismatched.length} 项数据不一致`,
      content: `${mismatched.map((d) => `${d.metric}偏差 ¥${(d.difference / 10000).toFixed(1)}万`).join('、')}，合计偏差 ¥${(totalDiff / 10000).toFixed(1)}万。`,
      detail: `数据一致率仅 ${Math.round((dataConfidenceData.length - mismatched.length) / dataConfidenceData.length * 100)}%。不一致数据会影响经营决策的准确性，建议在月度经营会议上优先对齐偏差项，并推动系统间数据自动校验机制。`,
    });
  }

  // ── 跨室协作 ──
  if (supportLedgerData.length > 0) {
    const totalSettlement = supportLedgerData.reduce((s, d) => s + d.settlementAmount, 0);
    const studioSettlements = new Map<string, number>();
    supportLedgerData.forEach((d) => {
      studioSettlements.set(d.toStudio, (studioSettlements.get(d.toStudio) || 0) + d.settlementAmount);
    });
    const maxReceiver = [...studioSettlements.entries()].sort((a, b) => b[1] - a[1])[0];

    insights.push({
      id: 'cross-studio',
      category: '跨室协作',
      icon: '🤝',
      severity: 'info',
      title: `本月 ${supportLedgerData.length} 笔跨室支援，结算 ¥${(totalSettlement / 10000).toFixed(1)}万`,
      content: `${maxReceiver[0]}为最大受援方，接收支援 ¥${(maxReceiver[1] / 10000).toFixed(1)}万。`,
      detail: `跨工作室支援是业务协同的重要体现，但也反映了各工作室资源余缺不均。建议在月度复盘中讨论：是否需要长期化某些支援关系，还是通过内部调配解决结构性资源缺口。`,
    });
  }

  // ── 行动建议 ──
  insights.push({
    id: 'action-1',
    category: '行动建议',
    icon: '✅',
    severity: 'critical',
    title: '【本周】启动沉默客户回访计划',
    content: `优先回访 ${silentClients.map((c) => c.name).join('、')}，了解客户最新需求和合作意向。`,
    detail: `建议由客户成功经理在 3 个工作日内完成首轮触达，重点了解：1）客户业务变化；2）未续约原因；3）竞品动态。回访结果更新至 CRM 并在下周经营会上汇报。`,
  });

  insights.push({
    id: 'action-2',
    category: '行动建议',
    icon: '✅',
    severity: 'warning',
    title: '【本月】推动数据对齐专项',
    content: `解决 CRM 与财务系统 ${mismatched.length} 项数据偏差，目标一致率提升至 90% 以上。`,
    detail: `建议由数据团队牵头，逐项排查偏差原因（录入时间差、口径差异、系统 bug），制定标准化对账流程，避免月度重复劳动。`,
  });

  insights.push({
    id: 'action-3',
    category: '行动建议',
    icon: '✅',
    severity: 'warning',
    title: '【本月】优化失衡工作室人员配比',
    content: `针对 ${imbalanced.map((s) => s.studio).join('、')} 的 BD:交付比问题，制定人员调整方案。`,
    detail: `建议结合各工作室 Q3 业务预测，评估是否需要内部调岗或外部招聘。目标是在不影响交付质量的前提下，将 BD:交付比调整至 1:2~1:3 的健康区间。`,
  });

  return insights;
}

export const agentInsights: Insight[] = generateInsights();

export const agentMetadata = {
  generatedAt: new Date().toISOString(),
  dataRange: `${efficiencyTrendData[0].month} ~ ${latest_month()}`,
  sourceCount: 4,
  sourceNames: ['CRM 客户管理系统', 'BPMS 项目管理系统', 'TFG 财务核算系统', 'Galaxy 数据平台'],
};

function latest_month(): string {
  return efficiencyTrendData[efficiencyTrendData.length - 1].month;
}
