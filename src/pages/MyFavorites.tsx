import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import ArticleList from '@/components/ArticleList/ArticleList';
import { listArticleVoByPageUsingPost } from "@/services/backend/articleController";
import {Empty, Pagination, Spin} from "antd";
import Search from "antd/es/input/Search";
import {listMyFavourArticleByPageUsingPost} from "@/services/backend/articleFavourController";

const Welcome: React.FC = () => {
  const [articleContentList, setArticleContentList] = useState<API.ArticleVO[]>([]); // 存储文章列表
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [searchValue, setSearchValue] = useState<string>(''); // 用于存储搜索框的值
  const [pageNum, setPageNum] = useState<number>(1); // 当前页码
  const [totalNum, setTotalNum] = useState<number>(); // 当前页码

  // 获取文章数据
  const fetchArticles = async (queryRequest: API.ArticleQueryRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listMyFavourArticleByPageUsingPost(queryRequest);
      setArticleContentList(response.data.records);
      setTotalNum(response.data.total)
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
  }, [pageNum]); // 页码和搜索值作为依赖

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
    return <div><Spin tip="Loading" size="large"/></div>
  }

  return (
    <PageContainer
      style={{
        background: 'linear-gradient(to bottom, #C0C0C0, #DCDCDC)', // 淡蓝色上下渐变
        minHeight: "1000px"
      }}
    >
      {/* 添加一个新的容器，用于居中对齐搜索框 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', // 使搜索框和文章列表垂直排列
      }}>
        <Search
          placeholder="input search text"
          allowClear
          enterButton="搜索"
          size="large"
          value={searchValue} // 绑定输入框的值
          onChange={handleSearchChange} // 监听输入框变化
          onSearch={onSearch} // 搜索按钮点击时触发搜索
          style={{ width: "600px" }}
        />
        <div style={{ padding: '80px 20px', width: '100%' }}>
          {articleContentList && articleContentList.length > 0 ? (
            <ArticleList  articles={articleContentList} />
          ) : (
            <Empty style={{ paddingTop: "100px" }} />
          )}
        </div>
        <Pagination
          showQuickJumper
          current={pageNum}
          total={totalNum}
          onChange={handlePageNumChange}
        />
      </div>
    </PageContainer>
  );
};

export default Welcome;
