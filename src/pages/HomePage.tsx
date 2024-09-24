import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import ArticleList from '@/components/ArticleList/ArticleList';
import { listArticleVoByPageUsingPost } from "@/services/backend/articleController";
import { Empty, Pagination, Spin } from "antd";
import Search from "antd/es/input/Search";
import Leaderboard from '../components/Leaderboard/Leaderboard';
import TopArticles from '../components/TopArticles/TopArticles';
import { Col, Row } from 'antd';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
  { key: '0', label: '全部' },
  { key: '1', label: '热门' },
  { key: '2', label: '技术栈文章' },
  { key: '3', label: '笔记' },
  { key: '4', label: '日记' },
  { key: '5', label: '心情' },
];

const Welcome: React.FC = () => {
  const [articleContentList, setArticleContentList] = useState<API.ArticleVO[]>([]); // 存储文章列表
  const [globalLoading, setGlobalLoading] = useState<boolean>(true); // 全局加载状态
  const [listLoading, setListLoading] = useState<boolean>(false); // 局部加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [searchValue, setSearchValue] = useState<string>(''); // 用于存储搜索框的值
  const [pageNum, setPageNum] = useState<number>(1); // 当前页码
  const [totalNum, setTotalNum] = useState<number>(); // 总文章数
  const [category, setCategory] = useState<string>(''); // 当前选中的分类
  const [activeTabKey, setActiveTabKey] = useState<string>('0'); // 当前选中的 tab

  // 获取文章数据
  const fetchArticles = async (queryRequest: API.ArticleQueryRequest) => {
    setListLoading(true); // 局部 loading
    setError(null);

    try {
      const response = await listArticleVoByPageUsingPost(queryRequest);
      setArticleContentList(response.data.records);
      setTotalNum(response.data.total);
    } catch (error) {
      console.error('获取文章失败:', error);
      setError('获取文章失败，请稍后再试。');
    } finally {
      setListLoading(false); // 结束局部 loading
    }
  };

  // 初次加载页面
  useEffect(() => {
    const queryRequest: API.ArticleQueryRequest = {
      current: pageNum,
      pageSize: 10,
      title: searchValue,
      category, // 添加分类参数
    };
    fetchArticles(queryRequest);
    setGlobalLoading(false); // 初次加载完成后设置全局加载为 false
  }, [pageNum, searchValue, category]); // 页码、搜索值和分类作为依赖

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
    setSearchValue(value);
    setPageNum(1); // 搜索时从第一页开始
  };

  // 点击 tab 时处理逻辑
  const onTabChange = (key: string) => {
    setActiveTabKey(key);
    const selectedCategory = items.find(item => item.key === key)?.label || '';
    setCategory(selectedCategory === '全部' ? '' : selectedCategory);
  };

  // 渲染加载状态
  if (globalLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh' // 让父容器占满整个视窗高度
      }}>
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <PageContainer
      style={{
        backgroundColor: "#fff",
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
          <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ padding: "20 0" }}>
            <Tabs
              activeKey={activeTabKey} // 保持选中状态
              items={items}
              onChange={onTabChange} // 点击 tab 时的处理函数
            />

            <div style={{ minHeight: '300px' }}>
              {listLoading ? ( // 局部 loading 状态
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // minWidth: '447px',
                  height: '300px' // 设置局部加载区域的高度
                }}>
                  <Spin tip="Loading" size="large" />
                </div>
              ) : articleContentList && articleContentList.length > 0 ? (
                <ArticleList articles={articleContentList} />
              ) : (
                <div style={{ display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  minWidth: '400px',
                  maxWidth: '900px',
                  margin: '0 0',
                height:"300px"}}>
                  <Empty style={{ paddingTop: "100px" }} />
                </div>

              )}
              {/* 分页控件 */}
              {!listLoading && (
                <Pagination
                  showQuickJumper
                  current={pageNum}
                  total={totalNum}
                  onChange={handlePageNumChange}
                  style={{ marginBottom: 30 }}
                />
              )}
            </div>

          </Col>

          <Col xs={24} sm={24} md={8} lg={4} xl={4} style={{ padding: "20 0" }}>
            <div style={{ marginBottom: 20 }}>
              <Leaderboard />
            </div>
            <div>
              <TopArticles />
            </div>
          </Col>
        </Row>

      </div>
    </PageContainer>
  );
};

export default Welcome;
