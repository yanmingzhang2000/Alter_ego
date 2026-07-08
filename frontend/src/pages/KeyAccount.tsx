import React from 'react';
import { Row, Col, Card, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import WaterLine from '../components/SKAFortress/WaterLine';
import SilentWarning from '../components/SKAFortress/SilentWarning';
import ProfitInsight from '../components/SKAFortress/ProfitInsight';

const KeyAccount: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>
        <Space>
          <TeamOutlined />
          核心客户监控
        </Space>
      </h2>

      <Card style={{ marginBottom: 16 }}>
        <WaterLine />
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }}>
            <SilentWarning />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }}>
            <ProfitInsight />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default KeyAccount;
