import React, { useState } from 'react';
import {
  Drawer, Form, InputNumber, Button, Divider, Tabs, Space, Typography,
  Tooltip, Tag, Alert, message, type FormInstance,
} from 'antd';
import {
  QuestionCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  useSegmentation,
  type SegmentationRules,
} from '../../contexts/SegmentationContext';

const { Text } = Typography;

const STUDIOS = ['数字营销一室', '数字营销二室', '直播电商室', '内容创意室'] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

type RuleFormValues = Partial<SegmentationRules>;

const RulesForm: React.FC<{
  form: FormInstance<RuleFormValues>;
  isOverride?: boolean;
  globalRules?: SegmentationRules;
}> = ({ form, isOverride = false, globalRules }) => {
  const ph = (field: keyof SegmentationRules, unit: string) =>
    isOverride && globalRules ? `全局默认 ${globalRules[field]}${unit}` : undefined;

  return (
    <Form form={form} layout="vertical" size="middle">
      {isOverride && (
        <Alert
          message="留空则继承全局默认值，仅填写需要覆盖的字段"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 12 }}>客户分层规则</Text>
      </Divider>

      <Form.Item
        label={
          <Space size={4}>
            大客户签约额门槛
            <Tooltip title="年度签约额 ≥ 此值的客户被标记为大客户（SKA），显示在水位线看板中">
              <QuestionCircleOutlined style={{ color: '#999' }} />
            </Tooltip>
          </Space>
        }
        name="bigClientThreshold"
        rules={!isOverride ? [{ required: true, message: '请输入门槛金额' }] : []}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={100000}
          placeholder={ph('bigClientThreshold', '元')}
          addonBefore="¥"
          addonAfter="元"
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parser={(v) => Number((v ?? '').replace(/,/g, '')) as any}
        />
      </Form.Item>

      <Form.Item
        label={
          <Space size={4}>
            沉默预警天数
            <Tooltip title="距上次订单超过此天数，客户进入「沉默预警」状态并标红">
              <QuestionCircleOutlined style={{ color: '#999' }} />
            </Tooltip>
          </Space>
        }
        name="silentDaysThreshold"
        rules={!isOverride ? [{ required: true, message: '请输入天数' }] : []}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          max={365}
          placeholder={ph('silentDaysThreshold', '天')}
          addonAfter="天无订单触发预警"
        />
      </Form.Item>

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 12 }}>毛利率红绿灯阈值</Text>
      </Divider>

      <Form.Item
        label={
          <Space size={4}>
            <Tag color="green" style={{ marginRight: 0 }}>绿灯</Tag>健康毛利率
            <Tooltip title="毛利率 ≥ 此值，显示绿色">
              <QuestionCircleOutlined style={{ color: '#999' }} />
            </Tooltip>
          </Space>
        }
        name="profitMarginGood"
        rules={!isOverride ? [{ required: true, message: '请输入' }] : []}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          placeholder={ph('profitMarginGood', '%')}
          addonAfter="%"
        />
      </Form.Item>

      <Form.Item
        label={
          <Space size={4}>
            <Tag color="orange" style={{ marginRight: 0 }}>黄灯</Tag>预警毛利率
            <Tooltip title="毛利率介于预警值和健康值之间，显示橙色">
              <QuestionCircleOutlined style={{ color: '#999' }} />
            </Tooltip>
          </Space>
        }
        name="profitMarginWarning"
        rules={!isOverride ? [{ required: true, message: '请输入' }] : []}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          placeholder={ph('profitMarginWarning', '%')}
          addonAfter="%"
        />
      </Form.Item>

      <Form.Item
        label={
          <Space size={4}>
            <Tag color="red" style={{ marginRight: 0 }}>红灯</Tag>危险毛利率
            <Tooltip title="毛利率低于此值，显示红色">
              <QuestionCircleOutlined style={{ color: '#999' }} />
            </Tooltip>
          </Space>
        }
        name="profitMarginBad"
        rules={!isOverride ? [{ required: true, message: '请输入' }] : []}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          placeholder={ph('profitMarginBad', '%')}
          addonAfter="%"
        />
      </Form.Item>
    </Form>
  );
};

const SegmentationSettings: React.FC<Props> = ({ open, onClose }) => {
  const { globalRules, studioRules, updateGlobalRules, updateStudioRules, resetStudioRules } =
    useSegmentation();

  const [globalForm] = Form.useForm<RuleFormValues>();
  // 固定 4 个工作室，每个单独声明以遵守 hooks 规则
  const [studioForm0] = Form.useForm<RuleFormValues>();
  const [studioForm1] = Form.useForm<RuleFormValues>();
  const [studioForm2] = Form.useForm<RuleFormValues>();
  const [studioForm3] = Form.useForm<RuleFormValues>();
  const studioForms: FormInstance<RuleFormValues>[] = [studioForm0, studioForm1, studioForm2, studioForm3];

  const [activeTab, setActiveTab] = useState('global');

  const handleAfterOpen = (v: boolean) => {
    if (!v) return;
    globalForm.setFieldsValue(globalRules);
    STUDIOS.forEach((studio, i) => {
      studioForms[i].setFieldsValue(studioRules[studio] ?? {});
    });
  };

  const handleSaveGlobal = async () => {
    const values = await globalForm.validateFields();
    updateGlobalRules(values as Partial<SegmentationRules>);
    message.success('全局规则已保存，看板实时生效');
  };

  const handleSaveStudio = async (studio: string, idx: number) => {
    const values = await studioForms[idx].validateFields();
    const cleaned = Object.fromEntries(
      (Object.entries(values as Record<string, unknown>)).filter(([, v]) => v !== null && v !== undefined)
    ) as Partial<SegmentationRules>;
    if (Object.keys(cleaned).length === 0) {
      resetStudioRules(studio);
      message.success(`${studio} 已重置为继承全局规则`);
    } else {
      updateStudioRules(studio, cleaned);
      message.success(`${studio} 自定义规则已保存`);
    }
  };

  const handleResetStudio = (studio: string, idx: number) => {
    resetStudioRules(studio);
    studioForms[idx].resetFields();
    message.info(`${studio} 已重置为全局默认`);
  };

  const hasStudioOverride = (studio: string) => {
    const r = studioRules[studio];
    return r && Object.keys(r).length > 0;
  };

  const tabItems = [
    {
      key: 'global',
      label: (
        <Space size={4}>
          全局默认
          <Tag color="blue" style={{ fontSize: 11, marginLeft: 0 }}>基准</Tag>
        </Space>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          <RulesForm form={globalForm} />
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveGlobal}>
              保存全局规则
            </Button>
          </div>
        </div>
      ),
    },
    ...STUDIOS.map((studio, idx) => ({
      key: studio,
      label: (
        <Space size={4}>
          {studio}
          {hasStudioOverride(studio) && (
            <Tag color="volcano" style={{ fontSize: 11, marginLeft: 0 }}>已定制</Tag>
          )}
        </Space>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          <RulesForm form={studioForms[idx]} isOverride globalRules={globalRules} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => handleResetStudio(studio, idx)}
              disabled={!hasStudioOverride(studio)}
            >
              重置为全局默认
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSaveStudio(studio, idx)}
            >
              保存 {studio} 规则
            </Button>
          </div>
        </div>
      ),
    })),
  ];

  return (
    <Drawer
      title="客户分层规则配置"
      width={520}
      open={open}
      onClose={onClose}
      afterOpenChange={handleAfterOpen}
      destroyOnClose={false}
      styles={{ body: { paddingTop: 12 } }}
    >
      <Alert
        message="规则修改后立即生效，看板数据将实时重新计算"
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
        size="small"
      />
    </Drawer>
  );
};

export default SegmentationSettings;
