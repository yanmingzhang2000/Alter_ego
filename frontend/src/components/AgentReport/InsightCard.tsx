import React from 'react';
import { Tag, Collapse } from 'antd';
import type { Insight, InsightSeverity } from '../../mock/agentReport';

const severityConfig: Record<InsightSeverity, { color: string; label: string; border: string }> = {
  critical: { color: '#ff4d4f', label: '紧急', border: '#ff4d4f' },
  warning: { color: '#faad14', label: '关注', border: '#faad14' },
  info: { color: '#1677ff', label: '洞察', border: '#1677ff' },
  positive: { color: '#52c41a', label: '良好', border: '#52c41a' },
};

interface InsightCardProps {
  insight: Insight;
  animationDelay?: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, animationDelay = 0 }) => {
  const config = severityConfig[insight.severity];

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        marginBottom: 16,
        animation: `fadeSlideIn 0.4s ease-out ${animationDelay}s both`,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: `linear-gradient(135deg, ${config.border}22, ${config.border}44)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          border: `2px solid ${config.border}33`,
        }}
      >
        {insight.icon}
      </div>

      {/* Bubble */}
      <div style={{ flex: 1, maxWidth: 680 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Tag
            color={config.color}
            style={{ margin: 0, fontSize: 11, lineHeight: '18px', padding: '0 6px' }}
          >
            {config.label}
          </Tag>
          <span style={{ fontSize: 12, color: '#999' }}>{insight.category}</span>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: '2px 12px 12px 12px',
            padding: '12px 16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            border: `1px solid ${config.border}22`,
            borderLeft: `3px solid ${config.border}`,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: '#1a1a1a' }}>
            {insight.title}
          </div>
          <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7 }}>
            {insight.content}
          </div>

          <Collapse
            ghost
            size="small"
            style={{ marginTop: 8 }}
            items={[
              {
                key: '1',
                label: <span style={{ fontSize: 12, color: '#999' }}>查看详细分析</span>,
                children: (
                  <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                    {insight.detail}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
