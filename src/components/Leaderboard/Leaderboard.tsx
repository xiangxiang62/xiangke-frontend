import React from 'react';
import { Card, List, Typography } from 'antd';
import { FireOutlined } from '@ant-design/icons';
// 定义用户数据的接口
interface User {
  rank: any;
  name: string;
  activity: number;
}

// 创建 mock 数据
const users: User[] = [
  { rank: "🥇", name: 'Alice', activity: 120 },
  { rank: "🥈", name: 'Bob', activity: 115 },
  { rank: "🥉", name: 'Charlie', activity: 110 },
  { rank: 4, name: 'David', activity: 105 },
  { rank: 5, name: 'Eva', activity: 100 },
  { rank: 6, name: 'Frank', activity: 95 },
  { rank: 7, name: 'Grace', activity: 90 },
  { rank: 8, name: 'Hannah', activity: 85 },
  { rank: 9, name: 'Isaac', activity: 80 },
  { rank: 10, name: 'Jack', activity: 75 },
];

// 封装排行榜组件
const Leaderboard: React.FC = () => (

  <Card title="用户活跃排行榜" bordered={false} style={{ width: 300,background: 'linear-gradient(to bottom, orange 10px, white 60px, white 100%)' }}>
    <List
      dataSource={users}
      renderItem={item => (
        <List.Item>
          <Typography.Text>{item.rank}: {item.name}</Typography.Text>
          <Typography.Text style={{ marginLeft: 'auto' }}><FireOutlined /> {item.activity}</Typography.Text>
        </List.Item>
      )}
    />
  </Card>
);

export default Leaderboard;
