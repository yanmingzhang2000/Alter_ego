import React from 'react';
import { Card, Table, Tag, Alert, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { topClients } from '../../mock/skaData';

const SilentWarning: React.FC = () => {
  const silentClients = topClients.filter(c => c.isSilent);

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#ff4d4f' }}>{text}</span>,
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
      dataIndex: 'lastOrderDays',
      key: 'lastOrderDays',
      align: 'center' as const,
      render: (val: number) => <Tag color="red">{val}天</Tag>,
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
      render: (_: unknown, record: { lastOrderDays: number }) => (
        <Tag color={record.lastOrderDays > 100 ? 'red' : 'orange'}>
          {record.lastOrderDays > 100 ? '高危' : '预警'}
        </Tag>
      ),
    },
  ];

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
      {silentClients.length > 0 && (
        <Alert
          message={`有 ${silentClients.length} 个大客户已超过90天无新订单，请及时介入跟进！`}
          type="error"
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
      />
    </Card>
  );
};

export default SilentWarning;
