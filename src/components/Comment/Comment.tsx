import React, { useState } from 'react';
import { Avatar, List, Form, Button, Input, Tooltip } from 'antd';
import { Comment } from '@ant-design/compatible';
import moment from 'moment';

const { TextArea } = Input;

interface CommentData {
  author: string;
  avatar: string;
  content: React.ReactNode;
  datetime: React.ReactNode;
  replies: CommentData[];
}

const initialData: CommentData[] = [
  {
    author: 'John Doe',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: <p>这是第一条评论。</p>,
    datetime: (
      <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
        <span>2024.01.01</span>
      </Tooltip>
    ),
    replies: [],
  },
];

const Editor = ({
                  onChange,
                  onSubmit,
                  submitting,
                  value,
                }: {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        添加评论
      </Button>
    </Form.Item>
  </>
);

const CommentComponent: React.FC<{ comment: CommentData; addReply: (reply: CommentData, parent: CommentData) => void }> = ({
                                                                                                                             comment,
                                                                                                                             addReply,
                                                                                                                           }) => {
  const [replying, setReplying] = useState(false);
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReply = () => {
    if (!value) return;
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const newReply: CommentData = {
        author: '当前用户',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: <p>{value}</p>,
        datetime: (
          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        ),
        replies: [],
      };
      addReply(newReply, comment);
      setValue('');
      setReplying(false);
    }, 1000);
  };

  return (
    <>
      <Comment
        author={comment.author}
        avatar={<Avatar src={comment.avatar} alt={comment.author} />}
        content={comment.content}
        datetime={comment.datetime}
        actions={[
          <span key="reply" onClick={() => setReplying(!replying)}>
            回复
          </span>,
        ]}
      >
        {replying && (
          <Editor
            onChange={(e) => setValue(e.target.value)}
            onSubmit={handleReply}
            submitting={submitting}
            value={value}
          />
        )}
      </Comment>
      {/* Render all replies at the same level */}
      {comment.replies.map((reply, index) => (
        <Comment
          key={index}
          author={reply.author}
          avatar={<Avatar src={reply.avatar} alt={reply.author} />}
          content={reply.content}
          datetime={reply.datetime}
          style={{ marginLeft: '40px' }}
        />
      ))}
    </>
  );
};

const Comments: React.FC = () => {
  const [comments, setComments] = useState<CommentData[]>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');

  const addReply = (reply: CommentData, parent: CommentData) => {
    const addNestedReply = (comments: CommentData[]): CommentData[] => {
      return comments.map((c) => {
        if (c === parent) {
          return { ...c, replies: [...c.replies, reply] };
        } else if (c.replies.length > 0) {
          return { ...c, replies: addNestedReply(c.replies) };
        } else {
          return c;
        }
      });
    };

    setComments(addNestedReply(comments));
  };

  const handleSubmit = () => {
    if (!value) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const newComment: CommentData = {
        author: '当前用户',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: <p>{value}</p>,
        datetime: (
          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        ),
        replies: [],
      };
      setComments([...comments, newComment]);
      setValue('');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      {comments.map((comment, index) => (
        <CommentComponent key={index} comment={comment} addReply={addReply} />
      ))}
      <Comment
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="User" />}
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
};

export default Comments;
