import React from 'react';
import { Card, List, Typography } from 'antd';

// 定义文章数据的接口
interface Article {
  rank: number;
  title: string;
  author: string;
  views: number;
}

// 创建 mock 数据
const articles: Article[] = [
  { rank: 1, title: '如何提升编程技能', author: 'Alice', views: 1500 },
  { rank: 2, title: 'React 高级技巧', author: 'Bob', views: 1400 },
  { rank: 3, title: 'JavaScript 性能优化', author: 'Charlie', views: 1300 },
  { rank: 4, title: 'TypeScript 入门指南', author: 'David', views: 1200 },
  { rank: 5, title: '前端工程化实践', author: 'Eva', views: 1100 },
  { rank: 6, title: 'CSS 布局技巧', author: 'Frank', views: 1000 },
  { rank: 7, title: 'Node.js 性能调优', author: 'Grace', views: 900 },
  { rank: 8, title: 'GraphQL 实践', author: 'Hannah', views: 800 },
  { rank: 9, title: '云计算基础知识', author: 'Isaac', views: 700 },
  { rank: 10, title: '前端安全最佳实践', author: 'Jack', views: 600 },
];

// 封装热门文章排行榜组件
const TopArticles: React.FC = () => (
  <Card title="热门文章排行榜" bordered={false} style={{ width: 300 }}>
    <List
      dataSource={articles}
      renderItem={item => (
        <List.Item>
          <div style={{ flex: 1 }}>
            <Typography.Text strong>{item.rank}. {item.title}</Typography.Text>
            <div>
              <Typography.Text>作者: {item.author}</Typography.Text>
              <Typography.Text style={{ marginLeft: 'auto' }}>阅读: {item.views}</Typography.Text>
            </div>
          </div>
        </List.Item>
      )}
    />
  </Card>
);

export default TopArticles;
