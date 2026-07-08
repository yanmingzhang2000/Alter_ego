import React, { useState, useMemo } from 'react';
import {
  Card, Tabs, Row, Col, Statistic, Select, Button, InputNumber, Tag,
  Space, Divider, Typography, Alert, Tooltip, Progress,
} from 'antd';
import {
  TeamOutlined,
  CalculatorOutlined,
  PlusOutlined,
  MinusOutlined,
  ExperimentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  ROLE_CONFIGS,
  STUDIO_BASELINES,
  CLIENT_PROJECTS,
} from '../../mock/scenarioAnalysis';

const { Text } = Typography;

const ScenarioAnalysis: React.FC = () => (
  <Card
    title={
      <Space>
        <CalculatorOutlined />
        <span>模拟测算</span>
      </Space>
    }
    bordered={false}
  >
    <Tabs
      type="card"
      size="small"
      items={[
        {
          key: 'headcount',
          label: <Space><TeamOutlined />人力增减模拟</Space>,
          children: <HeadcountSimulation />,
        },
        {
          key: 'price',
          label: <Space><ExperimentOutlined />调价模拟</Space>,
          children: <PriceSimulation />,
        },
      ]}
    />
  </Card>
);

/* ========== 人力增减模拟 ========== */
const HeadcountSimulation: React.FC = () => {
  const [selectedStudio, setSelectedStudio] = useState(STUDIO_BASELINES[0].studio);
  const [changes, setChanges] = useState<Record<string, number>>({});

  const baseline = useMemo(
    () => STUDIO_BASELINES.find((s) => s.studio === selectedStudio)!,
    [selectedStudio],
  );

  const totalDelta = useMemo(() => {
    let costDelta = 0;
    let revenueDelta = 0;
    Object.entries(changes).forEach(([role, count]) => {
      if (!count) return;
      const cfg = ROLE_CONFIGS.find((r) => r.role === role);
      if (!cfg) return;
      costDelta += count * cfg.avgMonthlyCost;
      revenueDelta += count * cfg.avgMonthlyRevenue;
    });
    return { costDelta, revenueDelta, profitDelta: revenueDelta - costDelta };
  }, [changes]);

  const predicted = useMemo(() => ({
    headcount: baseline.headcount + Object.values(changes).reduce((s, v) => s + (v || 0), 0),
    revenue: baseline.monthlyRevenue + totalDelta.revenueDelta,
    cost: baseline.monthlyCost + totalDelta.costDelta,
    profit: baseline.monthlyProfit + totalDelta.profitDelta,
  }), [baseline, totalDelta, changes]);

  const profitMargin = predicted.revenue > 0 ? (predicted.profit / predicted.revenue) * 100 : 0;

  const handleChange = (role: string, delta: number) => {
    setChanges((prev) => ({ ...prev, [role]: (prev[role] || 0) + delta }));
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">选择工作室</Text>
            <Select
              value={selectedStudio}
              onChange={setSelectedStudio}
              style={{ width: '100%' }}
              options={STUDIO_BASELINES.map((s) => ({ value: s.studio, label: s.studio }))}
            />
          </Space>
        </Col>
        <Col span={16}>
          <Row gutter={12}>
            <Col span={6}>
              <Statistic title="当前人数" value={baseline.headcount} suffix="人" />
            </Col>
            <Col span={6}>
              <Statistic
                title="模拟后人数"
                value={predicted.headcount}
                suffix="人"
                valueStyle={{ color: predicted.headcount > baseline.headcount ? '#1677ff' : '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="模拟利润变化"
                value={totalDelta.profitDelta}
                precision={0}
                prefix={totalDelta.profitDelta >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="元/月"
                valueStyle={{ color: totalDelta.profitDelta >= 0 ? '#52c41a' : '#ff4d4f', fontSize: 16 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="模拟后毛利率"
                value={profitMargin}
                precision={1}
                suffix="%"
                valueStyle={{
                  color: profitMargin >= 25 ? '#52c41a' : profitMargin >= 20 ? '#faad14' : '#ff4d4f',
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {totalDelta.profitDelta < 0 && (
        <Alert
          message={`模拟净增成本 ¥${(totalDelta.costDelta / 10000).toFixed(1)}万/月，无直接营收产出，利润下降`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {totalDelta.profitDelta > 0 && (
        <Alert
          message={`模拟净增利润 ¥${(totalDelta.profitDelta / 10000).toFixed(1)}万/月，ROI: ${((totalDelta.profitDelta / totalDelta.costDelta) * 100).toFixed(0)}%`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 12 }}>增减人员（点击 +/- 模拟）</Text>
      </Divider>

      <Row gutter={[16, 16]}>
        {ROLE_CONFIGS.map((role) => {
          const count = changes[role.role] || 0;
          return (
            <Col span={8} key={role.role}>
              <Card size="small" bordered hoverable>
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ fontSize: 14 }}>{role.label}</Text>
                  <div style={{ margin: '12px 0' }}>
                    <Space>
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => handleChange(role.role, -1)}
                        disabled={count <= -baseline.headcount}
                      />
                      <span style={{ fontSize: 20, fontWeight: 600, minWidth: 32, textAlign: 'center', color: count > 0 ? '#1677ff' : count < 0 ? '#ff4d4f' : '#333' }}>
                        {count > 0 ? `+${count}` : count}
                      </span>
                      <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleChange(role.role, 1)}
                      />
                    </Space>
                  </div>
                  <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      月成本 ¥{(role.avgMonthlyCost / 10000).toFixed(1)}万/人
                    </Text>
                    {role.avgMonthlyRevenue > 0 && (
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        月产出 ¥{(role.avgMonthlyRevenue / 10000).toFixed(1)}万/人
                      </Text>
                    )}
                    {count !== 0 && (
                      <Tag
                        color={count * (role.avgMonthlyRevenue - role.avgMonthlyCost) >= 0 ? 'green' : 'red'}
                        style={{ marginTop: 4 }}
                      >
                        {count > 0 ? '增' : '减'}{Math.abs(count)}人 → {count > 0 ? '+' : ''}{((count * (role.avgMonthlyRevenue - role.avgMonthlyCost)) / 10000).toFixed(1)}万/月
                      </Tag>
                    )}
                  </Space>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 12 }}>基准数据对比</Text>
      </Divider>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="基准月营收" value={baseline.monthlyRevenue} precision={0} prefix="¥" suffix="元" />
        </Col>
        <Col span={6}>
          <Statistic title="基准月成本" value={baseline.monthlyCost} precision={0} prefix="¥" suffix="元" />
        </Col>
        <Col span={6}>
          <Statistic title="基准月利润" value={baseline.monthlyProfit} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#52c41a' }} />
        </Col>
        <Col span={6}>
          <Statistic
            title="基准毛利率"
            value={(baseline.monthlyProfit / baseline.monthlyRevenue * 100)}
            precision={1}
            suffix="%"
          />
        </Col>
      </Row>
    </div>
  );
};

/* ========== 调价模拟 ========== */
const PriceSimulation: React.FC = () => {
  const [selectedId, setSelectedId] = useState(CLIENT_PROJECTS[0].id);
  const [priceChangePct, setPriceChangePct] = useState(0);

  const project = useMemo(
    () => CLIENT_PROJECTS.find((p) => p.id === selectedId)!,
    [selectedId],
  );

  const simulated = useMemo(() => {
    const newRevenue = project.monthlyRevenue * (1 + priceChangePct / 100);
    const profitDelta = newRevenue - project.monthlyRevenue;
    const newProfit = newRevenue - project.monthlyCost;
    const newMargin = newRevenue > 0 ? (newProfit / newRevenue) * 100 : 0;
    return { newRevenue, profitDelta, newProfit, newMargin };
  }, [project, priceChangePct]);

  const marginColor =
    simulated.newMargin >= 25 ? '#52c41a' : simulated.newMargin >= 20 ? '#faad14' : '#ff4d4f';

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={10}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">选择客户项目</Text>
            <Select
              value={selectedId}
              onChange={setSelectedId}
              style={{ width: '100%' }}
              options={CLIENT_PROJECTS.map((p) => ({
                value: p.id,
                label: (
                  <Space>
                    <span>{p.name}</span>
                    <Tag color="blue">{p.studio}</Tag>
                    <span style={{ color: '#999' }}>当前毛利 {p.grossMargin}%</span>
                  </Space>
                ),
              }))}
            />
          </Space>
        </Col>
        <Col span={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">
              调价幅度
              <Tooltip title="正数为涨价，负数为降价">
                <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
              </Tooltip>
            </Text>
            <InputNumber
              value={priceChangePct}
              onChange={(v) => setPriceChangePct(v || 0)}
              min={-50}
              max={100}
              step={5}
              style={{ width: '100%' }}
              addonBefore={priceChangePct >= 0 ? '+' : ''}
              addonAfter="%"
              size="large"
            />
          </Space>
        </Col>
        <Col span={6}>
          <Space>
            {[-20, -10, -5, 0, 10, 20].map((pct) => (
              <Button
                key={pct}
                size="small"
                type={priceChangePct === pct ? 'primary' : 'default'}
                onClick={() => setPriceChangePct(pct)}
              >
                {pct > 0 ? '+' : ''}{pct}%
              </Button>
            ))}
          </Space>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Statistic title="当前月营收" value={project.monthlyRevenue} precision={0} prefix="¥" suffix="元" />
        </Col>
        <Col span={6}>
          <Statistic
            title="模拟后月营收"
            value={simulated.newRevenue}
            precision={0}
            prefix="¥"
            suffix="元"
            valueStyle={{ color: priceChangePct !== 0 ? '#1677ff' : undefined }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="利润变化"
            value={simulated.profitDelta}
            precision={0}
            prefix={simulated.profitDelta >= 0 ? '+' : ''}
            suffix="元/月"
            valueStyle={{ color: simulated.profitDelta >= 0 ? '#52c41a' : '#ff4d4f' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="模拟后毛利率"
            value={simulated.newMargin}
            precision={1}
            suffix="%"
            valueStyle={{ color: marginColor, fontSize: 20, fontWeight: 600 }}
          />
        </Col>
      </Row>

      {simulated.newMargin < 0 && (
        <Alert
          message="降价后毛利率为负，该项目将亏损！"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {priceChangePct < 0 && simulated.newMargin >= 0 && simulated.newMargin < 20 && (
        <Alert
          message={`降价后毛利率 ${simulated.newMargin.toFixed(1)}%，已低于20%预警线`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {simulated.newMargin >= 25 && priceChangePct > 0 && (
        <Alert
          message={`涨价后毛利率 ${simulated.newMargin.toFixed(1)}%，项目盈利能力优秀`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 12 }}>毛利率变化</Text>
      </Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">当前毛利率</Text>
            <Progress
              percent={project.grossMargin}
              strokeColor={project.grossMargin >= 25 ? '#52c41a' : project.grossMargin >= 20 ? '#faad14' : '#ff4d4f'}
              format={(v) => `${v}%`}
            />
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">模拟后毛利率</Text>
            <Progress
              percent={Math.max(0, simulated.newMargin)}
              strokeColor={marginColor}
              format={() => `${simulated.newMargin.toFixed(1)}%`}
              status={simulated.newMargin < 0 ? 'exception' : undefined}
            />
          </Space>
        </Col>
      </Row>

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 12 }}>基准数据</Text>
      </Divider>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="月服务成本" value={project.monthlyCost} precision={0} prefix="¥" suffix="元" />
        </Col>
        <Col span={6}>
          <Statistic title="当前毛利率" value={project.grossMargin} precision={1} suffix="%" />
        </Col>
        <Col span={6}>
          <Statistic title="所属工作室" value={project.studio} />
        </Col>
        <Col span={6}>
          <Statistic
            title="成本不变"
            value={project.monthlyCost}
            precision={0}
            prefix="¥"
            suffix="元"
            valueStyle={{ color: '#999' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ScenarioAnalysis;
