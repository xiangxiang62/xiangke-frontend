import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import ArticleList from '@/components/ArticleList/ArticleList';
import { listArticleVoByPageUsingPost } from "@/services/backend/articleController";
import { Empty, Pagination, Spin } from "antd";
import Search from "antd/es/input/Search";
import Leaderboard from '../components/Leaderboard/Leaderboard';
import TopArticles from '../components/TopArticles/TopArticles';
import { Col, Row } from 'antd';

const Welcome: React.FC = () => {
  const [articleContentList, setArticleContentList] = useState<API.ArticleVO[]>([]); // 存储文章列表
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [searchValue, setSearchValue] = useState<string>(''); // 用于存储搜索框的值
  const [pageNum, setPageNum] = useState<number>(1); // 当前页码
  const [totalNum, setTotalNum] = useState<number>(); // 总文章数

  // 获取文章数据
  const fetchArticles = async (queryRequest: API.ArticleQueryRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listArticleVoByPageUsingPost(queryRequest);
      setArticleContentList(response.data.records);
      setTotalNum(response.data.total);
    } catch (error) {
      console.error('获取文章失败:', error);
      setError('获取文章失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时和页码或搜索值改变时调用
  useEffect(() => {
    const queryRequest: API.ArticleQueryRequest = {
      current: pageNum,
      pageSize: 10,
      title: searchValue,
    };
    fetchArticles(queryRequest);
  }, [pageNum, searchValue]); // 页码和搜索值作为依赖

  // 更新搜索框的值
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 更新页码
  const handlePageNumChange = (page: number) => {
    setPageNum(page);
  };

  // 搜索功能
  const onSearch = (value: string) => {
    const queryRequest: API.ArticleQueryRequest = {
      current: 1, // 搜索时从第一页开始
      pageSize: 10,
      title: value,
    };
    setPageNum(1); // 重置页码为1
    fetchArticles(queryRequest); // 执行搜索
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh' // 让父容器占满整个视窗高度
      }}>
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <PageContainer
      style={{
        minHeight: "1000px"
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', // 使搜索框和内容垂直排列
      }}>
        <Search
          placeholder="请搜索感兴趣的文章"
          allowClear
          enterButton="搜索"
          size="large"
          value={searchValue} // 绑定输入框的值
          onChange={handleSearchChange} // 监听输入框变化
          onSearch={onSearch} // 搜索按钮点击时触发搜索
          style={{ width: "60vw" }}
        />

        {/* 使用 Row 和 Col 布局 */}
        <Row gutter={20} style={{ marginTop: 20 }}>
          {/* 手机端和 PC 端布局不同 */}
          <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ padding: 20 }}>
            <div style={{ minHeight: '300px' }}>
              {articleContentList && articleContentList.length > 0 ? (
                <ArticleList articles={articleContentList} />
              ) : (
                <Empty style={{ paddingTop: "100px" }} />
              )}
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={4} xl={4} style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <Leaderboard />
            </div>
            <div>
              <TopArticles />
            </div>
          </Col>
        </Row>

        <Pagination
          showQuickJumper
          current={pageNum}
          total={totalNum}
          onChange={handlePageNumChange}
          style={{ marginTop: 20 }}
        />
      </div>
    </PageContainer>
  );
};

export default Welcome;
