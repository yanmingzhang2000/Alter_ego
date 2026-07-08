import React, { useState, useMemo, useContext } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Tabs, Tooltip, Button, Breadcrumb } from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  RiseOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { GlobalFilterContext } from '../App';
import {
  buildFilteredHierarchy,
  DivisionDetail,
  StudioDetail,
  CrossMatrix,
  CrossMatrixCell,
} from '../mock/hierarchyData';

type ViewLevel = 'division' | 'studio' | 'businessLine';

const formatMoney = (val: number) => `¥${(val / 10000).toFixed(1)}万`;
const formatPercent = (val: number) => `${val.toFixed(1)}%`;

const DivisionKPICards: React.FC<{ data: DivisionDetail }> = ({ data }) => (
  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
    <Col xs={12} sm={8} lg={4}>
      <Card hoverable>
        <Statistic title="总营收" value={data.totalRevenue} precision={0} prefix="¥" suffix="元" />
      </Card>
    </Col>
    <Col xs={12} sm={8} lg={4}>
      <Card hoverable>
        <Statistic title="总成本" value={data.totalCost} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#ff4d4f' }} />
      </Card>
    </Col>
    <Col xs={12} sm={8} lg={4}>
      <Card hoverable>
        <Statistic title="毛利" value={data.grossProfit} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#52c41a' }} />
      </Card>
    </Col>
    <Col xs={12} sm={8} lg={4}>
      <Card hoverable>
        <Statistic title="毛利率" value={data.grossMargin} precision={1} suffix="%" valueStyle={{ color: '#1677ff' }} />
      </Card>
    </Col>
    <Col xs={12} sm={8} lg={4}>
      <Card hoverable>
        <Statistic title="客户数" value={data.clientCount} suffix="家" />
      </Card>
    </Col>
    <Col xs={12} sm={8} lg={4}>
      <Card hoverable>
        <Statistic title="人均营收" value={data.headcount > 0 ? Math.round(data.totalRevenue / data.headcount) : 0} precision={0} prefix="¥" suffix="元" />
      </Card>
    </Col>
  </Row>
);

const StudioCards: React.FC<{
  studios: StudioDetail[];
  onSelect: (studioName: string) => void;
}> = ({ studios, onSelect }) => {
  const chartData = studios.flatMap((s) =>
    s.businessLines.map((bl) => ({
      studio: s.name,
      businessLine: bl.name,
      revenue: bl.revenue / 10000,
    }))
  );

  const columnConfig = {
    data: chartData,
    xField: 'studio',
    yField: 'revenue',
    seriesField: 'businessLine',
    isStack: true,
    height: 200,
    legend: { position: 'top' as const },
    axis: { y: { title: '营收（万元）' } },
    label: { position: 'middle' as const, style: { fill: '#fff', fontSize: 10 } },
  };

  return (
    <Card
      title={
        <Space>
          <DeploymentUnitOutlined style={{ color: '#722ed1' }} />
          <span>工作室级数据</span>
        </Space>
      }
      style={{ marginBottom: 24 }}
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Column {...columnConfig} />
        </Col>
        <Col xs={24} lg={10}>
          <Row gutter={[12, 12]}>
            {studios.map((studio) => (
              <Col xs={12} key={studio.name}>
                <Card
                  hoverable
                  size="small"
                  onClick={() => onSelect(studio.name)}
                  style={{ cursor: 'pointer' }}
                  bordered
                >
                  <Statistic
                    title={studio.name}
                    value={studio.totalRevenue}
                    precision={0}
                    prefix="¥"
                    suffix="元"
                    valueStyle={{ fontSize: 18 }}
                  />
                  <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                    毛利率 <span style={{ color: studio.grossMargin >= 25 ? '#52c41a' : '#faad14' }}>
                      {formatPercent(studio.grossMargin)}
                    </span>
                    <span style={{ marginLeft: 8 }}>客户 {studio.clientCount}家</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

const BusinessLineCards: React.FC<{ division: DivisionDetail }> = ({ division }) => {
  const blMap = new Map<string, { name: string; revenue: number; cost: number; profit: number; clientCount: number }>();

  division.studios.forEach((studio) => {
    studio.businessLines.forEach((bl) => {
      const existing = blMap.get(bl.code);
      if (existing) {
        existing.revenue += bl.revenue;
        existing.cost += bl.cost;
        existing.profit += bl.profit;
        existing.clientCount += bl.clientCount;
      } else {
        blMap.set(bl.code, {
          name: bl.name,
          revenue: bl.revenue,
          cost: bl.cost,
          profit: bl.profit,
          clientCount: bl.clientCount,
        });
      }
    });
  });

  const blData = Array.from(blMap.entries()).map(([code, data]) => ({
    code,
    ...data,
    margin: data.revenue > 0 ? Math.round((data.profit / data.revenue) * 1000) / 10 : 0,
  }));

  const pieData = blData.map((bl) => ({
    type: bl.name,
    value: bl.revenue / 10000,
  }));

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    height: 200,
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      text: 'type',
      position: 'outside' as const,
    },
    legend: { position: 'bottom' as const },
  };

  return (
    <Card
      title={
        <Space>
          <ApartmentOutlined style={{ color: '#13c2c2' }} />
          <span>业务线级数据</span>
        </Space>
      }
      style={{ marginBottom: 24 }}
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Pie {...pieConfig} />
        </Col>
        <Col xs={24} lg={14}>
          <Table
            dataSource={blData}
            rowKey="code"
            pagination={false}
            size="small"
            columns={[
              {
                title: '业务线',
                dataIndex: 'name',
                render: (text: string, record: { code: string }) => (
                  <Space>
                    <span style={{ fontWeight: 500 }}>{text}</span>
                    <Tag>{record.code}</Tag>
                  </Space>
                ),
              },
              {
                title: '营收',
                dataIndex: 'revenue',
                align: 'right' as const,
                render: (val: number) => formatMoney(val),
              },
              {
                title: '毛利',
                dataIndex: 'profit',
                align: 'right' as const,
                render: (val: number) => formatMoney(val),
              },
              {
                title: '毛利率',
                dataIndex: 'margin',
                align: 'right' as const,
                render: (val: number) => (
                  <Tag color={val >= 25 ? 'green' : val >= 20 ? 'orange' : 'red'}>
                    {formatPercent(val)}
                  </Tag>
                ),
              },
              {
                title: '客户数',
                dataIndex: 'clientCount',
                align: 'center' as const,
                render: (val: number) => `${val}家`,
              },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );
};

const CrossMatrixTable: React.FC<{
  crossMatrix: CrossMatrix;
  onDrillDown: (studioName: string, blCode: string) => void;
}> = ({ crossMatrix, onDrillDown }) => {
  const columns = [
    {
      title: '工作室 \\ 业务线',
      dataIndex: 'studio',
      key: 'studio',
      fixed: 'left' as const,
      width: 140,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    ...crossMatrix.businessLines.map((bl) => ({
      title: `${bl.name}（${bl.code}）`,
      dataIndex: bl.code,
      key: bl.code,
      align: 'right' as const,
      render: (val: CrossMatrixCell | null) => {
        if (!val) return <span style={{ color: '#ccc' }}>-</span>;
        return (
          <Tooltip title={`毛利率: ${formatPercent(val.margin)} | 客户: ${val.clientCount}家`}>
            <Button
              type="link"
              size="small"
              onClick={() => onDrillDown(val.studioName, val.businessLineCode)}
              style={{ padding: 0 }}
            >
              {formatMoney(val.revenue)}
            </Button>
          </Tooltip>
        );
      },
    })),
    {
      title: '合计',
      key: 'total',
      align: 'right' as const,
      render: (_: unknown, record: { studio: string }) => {
        const total = crossMatrix.rowTotals[record.studio];
        return total ? <strong>{formatMoney(total.revenue)}</strong> : '-';
      },
    },
  ];

  const dataSource = crossMatrix.studios.map((studioName) => {
    const row: Record<string, string | CrossMatrixCell | null> = { studio: studioName };
    crossMatrix.businessLines.forEach((bl) => {
      const cell = crossMatrix.cells.find(
        (c) => c.studioName === studioName && c.businessLineCode === bl.code
      );
      row[bl.code] = cell || null;
    });
    return row;
  });

  const totalRow = {
    studio: '合计',
    ...crossMatrix.businessLines.reduce((acc, bl) => {
      acc[bl.code] = crossMatrix.colTotals[bl.code];
      return acc;
    }, {} as Record<string, { revenue: number }>),
  };

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined style={{ color: '#fa8c16' }} />
          <span>工作室 × 业务线 交叉矩阵</span>
        </Space>
      }
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={[...dataSource, totalRow]}
        rowKey="studio"
        pagination={false}
        size="small"
        scroll={{ x: 800 }}
        onRow={(record) => ({
          style: record.studio === '合计' ? { fontWeight: 700, background: '#fafafa' } : {},
        })}
      />
    </Card>
  );
};

const HierarchyDashboard: React.FC = () => {
  const { filter } = useContext(GlobalFilterContext);
  const [viewLevel, setViewLevel] = useState<ViewLevel>('division');
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
  const [selectedBL, setSelectedBL] = useState<string | null>(null);

  const { division, crossMatrix } = useMemo(
    () => buildFilteredHierarchy(filter.studio, filter.businessLine),
    [filter.studio, filter.businessLine]
  );

  const handleStudioSelect = (studioName: string) => {
    setSelectedStudio(studioName);
    setViewLevel('studio');
  };

  const handleDrillDown = (studioName: string, blCode: string) => {
    setSelectedStudio(studioName);
    setSelectedBL(blCode);
    setViewLevel('businessLine');
  };

  const breadcrumbItems = [
    { title: <BankOutlined /> },
    viewLevel === 'division' && { title: '事业部总览' },
    viewLevel === 'studio' && {
      title: (
        <Button type="link" size="small" onClick={() => setViewLevel('division')} style={{ padding: 0 }}>
          事业部总览
        </Button>
      ),
    },
    viewLevel === 'studio' && { title: selectedStudio || '' },
    viewLevel === 'businessLine' && {
      title: (
        <Button type="link" size="small" onClick={() => setViewLevel('division')} style={{ padding: 0 }}>
          事业部总览
        </Button>
      ),
    },
    viewLevel === 'businessLine' && {
      title: (
        <Button type="link" size="small" onClick={() => setViewLevel('studio')} style={{ padding: 0 }}>
          {selectedStudio}
        </Button>
      ),
    },
    viewLevel === 'businessLine' && { title: selectedBL || '' },
  ].filter(Boolean);

  const studioDetail = selectedStudio ? division.studios.find((s) => s.name === selectedStudio) : null;
  const blDetail = studioDetail?.businessLines.find((bl) => bl.code === selectedBL);

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0, fontWeight: 600 }}>层级KPI看板</h2>
        </Col>
        <Col>
          <Tabs
            activeKey={viewLevel}
            onChange={(key) => setViewLevel(key as ViewLevel)}
            items={[
              { key: 'division', label: '事业部级' },
              { key: 'studio', label: '工作室级' },
              { key: 'businessLine', label: '业务线级' },
            ]}
          />
        </Col>
      </Row>

      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />

      <DivisionKPICards data={division} />

      {viewLevel === 'division' && (
        <>
          <StudioCards studios={division.studios} onSelect={handleStudioSelect} />
          <BusinessLineCards division={division} />
          <CrossMatrixTable crossMatrix={crossMatrix} onDrillDown={handleDrillDown} />
        </>
      )}

      {viewLevel === 'studio' && studioDetail && (
        <>
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: '#722ed1' }} />
                <span>{studioDetail.name} - 详情</span>
              </Space>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic title="总营收" value={studioDetail.totalRevenue} precision={0} prefix="¥" suffix="元" />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic title="毛利" value={studioDetail.grossProfit} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#52c41a' }} />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic title="毛利率" value={studioDetail.grossMargin} precision={1} suffix="%" valueStyle={{ color: '#1677ff' }} />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic title="客户数" value={studioDetail.clientCount} suffix="家" />
              </Col>
            </Row>
          </Card>

          <Card
            title={
              <Space>
                <ApartmentOutlined style={{ color: '#13c2c2' }} />
                <span>{studioDetail.name} - 业务线构成</span>
              </Space>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <Table
              dataSource={studioDetail.businessLines}
              rowKey="code"
              pagination={false}
              size="small"
              onRow={(record) => ({
                style: { cursor: 'pointer' },
                onClick: () => handleDrillDown(studioDetail.name, record.code),
              })}
              columns={[
                {
                  title: '业务线',
                  dataIndex: 'name',
                  render: (text: string, record: { code: string }) => (
                    <Space>
                      <span style={{ fontWeight: 500 }}>{text}</span>
                      <Tag>{record.code}</Tag>
                    </Space>
                  ),
                },
                {
                  title: '营收',
                  dataIndex: 'revenue',
                  align: 'right' as const,
                  render: (val: number) => formatMoney(val),
                },
                {
                  title: '毛利',
                  dataIndex: 'profit',
                  align: 'right' as const,
                  render: (val: number) => formatMoney(val),
                },
                {
                  title: '毛利率',
                  dataIndex: 'margin',
                  align: 'right' as const,
                  render: (val: number) => (
                    <Tag color={val >= 25 ? 'green' : val >= 20 ? 'orange' : 'red'}>
                      {formatPercent(val)}
                    </Tag>
                  ),
                },
                {
                  title: '客户数',
                  dataIndex: 'clientCount',
                  align: 'center' as const,
                  render: (val: number) => `${val}家`,
                },
                {
                  title: '人均营收',
                  dataIndex: 'headcount',
                  align: 'right' as const,
                  render: (_: number, record: { revenue: number; headcount: number }) =>
                    record.headcount > 0 ? formatMoney(Math.round(record.revenue / record.headcount)) : '-',
                },
              ]}
            />
          </Card>
        </>
      )}

      {viewLevel === 'businessLine' && blDetail && (
        <Card
          title={
            <Space>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span>{selectedStudio} - {blDetail.name}（{blDetail.code}）</span>
            </Space>
          }
          bordered={false}
        >
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic title="营收" value={blDetail.revenue} precision={0} prefix="¥" suffix="元" />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="成本" value={blDetail.cost} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#ff4d4f' }} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="毛利" value={blDetail.profit} precision={0} prefix="¥" suffix="元" valueStyle={{ color: '#52c41a' }} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="毛利率" value={blDetail.margin} precision={1} suffix="%" valueStyle={{ color: '#1677ff' }} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="客户数" value={blDetail.clientCount} suffix="家" />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="BD人数" value={blDetail.bdCount} suffix="人" />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="交付人数" value={blDetail.deliveryCount} suffix="人" />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="人均营收"
                value={blDetail.headcount > 0 ? Math.round(blDetail.revenue / blDetail.headcount) : 0}
                precision={0}
                prefix="¥"
                suffix="元"
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default HierarchyDashboard;
