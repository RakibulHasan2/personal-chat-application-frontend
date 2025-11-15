import { useEffect, useRef } from 'react';
import { MessageBubble } from '../message-bubble';
import './ChatArea.css';

const ChatArea = ({
  messages,
  loading,
  error,
  currentUser,
  onRefresh,
  onMessageUpdate,
  onMessageDelete
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="chat-area">
        <div className="chat-loading">
          <div className="loading-spinner"></div>
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-area">
        <div className="chat-error">
          <div className="error-message">
            <span>Failed to load messages</span>
            <p>{error}</p>
          </div>
          <button onClick={onRefresh} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="conversation-info">
          <h2>Messages</h2>
          {currentUser && (
            <div className="active-conversation">
              <span className="conversation-label">Chatting as:</span>
              <span className="current-user-name">{currentUser.name}</span>
            </div>
          )}
        </div>
        <button onClick={onRefresh} className="refresh-button" title="Refresh messages">
          🔄
        </button>
      </div>

      <div className="messages-container">
        {!currentUser ? (
          <div className="no-messages">
            <div className="no-messages-icon">👤</div>
            <p>Please select who you are from the "You are:" section above to start chatting</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                currentUser={currentUser}
                onMessageUpdate={onMessageUpdate}
                onMessageDelete={onMessageDelete}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;