import React, { useState, useMemo } from 'react';
import { Layout, Menu, DatePicker, Select, Space, Button, Tooltip, theme } from 'antd';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  SettingOutlined,
  RiseOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KeyAccount from './pages/KeyAccount';
import Efficiency from './pages/Efficiency';
import Simulation from './pages/Simulation';
import DataReconciliation from './pages/DataReconciliation';
import AgentReport from './pages/AgentReport';
import SegmentationSettings from './components/Settings/SegmentationSettings';
import { SegmentationProvider } from './contexts/SegmentationContext';
import { DIVISION, ALL_STUDIOS, getStudioByName } from './mock/organization';

const { Header, Sider, Content, Footer } = Layout;

export interface GlobalFilter {
  studio: string | null;
  businessLine: string | null;
}

export const GlobalFilterContext = React.createContext<{
  filter: GlobalFilter;
  setFilter: (f: GlobalFilter) => void;
}>({ filter: { studio: null, businessLine: null }, setFilter: () => {} });

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filter, setFilter] = useState<GlobalFilter>({ studio: null, businessLine: null });
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const studioOptions = useMemo(() => {
    return DIVISION.studios.map((s) => ({ value: s.name, label: s.name }));
  }, []);

  const businessLineOptions = useMemo(() => {
    if (!filter.studio) {
      const allBL = DIVISION.studios.flatMap((s) => s.businessLines);
      const unique = Array.from(new Map(allBL.map((bl) => [bl.code, bl])).values());
      return unique.map((bl) => ({ value: bl.code, label: `${bl.name}（${bl.code}）` }));
    }
    const studio = getStudioByName(filter.studio);
    return (studio?.businessLines ?? []).map((bl) => ({
      value: bl.code,
      label: `${bl.name}（${bl.code}）`,
    }));
  }, [filter.studio]);

  const handleStudioChange = (value: string) => {
    setFilter({ studio: value, businessLine: null });
  };

  const handleBusinessLineChange = (value: string) => {
    setFilter((prev) => ({ ...prev, businessLine: value }));
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: '经营概览' },
    { key: '/key-account', icon: <TeamOutlined />, label: '核心客户监控' },
    { key: '/efficiency', icon: <BarChartOutlined />, label: '效能分析' },
    { key: '/simulation', icon: <ExperimentOutlined />, label: '经营模拟' },
    { key: '/data-reconciliation', icon: <SafetyCertificateOutlined />, label: '数据核算' },
    { key: '/agent-report', icon: <RobotOutlined />, label: 'AI 洞察' },
  ];

  return (
    <GlobalFilterContext.Provider value={{ filter, setFilter }}>
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
            <Space size={8}>
              <DatePicker picker="month" style={{ width: 140 }} />
              <Select
                placeholder="全部工作室"
                allowClear
                style={{ width: 150 }}
                options={studioOptions}
                value={filter.studio}
                onChange={handleStudioChange}
              />
              <Select
                placeholder="全部业务线"
                allowClear
                style={{ width: 160 }}
                options={businessLineOptions}
                value={filter.businessLine}
                onChange={handleBusinessLineChange}
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
              <Route path="/agent-report" element={<AgentReport />} />
            </Routes>
          </Content>

          <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
            Alter Ego · 业务经营看板 MVP · 数据更新频次 T+1 · 月度经营快照每月5号自动生成
          </Footer>
        </Layout>

        <SegmentationSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </Layout>
    </GlobalFilterContext.Provider>
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
