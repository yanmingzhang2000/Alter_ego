import React from 'react';
import { Card, Table, Tag, Row, Col, Statistic, Alert } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { dataConfidenceData } from '../../mock/reconciliation';

const DataConfidence: React.FC = () => {
  const matchCount = dataConfidenceData.filter(d => d.status === 'match').length;
  const mismatchCount = dataConfidenceData.filter(d => d.status === 'mismatch').length;

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'metric',
      key: 'metric',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'CRM数据',
      dataIndex: 'crmValue',
      key: 'crmValue',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: 'Galaxy财务数据',
      dataIndex: 'galaxyValue',
      key: 'galaxyValue',
      align: 'right' as const,
      render: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
    },
    {
      title: '差异金额',
      dataIndex: 'difference',
      key: 'difference',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val === 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
          {val === 0 ? '¥0' : `¥${(val / 10000).toFixed(1)}万`}
        </span>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => (
        <Tag
          icon={status === 'match' ? <CheckCircleOutlined /> : <WarningOutlined />}
          color={status === 'match' ? 'success' : 'warning'}
        >
          {status === 'match' ? '匹配' : '有差异'}
        </Tag>
      ),
    },
    {
      title: '数据来源',
      key: 'source',
      align: 'center' as const,
      render: () => (
        <div>
          <Tag color="blue">CRM</Tag>
          <Tag color="purple">Galaxy</Tag>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="数据置信度标签"
      bordered={false}
      extra={<span style={{ fontSize: 12, color: '#999' }}>金额类指标以财务Galaxy系统为准</span>}
    >
      {mismatchCount > 0 && (
        <Alert
          message={`${mismatchCount}项指标存在数据差异，需人工线下核对`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="匹配指标数"
            value={matchCount}
            suffix={`/ ${dataConfidenceData.length}`}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="差异指标数"
            value={mismatchCount}
            suffix={`/ ${dataConfidenceData.length}`}
            valueStyle={{ color: mismatchCount > 0 ? '#faad14' : '#52c41a' }}
            prefix={<WarningOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="数据一致率"
            value={(matchCount / dataConfidenceData.length * 100)}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#1677ff' }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={dataConfidenceData}
        rowKey="id"
        pagination={false}
        size="middle"
      />
    </Card>
  );
};

export default DataConfidence;
