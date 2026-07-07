import React from 'react';
import { Card, Table, Tag, Space, Row, Col, Statistic } from 'antd';
import { WarningOutlined, RiseOutlined } from '@ant-design/icons';
import { topClients, type SKAClient } from '../../mock/skaData';

const columns = [
  {
    title: '客户名称',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: SKAClient) => (
      <Space>
        <span style={{ fontWeight: 500 }}>{text}</span>
        {record.isNewClient && <Tag color="blue">新客户</Tag>}
        {record.isSilent && <Tag color="red">沉默预警</Tag>}
      </Space>
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
    sorter: (a: SKAClient, b: SKAClient) => a.contractAmount - b.contractAmount,
    defaultSortOrder: 'descend' as const,
  },
  {
    title: '财务确认收入',
    dataIndex: 'financeRevenue',
    key: 'financeRevenue',
    align: 'right' as const,
    render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
  },
  {
    title: '单客毛利',
    dataIndex: 'grossProfit',
    key: 'grossProfit',
    align: 'right' as const,
    render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
  },
  {
    title: '毛利率',
    dataIndex: 'grossMargin',
    key: 'grossMargin',
    align: 'right' as const,
    render: (val: number) => (
      <span style={{ color: val >= 25 ? '#52c41a' : val >= 20 ? '#faad14' : '#ff4d4f' }}>
        {val}%
      </span>
    ),
    sorter: (a: SKAClient, b: SKAClient) => a.grossMargin - b.grossMargin,
  },
  {
    title: '距上次订单(天)',
    dataIndex: 'lastOrderDays',
    key: 'lastOrderDays',
    align: 'center' as const,
    render: (val: number, record: SKAClient) => (
      <Tag color={record.isSilent ? 'red' : val > 60 ? 'orange' : 'green'}>
        {val}天
      </Tag>
    ),
  },
];

const WaterLine: React.FC = () => {
  const totalContract = topClients.reduce((sum, c) => sum + c.contractAmount, 0);
  const totalRevenue = topClients.reduce((sum, c) => sum + c.financeRevenue, 0);
  const silentCount = topClients.filter(c => c.isSilent).length;

  return (
    <Card title="大客户水位线" bordered={false}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Statistic title="TOP客户签约总额" value={totalContract} precision={0} prefix="¥" suffix="元" />
        </Col>
        <Col span={6}>
          <Statistic title="财务确认收入" value={totalRevenue} precision={0} prefix="¥" suffix="元" />
        </Col>
        <Col span={6}>
          <Statistic
            title="沉默客户数"
            value={silentCount}
            suffix={`/ ${topClients.length}`}
            valueStyle={{ color: silentCount > 0 ? '#ff4d4f' : '#52c41a' }}
            prefix={<WarningOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="平均毛利率"
            value={topClients.reduce((sum, c) => sum + c.grossMargin, 0) / topClients.length}
            precision={1}
            suffix="%"
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={topClients}
        rowKey="id"
        pagination={false}
        size="middle"
        rowClassName={(record) => record.isSilent ? 'silent-row' : ''}
      />
    </Card>
  );
};

export default WaterLine;
