import React, { useCallback } from 'react';
import { Avatar, Button, Space } from 'antd';
import { LogoutOutlined, SettingOutlined, StarOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { flushSync } from 'react-dom';
import { Link } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import './HeaderDropdown.css';
import {userLogout} from "@/services/backend/userController";  // 导入 CSS 文件

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const loginOut = async () => {
    await userLogout();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }

      if (key === 'star') {
        history.push('/my/favorites');
        return;
      }
      if (key === 'userInfo') {
        history.push('/my/userInfo');
        return;
      }

      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const { currentUser } = initialState || {};

  const menuItems = [
    ...(menu
      ? [
        {
          key: 'center',
          icon: <UserOutlined />,
          label: '个人中心',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '个人设置',
        },
        {
          type: 'divider' as const,
        },
      ]
      : []),
    {
      key: 'userInfo',
      icon: <StarOutlined />,
      label: '个人信息',
    },
    {
      key: 'star',
      icon: <StarOutlined />,
      label: '我的收藏',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  if (!currentUser) {
    return (
      <div className="header-actions">
        <Link to="/user/login">
          <Button type="primary" shape="round">
            登录
          </Button>
        </Link>
      </div>
    );
  }

  // @ts-ignore
  return (
    <div className="header-actions">
      <Button
        type="primary"
        shape="round"
        icon={<EditOutlined />}
        onClick={() => history.push('/writePost')}
      >
        写文章
      </Button>

      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        <Space>
          {currentUser?.userAvatar ? (
            <Avatar size="small" src={currentUser?.userAvatar} />
          ) : (
            <Avatar size="small" icon={<UserOutlined />} />
          )}
          {currentUser?.userName?.length > 2 ? `${currentUser.userName.slice(0, 2)}...` : currentUser?.userName ?? '无名'}
        </Space>
      </HeaderDropdown>
    </div>
  );
};
