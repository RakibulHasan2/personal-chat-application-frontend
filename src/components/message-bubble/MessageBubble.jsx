import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { formatTime } from '../../utils/helpers';
import { apiService } from '../../services/api';
import './MessageBubble.css';

const MessageBubble = ({ message, currentUser, onMessageUpdate, onMessageDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isOwnMessage = message.sender === currentUser?.name;

  // Update editContent when message content changes
  useEffect(() => {
    setEditContent(message.content);
  }, [message.content]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleEdit = async () => {
    if (editContent.trim() === message.content) {
      setIsEditing(false);
      return;
    }

    if (!editContent.trim()) {
      toast.error('Message content cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.updateMessage(message._id, { content: editContent.trim() });

      if (response.success) {
        onMessageUpdate?.(response.data);
        setIsEditing(false);
        setShowMenu(false);
        toast.success('Message updated successfully!');
      } else {
        // Handle API response with success: false
        console.error('Update failed:', response);
        toast.error('Failed to update message', {
          description: 'Please try again.'
        });
        setEditContent(message.content); // Reset content on error
      }
    } catch (error) {
      console.error('Failed to update message:', error);
      toast.error('Failed to update message', {
        description: 'There was an error updating your message.'
      });
      setEditContent(message.content); // Reset content on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.deleteMessage(message._id);

      if (response.success) {
        onMessageDelete?.(message._id);
        toast.success('Message deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message', {
        description: 'There was an error deleting your message.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(message.content);
    setShowMenu(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    handleDelete();
  };

  return (
    <div className={`message-bubble ${isOwnMessage ? 'own-message' : 'other-message'} ${isLoading ? 'loading' : ''}`}>
      <div className="message-wrapper">
        {/* Menu button for own messages */}
        {isOwnMessage && !isEditing && (
          <div className="message-menu" ref={menuRef}>
            <button
              className="menu-toggle-btn"
              onClick={handleMenuToggle}
              disabled={isLoading}
              title="Message options"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="menu-dropdown">
                <button
                  className="menu-item edit-item"
                  onClick={handleEditClick}
                  disabled={isLoading}
                >
                  <span className="menu-icon">✏️</span>
                  <span className="menu-text">Edit</span>
                </button>
                <button
                  className="menu-item delete-item"
                  onClick={handleDeleteClick}
                  disabled={isLoading}
                >
                  <span className="menu-icon">🗑️</span>
                  <span className="menu-text">Delete</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="message-content">
          {isEditing ? (
            <div className="edit-form">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="edit-textarea"
                disabled={isLoading}
                maxLength={1000}
                rows={3}
                autoFocus
              />
              <div className="edit-actions">
                <button
                  onClick={handleEdit}
                  disabled={isLoading || !editContent.trim()}
                  className="save-btn"
                >
                  {isLoading ? 'Saving...' : '✓ Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="cancel-btn"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="message-text">{message.content}</div>
              <div className="message-meta">
                {!isOwnMessage && (
                  <span className="message-sender">{message.sender}</span>
                )}
                <span className="message-time">
                  {formatTime(message.timestamp || message.createdAt)}
                  {message.isEdited && <span className="edited-indicator"> (edited)</span>}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;