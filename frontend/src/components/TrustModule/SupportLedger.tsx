import React from 'react';
import { Card, Table, Row, Col, Statistic, Tag } from 'antd';
import { supportLedgerData } from '../../mock/reconciliation';
import { TeamOutlined } from '@ant-design/icons';

const SupportLedger: React.FC = () => {
  const totalCost = supportLedgerData.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalDays = supportLedgerData.reduce((sum, item) => sum + item.supportDays, 0);
  const totalPersons = supportLedgerData.reduce((sum, item) => sum + item.supportPersons, 0);

  const columns = [
    {
      title: '支援方工作室',
      dataIndex: 'fromStudio',
      key: 'fromStudio',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '受援方工作室',
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
      title: '预估成本',
      dataIndex: 'estimatedCost',
      key: 'estimatedCost',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: '#ff4d4f', fontWeight: 500 }}>¥{(val / 10000).toFixed(1)}万</span>
      ),
    },
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
      align: 'center' as const,
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
      extra={<span style={{ fontSize: 12, color: '#999' }}>仅做标签与汇总展示，不影响核心毛利公式</span>}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic title="支援总人次" value={totalPersons} suffix="人" prefix={<TeamOutlined />} />
        </Col>
        <Col span={8}>
          <Statistic title="支援总天数" value={totalDays} suffix="天" />
        </Col>
        <Col span={8}>
          <Statistic
            title="支援总成本"
            value={totalCost}
            precision={0}
            prefix="¥"
            suffix="元"
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={supportLedgerData}
        rowKey="id"
        pagination={false}
        size="middle"
      />
    </Card>
  );
};

export default SupportLedger;
