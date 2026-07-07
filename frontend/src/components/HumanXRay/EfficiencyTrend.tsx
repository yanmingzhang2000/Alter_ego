import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { Line } from '@ant-design/charts';
import { efficiencyTrendData } from '../../mock/humanEfficiency';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

const EfficiencyTrend: React.FC = () => {
  const latestData = efficiencyTrendData[efficiencyTrendData.length - 1];
  const prevData = efficiencyTrendData[efficiencyTrendData.length - 2];

  const revenueGrowth = ((latestData.revenuePerPerson - prevData.revenuePerPerson) / prevData.revenuePerPerson * 100).toFixed(1);
  const profitGrowth = ((latestData.profitPerPerson - prevData.profitPerPerson) / prevData.profitPerPerson * 100).toFixed(1);

  const chartData = efficiencyTrendData.flatMap(item => [
    { month: item.month, type: '人均营收', value: item.revenuePerPerson / 10000 },
    { month: item.month, type: '人均毛利', value: item.profitPerPerson / 10000 },
    { month: item.month, type: '人均净利', value: item.netProfitPerPerson / 10000 },
  ]);

  const config = {
    data: chartData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    height: 300,
    point: { shapeField: 'circle', sizeField: 2 },
    legend: { position: 'top' as const },
    axis: {
      y: { title: '金额（万元）' },
    },
  };

  return (
    <Card title="多口径人效趋势" bordered={false}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Statistic
            title="人均营收"
            value={latestData.revenuePerPerson}
            precision={0}
            prefix="¥"
            suffix="元"
            valueStyle={{ fontSize: 20 }}
          />
          <div style={{ fontSize: 12, color: Number(revenueGrowth) >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {Number(revenueGrowth) >= 0 ? <RiseOutlined /> : <FallOutlined />}
            {Math.abs(Number(revenueGrowth))}%
          </div>
        </Col>
        <Col span={6}>
          <Statistic
            title="人均毛利"
            value={latestData.profitPerPerson}
            precision={0}
            prefix="¥"
            suffix="元"
            valueStyle={{ fontSize: 20 }}
          />
          <div style={{ fontSize: 12, color: Number(profitGrowth) >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {Number(profitGrowth) >= 0 ? <RiseOutlined /> : <FallOutlined />}
            {Math.abs(Number(profitGrowth))}%
          </div>
        </Col>
        <Col span={6}>
          <Statistic
            title="人均净利"
            value={latestData.netProfitPerPerson}
            precision={0}
            prefix="¥"
            suffix="元"
            valueStyle={{ fontSize: 20 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="毛利率"
            value={(latestData.profitPerPerson / latestData.revenuePerPerson * 100)}
            precision={1}
            suffix="%"
            valueStyle={{ fontSize: 20, color: '#1677ff' }}
          />
        </Col>
      </Row>
      <Line {...config} />
    </Card>
  );
};

export default EfficiencyTrend;
