import React from 'react';
import { Row, Col, Card, Statistic, Space, Tag } from 'antd';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { monthlySnapshot, supportLedgerData, dataConfidenceData } from '../mock/reconciliation';
import { efficiencyTrendData, costAllocationData } from '../mock/humanEfficiency';
import { topClients } from '../mock/skaData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const silentCount = topClients.filter((c) => c.isSilent).length;
  const negativeProfitCount = topClients.filter((c) => c.grossMargin < 0).length;
  const avgEfficiency = efficiencyTrendData[efficiencyTrendData.length - 1]?.revenuePerPerson ?? 0;
  const avgMargin = topClients.reduce((sum, c) => sum + c.grossMargin, 0) / topClients.length;
  const totalCost = costAllocationData.reduce((sum, d) => sum + d.totalCost, 0);
  const matchCount = dataConfidenceData.filter((d) => d.status === 'match').length;
  const avgConfidence = dataConfidenceData.length > 0
    ? Math.round((matchCount / dataConfidenceData.length) * 100)
    : 0;

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>经营概览</h2>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="本月营收" value={monthlySnapshot.totalRevenue} precision={0} prefix="¥" suffix="元" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="本月毛利" value={monthlySnapshot.grossProfit} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="毛利率" value={monthlySnapshot.grossMargin} precision={1} suffix="%" valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="客户总数" value={monthlySnapshot.clientCount} suffix="家" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/efficiency')} style={{ cursor: 'pointer' }}>
            <Statistic title="人均营收" value={monthlySnapshot.avgRevenuePerPerson} precision={0} prefix="¥" suffix="元" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/efficiency')} style={{ cursor: 'pointer' }}>
            <Statistic title="人力总成本" value={totalCost} precision={0} prefix="¥" suffix="元" />
          </Card>
        </Col>
      </Row>

      {/* Module Snapshots */}
      <Row gutter={[16, 16]}>
        {/* 核心客户监控 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: '#1677ff' }} />
                <span>核心客户监控</span>
              </Space>
            }
            extra={<a onClick={() => navigate('/key-account')}>查看详情 →</a>}
            hoverable
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/key-account')}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="SKA客户" value={topClients.length} suffix="家" valueStyle={{ fontSize: 20 }} />
              </Col>
              <Col span={8}>
                <Statistic
                  title="静默预警"
                  value={silentCount}
                  suffix="家"
                  valueStyle={{ color: silentCount > 0 ? '#ff4d4f' : '#52c41a', fontSize: 20 }}
                  prefix={silentCount > 0 ? <WarningOutlined /> : undefined}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="负毛利客户"
                  value={negativeProfitCount}
                  suffix="家"
                  valueStyle={{ color: negativeProfitCount > 0 ? '#ff4d4f' : '#52c41a', fontSize: 20 }}
                  prefix={negativeProfitCount > 0 ? <WarningOutlined /> : undefined}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 效能分析 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined style={{ color: '#52c41a' }} />
                <span>效能分析</span>
              </Space>
            }
            extra={<a onClick={() => navigate('/efficiency')}>查看详情 →</a>}
            hoverable
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/efficiency')}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="人均营收" value={avgEfficiency} precision={0} prefix="¥" suffix="元" valueStyle={{ fontSize: 20 }} />
              </Col>
              <Col span={12}>
                <Statistic title="平均毛利率" value={avgMargin} precision={1} suffix="%" valueStyle={{ color: '#1677ff', fontSize: 20 }} />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 数据核算 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: '#722ed1' }} />
                <span>数据核算</span>
              </Space>
            }
            extra={<a onClick={() => navigate('/data-reconciliation')}>查看详情 →</a>}
            hoverable
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/data-reconciliation')}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="数据置信度" value={avgConfidence} precision={0} suffix="%" valueStyle={{ color: '#52c41a', fontSize: 20 }} />
              </Col>
              <Col span={12}>
                <Statistic title="对账工单" value={supportLedgerData.length} suffix="条" valueStyle={{ fontSize: 20 }} />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 经营模拟 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined style={{ color: '#fa8c16' }} />
                <span>经营模拟</span>
              </Space>
            }
            extra={<a onClick={() => navigate('/simulation')}>进入模拟 →</a>}
            hoverable
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/simulation')}
          >
            <div style={{ color: '#666', padding: '8px 0' }}>
              <div style={{ marginBottom: 8 }}>
                <Tag color="blue">人力增减模拟</Tag>
                <Tag color="green">调价模拟</Tag>
              </div>
              <div style={{ fontSize: 13 }}>
                模拟不同人力配置和价格调整对利润的影响，辅助经营决策。
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
