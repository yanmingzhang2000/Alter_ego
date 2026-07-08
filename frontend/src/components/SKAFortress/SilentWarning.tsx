import React from 'react';
import { Card, Table, Tag, Alert, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { topClients } from '../../mock/skaData';
import { useSegmentation } from '../../contexts/SegmentationContext';

const SilentWarning: React.FC = () => {
  const { getEffectiveRules } = useSegmentation();

  // 动态计算沉默客户（每个客户用其所属工作室规则）
  const enrichedClients = topClients.map((c) => {
    const rules = getEffectiveRules(c.studio);
    return {
      ...c,
      isBigClient: c.contractAmount >= rules.bigClientThreshold,
      isSilent: c.lastOrderDays >= rules.silentDaysThreshold,
      isHighRisk: c.lastOrderDays >= rules.silentDaysThreshold * 1.2,
      _silentDays: rules.silentDaysThreshold,
    };
  });

  const silentClients = enrichedClients.filter((c) => c.isBigClient && c.isSilent);

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 600, color: '#ff4d4f' }}>{text}</span>
      ),
    },
    {
      title: '所属工作室',
      dataIndex: 'studio',
      key: 'studio',
    },
    {
      title: '年度签约额',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: '沉默天数',
      key: 'silentDays',
      align: 'center' as const,
      render: (_: unknown, record: typeof enrichedClients[0]) => (
        <Tag color="red">
          {record.lastOrderDays}天
          <span style={{ fontSize: 11, opacity: 0.8 }}> / 阈值{record._silentDays}天</span>
        </Tag>
      ),
    },
    {
      title: '单客毛利',
      dataIndex: 'grossProfit',
      key: 'grossProfit',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: '风险等级',
      key: 'risk',
      align: 'center' as const,
      render: (_: unknown, record: typeof enrichedClients[0]) => (
        <Tag color={record.isHighRisk ? 'red' : 'orange'}>
          {record.isHighRisk ? '高危' : '预警'}
        </Tag>
      ),
    },
  ];

  // 展示当前生效的全局阈值（用于 Alert 提示文案）
  const globalRules = getEffectiveRules();

  return (
    <Card
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>沉默大客户预警</span>
        </Space>
      }
      bordered={false}
      style={{ borderLeft: '4px solid #ff4d4f' }}
    >
      {silentClients.length > 0 ? (
        <Alert
          message={`有 ${silentClients.length} 个大客户已超过 ${globalRules.silentDaysThreshold} 天无新订单，请及时介入跟进！`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Alert
          message={`暂无沉默大客户（阈值：${globalRules.silentDaysThreshold} 天无订单）`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Table
        columns={columns}
        dataSource={silentClients}
        rowKey="id"
        pagination={false}
        size="small"
        rowClassName="silent-row"
        locale={{ emptyText: '当前无沉默大客户' }}
      />
    </Card>
  );
};

export default SilentWarning;
