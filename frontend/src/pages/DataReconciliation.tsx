import React from 'react';
import { Row, Col, Card, Space } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import DataConfidence from '../components/TrustModule/DataConfidence';
import SupportLedger from '../components/TrustModule/SupportLedger';

const DataReconciliation: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>
        <Space>
          <SafetyCertificateOutlined />
          数据核算
        </Space>
      </h2>

      <Row gutter={16}>
        <Col xs={24} lg={10}>
          <Card style={{ height: '100%' }}>
            <DataConfidence />
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card style={{ height: '100%' }}>
            <SupportLedger />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataReconciliation;
