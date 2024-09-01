import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import ArticleList from '@/components/ArticleList/ArticleList';
import {
  getArticleVoByIdUsingGet,
  listArticleByPageUsingPost,
  listArticleVoByPageUsingPost
} from "@/services/backend/articleController";
// import ArticleVO = API.ArticleVO;
import ArticleVO  from '@/services/backend/typings';




const Welcome: React.FC = () => {
  const [articleContentList, setArticleContentList] = useState<ArticleVO[]>([]); // 存储文章列表
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息




// 组件挂载时获取文章数据
  useEffect(() => {
    console.log(11);
    let isMounted = true; // 标记组件是否已挂载

    const fetchArticle = async (values: API.ArticleQueryRequest) => {
      console.log(1122);
      setLoading(true); // 开始加载
      setError(null); // 重置错误状态
      try {
        const response = await listArticleVoByPageUsingPost(values);
        if (isMounted) {
          setArticleContentList(response.data.records); // 更新文章列表
        }
      } catch (error) {
        console.error('获取文章失败:', error);
        if (isMounted) {
          setError('获取文章失败，请稍后再试。'); // 更新错误状态
        }
      } finally {
        if (isMounted) {
          setLoading(false); // 停止加载
        }
      }
    };

    // 设置查询参数
    const queryRequest: API.ArticleQueryRequest = {
      current: 1, // 示例值：第一页
      pageSize: 10, // 示例值：每页 10 条数据
    };

    fetchArticle(queryRequest); // 调用 fetchArticle

    // 清理操作
    return () => {
      isMounted = false;
    };
  }, []); // 空依赖数组表示组件挂载时执行一次


  if (loading) {
    return <div>加载中...</div>; // 显示加载状态
  }


  return (
    <PageContainer
      style={{
        background: 'linear-gradient(to bottom,#010101, #DCDCDC )' // 淡蓝色上下渐变
      }}>
      <div style={{ padding: '20px' }}>
        <ArticleList articles={articleContentList} />
      </div>
    </PageContainer>
  );
};

export default Welcome;
