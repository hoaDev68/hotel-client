'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Layout, Menu, ConfigProvider, Image, FloatButton, theme, App as AntdApp } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SimpleBar from 'simplebar-react';
import routes from './routes';
import 'simplebar-react/dist/simplebar.min.css';

const { Sider, Content } = Layout;

type IMainProps = {
  children: ReactNode;
};

function MainAdmin({ children }: IMainProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [urlSelectedSub, setUrlSelectedSub] = useState<string>('');
  const [openKeysMainMenu, setOpenKeysMainMenu] = useState<string[]>([]);
  const { token } = theme.useToken();

  useEffect(() => {
    const findRoute = routes.find((item) => pathname.includes(item.key));
    const pathnameLast = pathname.split('/')[2];
    if (pathnameLast === 'admin') {
      setUrlSelectedSub('admin/thong-ke');
    }
    if (findRoute?.key) {
      const latestOpenKey = [findRoute.key];
      if (!collapsed) {
        setOpenKeysMainMenu(latestOpenKey);
      }
      setUrlSelectedSub(findRoute.key);
    }
  }, [pathname, collapsed]);

  const onOpenChangeMainMenu = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeysMainMenu.indexOf(key) === -1);
    setOpenKeysMainMenu(latestOpenKey ? [latestOpenKey] : []);
  };

  const renderMenuItem = routes.map((route) => ({
    key: route.key,
    icon: route.icon,
    label: (
      <Link href={`/${route.key}`} scroll={false}>
        {route.label}
      </Link>
    ),
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#396fb7',
          borderRadius: 6,
        },
        components: {
          Menu: {
            itemSelectedBg: '#e6f4ff',
            itemSelectedColor: '#396fb7',
          },
        },
      }}
    >
      <AntdApp>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          width={250}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div 
            style={{ 
              height: 64,
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Link href="/admin/thong-ke">
              {collapsed ? (
                <div style={{ fontSize: 24, color: '#396fb7', fontWeight: 'bold' }}>SEA</div>
              ) : (
                <Image src="/logo.png" alt="Logo" preview={false} width={120} height={32} />
              )}
            </Link>
          </div>
          <SimpleBar style={{ height: 'calc(100vh - 64px)' }}>
            <Menu
              mode="inline"
              selectedKeys={[urlSelectedSub]}
              openKeys={openKeysMainMenu}
              onOpenChange={onOpenChangeMainMenu}
              items={renderMenuItem}
              style={{ border: 'none' }}
            />
          </SimpleBar>
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
          <Content style={{ padding: 24, minHeight: '100vh', background: '#fff' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
      <FloatButton.BackTop type="primary" icon={<ArrowUpOutlined />} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default MainAdmin;
