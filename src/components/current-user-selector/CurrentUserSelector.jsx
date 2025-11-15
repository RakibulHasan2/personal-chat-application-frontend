import { getAvatarInitials, getAvatarColor } from '../../utils/helpers';
import './CurrentUserSelector.css';

const CurrentUserSelector = ({ users, currentUser, onCurrentUserSelect, loading }) => {
  if (loading) {
    return (
      <div className="current-user-selector">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="current-user-selector">
      <h4>You are:</h4>
      <div className="current-user-options">
        {users.map((user) => (
          <div
            key={user._id}
            className={`current-user-option ${
              currentUser?._id === user._id ? 'selected' : ''
            }`}
            onClick={() => onCurrentUserSelect(user)}
          >
            <div 
              className="user-avatar-small"
              style={{ background: getAvatarColor(user.name) }}
            >
              {getAvatarInitials(user.name)}
            </div>
            <span className="user-name-small">{user.name}</span>
            {currentUser?._id === user._id && (
              <span className="check-mark">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentUserSelector;