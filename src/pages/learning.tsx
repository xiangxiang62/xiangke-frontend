import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Checkbox, Input, Button, List, Modal, Row, Col, Typography, DatePicker } from 'antd';
import { useModel } from '@umijs/max';
import {
  listDailyScheduleUsingGet,
  finishDailyScheduleByIdUsingPost,
  addDailyScheduleUsingPost,
  deleteDailyScheduleUsingPost,
  queryHistoryDailyScheduleUsingPost,
} from "@/services/backend/dailyScheduleController";
import { CheckCircleOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

const LearningTasks: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [user, setUser] = useState<UserVO | undefined>(initialState?.currentUser);
  const [taskInput, setTaskInput] = useState('');
  const [dailyScheduleList, setDailyScheduleList] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [randomQuote, setRandomQuote] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyTasks, setHistoryTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  useEffect(() => {
    const fetchDailySchedule = async () => {
      try {
        const res = await listDailyScheduleUsingGet();
        const completed = res?.data.filter(item => item.todayIsFinish === 1) || [];
        const pending = res?.data.filter(item => item.todayIsFinish === 0) || [];
        setDailyScheduleList(pending);
        setCompletedTasks(completed);
      } catch (error) {
        console.error('获取计划失败:', error);
      }
    };

    const fetchRandomQuote = async () => {
      try {
        const response = await fetch('https://zj.v.api.aa1.cn/api/wenan-zl/?type=json');
        const data = await response.json();
        console.log(data); // 检查 API 响应
        setRandomQuote(data.msg);
        console.log(data.msg); // 确保状态更新
      } catch (error) {
        console.error('获取随机文案失败:', error);
      }
    };


    fetchDailySchedule();
    fetchRandomQuote();
    refreshQuote();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const addTask = async () => {
    if (taskInput && user) {
      const newTask = { planName: taskInput, todayIsFinish: 0, userId: user.id };
      try {
        await addDailyScheduleUsingPost(newTask);
        setTaskInput('');
        Modal.success({ content: '任务添加成功！' });

        const res = await listDailyScheduleUsingGet();
        const completed = res?.data.filter(item => item.todayIsFinish === 1) || [];
        const pending = res?.data.filter(item => item.todayIsFinish === 0) || [];
        setDailyScheduleList(pending);
        setCompletedTasks(completed);
      } catch (error) {
        console.error('添加任务失败:', error);
      }
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    const taskToToggle = dailyScheduleList.find(task => task.id === id);
    if (taskToToggle) {
      const newStatus = taskToToggle.todayIsFinish === 1 ? 0 : 1;
      await finishDailyScheduleByIdUsingPost({ dailyId: id });

      if (newStatus === 1) {
        setCompletedTasks([...completedTasks, { ...taskToToggle, todayIsFinish: newStatus }]);
        setDailyScheduleList(dailyScheduleList.filter(task => task.id !== id));
      } else {
        setCompletedTasks(completedTasks.filter(task => task.id !== id));
        setDailyScheduleList([...dailyScheduleList, { ...taskToToggle, todayIsFinish: newStatus }]);
      }

      if (dailyScheduleList.length === 1 && newStatus === 1) {
        Modal.success({ content: '恭喜你！今日目标已全部完成！' });
      }
    }
  };

  const handleCompletedTaskToggle = async (id: number) => {
    const taskToToggle = completedTasks.find(task => task.id === id);
    if (taskToToggle) {
      await finishDailyScheduleByIdUsingPost({ dailyId: id });
      setCompletedTasks(completedTasks.filter(task => task.id !== id));
      setDailyScheduleList([...dailyScheduleList, { ...taskToToggle, todayIsFinish: 0 }]);
    }
  };

  const confirmDeleteTask = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个任务吗？',
      onOk: async () => {
        try {
          await deleteDailyScheduleUsingPost({ id });
          setDailyScheduleList(dailyScheduleList.filter(task => task.id !== id));
          setCompletedTasks(completedTasks.filter(task => task.id !== id));
          Modal.success({ content: '任务删除成功！' });
        } catch (error) {
          console.error('删除任务失败:', error);
        }
      },
    });
  };

  const refreshQuote = async () => {
    try {
      const response = await fetch('https://api.suyanw.cn/api/djt3.php?type=json');
      const data = await response.json();
      setRandomQuote(data.text);
    } catch (error) {
      console.error('获取随机文案失败:', error);
    }
  };

  const fetchHistoricalTasks = async (date: moment.Moment) => {
    if (!date) return;

    const formattedDate = date.format('YYYY-MM-DD');
    const params = new URLSearchParams();
    params.append('today', formattedDate);

    try {
      setHistoryTasks([]);
      const response = await queryHistoryDailyScheduleUsingPost(params);
      const historyTaskInfo = JSON.parse(response.data.historyTaskInfo);
      setHistoryTasks(historyTaskInfo);
    } catch (error) {
      console.error('获取历史任务失败:', error);
    }
  };

  const showHistoryModal = () => {
    if (selectedDate) {
      fetchHistoricalTasks(selectedDate);
      setIsModalVisible(true);
    } else {
      Modal.warning({ content: '请先选择一个日期！' });
    }
  };

  const calculateCompletionRatio = () => {
    const totalTasks = historyTasks.length;
    const completedTasksCount = historyTasks.filter(item => item.completed).length;
    return totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
  };

  const completionRatio = calculateCompletionRatio();
  let completionMessage = '';

  if (completionRatio === 100) {
    completionMessage = '🎉 当日目标已全部完成！';
  } else if (completionRatio > 0) {
    completionMessage = `👍 当日完成率为 ${completionRatio.toFixed(0)}%`;
  } else {
    completionMessage = '😞 还需努力，当日尚未完成任务！';
  }

  return (
    <PageContainer style={{ backgroundColor: '#f0f2f5', padding: '20px' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: 20, color: '#2c3e50' }}>学习任务记录</Title>
      <div style={{ textAlign: 'center', marginBottom: 20, color: '#7f8c8d' }}>
        <p style={{ display: 'inline' }}>{randomQuote}</p>
        <ReloadOutlined
          onClick={refreshQuote}
          style={{ marginLeft: 10, cursor: 'pointer', color: '#3498db' }}
        />
        <p>{currentTime}</p>
      </div>

      <Row justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Input
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            placeholder="输入任务"
            style={{ width: '100%', borderRadius: 5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          />
          <Button type="primary" onClick={addTask} style={{ width: '100%', borderRadius: 5, marginTop: 10 }}>添加任务</Button>
        </Col>
      </Row>

      <div style={{ paddingTop: "30px" }}></div>

      <Row justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <DatePicker
            format="YYYY-MM-DD"
            style={{ marginBottom: 20, width: '100%' }}
            onChange={(date) => setSelectedDate(date)}
            inputReadOnly // 使输入框为只读状态
            showToday={false} // 不显示“今天”按钮
          />
          <Button
            type="primary"
            onClick={showHistoryModal}
            style={{ marginBottom: 20, width: '100%' }}
          >
            查看历史完成情况
          </Button>
          <Modal
            title="当日完成情况"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }}  // 设置最大高度和垂直滚动
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h3>{completionMessage}</h3>
            </div>
            <List
              dataSource={historyTasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? -1 : 1))}
              renderItem={(item, index) => (
                <List.Item>
                  <span style={{ marginRight: 10 }}>{index + 1}.</span>
                  <b>{item.planName}</b> -
                  <span style={{ marginLeft: 5, color: item.completed ? 'green' : 'red' }}>
                    {item.completed ? '✅ 完成' : '❌ 未完成'}
                  </span>
                </List.Item>
              )}
            />
          </Modal>
        </Col>
      </Row>

      <Title level={2} style={{ marginTop: 20, color: '#3498db' }}>今日待完成</Title>
      <List
        style={{
          marginTop: 10,
          backgroundColor: '#ffffff',
          borderRadius: 10,
          padding: 15,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
        dataSource={dailyScheduleList}
        renderItem={item => (
          <List.Item style={{
            padding: '10px 0',
            borderBottom: '1px solid #eaeaea',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Checkbox
              checked={item.todayIsFinish === 1}
              onChange={() => toggleTaskCompletion(item.id)}
              style={{ fontSize: '16px' }}
            >
              {item.planName}
            </Checkbox>
            <DeleteOutlined
              onClick={() => confirmDeleteTask(item.id)}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          </List.Item>
        )}
      />

      <Title level={2} style={{ marginTop: 20, color: '#27ae60' }}>今日已完成</Title>
      <List
        style={{
          marginTop: 10,
          backgroundColor: '#e8f8f5',
          borderRadius: 10,
          padding: 15,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
        dataSource={completedTasks}
        renderItem={task => (
          <List.Item style={{
            padding: '10px 0',
            borderBottom: '1px solid #eaeaea',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Checkbox
              checked
              onChange={() => handleCompletedTaskToggle(task.id)}
              style={{ fontSize: '16px' }}
            >
              <CheckCircleOutlined style={{ color: '#27ae60', marginRight: 8 }} />
              {task.planName}
            </Checkbox>
            <DeleteOutlined
              onClick={() => confirmDeleteTask(task.id)}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default LearningTasks;
