import React, { useMemo } from 'react';
import { Card, Table, Row, Col, Statistic, Tag, Divider, Typography } from 'antd';
import { supportLedgerData, type SupportLedger } from '../../mock/reconciliation';
import { TeamOutlined, SwapOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface NetSettlement {
  pair: string;
  studioA: string;
  studioB: string;
  netAmount: number; // 正数 = A 收到 B 的钱，负数 = A 付给 B 的钱
}

const SupportLedger: React.FC = () => {
  const totalCost = supportLedgerData.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalDays = supportLedgerData.reduce((sum, item) => sum + item.supportDays, 0);
  const totalPersons = supportLedgerData.reduce((sum, item) => sum + item.supportPersons, 0);

  // 计算工作室间净结算
  const netSettlements = useMemo(() => {
    const flowMap = new Map<string, number>(); // "A|B" -> net amount from A's perspective
    const studios = new Set<string>();

    supportLedgerData.forEach((item) => {
      studios.add(item.fromStudio);
      studios.add(item.toStudio);

      // 支援方收到钱（+），受援方付出钱（-）
      const keyA = `${item.fromStudio}|${item.toStudio}`;
      const keyB = `${item.toStudio}|${item.fromStudio}`;
      flowMap.set(keyA, (flowMap.get(keyA) || 0) + item.settlementAmount);
      flowMap.set(keyB, (flowMap.get(keyB) || 0) - item.settlementAmount);
    });

    const pairs = new Set<string>();
    const results: NetSettlement[] = [];

    flowMap.forEach((_, key) => {
      const [a, b] = key.split('|');
      const pairKey = [a, b].sort().join('|');
      if (pairs.has(pairKey)) return;
      pairs.add(pairKey);

      const net = flowMap.get(`${a}|${b}`) || 0;
      results.push({
        pair: pairKey,
        studioA: a,
        studioB: b,
        netAmount: net,
      });
    });

    return results;
  }, []);

  const detailColumns = [
    {
      title: '支援方',
      dataIndex: 'fromStudio',
      key: 'fromStudio',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '受援方',
      dataIndex: 'toStudio',
      key: 'toStudio',
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '支援天数',
      dataIndex: 'supportDays',
      key: 'supportDays',
      align: 'center' as const,
      render: (val: number) => `${val}天`,
    },
    {
      title: '支援人数',
      dataIndex: 'supportPersons',
      key: 'supportPersons',
      align: 'center' as const,
      render: (val: number) => `${val}人`,
    },
    {
      title: '结算金额',
      dataIndex: 'settlementAmount',
      key: 'settlementAmount',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: '#1677ff', fontWeight: 500 }}>¥{(val / 10000).toFixed(1)}万</span>
      ),
    },
    {
      title: '成本承担方',
      dataIndex: 'costBearer',
      key: 'costBearer',
      render: (text: string) => <Tag color="volcano">{text}</Tag>,
    },
    {
      title: '收益归属方',
      dataIndex: 'revenueReceiver',
      key: 'revenueReceiver',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
  ];

  const settlementColumns = [
    {
      title: '工作室A',
      dataIndex: 'studioA',
      key: 'studioA',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '工作室B',
      dataIndex: 'studioB',
      key: 'studioB',
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: '净结算金额',
      dataIndex: 'netAmount',
      key: 'netAmount',
      align: 'right' as const,
      render: (val: number) => {
        const isPositive = val > 0;
        return (
          <span style={{ color: isPositive ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
            {isPositive ? '+' : ''}¥{(val / 10000).toFixed(1)}万
          </span>
        );
      },
    },
    {
      title: '结算说明',
      key: 'desc',
      render: (_: unknown, record: NetSettlement) => {
        const isPositive = record.netAmount > 0;
        return (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isPositive
              ? `${record.studioA} 净收入，${record.studioB} 净支出`
              : `${record.studioA} 净支出，${record.studioB} 净收入`}
          </Text>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <span>
          <TeamOutlined style={{ marginRight: 8 }} />
          跨工作室支援台账
        </span>
      }
      bordered={false}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Statistic title="支援总人次" value={totalPersons} suffix="人" prefix={<TeamOutlined />} />
        </Col>
        <Col span={6}>
          <Statistic title="支援总天数" value={totalDays} suffix="天" />
        </Col>
        <Col span={6}>
          <Statistic
            title="结算总金额"
            value={totalCost}
            precision={0}
            prefix="¥"
            suffix="元"
            valueStyle={{ color: '#1677ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="涉及工作室数"
            value={new Set(supportLedgerData.flatMap(d => [d.fromStudio, d.toStudio])).size}
            suffix="个"
          />
        </Col>
      </Row>

      <Divider plain>
        <SwapOutlined style={{ marginRight: 4 }} />
        明细台账（双向结算）
      </Divider>
      <Table
        columns={detailColumns}
        dataSource={supportLedgerData}
        rowKey="id"
        pagination={false}
        size="middle"
      />

      <Divider plain>
        <SwapOutlined style={{ marginRight: 4 }} />
        工作室间净结算汇总
      </Divider>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
        正数 = 该工作室净收入（对方付给我方），负数 = 该工作室净支出（我方付给对方）
      </Text>
      <Table
        columns={settlementColumns}
        dataSource={netSettlements}
        rowKey="pair"
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default SupportLedger;
