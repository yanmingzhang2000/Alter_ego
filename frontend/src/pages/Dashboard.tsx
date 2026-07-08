import React, { useContext, useMemo } from 'react';
import { Row, Col, Card, Statistic, Space, Tag, Alert } from 'antd';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  WarningOutlined,
  RobotOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GlobalFilterContext } from '../App';
import { supportLedgerData, dataConfidenceData } from '../mock/reconciliation';
import { efficiencyTrendData, costAllocationData } from '../mock/humanEfficiency';
import { topClients } from '../mock/skaData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { filter } = useContext(GlobalFilterContext);

  const filteredClients = useMemo(() => {
    return topClients.filter((c) => {
      if (filter.studio && c.studio !== filter.studio) return false;
      if (filter.businessLine && c.businessLine !== filter.businessLine) return false;
      return true;
    });
  }, [filter.studio, filter.businessLine]);

  const silentCount = filteredClients.filter((c) => c.isSilent).length;
  const negativeProfitCount = filteredClients.filter((c) => c.grossMargin < 0).length;
  const avgEfficiency = efficiencyTrendData[efficiencyTrendData.length - 1]?.revenuePerPerson ?? 0;
  const avgMargin = filteredClients.length > 0
    ? filteredClients.reduce((sum, c) => sum + c.grossMargin, 0) / filteredClients.length
    : 0;
  const totalCost = costAllocationData.reduce((sum, d) => sum + d.totalCost, 0);
  const matchCount = dataConfidenceData.filter((d) => d.status === 'match').length;
  const avgConfidence = dataConfidenceData.length > 0
    ? Math.round((matchCount / dataConfidenceData.length) * 100)
    : 0;

  const totalRevenue = filteredClients.reduce((sum, c) => sum + c.financeRevenue, 0);
  const totalProfit = filteredClients.reduce((sum, c) => sum + c.grossProfit, 0);

  const filterLabel = filter.studio
    ? filter.businessLine
      ? `${filter.studio} - ${filter.businessLine}`
      : filter.studio
    : filter.businessLine
    ? filter.businessLine
    : null;

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>经营概览</h2>

      {filterLabel && (
        <Alert
          message={
            <Space>
              <InfoCircleOutlined />
              <span>当前筛选: <strong>{filterLabel}</strong>，下方数据已根据筛选条件更新</span>
            </Space>
          }
          type="info"
          showIcon={false}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="本月营收" value={totalRevenue} precision={0} prefix="¥" suffix="元" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="本月毛利" value={totalProfit} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="毛利率" value={avgMargin} precision={1} suffix="%" valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/key-account')} style={{ cursor: 'pointer' }}>
            <Statistic title="客户总数" value={filteredClients.length} suffix="家" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card hoverable onClick={() => navigate('/efficiency')} style={{ cursor: 'pointer' }}>
            <Statistic title="人均营收" value={avgEfficiency} precision={0} prefix="¥" suffix="元" />
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
                <Statistic title="SKA客户" value={filteredClients.length} suffix="家" valueStyle={{ fontSize: 20 }} />
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

        {/* AI 洞察 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RobotOutlined style={{ color: '#722ed1' }} />
                <span>AI 经营洞察</span>
              </Space>
            }
            extra={<a onClick={() => navigate('/agent-report')}>查看报告 →</a>}
            hoverable
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/agent-report')}
          >
            <div style={{ color: '#666', padding: '8px 0' }}>
              <div style={{ marginBottom: 8 }}>
                <Tag color="purple">智能分析</Tag>
                <Tag color="red">风险预警</Tag>
                <Tag color="cyan">行动建议</Tag>
              </div>
              <div style={{ fontSize: 13 }}>
                AI 基于全量看板数据自动生成的经营洞察，包含风险预警和行动建议。
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
