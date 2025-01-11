import {
  createComplianceUnit,
  deleteComplianceUnit,
  getComplianceUnit,
} from '@/services/unitConfig';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
// import type { FormValueType } from './components/UpdateForm';
// import UpdateForm from './components/UpdateForm';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '单位名称',
      dataIndex: 'unitName',
    },
    {
      title: '单位级别',
      dataIndex: 'unitLevel',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        // <a>编辑</a>,
        <a onClick={() => onDelete(record.id)}>删除</a>,
      ],
    },
  ];

  const getList = async (params: ParamsType) => {
    const { result } = await getComplianceUnit({
      unitName: params.unit_name,
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
    const hide = message.loading('正在删除!');
    await deleteComplianceUnit(id);
    if (actionRef.current?.setPageInfo) {
      actionRef.current?.setPageInfo({ current: 1 });
      actionRef?.current?.reload();
    }
    hide();
    message.success('删除成功!');
  };

  const onAdd = async (onAdd: any) => {
    await createComplianceUnit(onAdd);
    message.success('创建成功！');
    actionRef?.current?.reload();
    handleModalOpen(false);
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle={'单位配置'}
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
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getList}
        columns={columns}
      />
      <ModalForm
        title={'新建单位'}
        width="400px"
        layout="horizontal"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={onAdd}
      >
        <ProFormText
          width="md"
          name="unitName"
          label="单位名称"
          rules={[
            {
              required: true,
              message: '单位名称为必填项',
            },
          ]}
        />
        <ProFormSelect
          width="md"
          name="unitLevel"
          label="单位等级"
          options={[
            {
              value: '一级单位',
              label: '一级单位',
            },
            {
              value: '二级单位',
              label: '二级单位',
            },
            {
              value: '三级单位',
              label: '三级单位',
            },
          ]}
          rules={[
            {
              required: true,
              message: '单位等级为必填项',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
