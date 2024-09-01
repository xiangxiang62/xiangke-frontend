import Footer from '@/components/Footer'; // 导入页脚组件
import {sendEmailUsingGet, userLogin, userRegister} from '@/services/backend/userController'; // 导入后端服务函数
import {LockOutlined, UserOutlined, CodeOutlined, MailOutlined} from '@ant-design/icons'; // 导入 Ant Design 图标
import {LoginForm, ProFormText} from '@ant-design/pro-components'; // 导入 Ant Design Pro 组件
import {useEmotionCss} from '@ant-design/use-emotion-css'; // 导入情感样式钩子
import {Helmet, history, Link} from '@umijs/max'; // 导入 UmiJS 相关组件和函数
import {Button, message, Tabs} from 'antd'; // 导入 Ant Design 组件
import React, {useEffect, useState} from 'react'; // 导入 React 和相关 Hooks
import Settings from '../../../../config/defaultSettings'; // 导入设置

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱格式正则表达式

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account'); // 状态管理，记录当前注册类型
  const [email, setEmail] = useState(''); // 状态管理，记录输入的邮箱
  const [countdown, setCountdown] = useState(0); // 状态管理，记录验证码倒计时时间

  // 使用情感样式钩子定义容器的 CSS 类
  const containerClassName = useEmotionCss(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage: 'linear-gradient(to bottom, #99ccff, #cce6ff)', // 渐变背景色
    backgroundSize: '100% 100%',
  }));

  // 提交表单的处理函数
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const {userPassword, checkPassword} = values;

    // 校验密码是否一致
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致'); // 提示错误信息
      return;
    }

    try {
      // 调用用户注册接口
      const data = await userRegister(values);

      if (data.code === 0) {
        // 注册成功
        message.success('注册成功！');
        history.push({pathname: '/user/login'}); // 跳转到登录页
      } else {
        // 注册失败，显示返回的错误信息
        message.error(data.message || '未知错误');
      }

    } catch (error: any) {
      // 捕获其他错误
      message.error(error.message);
    }
  };

  // 处理发送验证码按钮点击事件
  const handleSendEmailClick = async () => {
    if (countdown > 0) return; // 如果倒计时未结束，不允许再次发送
    if (!emailRegex.test(email)) {
      message.error('邮箱为空或邮箱格式不正确'); // 校验邮箱格式
      return;
    }
    try {
      const values = {email, type: "REGISTER"};
      const response = await sendEmailUsingGet(values);
      if (response && response.data) {
        setCountdown(60); // 启动倒计时
      }
    } catch (error) {
      console.error('发送邮箱验证码出错:', error); // 打印错误信息
    }
  };

  // 设置倒计时逻辑
  useEffect(() => {
    let intervalId: number | null = null; // 修改为 number 类型
    if (countdown > 0) {
      intervalId = window.setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1); // 更新倒计时时间
      }, 1000);
    } else if (intervalId) {
      window.clearInterval(intervalId); // 清除定时器
    }
    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId); // 组件卸载时清除定时器
      }
    };
  }, [countdown]);


  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{'注册'}- {Settings.title}</title> {/* 设置页面标题 */}
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册', // 提交按钮文本
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" style={{height: '100%'}} src="/logo.png"/>}
          title="香客"
          subTitle={'快来测试一下你的水平吧'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest); // 提交表单
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账号密码注册',
              },
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '重复密码是必填项！',
                  },
                ]}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined/>,
                  value: email, // 通过 fieldProps 传递值
                  onChange: (e) => setEmail(e.target.value), // 通过 fieldProps 处理输入变化
                }}
                placeholder={'请输入邮箱'}
                rules={[
                  {
                    required: true,
                    message: '邮箱是必填项！',
                  },
                ]}
              />
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}> {/* 增加 gap 属性 */}
                <ProFormText
                  name="emailCode"
                  fieldProps={{
                    size: 'large',
                    prefix: <CodeOutlined/>,
                  }}
                  placeholder={'请输入验证码'}
                  rules={[
                    {
                      required: true,
                      message: '验证码是必填项！',
                    },
                  ]}
                  style={{flex: 1}} // 设置输入框的宽度自动调整
                />
                <Button
                  type="primary"
                  disabled={countdown > 0}
                  onClick={handleSendEmailClick}
                  style={{height: '40px', marginBottom: '20px'}} // 确保按钮与输入框高度一致
                >
                  {countdown > 0 ? `${countdown} 秒后可重新发送` : '发送验证码'}
                </Button>
              </div>
            </>
          )}

          <div
            style={{
              marginBottom: 24,
              textAlign: 'right',
            }}
          >
            <Link to={"/user/login"}>已有账号？去登录</Link> {/* 登录页链接 */}
          </div>
        </LoginForm>
      </div>
      <Footer/> {/* 页脚 */}
    </div>
  );
};

export default Register;
