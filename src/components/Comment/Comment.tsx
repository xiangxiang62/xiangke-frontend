import React, { useState, useEffect } from 'react';
import { Avatar, Button, Form, Input, List, message } from 'antd';
import { Comment } from '@ant-design/compatible';
import { addArticleCommentUsingPost, getArticleCommentsUsingGet } from '@/services/backend/articleCommentController'; // API 请求导入
import { ArticleCommentAddRequest, ArticleCommentVO, UserVO } from '@/services/backend/typings'; // 类型导入
import { useParams } from 'react-router-dom';
import { useModel } from "@umijs/max"; // 导入 useModel

const { TextArea } = Input;

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

const Editor: React.FC<EditorProps> = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        评论
      </Button>
    </Form.Item>
  </>
);

interface CommentComponentProps {
  comment: ArticleCommentVO;
  onReplySubmit: (content: string, parentCommentId: string) => void; // parentCommentId 应为字符串类型
  level: number; // 级别，用于控制嵌套深度
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment, onReplySubmit, level }) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = async () => {
    if (!replyContent) return;
    await onReplySubmit(replyContent, comment.id);
    setReplying(false);
    setReplyContent('');
  };

  return (
    <Comment
      actions={[<span key="reply-to" onClick={() => setReplying(!replying)}>回复</span>]}
      author={comment.userVO.userName}
      avatar={<Avatar src={comment.userVO.userAvatar} alt={comment.userName} />}
      content={<p>{comment.content}</p>}
      datetime={comment.createdTime}
      style={{ marginLeft: level > 0 ? 40 : 0 }} // 根据层级缩进
    >
      {replying && (
        <Editor
          onChange={handleReplyChange}
          onSubmit={handleReplySubmit}
          submitting={false}
          value={replyContent}
        />
      )}
      {level < 1 && comment.childComments && comment.childComments.length > 0 && (
        <CommentList comments={comment.childComments} onReplySubmit={onReplySubmit} level={level + 1} />
      )}
    </Comment>
  );
};

interface CommentListProps {
  comments: ArticleCommentVO[];
  onReplySubmit: (content: string, parentCommentId: string) => void; // parentCommentId 应为字符串类型
  level: number; // 级别
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReplySubmit, level }) => (
  <List
    dataSource={comments}
    itemLayout="horizontal"
    renderItem={(comment) => (
      <CommentComponent key={comment.id} comment={comment} onReplySubmit={onReplySubmit} level={level} />
    )}
  />
);

const CommentsSection: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 从路由参数中获取 id
  const articleId = parseInt(id); // 将 id 转换为数字
  const [comments, setComments] = useState<ArticleCommentVO[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true); // 用于表示是否正在加载
  const { initialState } = useModel('@@initialState');
  const [user, setUser] = useState<UserVO | null>(null); // 初始值设为 null

  useEffect(() => {
    if (initialState?.currentUser) {
      setUser(initialState.currentUser);
    }
  }, [initialState?.currentUser]);

  useEffect(() => {
    fetchComments(); // 当 articleId 改变时，重新获取评论
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const response = await getArticleCommentsUsingGet({ articleId });
      // @ts-ignore
      setComments(response.data); // 假设 response.data 是评论数据
      // console.log(response?.data?.userVO+"111")
      setLoading(false);
      console.log(comments+"1")
    } catch (error) {
      console.error('获取评论失败:', error);
      setLoading(false);
      message.error('获取评论失败');
    }
  };

  const handleSubmit = async () => {
    if (!value) return;

    setSubmitting(true);

    try {
      const req: ArticleCommentAddRequest = {
        articleId,
        content: value,
        authorId: user?.id || '', // 添加 authorId，确保有值
        parentCommentId: null, // 表示是一级评论
      };

      const response = await addArticleCommentUsingPost(req);
      if (response.code === 0) {
        message.success('评论添加成功');
        fetchComments(); // 重新获取评论列表
      } else {
        message.error(response.message || '评论添加失败');
      }
    } catch (error) {
      message.error('网络错误，无法提交评论');
    } finally {
      setSubmitting(false);
      setValue(''); // 清空输入框
    }
  };

  const handleReplySubmit = async (content: string, parentCommentId: string) => {
    try {
      const req: ArticleCommentAddRequest = {
        articleId,
        content,
        authorId: user?.id || '', // 添加 authorId，确保有值
        parentCommentId, // 将回复的评论ID作为 parentCommentId
      };
      const response = await addArticleCommentUsingPost(req);
      if (response.code === 0) {
        message.success('回复成功');
        fetchComments(); // 重新获取评论列表
      } else {
        message.error(response.message || '回复失败');
      }
    } catch (error) {
      message.error('网络错误，无法提交回复');
    }
  };

  return (
    <div>
      <Comment
        avatar={<Avatar src={user?.userAvatar} alt="User" />}
        content={
          <Editor
            onChange={(e) => setValue(e.target.value)}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
      {loading ? (
        <div>加载中...</div> // 显示加载状态
      ) : (
        <>
          {comments.length > 0 ? (
            <CommentList comments={comments} onReplySubmit={handleReplySubmit} level={0} />
          ) : (
            <div>暂无评论</div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
