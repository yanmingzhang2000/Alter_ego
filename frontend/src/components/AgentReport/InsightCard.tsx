import React from 'react';
import { Tag, Collapse } from 'antd';
import type { Insight, InsightSeverity } from '../../mock/agentReport';

const severityConfig: Record<InsightSeverity, { color: string; label: string }> = {
  critical: { color: '#ff4d4f', label: '紧急' },
  warning: { color: '#faad14', label: '关注' },
  info: { color: '#1677ff', label: '洞察' },
  positive: { color: '#52c41a', label: '良好' },
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
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #f0f0f0',
        borderLeft: `3px solid ${config.color}`,
        padding: '14px 16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
        animation: `fadeSlideIn 0.3s ease-out ${animationDelay}s both`,
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top: Icon + Tag + Category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{insight.icon}</span>
        <Tag
          color={config.color}
          style={{ margin: 0, fontSize: 11, lineHeight: '18px', padding: '0 6px' }}
        >
          {config.label}
        </Tag>
        <span style={{ fontSize: 11, color: '#bbb' }}>{insight.category}</span>
      </div>

      {/* Title */}
      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 6 }}>
        {insight.title}
      </div>

      {/* Content */}
      <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
        {insight.content}
      </div>

      {/* Detail Collapse */}
      <Collapse
        ghost
        size="small"
        style={{ marginTop: 4 }}
        items={[
          {
            key: '1',
            label: <span style={{ fontSize: 12, color: '#bbb' }}>详细分析</span>,
            children: (
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8, borderTop: '1px solid #f5f5f5', paddingTop: 8 }}>
                {insight.detail}
              </div>
            ),
          },
        ]}
      />

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default InsightCard;
