import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiService } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  users: [],
  messages: [],
  selectedUser: null,
  currentUser: null,
  loading: {
    users: false,
    messages: false,
    sendingMessage: false,
  },
  error: {
    users: null,
    messages: null,
    sendMessage: null,
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USERS: 'SET_USERS',
  SET_MESSAGES: 'SET_MESSAGES',
  SET_SELECTED_USER: 'SET_SELECTED_USER',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.value,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.type]: action.payload.value,
        },
      };

    case ActionTypes.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };

    case ActionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };

    case ActionTypes.SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };

    case ActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case ActionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case ActionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload._id ? action.payload : msg
        ),
      };

    case ActionTypes.DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(msg => msg._id !== action.payload),
      }; case ActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        error: {
          users: null,
          messages: null,
          sendMessage: null,
        },
      }; default:
      return state;
  }
};

// Context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load saved users from localStorage on mount
  useEffect(() => {
    const savedSelectedUser = localStorage.getItem(STORAGE_KEYS.SELECTED_USER);
    const savedCurrentUser = localStorage.getItem('CURRENT_USER');

    if (savedSelectedUser) {
      try {
        const user = JSON.parse(savedSelectedUser);
        dispatch({
          type: ActionTypes.SET_SELECTED_USER,
          payload: user,
        });
      } catch (error) {
        console.error('Failed to parse saved selected user:', error);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_USER);
      }
    }

    if (savedCurrentUser) {
      try {
        const user = JSON.parse(savedCurrentUser);
        dispatch({
          type: ActionTypes.SET_CURRENT_USER,
          payload: user,
        });
      } catch (error) {
        console.error('Failed to parse saved current user:', error);
        localStorage.removeItem('CURRENT_USER');
      }
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (state.selectedUser) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_USER, JSON.stringify(state.selectedUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_USER);
    }
  }, [state.selectedUser]);

  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('CURRENT_USER', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('CURRENT_USER');
    }
  }, [state.currentUser]);

  // Actions that need access to current state - memoized to prevent re-renders
  const fetchUsers = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'users', value: true } });
    dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'users', value: null } });

    try {
      const response = await apiService.getUsers();
      dispatch({ type: ActionTypes.SET_USERS, payload: response.data || [] });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'users', value: error.message } });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'users', value: false } });
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'messages', value: true } });
    dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'messages', value: null } });

    try {
      // If we have both current user and selected user, get private messages
      if (state.currentUser && state.selectedUser) {
        const response = await apiService.getMessagesBetweenUsers(
          state.currentUser.name,
          state.selectedUser.name
        );
        dispatch({ type: ActionTypes.SET_MESSAGES, payload: response.data || [] });
      } else {
        // Otherwise clear messages
        dispatch({ type: ActionTypes.SET_MESSAGES, payload: [] });
      }
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'messages', value: error.message } });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'messages', value: false } });
    }
  }, [state.currentUser, state.selectedUser]);

  const sendMessage = useCallback(async (messageData) => {
    if (!state.currentUser || !state.selectedUser) {
      toast.error('Cannot send message', {
        description: 'Both current user and recipient must be selected'
      });
      throw new Error('Both current user and recipient must be selected');
    }

    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'sendingMessage', value: true } });
    dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'sendMessage', value: null } });

    try {
      const messageWithRecipient = {
        ...messageData,
        sender: state.currentUser.name,
        recipient: state.selectedUser.name
      };

      const response = await apiService.sendMessage(messageWithRecipient);
      dispatch({ type: ActionTypes.ADD_MESSAGE, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'sendMessage', value: error.message } });
      toast.error('Failed to send message', {
        description: error.message || 'There was an error sending your message.'
      });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'sendingMessage', value: false } });
    }
  }, [state.currentUser, state.selectedUser]);

  const createUser = useCallback(async (userData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'users', value: true } });
    dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'users', value: null } });

    try {
      const response = await apiService.createUser(userData);
      // Refresh users list after creating new user
      const usersResponse = await apiService.getUsers();
      dispatch({ type: ActionTypes.SET_USERS, payload: usersResponse.data || [] });

      toast.success(`User "${userData.name}" created successfully!`, {
        description: 'The user has been added to your contacts.',
      });

      return response.data;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: { type: 'users', value: error.message } });
      toast.error('Failed to create user', {
        description: error.message || 'There was an error creating the user.',
      });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'users', value: false } });
    }
  }, []);

  const setCurrentUser = useCallback((user) => {
    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: user });
  }, []);

  const selectUser = useCallback((user) => {
    dispatch({ type: ActionTypes.SET_SELECTED_USER, payload: user });
    // Clear messages when switching conversations
    dispatch({ type: ActionTypes.SET_MESSAGES, payload: [] });
  }, []);

  const updateMessage = useCallback((messageId, updatedMessage) => {
    dispatch({ type: ActionTypes.UPDATE_MESSAGE, payload: updatedMessage });
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    dispatch({ type: ActionTypes.DELETE_MESSAGE, payload: messageId });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERRORS });
  }, []);

  const value = {
    ...state,
    fetchUsers,
    fetchMessages,
    sendMessage,
    createUser,
    setCurrentUser,
    selectUser,
    updateMessage,
    deleteMessage,
    clearErrors,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;