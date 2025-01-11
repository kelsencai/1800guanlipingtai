import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'zzkj合规信息化系统平台',
          title: 'zzkj合规信息化系统平台',
          href: '/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
