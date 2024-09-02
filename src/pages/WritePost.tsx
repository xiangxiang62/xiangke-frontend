import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Input, Button, message } from 'antd';
import MarkdownEditorComponent from "@/components/MdEditor/ReactMdEditor";
import { addArticleUsingPost } from '@/services/backend/articleController'; // 确保路径正确
import ArticleVO from '@/services/backend/typings';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
const Welcome: React.FC = () => {
  const [articleTitle, setArticleTitle] = useState<string>(''); // 存储文章标题
  const [articleDescription, setArticleDescription] = useState<string>(''); // 存储文章描述
  const [articleContent, setArticleContent] = useState<string>(''); // 存储文章内容
  const [loading, setLoading] = useState<boolean>(false); // 提交加载状态
  const navigate = useNavigate(); // 创建 navigate 函数
  const handleSubmit = async () => {
    setLoading(true);
    console.log(articleContent + "2121")
    try {
      // 创建请求体
      const body: API.ArticleAddRequest = {
        title: articleTitle,
        category: articleDescription,
        content: articleContent,
      };

      // 调用 API 提交文章
      const response = await addArticleUsingPost(body);
console.log(response+"qqq")
      // 处理响应
      if (response?.code === 0) {
        message.success('文章提交成功');
        // 可以在这里重置表单或导航到其他页面
        navigate('/home'); // 跳转到 /home 页面
        setArticleTitle('');
        setArticleDescription('');
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
        background: 'linear-gradient(to bottom, #DCDCDC, #f5f5f5)', // 淡蓝色上下渐变
      }}
    >
      <h1><strong>新建文章</strong></h1>
      <br/>
      <div>
        文章标题：
        <br/><br/>
        <Input
          style={{ width: '90vw' }}
          placeholder="输入文章标题"
          value={articleTitle}
          onChange={(e) => setArticleTitle(e.target.value)}
        />
        <br/><br/>
        文章描述：
        <br/><br/>
        <Input.TextArea
          style={{ width: '90vw' }}
          rows={2}
          placeholder="输入文章描述"
          value={articleDescription}
          onChange={(e) => setArticleDescription(e.target.value)}
        />
        <br/><br/>
        <MarkdownEditorComponent
          onChange={(content) => setArticleContent(content)}
        />
        <br/><br/>
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
