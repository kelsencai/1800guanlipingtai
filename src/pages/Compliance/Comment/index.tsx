/* eslint-disable react/button-has-type */
import {
  createComment,
  getMessage,
  removeComment,
  removeReply,
  replyComment,
} from '@/services/comment';
import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';
import './index.css';

const MessageBoard = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const initMessage = async () => {
    const res = await getMessage();
    setMessages(res.result || []);
  };
  useEffect(() => {
    initMessage();
  }, []);

  const handleNewMessageSubmit = async (e: any) => {
    e.preventDefault();
    const res = await createComment({
      // @ts-ignore
      userId: currentUser?.id || 1,
      content: newMessage,
      fullName: currentUser?.email || '管理员',
    });
    setMessages(res.result || []);
  };

  const handleReplySubmit = async (e: any) => {
    e.preventDefault();
    const res = await replyComment({
      messageId: replyTo,
      // @ts-ignore
      userId: currentUser?.id || 1,
      content: replyContent,
      fullName: currentUser?.email || '管理员',
    });
    setReplyContent('');
    setReplyTo(null);
    setMessages(res.result || []);
  };

  const handleDeleteMessage = async (id: number) => {
    const res = await removeComment(id);
    setMessages(res.result || []);
  };

  const handleDeleteReply = async (id: number) => {
    const res = await removeReply(id);
    setMessages(res.result || []);
  };

  return (
    <div className="container">
      <h1>留言板</h1>
      <form onSubmit={handleNewMessageSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="输入留言"
        />
        <button type="submit">提交</button>
      </form>
      <ul>
        {messages.map((message: any) => (
          <li key={message.id}>
            <p>
              {message.fullName || '管理员'}：{message.content}
            </p>
            <button className="delete-button" onClick={() => handleDeleteMessage(message.id)}>
              删除
            </button>
            <button style={{ marginLeft: '12px' }} onClick={() => setReplyTo(message.id)}>
              回复
            </button>
            {replyTo === message.id && (
              <form onSubmit={handleReplySubmit}>
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="输入回复"
                />
                <button type="submit">提交回复</button>
              </form>
            )}
            {message.replies.map((reply: any) => (
              <ul key={reply.id}>
                <li className="reply">
                  <p>
                    {reply.fullName || '管理员'}：{reply.content}
                  </p>
                  <button className="delete-button" onClick={() => handleDeleteReply(reply.id)}>
                    删除
                  </button>
                </li>
              </ul>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageBoard;
