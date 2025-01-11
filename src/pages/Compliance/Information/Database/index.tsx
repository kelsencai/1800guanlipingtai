import {
  createComplianceInfoLibrary,
  deleteComplianceInfoLibrary,
  getComplianceInfoLibrary,
  updateComplianceInfoLibrary,
} from '@/services/complianceInfoLibrary';
import { uploadFile } from '@/services/upload';
import { getUnit } from '@/services/violationRecord';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Form, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [formTitle, setFormTitle] = useState<string>('');
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const getList = async (params: ParamsType) => {
    const { result } = await getComplianceInfoLibrary({
      systemName: params.systemName,
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
        await deleteComplianceInfoLibrary(id);
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
      data.file = data.file.map((file: any) =>
        file.response
          ? {
              name: file.response.file_id,
              path: file.response.path,
              originName: file.response.origin_name,
            }
          : {
              name: file.name,
              path: file.url,
              originName: file.originName,
            },
      );
      await updateComplianceInfoLibrary(data);
      message.success('修改成功！');
      actionRef?.current?.reload();
      handleModalOpen(false);
      form.resetFields();
      return;
    }

    data.file = data.file.map((file: any) => file.response);
    await createComplianceInfoLibrary(data);
    message.success('创建成功！');
    actionRef?.current?.reload();
    handleModalOpen(false);
    form.resetFields();
  };

  const onCustomUpload = async (info: any) => {
    const { file, onSuccess } = info;
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadFile(formData);
    onSuccess(res.result);
  };

  const onUpdate = (data: any) => {
    setFormTitle('修改合规内规信息');
    data.file = [
      {
        uid: '-1',
        ...data.file,
      },
    ];
    handleModalOpen(true);
    form.setFieldsValue(data);
  };

  const getSelectUnit = async () => {
    const { result } = (await getUnit({})) || {};
    return (
      result?.pageList?.map((item: any) => ({
        label: item.unitName,
        value: item.id,
      })) || []
    );
  };

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '制度名称',
      dataIndex: 'systemName',
    },
    {
      title: '发布时间',
      dataIndex: 'publishAt',
      search: false,
    },
    {
      title: '发文字号',
      dataIndex: 'docNumber',
      search: false,
    },
    {
      title: '归属文件',
      dataIndex: 'fileId',
      search: false,
      render: (_, record: any) => (
        <a href={record.file?.path} target="_blank" rel="noreferrer">
          查看
        </a>
      ),
    },
    {
      title: '归属单位',
      dataIndex: 'unitName',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a key="update" onClick={() => onUpdate(record)}>
          编辑
        </a>,
        <a key="delete" onClick={() => onDelete(record.id)}>
          删除
        </a>,
      ],
    },
  ];

  useEffect(() => {
    if (!createModalOpen) {
      form.resetFields();
    }
  }, [createModalOpen]);

  return (
    <PageContainer>
      <ProTable
        headerTitle={'合规内规信息'}
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
              setFormTitle('新建合规内规信息');
              handleModalOpen(true);
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
          name="systemName"
          label="制度名称"
          rules={[
            {
              required: true,
              message: '制度名称为必填项',
            },
          ]}
        />
        <ProFormDateTimePicker
          width="xl"
          name="publishAt"
          label="发布时间"
          rules={[
            {
              required: true,
              message: '发布时间为必填项',
            },
          ]}
        />
        <ProFormText
          width="xl"
          name="docNumber"
          label="发文字号"
          rules={[
            {
              required: true,
              message: '发文字号为必填项',
            },
          ]}
        />
        <ProFormUploadButton
          width="md"
          name="file"
          label="合规文件"
          fieldProps={{ customRequest: onCustomUpload, maxCount: 1 }}
          rules={[
            {
              required: true,
              message: '合规文件为必填项',
            },
          ]}
        />
        <ProFormSelect
          width="xl"
          name="unitId"
          label="归属单位"
          request={getSelectUnit}
          rules={[
            {
              required: true,
              message: '归属单位为必填项',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
