import React from 'react';
import { Button, Tooltip } from 'antd';
import { LikeOutlined, StarOutlined, CommentOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './FloatingActionPanel.css'; // 引入自定义样式

const FloatingActionPanel: React.FC = () => {
  return (
    <div className="floating-action-panel">
      <Tooltip title="点赞">
        <Button
          shape="circle"
          icon={<LikeOutlined />}
          className="action-button"
        />
      </Tooltip>
      <Tooltip title="收藏">
        <Button
          shape="circle"
          icon={<StarOutlined />}
          className="action-button"
        />
      </Tooltip>
      <Tooltip title="评论">
        <Button
          shape="circle"
          icon={<CommentOutlined />}
          className="action-button"
        />
      </Tooltip>
      <Tooltip title="举报">
        <Button
          shape="circle"
          icon={<ExclamationCircleOutlined />}
          className="action-button"
        />
      </Tooltip>
    </div>
  );
};

export default FloatingActionPanel;
