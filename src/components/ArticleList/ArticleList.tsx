// ArticleList.tsx
import React from 'react';
import {Card,Badge, Typography, Space, Button, Avatar} from 'antd';
import {CommentOutlined, LikeOutlined, StarOutlined} from '@ant-design/icons';


interface ArticleListProps {
  articles: API.ArticleVO[]; // 使用全局类型
}

const { Title, Paragraph } = Typography;

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  const handleTitleClick = (id: number) => {
    // 根据 id 生成目标 URL
    const url = `/welcome/${id}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', maxWidth: '800px', margin: '0 auto' }}>
      {articles.map(article => (
        <Card
          key={article.id}
          hoverable={true}
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                alt="头像"
                src={article.user?.userAvatar} // 替换为头像的 URL
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '10px',
                  border: '2px solid #f0f0f0', // 头像边框
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // 头像阴影
                }}
              />
              <Title level={4} style={{ margin: 0, cursor: 'pointer' }} onClick={() => handleTitleClick(article.id)}>
                {article.title}
              </Title>
            </div>
          }
          bordered={false}
          style={{
            width: '100%',
            marginBottom: '20px', // 设置底部间隔
            background: 'linear-gradient(to bottom, #B3E5FC, transparent)',
            padding: '16px', // 内边距
            borderRadius: '8px', // 卡片圆角
          }}

        >

          <Paragraph ellipsis={{ rows: 2, expandable: true }}>
            {article.category}
          </Paragraph>
          <br/>
          <LikeOutlined /> {article.likeNum}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <StarOutlined /> {article.favourNum}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <CommentOutlined/> 0
        </Card>
      ))}
    </div>

  );
};

export default ArticleList;
