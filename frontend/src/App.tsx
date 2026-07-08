import React, { useState } from 'react';
import { Layout, Menu, theme, Card, Row, Col, Statistic, DatePicker, Select, Space, Button, Tooltip } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  BarChartOutlined,
  RiseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import WaterLine from './components/SKAFortress/WaterLine';
import SilentWarning from './components/SKAFortress/SilentWarning';
import ProfitInsight from './components/SKAFortress/ProfitInsight';
import EfficiencyTrend from './components/HumanXRay/EfficiencyTrend';
import CostAllocation from './components/HumanXRay/CostAllocation';
import StaffingRatio from './components/HumanXRay/StaffingRatio';
import ScenarioAnalysis from './components/HumanXRay/ScenarioAnalysis';
import DataConfidence from './components/TrustModule/DataConfidence';
import SupportLedger from './components/TrustModule/SupportLedger';
import SegmentationSettings from './components/Settings/SegmentationSettings';
import { SegmentationProvider } from './contexts/SegmentationContext';
import { monthlySnapshot } from './mock/reconciliation';

const { Header, Content, Footer } = Layout;

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: 'all', icon: <DashboardOutlined />, label: '全部模块' },
    { key: 'ska', icon: <TeamOutlined />, label: 'SKA护城河' },
    { key: 'human', icon: <UserOutlined />, label: '人效X光机' },
    { key: 'trust', icon: <SafetyCertificateOutlined />, label: '对账公信力' },
  ];

  const showSKA = activeTab === 'all' || activeTab === 'ska';
  const showHuman = activeTab === 'all' || activeTab === 'human';
  const showTrust = activeTab === 'all' || activeTab === 'trust';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: '#001529',
        }}
      >
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginRight: 48 }}>
          <RiseOutlined style={{ marginRight: 8 }} />
          Alter Ego
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeTab]}
          items={menuItems}
          onClick={({ key }) => setActiveTab(key)}
          style={{ flex: 1 }}
        />
        <Space style={{ color: '#fff' }}>
          <DatePicker picker="month" style={{ width: 140 }} defaultValue={undefined} />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部工作室' },
              { value: '1', label: '数字营销一室' },
              { value: '2', label: '数字营销二室' },
              { value: '3', label: '直播电商室' },
              { value: '4', label: '内容创意室' },
            ]}
          />
          <Tooltip title="客户分层规则设置">
            <Button
              type="text"
              icon={<SettingOutlined />}
              style={{ color: '#fff' }}
              onClick={() => setSettingsOpen(true)}
            />
          </Tooltip>
        </Space>
      </Header>

      <Content style={{ padding: '24px 48px', background: '#f5f5f5' }}>
        {/* 顶部概览卡片 */}
        <Card style={{ marginBottom: 24, borderRadius: borderRadiusLG }}>
          <Row gutter={24}>
            <Col span={4}>
              <Statistic title="本月营收" value={monthlySnapshot.totalRevenue} precision={0} prefix="¥" suffix="元" />
            </Col>
            <Col span={4}>
              <Statistic title="本月毛利" value={monthlySnapshot.grossProfit} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#52c41a' }} />
            </Col>
            <Col span={3}>
              <Statistic title="毛利率" value={monthlySnapshot.grossMargin} precision={1} suffix="%" valueStyle={{ color: '#1677ff' }} />
            </Col>
            <Col span={3}>
              <Statistic title="客户总数" value={monthlySnapshot.clientCount} suffix="家" />
            </Col>
            <Col span={3}>
              <Statistic title="新增客户" value={monthlySnapshot.newClientCount} suffix="家" valueStyle={{ color: '#52c41a' }} />
            </Col>
            <Col span={3}>
              <Statistic title="流失客户" value={monthlySnapshot.lostClientCount} suffix="家" valueStyle={{ color: '#ff4d4f' }} />
            </Col>
            <Col span={4}>
              <Statistic title="人均营收" value={monthlySnapshot.avgRevenuePerPerson} precision={0} prefix="¥" suffix="元" />
            </Col>
          </Row>
        </Card>

        {/* 第一段：SKA护城河 */}
        {showSKA && (
          <div style={{ marginBottom: 24 }}>
            <Card
              title={
                <Space>
                  <TeamOutlined />
                  <span>第一段：SKA护城河</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: borderRadiusLG }}
            >
              <WaterLine />
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <SilentWarning />
                </Col>
                <Col span={12}>
                  <ProfitInsight />
                </Col>
              </Row>
            </Card>
          </div>
        )}

        {/* 第二段：人效X光机 */}
        {showHuman && (
          <div style={{ marginBottom: 24 }}>
            <Card
              title={
                <Space>
                  <BarChartOutlined />
                  <span>第二段：人效X光机</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: borderRadiusLG }}
            >
              <EfficiencyTrend />
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <CostAllocation />
                </Col>
                <Col span={12}>
                  <StaffingRatio />
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <ScenarioAnalysis />
              </div>
            </Card>
          </div>
        )}

        {/* 第三段：对账公信力 */}
        {showTrust && (
          <div style={{ marginBottom: 24 }}>
            <Card
              title={
                <Space>
                  <SafetyCertificateOutlined />
                  <span>第三段：对账公信力与利润真伪</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: borderRadiusLG }}
            >
              <Row gutter={16}>
                <Col span={14}>
                  <DataConfidence />
                </Col>
                <Col span={10}>
                  <SupportLedger />
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
        Alter Ego - 业务经营看板 MVP · 数据更新频次 T+1 · 月度经营快照每月5号自动生成
      </Footer>

      <SegmentationSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Layout>
  );
};

const App: React.FC = () => (
  <SegmentationProvider>
    <AppContent />
  </SegmentationProvider>
);

export default App;
