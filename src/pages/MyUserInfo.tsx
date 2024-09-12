// src/pages/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Badge, Button, Modal, Form, Input, message, Tag } from 'antd';
import { useModel } from '@umijs/max';
import { UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { getUserVoById, updateMyUser } from '@/services/backend/userController';
import { UserVO } from '@/services/backend/typings';
import ContributionCalendar from '../components/ContributionCalendar/ContributionCalendar'; // 引入 ContributionCalendar

const UserProfile: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [user, setUser] = useState<UserVO | undefined>(initialState?.currentUser); // 将 initialState?.currentUser 作为默认值
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 控制模态框显示
  const location = useLocation(); // 获取 location 对象
  const id = location.state?.id; // 从 state 中获取 ID
  const [form] = Form.useForm(); // Ant Design 表单实例
  const [calendarData, setCalendarData] = useState<Record<string, number>>({}); // 贡献数据

// 创建 mock 数据
const articles: any = {
  "2024-01-01": 3,
  "2024-01-02": 6,
  "2024-01-03": 22,
  "2024-02-01": 3,
  "2024-02-02": 6,
  "2024-02-03": 2,
  "2024-03-01": 32,
  "2024-03-02": 6,
  "2024-03-03": 2,
  "2024-04-01": 32,
  "2024-04-02": 6,
  "2024-04-03": 2,
  "2024-05-03": 2,
  "2024-05-01": 32,
  "2024-05-02": 6,
  "2024-06-03": 2,
  "2024-08-01": 32,
  "2024-09-02": 6,
  "2024-08-03": 2,
  "2024-11-03": 299,
  // ... 添加更多数据
};

  useEffect(() => {
    // 如果有 ID 参数，则获取该用户的信息
    const fetchUser = async () => {
      if (id) {
        setLoading(true); // 开始加载
        try {
          const res = await getUserVoById({ id }); // 替换为实际的 ID 或参数
          setUser(res.data); // 根据实际的响应结构调整
          form.setFieldsValue(res.data); // 设置表单初始值
          
          // 示例贡献数据
          setCalendarData({
            "2024-01-01": 3,
            "2024-01-02": 6,
            "2024-01-03": 22,
            "2024-02-01": 3,
            "2024-02-02": 6,
            "2024-02-03": 2,
            "2024-03-01": 32,
            "2024-03-02": 6,
            "2024-03-03": 2,
            "2024-04-01": 32,
            "2024-04-02": 6,
            "2024-04-03": 2,
            "2024-11-03": 299,
            // ... 添加更多数据
          });
        } catch (error) {
          console.error('获取用户信息失败:', error);
        } finally {
          setLoading(false); // 结束加载
        }
      } else {
        setLoading(false); // 如果没有 ID，则不需要加载
      }
    };

    fetchUser();
  }, [id]);

  const handleEditClick = () => {
    setIsModalVisible(true); // 显示模态框
  };

  const handleCancel = () => {
    setIsModalVisible(false); // 关闭模态框
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await updateMyUser(values);
      if (response.code === 0) {
        message.success('信息更新成功');
        setUser({ ...user, ...values }); // 更新本地用户信息
        setIsModalVisible(false); // 关闭模态框
      } else {
        message.error('更新失败，请稍后再试');
      }
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('提交表单失败，请检查输入');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card
        style={{ width: 400, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: 20 }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Avatar
            size={100}
            src={user?.userAvatar}
            icon={<UserOutlined />}
            style={{ marginBottom: 20 }}
          />
          <h2>{user?.userName || '未命名用户'}</h2>
          <p><Tag color="#87d068">{user?.userRole === "user" ? "普通用户" : "管理员"}</Tag></p>
          <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{user?.userProfile || '这位用户很神秘，没有留下任何个人简介。'}</p>
        </div>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="用户ID">{user?.id || '未知'}</Descriptions.Item>
          <Descriptions.Item label="用户角色">
            <Badge status={user?.userRole === 'admin' ? 'success' : 'default'} text={user?.userRole === 'admin' ? '管理员' : '普通用户'} />
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{user?.createTime || '未知'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{user?.updateTime || '未知'}</Descriptions.Item>
        </Descriptions>
        {/* 添加修改信息按钮 */}
        <Button type="primary" onClick={handleEditClick} style={{ marginTop: 20, width: '100%' }}>
          修改信息
        </Button>
      </Card>

      {/* 修改信息模态框 */}
      <Modal title="修改信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" initialValues={{ userAvatar: user?.userAvatar, userName: user?.userName, userProfile: user?.userProfile }}>
          <Form.Item
            label="头像 URL"
            name="userAvatar"
            rules={[{ required: true, message: '请输入头像 URL!' }]}
          >
            <Input placeholder="请输入头像 URL" />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="userName"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="个人简介" name="userProfile">
            <Input.TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 年度贡献日历 */}
      <h2>年度贡献日历</h2>
      <ContributionCalendar data={articles} />
    </div>
  );
};

export default UserProfile;
