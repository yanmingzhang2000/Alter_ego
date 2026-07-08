import { topClients } from './skaData';
import { efficiencyTrendData, costAllocationData, staffingRatioData } from './humanEfficiency';
import { monthlySnapshot, supportLedgerData, dataConfidenceData } from './reconciliation';
import { DIVISION } from './organization';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SuggestedQuestion {
  id: string;
  label: string;
  question: string;
}

export const suggestedQuestions: SuggestedQuestion[] = [
  { id: 'q1', label: '本月营收情况', question: '本月整体营收和利润情况怎么样？' },
  { id: 'q2', label: '客户风险', question: '有哪些客户存在流失风险？' },
  { id: 'q3', label: '工作室对比', question: '各工作室的经营表现对比如何？' },
  { id: 'q4', label: '人效分析', question: '人均效能趋势怎样？哪个工作室人效最高？' },
  { id: 'q5', label: '成本结构', question: '成本结构是什么样的？哪个工作室成本最高？' },
  { id: 'q6', label: '业务线分布', question: '各业务线的营收占比是多少？' },
  { id: 'q7', label: '数据质量', question: 'CRM和财务系统数据一致性如何？' },
  { id: 'q8', label: '改善建议', question: '基于当前数据，你有什么改善建议？' },
];

const latest = efficiencyTrendData[efficiencyTrendData.length - 1];
const prev = efficiencyTrendData[efficiencyTrendData.length - 2];
const revenueGrowth = prev
  ? ((latest.revenuePerPerson - prev.revenuePerPerson) / prev.revenuePerPerson * 100).toFixed(1)
  : '0';

function findResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('营收') || lower.includes('利润') || lower.includes('收入') || lower.includes('概览')) {
    return `📊 **本月经营数据**\n\n` +
      `• 总营收：¥${(monthlySnapshot.totalRevenue / 10000).toFixed(0)}万\n` +
      `• 毛利：¥${(monthlySnapshot.grossProfit / 10000).toFixed(0)}万\n` +
      `• 毛利率：${monthlySnapshot.grossMargin}%\n` +
      `• 管理客户数：${monthlySnapshot.clientCount} 家\n` +
      `• 人均营收：¥${(latest.revenuePerPerson / 10000).toFixed(1)}万，环比增长 ${revenueGrowth}%\n\n` +
      `本月新增 ${monthlySnapshot.newClientCount} 家客户，流失 ${monthlySnapshot.lostClientCount} 家。整体经营趋势稳中向好。`;
  }

  if (lower.includes('客户') && (lower.includes('风险') || lower.includes('流失') || lower.includes('沉默'))) {
    const silentClients = topClients.filter((c) => c.isSilent);
    const negativeClients = topClients.filter((c) => c.grossMargin < 0);
    let resp = `🚨 **客户风险预警**\n\n`;
    if (silentClients.length > 0) {
      resp += `**沉默客户（>90天未下单）：**\n`;
      silentClients.forEach((c) => {
        resp += `• ${c.name} — ${c.lastOrderDays}天未下单，年签约额 ¥${(c.contractAmount / 10000).toFixed(0)}万\n`;
      });
      resp += `\n`;
    }
    if (negativeClients.length > 0) {
      resp += `**负毛利客户：**\n`;
      negativeClients.forEach((c) => {
        resp += `• ${c.name} — 毛利率 ${c.grossMargin}%，正在亏损服务\n`;
      });
      resp += `\n`;
    }
    resp += `建议优先回访沉默客户，了解合作意向变化。`;
    return resp;
  }

  if (lower.includes('工作室') && (lower.includes('对比') || lower.includes('排名') || lower.includes('表现'))) {
    let resp = `🏢 **各工作室经营对比**\n\n`;
    resp += `| 工作室 | 客户数 | 签约额 | 营收 | 毛利率 |\n`;
    resp += `|--------|--------|--------|------|--------|\n`;
    costAllocationData.forEach((d) => {
      const margin = ((d.revenue - d.totalCost) / d.revenue * 100).toFixed(1);
      resp += `| ${d.studio} | ${topClients.filter((c) => c.studio === d.studio).length}+ | ¥${(d.revenue * 1.2 / 10000).toFixed(0)}万 | ¥${(d.revenue / 10000).toFixed(0)}万 | ${margin}% |\n`;
    });
    resp += `\n**人效排名（人均营收）：**\n`;
    const ranked = [...costAllocationData].sort((a, b) => b.revenue / b.headcount - a.revenue / a.headcount);
    ranked.forEach((d, i) => {
      resp += `${i + 1}. ${d.studio} — ¥${(d.revenue / d.headcount / 10000).toFixed(1)}万/人\n`;
    });
    return resp;
  }

  if (lower.includes('人效') || lower.includes('人均') || lower.includes('效能')) {
    const sixMonthsAgo = efficiencyTrendData[efficiencyTrendData.length - 7];
    const growth = ((latest.revenuePerPerson - sixMonthsAgo.revenuePerPerson) / sixMonthsAgo.revenuePerPerson * 100).toFixed(1);
    let resp = `📈 **人效分析**\n\n`;
    resp += `• 当前人均营收：¥${(latest.revenuePerPerson / 10000).toFixed(1)}万\n`;
    resp += `• 人均毛利：¥${(latest.profitPerPerson / 10000).toFixed(1)}万\n`;
    resp += `• 人均净利：¥${(latest.netProfitPerPerson / 10000).toFixed(1)}万\n`;
    resp += `• 近6个月增幅：${growth}%\n\n`;
    resp += `**BD人效排名：**\n`;
    const ranked = [...staffingRatioData].sort((a, b) => b.bdRevenue / b.bdCount - a.bdRevenue / a.bdCount);
    ranked.forEach((d, i) => {
      resp += `${i + 1}. ${d.studio} — BD人均营收 ¥${(d.bdRevenue / d.bdCount / 10000).toFixed(1)}万\n`;
    });
    resp += `\n效能持续提升，建议关注边际效益递减风险。`;
    return resp;
  }

  if (lower.includes('成本')) {
    const totalCost = costAllocationData.reduce((s, d) => s + d.totalCost, 0);
    let resp = `💰 **成本结构分析**\n\n`;
    resp += `总成本：¥${(totalCost / 10000).toFixed(0)}万\n\n`;
    const sorted = [...costAllocationData].sort((a, b) => b.totalCost - a.totalCost);
    sorted.forEach((d) => {
      const ratio = (d.totalCost / totalCost * 100).toFixed(1);
      resp += `• ${d.studio}：¥${(d.totalCost / 10000).toFixed(0)}万（占比 ${ratio}%）\n`;
      resp += `  直接人力 ¥${(d.directCost / 10000).toFixed(0)}万 / 中台 ¥${(d.middlePlatform / 10000).toFixed(0)}万 / 公共 ¥${(d.publicCost / 10000).toFixed(0)}万\n`;
    });
    return resp;
  }

  if (lower.includes('业务线') || lower.includes('cmc') || lower.includes('dmc') || lower.includes('ecp') || lower.includes('直播')) {
    let resp = `📊 **业务线营收分布**\n\n`;
    const studioRevenue: Record<string, number> = {};
    costAllocationData.forEach((d) => { studioRevenue[d.studio] = d.revenue; });

    DIVISION.studios.forEach((studio) => {
      const rev = studioRevenue[studio.name] || 0;
      resp += `**${studio.name}**\n`;
      studio.businessLines.forEach((bl) => {
        const clients = topClients.filter((c) => c.studio === studio.name && c.businessLine === bl.code);
        const blRevenue = clients.reduce((s, c) => s + c.financeRevenue, 0);
        const blRevRatio = rev > 0 ? (blRevenue / rev * 100).toFixed(1) : '0';
        resp += `  • ${bl.name}（${bl.code}）：¥${(blRevenue / 10000).toFixed(0)}万，占工作室 ${blRevRatio}%\n`;
      });
      resp += `\n`;
    });
    return resp;
  }

  if (lower.includes('数据') && (lower.includes('质量') || lower.includes('一致') || lower.includes('对账'))) {
    const matched = dataConfidenceData.filter((d) => d.status === 'match');
    const mismatched = dataConfidenceData.filter((d) => d.status === 'mismatch');
    let resp = `🔍 **数据质量报告**\n\n`;
    resp += `CRM 与 Galaxy 数据一致率：${(matched.length / dataConfidenceData.length * 100).toFixed(0)}%\n\n`;
    if (mismatched.length > 0) {
      resp += `**不一致项：**\n`;
      mismatched.forEach((d) => {
        resp += `• ${d.metric}：CRM ¥${(d.crmValue / 10000).toFixed(1)}万 vs Galaxy ¥${(d.galaxyValue / 10000).toFixed(1)}万，偏差 ¥${(d.difference / 10000).toFixed(1)}万\n`;
      });
      resp += `\n建议优先对齐回款额和广告投放成本两项偏差。`;
    } else {
      resp += `所有指标数据一致，无需对齐。`;
    }
    return resp;
  }

  if (lower.includes('建议') || lower.includes('改善') || lower.includes('优化')) {
    let resp = `💡 **经营改善建议**\n\n`;
    resp += `基于本月数据分析，建议重点关注以下方面：\n\n`;
    resp += `**1. 客户留存**（优先级：高）\n`;
    const silent = topClients.filter((c) => c.isSilent);
    if (silent.length > 0) {
      resp += `   ${silent.map((c) => c.name).join('、')} 已进入沉默状态，建议本周启动回访计划。\n\n`;
    }
    resp += `**2. 数据治理**（优先级：中）\n`;
    resp += `   CRM 与财务系统存在 ${dataConfidenceData.filter((d) => d.status === 'mismatch').length} 项数据偏差，建议推动系统间自动校验。\n\n`;
    resp += `**3. 人效优化**（优先级：中）\n`;
    const imbalanced = staffingRatioData.filter((s) => {
      const ratio = s.deliveryCount / s.bdCount;
      return ratio > 3 || ratio < 1.5;
    });
    if (imbalanced.length > 0) {
      resp += `   ${imbalanced.map((s) => s.studio).join('、')} 的 BD:交付比失衡，建议调整人员配比。\n\n`;
    }
    resp += `**4. 跨室协作**（优先级：低）\n`;
    resp += `   本月 ${supportLedgerData.length} 笔跨室支援，建议在复盘会上讨论是否需要长期化某些支援关系。`;
    return resp;
  }

  return `抱歉，我暂时无法回答这个问题。你可以尝试问我以下问题：\n\n` +
    `• 本月营收和利润情况\n• 客户风险预警\n• 各工作室对比分析\n• 人效趋势\n• 成本结构\n• 业务线分布\n• 数据质量\n• 改善建议`;
}

export function generateChatResponse(userMessage: string): ChatMessage {
  return {
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    content: findResponse(userMessage),
    timestamp: Date.now(),
  };
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: `msg-${Date.now()}-user`,
    role: 'user',
    content,
    timestamp: Date.now(),
  };
}
