import React from 'react';
import { Row, Col, Card, Space } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import EfficiencyTrend from '../components/HumanXRay/EfficiencyTrend';
import CostAllocation from '../components/HumanXRay/CostAllocation';
import StaffingRatio from '../components/HumanXRay/StaffingRatio';

const Efficiency: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>
        <Space>
          <BarChartOutlined />
          效能分析
        </Space>
      </h2>

      <Card style={{ marginBottom: 16 }}>
        <EfficiencyTrend />
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }}>
            <CostAllocation />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }}>
            <StaffingRatio />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Efficiency;
