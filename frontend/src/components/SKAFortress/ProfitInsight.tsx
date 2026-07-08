import React from 'react';
import { Card, Row, Col, Progress, Statistic } from 'antd';
import { topClients } from '../../mock/skaData';
import { useSegmentation } from '../../contexts/SegmentationContext';

const ProfitInsight: React.FC = () => {
  const { getEffectiveRules } = useSegmentation();

  const enrichedClients = topClients
    .map((c) => {
      const rules = getEffectiveRules(c.studio);
      const color =
        c.grossMargin >= rules.profitMarginGood
          ? '#52c41a'
          : c.grossMargin >= rules.profitMarginWarning
          ? '#faad14'
          : '#ff4d4f';
      return {
        ...c,
        isBigClient: c.contractAmount >= rules.bigClientThreshold,
        isSilent: c.lastOrderDays >= rules.silentDaysThreshold,
        marginColor: color,
      };
    })
    .filter((c) => c.isBigClient);

  return (
    <Card title="单客毛利透视" bordered={false}>
      <Row gutter={[16, 16]}>
        {enrichedClients.slice(0, 6).map((client) => (
          <Col span={8} key={client.id}>
            <Card
              size="small"
              bordered
              hoverable
              style={{ borderColor: client.marginColor }}
            >
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 500 }}>{client.name}</span>
                {client.isSilent && (
                  <span style={{ color: '#ff4d4f', marginLeft: 8, fontSize: 12 }}>
                    ⚠ 沉默
                  </span>
                )}
              </div>
              <Progress
                percent={client.grossMargin}
                format={(val) => `${val}%`}
                strokeColor={client.marginColor}
                style={{ marginBottom: 12 }}
              />
              <Row gutter={8}>
                <Col span={12}>
                  <Statistic
                    title="服务成本"
                    value={client.serviceCost}
                    precision={0}
                    valueStyle={{ fontSize: 14 }}
                    prefix="¥"
                    suffix="元"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="毛利"
                    value={client.grossProfit}
                    precision={0}
                    valueStyle={{
                      fontSize: 14,
                      color: client.grossProfit > 0 ? '#52c41a' : '#ff4d4f',
                    }}
                    prefix="¥"
                    suffix="元"
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                营收: ¥{(client.financeRevenue / 10000).toFixed(1)}万
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default ProfitInsight;
