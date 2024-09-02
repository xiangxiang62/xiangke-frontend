import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Spin, theme } from 'antd';
import { MdViewer } from '@/components/MdEditor/ReactMdEditorByView';
import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';
import Comments from '@/components/Comment/Comment';
import UserInfo from '@/components/UserInfo/UserInfo';
import { getArticleVoByIdUsingGet } from '@/services/backend/articleController';
import { useNavigate, useParams } from 'react-router-dom';
import ArticleVO from '@/services/backend/typings';

const Welcome: React.FC = () => {
  const [articleContent, setArticleContent] = useState<ArticleVO>(); // 存储文章内容
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const commentsRef = useRef<HTMLDivElement>(null); // 创建引用来指向评论区域
  const { id } = useParams<{ id: string }>(); // 获取路由参数
  const navigate = useNavigate(); // 获取 navigate 函数

  // 平滑滚动到评论区域
  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');

  // 组件挂载时获取文章数据
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticleVoByIdUsingGet({ id }); // 替换为实际的 ID 或参数
        setArticleContent(response.data); // 根据实际的响应结构调整
        setLoading(false);
      } catch (error) {
        console.error('获取文章失败:', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div><Spin tip="Loading" size="large" /></div>; // 显示加载状态
  }

  // 处理头像点击事件
  const handleAvatarClick = () => {
    navigate('/my/userInfo', { state: { id: articleContent?.user?.id } });
  };

  // 时间处理
  const formatDate = (isoDateString:any) => {
    const date = new Date(isoDateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 使用 24 小时制
    }).replace(',', ''); // 移除默认的逗号分隔符
  };
  return (
    <PageContainer
      style={{
        background: 'linear-gradient(to bottom, #DCDCDC, #f5f5f5)', // 淡蓝色上下渐变
      }}
    >
      <Card
        style={{
          width: '100%',
          marginTop: '50px',
          marginLeft: 0,
          marginRight: 0,
          // paddingLeft: '5%',
          // paddingRight: '5%',
        }}
      >
        <UserInfo
          style={{
            position: 'absolute',
            top: '-10vh', // 使头像位于卡片上方
            left: '1vw',
            // zIndex: 1000,
            cursor: 'pointer', // 添加手型指针效果
          }}
          src={articleContent?.user?.userAvatar}
          userName={articleContent?.user?.userName}
          onClick={handleAvatarClick} // 处理头像点击事件
        />

        <div
          style={{
            width: '100%', // 设置宽度为 100% 以与 Card 相同
            marginTop: '20px', // 设置顶部边距
            // paddingLeft: '5%', // 确保内容与 Card 内边距对齐
            // paddingRight: '5%',
            boxSizing: 'border-box', // 确保 padding 不影响宽度
          }}
        >
          <h1><strong>{articleContent?.title}</strong></h1>
          <p>发布时间：{formatDate(articleContent?.createdTime)} &nbsp;&nbsp;&nbsp;&nbsp;浏览量：78</p>
          <MdViewer content={articleContent?.content} /> {/* 确保 MdViewer 的宽度是 100% */}
        </div>

        <FloatingActionPanel
          onCommentButtonClick={scrollToComments}
          favourNum={articleContent?.favourNum ?? 0}
          likeNum={articleContent?.likeNum ?? 0}
          id={id}
          starred={articleContent?.starred}
        />
        <hr />
        <div ref={commentsRef}> {/* 使用 ref 属性指向这个 div */}
          <Comments />
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
