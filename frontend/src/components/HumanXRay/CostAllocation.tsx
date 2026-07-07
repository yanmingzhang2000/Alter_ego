import React from 'react';
import { Card, Row, Col, Table, Tag } from 'antd';
import { Column } from '@ant-design/charts';
import { costAllocationData } from '../../mock/humanEfficiency';

const CostAllocation: React.FC = () => {
  const chartData = costAllocationData.flatMap(item => [
    { studio: item.studio, type: '直接人力成本', value: item.directCost / 10000 },
    { studio: item.studio, type: '中台分摊成本', value: item.middlePlatform / 10000 },
    { studio: item.studio, type: '公共固定成本', value: item.publicCost / 10000 },
  ]);

  const config = {
    data: chartData,
    xField: 'studio',
    yField: 'value',
    seriesField: 'type',
    isStack: true,
    height: 280,
    legend: { position: 'top' as const },
    axis: {
      y: { title: '成本（万元）' },
    },
    label: {
      position: 'middle' as const,
      style: { fill: '#fff' },
    },
  };

  const columns = [
    {
      title: '工作室',
      dataIndex: 'studio',
      key: 'studio',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '直接人力成本',
      dataIndex: 'directCost',
      key: 'directCost',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: '中台分摊',
      dataIndex: 'middlePlatform',
      key: 'middlePlatform',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: '公共成本',
      dataIndex: 'publicCost',
      key: 'publicCost',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: '总成本',
      dataIndex: 'totalCost',
      key: 'totalCost',
      align: 'right' as const,
      render: (val: number) => <strong>¥{(val / 10000).toFixed(1)}万</strong>,
    },
    {
      title: '营收',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: '成本占比',
      key: 'costRatio',
      align: 'center' as const,
      render: (_: unknown, record: { totalCost: number; revenue: number }) => {
        const ratio = (record.totalCost / record.revenue * 100).toFixed(1);
        const color = Number(ratio) <= 60 ? '#52c41a' : Number(ratio) <= 70 ? '#faad14' : '#ff4d4f';
        return <Tag color={color}>{ratio}%</Tag>;
      },
    },
  ];

  return (
    <Card title="中台与职能成本摊薄视角" bordered={false}>
      <Row gutter={16}>
        <Col span={14}>
          <Column {...config} />
        </Col>
        <Col span={10}>
          <Table
            columns={columns}
            dataSource={costAllocationData}
            rowKey="studio"
            pagination={false}
            size="small"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CostAllocation;
