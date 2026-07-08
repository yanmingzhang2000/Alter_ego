import React, { useState, useMemo } from 'react';
import { Card, Button, Space, Tag, Typography, Row, Col, Statistic, Segmented } from 'antd';
import {
  RobotOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import InsightCard from '../components/AgentReport/InsightCard';
import { agentInsights, agentMetadata } from '../mock/agentReport';
import type { InsightSeverity } from '../mock/agentReport';

const { Text } = Typography;

const severityConfig: Record<InsightSeverity, { color: string; label: string; icon: React.ReactNode }> = {
  critical: { color: '#ff4d4f', label: '紧急', icon: <AlertOutlined /> },
  warning: { color: '#faad14', label: '关注', icon: <WarningOutlined /> },
  info: { color: '#1677ff', label: '洞察', icon: <InfoCircleOutlined /> },
  positive: { color: '#52c41a', label: '良好', icon: <CheckCircleOutlined /> },
};

const categories = ['全部', '客户风险', '效能趋势', '成本结构', '人效诊断', '数据质量', '跨室协作', '行动建议'];

const AgentReport: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const filteredInsights = useMemo(() => {
    if (activeCategory === '全部') return agentInsights;
    return agentInsights.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  const groupedInsights = useMemo(() => {
    const groups: Record<string, typeof agentInsights> = {};
    filteredInsights.forEach((insight) => {
      if (!groups[insight.category]) groups[insight.category] = [];
      groups[insight.category].push(insight);
    });
    return groups;
  }, [filteredInsights]);

  const severityCounts = useMemo(() => {
    const counts: Record<InsightSeverity, number> = { critical: 0, warning: 0, info: 0, positive: 0 };
    agentInsights.forEach((i) => counts[i.severity]++);
    return counts;
  }, []);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 800);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontWeight: 600, marginBottom: 4 }}>
            <Space>
              <RobotOutlined style={{ color: '#1677ff' }} />
              AI 经营洞察
            </Space>
          </h2>
          <Text type="secondary">基于全量看板数据自动生成的经营分析报告</Text>
        </div>
        <Space size={12}>
          <Space size={4}>
            <ClockCircleOutlined style={{ color: '#999' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date().toLocaleString('zh-CN')}
            </Text>
          </Space>
          <Space size={4}>
            <DatabaseOutlined style={{ color: '#999' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {agentMetadata.sourceNames.length} 个数据源
            </Text>
          </Space>
          <Button
            size="small"
            icon={<ReloadOutlined spin={isRegenerating} />}
            onClick={handleRegenerate}
          >
            重新生成
          </Button>
        </Space>
      </div>

      {/* Severity Stats */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        {(['critical', 'warning', 'info', 'positive'] as InsightSeverity[]).map((sev) => (
          <Col span={6} key={sev}>
            <Card
              size="small"
              hoverable
              style={{ borderTop: `3px solid ${severityConfig[sev].color}` }}
              onClick={() => setActiveCategory(sev === 'critical' ? '客户风险' : '全部')}
            >
              <Statistic
                title={severityConfig[sev].label}
                value={severityCounts[sev]}
                suffix="条"
                valueStyle={{ color: severityConfig[sev].color, fontSize: 28, fontWeight: 600 }}
                prefix={severityConfig[sev].icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Category Filter */}
      <div style={{ marginBottom: 20 }}>
        <Segmented
          options={categories.map((c) => ({
            label: c === '全部' ? `全部 (${agentInsights.length})` : c,
            value: c,
          }))}
          value={activeCategory}
          onChange={(val) => setActiveCategory(val as string)}
          size="middle"
        />
      </div>

      {/* Insight Groups */}
      {Object.entries(groupedInsights).map(([category, insights]) => (
        <div key={category} style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {category}
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400, marginLeft: 8 }}>
              {insights.length} 条
            </Text>
          </div>
          <Row gutter={[16, 16]}>
            {insights.map((insight, idx) => (
              <Col span={insights.length === 1 ? 24 : 12} key={insight.id}>
                <InsightCard insight={insight} animationDelay={idx * 0.08} />
              </Col>
            ))}
          </Row>
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#fafafa',
          borderRadius: 8,
          fontSize: 12,
          color: '#999',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>
          数据来源：{agentMetadata.sourceNames.join(' · ')}
        </span>
        <span>
          数据周期：{agentMetadata.dataRange}
        </span>
      </div>
    </div>
  );
};

export default AgentReport;
