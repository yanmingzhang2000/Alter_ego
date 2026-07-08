import React, { useState } from 'react';
import { Layout, Menu, DatePicker, Select, Space, Button, Tooltip, theme } from 'antd';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  SettingOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KeyAccount from './pages/KeyAccount';
import Efficiency from './pages/Efficiency';
import Simulation from './pages/Simulation';
import DataReconciliation from './pages/DataReconciliation';
import SegmentationSettings from './components/Settings/SegmentationSettings';
import { SegmentationProvider } from './contexts/SegmentationContext';

const { Header, Sider, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: '经营概览' },
    { key: '/key-account', icon: <TeamOutlined />, label: '核心客户监控' },
    { key: '/efficiency', icon: <BarChartOutlined />, label: '效能分析' },
    { key: '/simulation', icon: <ExperimentOutlined />, label: '经营模拟' },
    { key: '/data-reconciliation', icon: <SafetyCertificateOutlined />, label: '数据核算' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: '#001529' }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 16 : 18,
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <RiseOutlined style={{ marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && 'Alter Ego'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space>
            <DatePicker picker="month" style={{ width: 140 }} />
            <Select
              defaultValue="all"
              style={{ width: 140 }}
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
                onClick={() => setSettingsOpen(true)}
              />
            </Tooltip>
          </Space>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: '#f5f5f5', minHeight: 280, borderRadius: borderRadiusLG }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/key-account" element={<KeyAccount />} />
            <Route path="/efficiency" element={<Efficiency />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/data-reconciliation" element={<DataReconciliation />} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
          Alter Ego · 业务经营看板 MVP · 数据更新频次 T+1 · 月度经营快照每月5号自动生成
        </Footer>
      </Layout>

      <SegmentationSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Layout>
  );
};

const App: React.FC = () => (
  <SegmentationProvider>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </SegmentationProvider>
);

export default App;
