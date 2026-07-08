import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Space, Typography, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, ClearOutlined } from '@ant-design/icons';
import {
  ChatMessage,
  suggestedQuestions,
  createUserMessage,
  generateChatResponse,
} from '../../mock/chatResponses';

const { Text } = Typography;

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const content = text || inputValue.trim();
    if (!content || isTyping) return;

    const userMsg = createUserMessage(content);
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = generateChatResponse(content);
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        minHeight: 500,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <RobotOutlined style={{ color: '#1677ff', fontSize: 16 }} />
          <Text strong style={{ fontSize: 14 }}>AI 经营助手</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>基于看板数据的智能问答</Text>
        </Space>
        {messages.length > 0 && (
          <Button size="small" icon={<ClearOutlined />} onClick={handleClear}>
            清空对话
          </Button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <RobotOutlined style={{ fontSize: 40, color: '#d9d9d9', marginBottom: 16 }} />
            <div style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>
              你好，我是 Alter Ego 的 AI 经营助手。你可以问我任何关于经营数据的问题。
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
              {suggestedQuestions.map((q) => (
                <Button
                  key={q.id}
                  size="small"
                  style={{ borderRadius: 16, fontSize: 12 }}
                  onClick={() => handleSend(q.question)}
                >
                  {q.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 16,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: msg.role === 'user' ? '#f0f0f0' : 'linear-gradient(135deg, #1677ff, #722ed1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: msg.role === 'user' ? '#666' : '#fff',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
            </div>
            <div
              style={{
                maxWidth: '70%',
                background: msg.role === 'user' ? '#f0f0f0' : '#fff',
                borderRadius: msg.role === 'user' ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                padding: '10px 14px',
                boxShadow: msg.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                border: msg.role === 'assistant' ? '1px solid #f0f0f0' : 'none',
                fontSize: 13,
                lineHeight: 1.7,
                color: '#333',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <div key={i} style={{ fontWeight: 600, margin: '6px 0 2px' }}>{line.replace(/\*\*/g, '')}</div>;
                }
                if (line.startsWith('• ') || line.startsWith('- ')) {
                  return <div key={i} style={{ paddingLeft: 8 }}>{line}</div>;
                }
                if (line.match(/^\d+\./)) {
                  return <div key={i} style={{ fontWeight: 500, marginTop: 4 }}>{line}</div>;
                }
                if (line.startsWith('|')) {
                  return <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, color: '#555' }}>{line}</div>;
                }
                return <div key={i}>{line}</div>;
              })}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              <RobotOutlined />
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: '2px 12px 12px 12px',
                padding: '12px 16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Spin size="small" />
              <Text type="secondary" style={{ fontSize: 12 }}>正在分析...</Text>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="输入你的问题，例如：本月营收情况怎么样？"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            style={{ fontSize: 13 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default ChatPanel;
