import { useEffect, useCallback } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { UserSelector } from '../../components/user-selector';
import { CurrentUserSelector } from '../../components/current-user-selector';
import { ChatArea } from '../../components/chat-area';
import { MessageInput } from '../../components/message-input';
import './ChatPage.css';

const ChatPage = () => {
  const {
    users,
    messages,
    selectedUser,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchMessages,
    sendMessage,
    selectUser,
    setCurrentUser,
    updateMessage,
    deleteMessage,
  } = useChatContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch messages when both current user and selected user are available
  useEffect(() => {
    if (currentUser && selectedUser) {
      // Add a small delay to show conversation switching
      const timer = setTimeout(() => {
        fetchMessages();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentUser?.name, selectedUser?.name]);

  const handleSendMessage = useCallback(async (messageData) => {
    try {
      await sendMessage(messageData);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [sendMessage]);

  const handleRefresh = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMessageUpdate = useCallback((updatedMessage) => {
    updateMessage(updatedMessage._id, updatedMessage);
  }, [updateMessage]);

  const handleMessageDelete = useCallback((messageId) => {
    deleteMessage(messageId);
  }, [deleteMessage]);

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-layout">
          <aside className="sidebar">
            <CurrentUserSelector
              users={users}
              currentUser={currentUser}
              onCurrentUserSelect={setCurrentUser}
              loading={loading.users}
            />

            <UserSelector
              users={users.filter(user => user._id !== currentUser?._id)}
              selectedUser={selectedUser}
              onUserSelect={selectUser}
              loading={loading.users}
              error={error.users}
            />
          </aside>

          <div className="chat-main">
            <ChatArea
              messages={messages}
              loading={loading.messages}
              error={error.messages}
              currentUser={currentUser}
              onRefresh={handleRefresh}
              onMessageUpdate={handleMessageUpdate}
              onMessageDelete={handleMessageDelete}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
              disabled={!currentUser || !selectedUser}
              loading={loading.sendingMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;