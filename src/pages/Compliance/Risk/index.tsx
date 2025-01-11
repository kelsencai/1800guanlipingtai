import {
  createComplianceRisk,
  deleteComplianceRisk,
  getComplianceRisk,
  updateComplianceRisk,
} from '@/services/complianceRisk';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Form, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [formTitle, setFormTitle] = useState<string>('');
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const getList = async (params: ParamsType) => {
    const { result } = await getComplianceRisk({
      riskName: (params.riskName || '')?.trim(),
      page: {
        pageNo: params.current,
        pageSize: params.pageSize,
      },
    });

    return {
      total: result.count,
      data: result.pageList,
      success: true,
    };
  };

  const onDelete = async (id: number) => {
    Modal.confirm({
      title: '删除',
      content: '删除后无法恢复,请谨慎操作',
      onOk: async () => {
        const hide = message.loading('正在删除!');
        await deleteComplianceRisk(id);
        if (actionRef.current?.setPageInfo) {
          actionRef.current?.setPageInfo({ current: 1 });
          actionRef?.current?.reload();
        }
        hide();
        message.success('删除成功!');
      },
    });
  };

  const onAdd = async (data: any) => {
    if (data.id) {
      await updateComplianceRisk(data);
      message.success('修改成功！');
      actionRef?.current?.reload();
      handleModalOpen(false);
      form.resetFields();
      return;
    }

    await createComplianceRisk(data);
    message.success('创建成功！');
    actionRef?.current?.reload();
    handleModalOpen(false);
    form.resetFields();
  };

  const onUpdate = (data: any) => {
    setFormTitle('修改合规风险');
    handleModalOpen(true);
    form.setFieldsValue(data);
  };

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '风险名称',
      dataIndex: 'riskName',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevelName',
      search: false,
    },
    {
      title: '风险提示',
      dataIndex: 'riskTip',
      search: false,
      render: (url: any) => (
        <a href={url} target="_blank" rel="noreferrer">
          查看
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <Button key="edit" type="link" onClick={() => onUpdate(record)}>
          编辑
        </Button>,
        <Button key="delete" type="link" onClick={() => onDelete(record.id)}>
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={'合规风险'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
              setFormTitle('新建合规风险');
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getList}
        columns={columns}
      />
      <ModalForm
        title={formTitle}
        layout="horizontal"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={onAdd}
        form={form}
        width={600}
      >
        <ProFormText name="id" hidden />
        <ProFormText
          width="xl"
          name="riskName"
          label="风险名称"
          rules={[
            {
              required: true,
              message: '风险名称为必填项',
            },
          ]}
        />
        <ProFormRadio.Group
          width="xl"
          label="风险等级"
          name="riskLevelName"
          initialValue="低"
          options={['高', '中', '低']}
          rules={[
            {
              required: true,
              message: '风险等级为必填项',
            },
          ]}
        />
        <ProFormTextArea
          width="xl"
          name="riskTip"
          label="风险提示"
          rules={[
            {
              required: true,
              message: '风险提示为必填项',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
