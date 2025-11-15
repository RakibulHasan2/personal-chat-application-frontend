import { getAvatarInitials, getAvatarColor } from '../../utils/helpers';
import { CreateUser } from '../create-user';
import { useChatContext } from '../../context/ChatContext';
import './UserSelector.css';

const UserSelector = ({ users, onUserSelect, selectedUser, loading, error }) => {
  const { createUser } = useChatContext();

  const handleUserClick = (user) => {
    onUserSelect(user);
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  if (loading) {
    return (
      <div className="user-selector">
        <h3>Select User</h3>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-selector">
        <h3>Select User</h3>
        <div className="error">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="user-selector">
      <h3>Chat with:</h3>
      <div className="user-list">
        {users.length === 0 ? (
          <div className="no-users">No users found</div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''
                }`}
              onClick={() => handleUserClick(user)}
            >
              <div
                className="user-avatar"
                style={{ background: getAvatarColor(user.name) }}
              >
                {getAvatarInitials(user.name)}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-status">Online</div>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateUser
        onCreateUser={handleCreateUser}
        loading={loading}
      />
    </div>
  );
};

export default UserSelector;