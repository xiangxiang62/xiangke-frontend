import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Badge, Modal, message, Input, QRCode, Popover } from 'antd';
import { LikeOutlined, StarOutlined, CommentOutlined, ExclamationCircleOutlined, ShareAltOutlined } from '@ant-design/icons';
import './FloatingActionPanel.css'; // 引入自定义样式
import { doArticleFavourUsingPost } from "@/services/backend/articleFavourController";
import {doThumbUsingPost} from "@/services/backend/articleLikeController";

const { TextArea } = Input;
const currentUrl = window.location.href;

interface FloatingActionPanelProps {
  onCommentButtonClick: () => void; // 接收一个滚动函数作为属性
  id: string; // 传递文章 ID
  likeNum: number; // 点赞数
  favourNum: number; // 收藏数
  starred: boolean; // 收藏状态
  liked: boolean;
}

const FloatingActionPanel: React.FC<FloatingActionPanelProps> = ({
                                                                   onCommentButtonClick,
                                                                   likeNum,
                                                                   favourNum,
                                                                   id,
                                                                   liked,
                                                                   starred
                                                                 }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制弹出层的可见性
  const [likedNew, setLikedNew] = useState(liked); // 状态来控制点赞按钮的点击状态
  const [starredNew, setStarredNew] = useState(starred); // 状态来控制收藏按钮的点击状态
  const [currentFavourNum, setCurrentFavourNum] = useState(favourNum); // 状态来跟踪收藏数
  const [currentLikeNum, setCurrentLikeNum] = useState(likeNum); // 状态来跟踪收藏数

  useEffect(() => {
    // 初始化收藏状态
    setStarredNew(starred);
    setLikedNew(liked);
  }, [starred,liked]); // 依赖 starred，当 starred 变化时更新状态

  const showReportModal = () => {
    setIsModalVisible(true); // 显示弹出层
  };

  const handleOk = () => {
    console.log('举报已提交'); // 模拟提交操作
    setIsModalVisible(false); // 关闭弹出层
  };

  const handleCancel = () => {
    setIsModalVisible(false); // 关闭弹出层
  };

  const handleLikeClick = async () => {
    // setLikedNew(!liked); // 切换点赞状态
    try {
      await doThumbUsingPost({ id }); // 发送收藏请求
      setLikedNew(prevLikedNew => {
        const newLikedStatus = !prevLikedNew;
        setCurrentLikeNum(prevLikeNum => newLikedStatus ? prevLikeNum + 1 : prevLikeNum - 1);
        console.log(newLikedStatus)

        return newLikedStatus;
      });
      message.success(likedNew ? '已取消点赞' : '文章已点赞'); // 提示收藏状态
    } catch (error) {
      message.error('点赞操作失败');
    }
  };

  const handleStarClick = async () => {
    try {
      await doArticleFavourUsingPost({ id }); // 发送收藏请求
      setStarredNew(prevStarredNew => {
        const newStarredStatus = !prevStarredNew;
        setCurrentFavourNum(prevFavourNum => newStarredStatus ? prevFavourNum + 1 : prevFavourNum - 1);
        return newStarredStatus;
      });
      message.success(starredNew ? '已取消收藏' : '文章已收藏'); // 提示收藏状态
    } catch (error) {
      message.error('收藏操作失败');
    }
  };

  return (
    <div className="floating-action-panel">
      <Tooltip title="点赞">
        <Badge count={currentLikeNum} overflowCount={9999} className="action-badge">
          <Button
            shape="circle"
            icon={<LikeOutlined />}
            className={`action-button ${likedNew ? 'liked' : ''}`} // 根据状态切换 CSS 类
            onClick={handleLikeClick}
          />

        </Badge>
      </Tooltip>
      <Tooltip title="收藏">
        <Badge count={currentFavourNum} overflowCount={9999} className="action-badge">
          <Button
            shape="circle"
            icon={<StarOutlined />}
            className={`action-button ${starredNew ? 'starred' : ''}`} // 根据状态切换 CSS 类
            onClick={handleStarClick}
          />
        </Badge>
      </Tooltip>
      <Tooltip title="评论">
        <Badge count={10} overflowCount={9999} className="action-badge">
          <Button
            shape="circle"
            onClick={onCommentButtonClick}
            icon={<CommentOutlined />}
            className="action-button"
          />
        </Badge>
      </Tooltip>
      <Tooltip title="举报">
        <Button
          shape="circle"
          icon={<ExclamationCircleOutlined />}
          className="action-button"
          onClick={showReportModal} // 点击时显示弹出层
        />
      </Tooltip>
      <Tooltip title="分享">
        <Popover placement="leftBottom" content={<div className="share-tooltip-content-inner">
          <QRCode
            errorLevel="H"
            size={128}
            iconSize={32}
            value={currentUrl}
            icon="/logo.png"
          />
        </div>} title="分享">
          <div className="share-tooltip-content">
            <Button
              shape="circle"
              icon={<ShareAltOutlined />}
              className="action-button"
            />
          </div>
        </Popover>
      </Tooltip>

      {/* 举报弹出层 */}
      <Modal
        title="举报内容"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="提交"
        cancelText="取消"
      >
        <p>请描述您要举报的问题：</p>
        <TextArea rows={4} placeholder="请输入举报理由" />
      </Modal>
    </div>
  );
};

export default FloatingActionPanel;
