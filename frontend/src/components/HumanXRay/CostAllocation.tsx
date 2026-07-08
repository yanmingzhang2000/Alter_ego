import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Table, Tag, Radio, Space, Tooltip } from 'antd';
import { Column } from '@ant-design/charts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { costAllocationData, TOTAL_PUBLIC_COST } from '../../mock/humanEfficiency';

type AllocationMethod = 'revenue' | 'headcount' | 'workHours';

const METHOD_TIP: Record<AllocationMethod, string> = {
  revenue: '按各工作室当期营收占总营收的比例分摊公共固定成本',
  headcount: '按各工作室当期在职人数占总人数的比例分摊',
  workHours: '按各工作室当期实际交付工时占总工时的比例分摊',
};

const CostAllocation: React.FC = () => {
  const [method, setMethod] = useState<AllocationMethod>('revenue');

  // 根据选定方式动态计算每个工作室的 publicCost
  const computedData = useMemo(() => {
    const totalDenominator =
      method === 'revenue'
        ? costAllocationData.reduce((s, d) => s + d.revenue, 0)
        : method === 'headcount'
        ? costAllocationData.reduce((s, d) => s + d.headcount, 0)
        : costAllocationData.reduce((s, d) => s + d.workHours, 0);

    return costAllocationData.map((item) => {
      const ratio =
        method === 'revenue'
          ? item.revenue / totalDenominator
          : method === 'headcount'
          ? item.headcount / totalDenominator
          : item.workHours / totalDenominator;

      const publicCost = Math.round(TOTAL_PUBLIC_COST * ratio);
      return {
        ...item,
        publicCost,
        totalCost: item.directCost + item.middlePlatform + publicCost,
      };
    });
  }, [method]);

  const chartData = computedData.flatMap((item) => [
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
      title: (
        <Space size={4}>
          公共成本
          <Tooltip title={METHOD_TIP[method]}>
            <QuestionCircleOutlined style={{ color: '#999', fontSize: 12 }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'publicCost',
      key: 'publicCost',
      align: 'right' as const,
      render: (val: number) => <span style={{ color: '#1677ff' }}>¥{(val / 10000).toFixed(1)}万</span>,
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
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <span>中台与职能成本摊薄视角</span>
              <Tooltip title="切换公共固定成本的分摊方式，图表和表格实时联动">
                <QuestionCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
          </Col>
          <Col>
            <Radio.Group
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="revenue">营收占比</Radio.Button>
              <Radio.Button value="headcount">人头数</Radio.Button>
              <Radio.Button value="workHours">工时占比</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      }
      bordered={false}
    >
      <Row gutter={16}>
        <Col span={14}>
          <Column {...config} />
        </Col>
        <Col span={10}>
          <Table
            columns={columns}
            dataSource={computedData}
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
