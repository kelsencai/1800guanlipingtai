import {
  creactComplianceCase,
  deleteComplianceCase,
  getComplianceCase,
  updateComplianceCase,
} from '@/services/complianceCase';
import { uploadFile } from '@/services/upload';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
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
    const { result } = await getComplianceCase({
      caseName: params.caseName,
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
        await deleteComplianceCase(id);
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
      await updateComplianceCase(data);
      message.success('修改成功！');
      actionRef?.current?.reload();
      handleModalOpen(false);
      form.resetFields();
      return;
    }

    data.file = data.file.map((file: any) => file.response);
    await creactComplianceCase(data);
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
    setFormTitle('修改案例');
    data.file = [
      {
        uid: '-1',
        ...data.file,
      },
    ];
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
      title: '案例名称',
      dataIndex: 'caseName',
    },
    {
      title: '案例主体',
      dataIndex: 'caseSubject',
      search: false,
    },
    {
      title: '案例时间',
      dataIndex: 'caseAt',
      search: false,
    },
    {
      title: '案例详情',
      dataIndex: 'fileId',
      search: false,
      render: (_, record: any) => (
        <a href={record.file?.path} target="_blank" rel="noreferrer">
          查看
        </a>
      ),
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
        headerTitle={'合规案例'}
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
              setFormTitle('新建案例');
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
          name="caseName"
          label="案例名称"
          rules={[
            {
              required: true,
              message: '案例名称为必填项',
            },
          ]}
        />
        <ProFormDateTimePicker
          width="xl"
          name="caseAt"
          label="案例时间"
          rules={[
            {
              required: true,
              message: '案例时间为必填项',
            },
          ]}
        />
        <ProFormTextArea
          width="xl"
          name="caseSubject"
          label="案例主体"
          rules={[
            {
              required: true,
              message: '案例主体为必填项',
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
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
