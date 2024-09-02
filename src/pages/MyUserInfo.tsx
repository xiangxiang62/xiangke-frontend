import React from 'react';
import { Card, Avatar, Descriptions, Badge } from 'antd';
import { useModel } from '@umijs/max';
import { UserOutlined } from '@ant-design/icons';

const UserProfile: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card
        style={{ width: 400, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Avatar
            size={100}
            src={currentUser?.userAvatar}
            icon={<UserOutlined />}
            style={{ marginBottom: 20 }}
          />
          <h2>{currentUser?.userName || '未命名用户'}</h2>
          <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{currentUser?.userProfile || '这位用户很神秘，没有留下任何个人简介。'}</p>
        </div>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="用户ID">{currentUser?.id || '未知'}</Descriptions.Item>
          <Descriptions.Item label="用户角色">
            <Badge status={currentUser?.userRole === 'admin' ? 'success' : 'default'} text={currentUser?.userRole === 'admin' ? '管理员' : '普通用户'} />
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{currentUser?.createTime || '未知'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{currentUser?.updateTime || '未知'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserProfile;
