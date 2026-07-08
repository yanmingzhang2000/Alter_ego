import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, Tag, Typography, Spin } from 'antd';
import {
  RobotOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import InsightCard from '../components/AgentReport/InsightCard';
import { agentInsights, agentMetadata } from '../mock/agentReport';

const { Text } = Typography;

const AgentReport: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const startGeneration = () => {
    setVisibleCount(0);
    setShowSummary(false);
    setIsGenerating(true);

    // Simulate typing: reveal insights one by one
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= agentInsights.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setShowSummary(true);
        }, 500);
      }
    }, 600);
  };

  useEffect(() => {
    startGeneration();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, isGenerating]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>
          <Space>
            <RobotOutlined />
            AI 经营洞察
          </Space>
        </h2>
        <Text type="secondary">
          基于全量看板数据自动生成的经营分析报告
        </Text>
      </div>

      {/* Metadata Bar */}
      <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
        <Space wrap size={[16, 8]}>
          <Space size={4}>
            <ClockCircleOutlined style={{ color: '#999' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              生成时间：{new Date().toLocaleString('zh-CN')}
            </Text>
          </Space>
          <Space size={4}>
            <DatabaseOutlined style={{ color: '#999' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              数据源：{agentMetadata.sourceNames.length} 个
            </Text>
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            数据周期：{agentMetadata.dataRange}
          </Text>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={startGeneration}
            disabled={isGenerating}
          >
            重新生成
          </Button>
        </Space>
      </Card>

      {/* Chat Area */}
      <div
        style={{
          background: '#f7f8fa',
          borderRadius: 12,
          padding: 24,
          minHeight: 400,
          position: 'relative',
        }}
      >
        {/* Welcome Message */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #1677ff, #722ed1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            <RobotOutlined />
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: '2px 12px 12px 12px',
              padding: '12px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              maxWidth: 480,
            }}
          >
            <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7 }}>
              你好，我是 Alter Ego 的 AI 经营助手。我已分析了本月全量数据，以下是为你生成的经营洞察报告。
            </div>
          </div>
        </div>

        {/* Insight Cards */}
        {agentInsights.slice(0, visibleCount).map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            animationDelay={0}
          />
        ))}

        {/* Typing Indicator */}
        {isGenerating && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              <RobotOutlined />
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: '2px 12px 12px 12px',
                padding: '14px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Spin size="small" />
              <Text type="secondary" style={{ fontSize: 13 }}>
                正在分析数据...
              </Text>
            </div>
          </div>
        )}

        {/* Summary */}
        {showSummary && (
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              <RobotOutlined />
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: '2px 12px 12px 12px',
                padding: '12px 16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                maxWidth: 560,
              }}
            >
              <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7, marginBottom: 8 }}>
                以上是本月经营洞察报告，共生成 {agentInsights.length} 条洞察。其中：
              </div>
              <Space wrap size={[8, 4]}>
                <Tag color="red">
                  紧急 {agentInsights.filter((i) => i.severity === 'critical').length} 条
                </Tag>
                <Tag color="orange">
                  关注 {agentInsights.filter((i) => i.severity === 'warning').length} 条
                </Tag>
                <Tag color="blue">
                  洞察 {agentInsights.filter((i) => i.severity === 'info').length} 条
                </Tag>
                <Tag color="green">
                  良好 {agentInsights.filter((i) => i.severity === 'positive').length} 条
                </Tag>
              </Space>
              <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                数据来源：{agentMetadata.sourceNames.join(' · ')}
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AgentReport;
