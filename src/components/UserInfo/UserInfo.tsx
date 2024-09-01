import React from 'react';
import { Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';

interface UserInfoProps {
  style?: React.CSSProperties; // 添加 style 属性
  src?: string;
  userName?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ style, src, userName }) => {
  return (
    <div style={style}>
      <Avatar
        size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 140, xxl: 100 }}
        icon={<AntDesignOutlined />}
        alt="未知头像"
        src={src}
        style={{
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // 添加光环效果
          border: '10px solid #f0f0f0', // 可选的边框效果
        }}
      />
      <h1 style={{marginLeft:"40px"}}>{userName}</h1>
    </div>
  );
};

export default UserInfo;
