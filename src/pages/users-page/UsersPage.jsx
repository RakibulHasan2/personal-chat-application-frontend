import { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { getAvatarInitials, getAvatarColor, formatDateTime } from '../../utils/helpers';
import './UsersPage.css';

const UsersPage = () => {
  const { users, loading, error, fetchUsers } = useChatContext();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading.users) {
    return (
      <div className="users-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error.users) {
    return (
      <div className="users-page">
        <div className="container">
          <div className="error-state">
            <div className="error-message">
              <span>Error loading users</span>
              <p>{error.users}</p>
            </div>
            <button onClick={fetchUsers} className="btn btn-primary">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="container">
        <div className="users-header">
          <div className="header-content">
            <h1>Users</h1>
            <p>Manage and view all users in the system</p>
          </div>

          <div className="header-actions">
            <button onClick={fetchUsers} className="btn btn-secondary">
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="users-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="users-grid">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>
                {searchTerm
                  ? 'No users match your search criteria.'
                  : 'No users available at the moment.'}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-card-header">
                  <div
                    className="user-avatar"
                    style={{ background: getAvatarColor(user.name) }}
                  >
                    {getAvatarInitials(user.name)}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <div className="user-status">
                      <span className="status-dot online"></span>
                      <span>Online</span>
                    </div>
                  </div>
                </div>

                <div className="user-card-body">
                  <div className="user-meta">
                    <div className="meta-item">
                      <span className="meta-label">ID:</span>
                      <span className="meta-value">{user._id}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Joined:</span>
                      <span className="meta-value">
                        {formatDateTime(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="users-stats">
          <div className="stat-item">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{filteredUsers.length}</span>
            <span className="stat-label">Shown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;