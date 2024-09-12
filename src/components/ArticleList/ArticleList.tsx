import React from 'react';
import { Card, Typography } from 'antd';
import { CommentOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface ArticleListProps {
  articles: API.ArticleVO[]; // 使用全局类型
}

const { Title, Paragraph } = Typography;

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  const navigate = useNavigate(); // 使用 useNavigate 钩子

  const handleTitleClick = (id: number) => {
    const url = `/welcome/${id}`;
    window.open(url, '_blank'); // 打开文章详情
  };

  // 处理头像点击事件
  const handleAvatarClick = (userId: number) => {
    navigate('/my/userInfo', { state: { id: userId } }); // 导航到用户信息页
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '900px',
        margin: '0 0',
      }}
    >
      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            width: '100%',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.8)', // 设置背景色
            paddingTop: '16px',
            cursor: 'pointer',
            transition: 'box-shadow 0.3s', // 添加过渡效果
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img
              alt="头像"
              src={article.user?.userAvatar} // 头像 URL
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '10px',
                border: '2px solid #f0f0f0', // 头像边框
              }}
              onClick={() => handleAvatarClick(article.user?.id)} // 点击头像跳转
            />
            <div>
              <strong
                style={{
                  display: 'block', // 让 strong 标签占据整行
                  margin: 0,
                  cursor: 'pointer',
                  overflow: 'hidden', // 隐藏溢出的内容
                  textOverflow: 'ellipsis', // 溢出部分显示省略号
                  whiteSpace: 'normal', // 允许换行
                }}
                onClick={() => handleAvatarClick(article.user?.id)} // 点击用户名跳转
              >
                {article.user?.userName}
              </strong>
              <p
                style={{
                  margin: 0,
                  color: '#999', // 灰色字体
                  fontSize: '12px', // 小号字体
                }}
              >
                {article.createdTime || '2024.01.01'}
              </p>
            </div>
          </div>

          <Title
            level={4}
            style={{
              margin: 0,
              cursor: 'pointer',
              overflow: 'hidden', // 隐藏溢出的内容
              textOverflow: 'ellipsis', // 溢出部分显示省略号
              whiteSpace: 'normal', // 允许换行
            }}
            onClick={() => handleTitleClick(article.id)}
          >
            {article.title}
          </Title>

          <Paragraph ellipsis={{ rows: 2, expandable: true }} style={{ marginTop: '10px' }}>
            {article.category}
          </Paragraph>
          <div style={{ marginTop: '10px', color: '#999' }}>
            <LikeOutlined /> {article.likeNum}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <StarOutlined /> {article.favourNum}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <CommentOutlined /> 0
          </div>
          <br />
          <hr style={{ backgroundColor: '#f0f0f0', height: '1px', border: 'none' }} /> {/* 修改后的 hr 样式 */}
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
