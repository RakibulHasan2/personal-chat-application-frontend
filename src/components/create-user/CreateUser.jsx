import { useState } from 'react';
import './CreateUser.css';

const CreateUser = ({ onCreateUser, loading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateUser({ name: name.trim() });
      setName('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        className="create-user-button"
        onClick={() => setIsOpen(true)}
        disabled={loading}
      >
        <span className="button-icon">👤+</span>
        <span className="button-text">Create User</span>
      </button>
    );
  }

  return (
    <div className="create-user-form">
      <h4>Create New User</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name..."
            maxLength={50}
            disabled={isSubmitting}
            className="user-name-input"
            autoFocus
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;