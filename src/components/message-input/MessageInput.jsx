import { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, currentUser, disabled, loading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || !currentUser || loading) {
      return;
    }

    const messageData = {
      content: message.trim()
    };

    try {
      await onSendMessage(messageData);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Select who you are and choose someone to chat with..." : "Type your message..."}
            disabled={disabled || loading}
            className="message-textarea"
            rows={1}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled || loading}
            className="send-button"
          >
            {loading ? (
              <span className="sending-indicator">📤</span>
            ) : (
              <span className="send-icon">➤</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;