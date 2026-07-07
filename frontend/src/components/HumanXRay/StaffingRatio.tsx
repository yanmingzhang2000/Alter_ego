import React from 'react';
import { Card, Row, Col, Table, Statistic } from 'antd';
import { staffingRatioData } from '../../mock/humanEfficiency';

const StaffingRatio: React.FC = () => {
  const totalBD = staffingRatioData.reduce((sum, item) => sum + item.bdCount, 0);
  const totalDelivery = staffingRatioData.reduce((sum, item) => sum + item.deliveryCount, 0);
  const totalBDRevenue = staffingRatioData.reduce((sum, item) => sum + item.bdRevenue, 0);
  const totalDeliveryRevenue = staffingRatioData.reduce((sum, item) => sum + item.deliveryRevenue, 0);

  const columns = [
    {
      title: '工作室',
      dataIndex: 'studio',
      key: 'studio',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'BD销售人数',
      dataIndex: 'bdCount',
      key: 'bdCount',
      align: 'center' as const,
    },
    {
      title: 'BD人均产出',
      key: 'bdPerPerson',
      align: 'right' as const,
      render: (_: unknown, record: { bdCount: number; bdRevenue: number }) =>
        `¥${(record.bdRevenue / record.bdCount / 10000).toFixed(1)}万`,
    },
    {
      title: '交付人数',
      dataIndex: 'deliveryCount',
      key: 'deliveryCount',
      align: 'center' as const,
    },
    {
      title: '交付人均产出',
      key: 'deliveryPerPerson',
      align: 'right' as const,
      render: (_: unknown, record: { deliveryCount: number; deliveryRevenue: number }) =>
        `¥${(record.deliveryRevenue / record.deliveryCount / 10000).toFixed(1)}万`,
    },
    {
      title: 'BD:交付配比',
      key: 'ratio',
      align: 'center' as const,
      render: (_: unknown, record: { bdCount: number; deliveryCount: number }) => {
        const ratio = (record.deliveryCount / record.bdCount).toFixed(1);
        const numRatio = Number(ratio);
        let color = '#1677ff';
        if (numRatio >= 2 && numRatio <= 3) color = '#52c41a';
        else if (numRatio > 3) color = '#faad14';
        return <span style={{ color, fontWeight: 500 }}>{1}:{ratio}</span>;
      },
    },
  ];

  return (
    <Card title="前端与交付配比分析" bordered={false}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Statistic title="BD销售总人数" value={totalBD} suffix="人" />
        </Col>
        <Col span={6}>
          <Statistic title="交付总人数" value={totalDelivery} suffix="人" />
        </Col>
        <Col span={6}>
          <Statistic
            title="BD人均产出"
            value={totalBDRevenue / totalBD}
            precision={0}
            prefix="¥"
            suffix="元"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="交付人均产出"
            value={totalDeliveryRevenue / totalDelivery}
            precision={0}
            prefix="¥"
            suffix="元"
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={staffingRatioData}
        rowKey="studio"
        pagination={false}
        size="middle"
      />
    </Card>
  );
};

export default StaffingRatio;
