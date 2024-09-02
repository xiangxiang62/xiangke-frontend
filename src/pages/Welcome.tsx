import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {Card, Input, Spin, theme} from 'antd';
import { MdViewer } from '@/components/MdEditor/ReactMdEditorByView';
import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';
import Comments from '@/components/Comment/Comment';
import UserInfo from '@/components/UserInfo/UserInfo';
import { getArticleVoByIdUsingGet } from '@/services/backend/articleController';
import {useParams} from "@@/exports";
import ArticleVO  from '@/services/backend/typings';

const Welcome: React.FC = () => {
  const [articleContent, setArticleContent] = useState<ArticleVO>(); // 存储文章内容
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const commentsRef = useRef<HTMLDivElement>(null); // 创建引用来指向评论区域
  // 获取路由参数
  const { id } = useParams<{ id: string }>(); // 将 id 作为 string 类型

  // 平滑滚动到评论区域
  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  };

  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { TextArea } = Input;

  // 组件挂载时获取文章数据
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticleVoByIdUsingGet({ id }); // 替换为实际的 ID 或参数
        console.log(id)
        setArticleContent(response.data); // 根据实际的响应结构调整
        setLoading(false);
      } catch (error) {
        console.error('获取文章失败:', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, []);

  if (loading) {
    return <div><Spin tip="Loading" size="large"/></div> // 显示加载状态
  }

  return (
    <PageContainer
      style={{
        background: 'linear-gradient(to bottom,#f5f5f5, #DCDCDC )' // 淡蓝色上下渐变
      }}>
      <Card style={{ marginTop: '50px', position: 'relative' }}> {/* 调整顶部填充，设置相对定位 */}
        <UserInfo
          style={{
            position: 'absolute',
            top: '-80px', // 使头像位于卡片上方
            right: '160px',
            zIndex: 1000,
          }}
          src={articleContent?.user?.userAvatar}
          userName={articleContent?.user?.userName}
        />
        <div>
          <h1><strong>{articleContent?.title}</strong></h1>
          <MdViewer content={articleContent?.content} />
        </div>
        <FloatingActionPanel onCommentButtonClick={scrollToComments} favourNum={articleContent?.favourNum ?? 0}
                             likeNum={articleContent?.likeNum ?? 0} id={id} starred={articleContent?.starred}/> {/* 传递滚动函数作为属性 */}
        <hr/>
        <div ref={commentsRef}> {/* 使用 ref 属性指向这个 div */}
          <Comments />
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
