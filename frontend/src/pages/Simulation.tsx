import React from 'react';
import { Space } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import ScenarioAnalysis from '../components/HumanXRay/ScenarioAnalysis';

const Simulation: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>
        <Space>
          <ExperimentOutlined />
          经营模拟
        </Space>
      </h2>

      <ScenarioAnalysis />
    </div>
  );
};

export default Simulation;
