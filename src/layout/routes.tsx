import React from 'react'
import { AreaChartOutlined, HomeOutlined, ProductOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'

type MenuItem = {
    key: string;
    icon?: React.ReactNode | React.JSX.Element | string;
    label: React.ReactNode | React.JSX.Element | string;
    children?: MenuItem[];
    type?: 'group';
  };

  export const routes: MenuItem[] = [
    {
      key: 'admin/thong-ke',
      icon: <AreaChartOutlined />,
      label: 'Dashboard',
    },
    {
        key: 'admin/room',
        icon: <HomeOutlined />,
        label: 'Room',
    },
    {
        key: 'admin/booking',
        icon: <ProductOutlined />,
        label: 'Booking',
    },
    {
        key: 'admin/about',
        icon: <UserOutlined />,
        label: 'About',
    },
    {
        key: 'admin/setting',
        icon: <SettingOutlined />,
        label: 'Setting',
    }
  ];
  export default routes
