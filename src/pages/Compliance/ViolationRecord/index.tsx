import {
  createViolationRecord,
  deleteViolationRecord,
  getUnit,
  getViolationRecord,
  updateViolationRecord,
} from '@/services/violationRecord';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Form, message, Modal } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [formTitle, setFormTitle] = useState<string>('');
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const getSelectUnit = async () => {
    {
      const { result } = (await getUnit({})) || {};
      return (
        result?.pageList?.map((item: any) => ({
          label: item.unitName,
          value: item.id,
        })) || []
      );
    }
  };

  const getList = async (params: ParamsType) => {
    const { result } = await getViolationRecord({
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
        await deleteViolationRecord(id);
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
      await updateViolationRecord(data);
      message.success('修改成功！');
      actionRef?.current?.reload();
      handleModalOpen(false);
      form.resetFields();
      return;
    }

    await createViolationRecord(data);
    message.success('创建成功！');
    actionRef?.current?.reload();
    handleModalOpen(false);
    form.resetFields();
  };

  const onUpdate = (data: any) => {
    setFormTitle('编辑违规行为记录');
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
      title: '违规单位',
      dataIndex: 'unitName',
    },
    {
      title: '违规员工',
      dataIndex: 'violationEmployee',
      search: false,
    },
    {
      title: '违规时间',
      dataIndex: 'violationAt',
      search: false,
      render: (value: any) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '行为描述',
      dataIndex: 'behaviorDescription',
      search: false,
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
        headerTitle={'违规行为记录'}
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
              setFormTitle('新建违规行为记录');
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
        <ProFormSelect
          width="xl"
          name="violationUnitId"
          label="违规单位"
          request={getSelectUnit}
          rules={[
            {
              required: true,
              message: '违规单位为必填项',
            },
          ]}
        />
        <ProFormText
          width="xl"
          label="违规员工"
          name="violationEmployee"
          rules={[
            {
              required: true,
              message: '违规员工为必填项',
            },
          ]}
        />
        <ProFormTextArea
          width="xl"
          name="behaviorDescription"
          label="行为描述"
          rules={[
            {
              required: true,
              message: '行为描述为必填项',
            },
          ]}
        />
        <ProFormDateTimePicker
          width="xl"
          name="violationAt"
          label="违规时间"
          rules={[
            {
              required: true,
              message: '违规时间为必填项',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
