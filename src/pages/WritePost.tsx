import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Input, Button, message, Select } from 'antd';
import MarkdownEditorComponent from "@/components/MdEditor/ReactMdEditor";
import { addArticleUsingPost } from '@/services/backend/articleController'; // 确保路径正确
import ArticleVO from '@/services/backend/typings';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate

const categoryOptions = [
  { key: '0', label: '全部' },
  { key: '1', label: '热门' },
  { key: '2', label: '技术栈文章' },
  { key: '3', label: '笔记' },
  { key: '4', label: '日记' },
  { key: '5', label: '心情' },
];

const Welcome: React.FC = () => {
  const [articleTitle, setArticleTitle] = useState<string>(''); // 存储文章标题
  const [articleCategory, setArticleCategory] = useState<string>(''); // 存储文章分类
  const [articleContent, setArticleContent] = useState<string>(''); // 存储文章内容
  const [loading, setLoading] = useState<boolean>(false); // 提交加载状态
  const navigate = useNavigate(); // 创建 navigate 函数

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 创建请求体
      const body: API.ArticleAddRequest = {
        title: articleTitle,
        category: articleCategory,
        content: articleContent,
      };

      // 调用 API 提交文章
      const response = await addArticleUsingPost(body);

      // 处理响应
      if (response?.code === 0) {
        message.success('文章提交成功');
        // 可以在这里重置表单或导航到其他页面
        navigate('/home'); // 跳转到 /home 页面
        setArticleTitle('');
        setArticleCategory('');
        setArticleContent('');
      } else {
        message.error('文章提交失败，请重试');
      }
    } catch (error) {
      message.error('提交失败，请检查网络或服务器');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      style={{
        background: '#fff', // 淡蓝色上下渐变
      }}
    >
      <h1><strong>新建文章</strong></h1>
      <br />
      <div>
        文章标题：
        <br /><br />
        <Input
          style={{ width: '90vw' }}
          placeholder="输入文章标题"
          value={articleTitle}
          onChange={(e) => setArticleTitle(e.target.value)}
        />
        <br /><br />
        文章分类：
        <br /><br />
        <Select
          style={{ width: '90vw' }}
          placeholder="选择文章分类"
          value={articleCategory}
          onChange={(value) => setArticleCategory(value)}
        >
          {categoryOptions.map(option => (
            <Select.Option key={option.key} value={option.label}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
        <br /><br />
        <MarkdownEditorComponent
          onChange={(content) => setArticleContent(content)}
        />
        <br /><br />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          提交文章
        </Button>
      </div>
    </PageContainer>
  );
};

export default Welcome;
