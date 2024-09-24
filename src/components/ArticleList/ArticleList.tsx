import React from 'react';
import moment from 'moment';
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

  // 格式化发布时间的函数
  const formatCreatedTime = (createdTime: string) => {
    const time = moment(createdTime); // 使用 moment 解析时间
    const now = moment(); // 当前时间

    // 如果时间差小于等于3天，返回相对时间
    if (now.diff(time, 'days') <= 3) {
      return time.fromNow(); // 例如 "6 days ago"
    }

    // 否则返回具体日期时间
    return time.format('YYYY-MM-DD HH:mm:ss'); // 例如 "2024-09-13 16:25:13"
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
            padding: '16px 16px',
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
              <div style={{paddingTop:5}}></div>
              <p
                style={{
                  margin: 0,
                  color: '#999', // 灰色字体
                  fontSize: '12px', // 小号字体
                }}
              >
                {formatCreatedTime(article.createdTime)} {/* 使用格式化时间 */}
              </p>
            </div>
          </div>

          <Title
            level={5}
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
             {/*{article.category}*/}
          </Paragraph>
          <div style={{ marginTop: '20px', color: '#999' }}>
            <a style={{ color: 'inherit', textDecoration: 'none' }}>
              <LikeOutlined /> {article.likeNum}
            </a>


            &nbsp;&nbsp;&nbsp;&nbsp;
            <a style={{ color: 'inherit', textDecoration: 'none' }}>
              <StarOutlined /> {article.favourNum}
            </a>

            &nbsp;&nbsp;&nbsp;&nbsp;
            <CommentOutlined /> 0
          </div>
          {/*<br />*/}
          <hr style={{ backgroundColor: '#f0f0f0', height: '1px', border: 'none' }} /> {/* 修改后的 hr 样式 */}
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
