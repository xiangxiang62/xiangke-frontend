import React from 'react';
import {Avatar} from 'antd';
import {AntDesignOutlined} from '@ant-design/icons';
import './UserInfo.css'; // 引入 CSS 文件
interface UserInfoProps {
  style?: React.CSSProperties; // 添加 style 属性
  src?: string;
  userName?: string;
  onClick?: () => void; // 添加 onClick 属性
}

const UserInfo: React.FC<UserInfoProps> = ({style, src, userName, onClick}) => {
  return (
    <div style={style} onClick={onClick} className="user-info-container">
      <Avatar
        size={{xs: 100, sm: 100, md: 100, lg: 100, xl: 100, xxl: 100}}
        icon={<AntDesignOutlined/>}
        alt="未知头像"
        src={src}
        style={{
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // 添加光环效果
          border: '10px solid #f0f0f0', // 可选的边框效果
        }}
      />
      {userName && (
        <div className="user-name-tag">
          <strong>
            &nbsp;&nbsp;&nbsp;
            {userName}
          </strong>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
