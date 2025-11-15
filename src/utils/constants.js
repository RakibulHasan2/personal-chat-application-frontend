// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'NECX Messaging App',
  VERSION: '1.0.0',
  DESCRIPTION: 'Personal messaging interface',
};

// Message Configuration
export const MESSAGE_CONFIG = {
  MAX_LENGTH: 1000,
  MIN_LENGTH: 1,
  AUTO_REFRESH_INTERVAL: 5000, // 5 seconds
};

// User Configuration
export const USER_CONFIG = {
  MAX_NAME_LENGTH: 50,
  MIN_NAME_LENGTH: 1,
};

// UI Configuration
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 320,
  CHAT_HEIGHT: 600,
  MESSAGE_BUBBLE_MAX_WIDTH: '70%',
  AVATAR_SIZE: 40,
};

// Routes
export const ROUTES = {
  HOME: '/',
  CHAT: '/',
  USERS: '/users',
  SETTINGS: '/settings',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SELECTED_USER: 'necx_selected_user',
  USER_PREFERENCES: 'necx_user_preferences',
  THEME: 'necx_theme',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERIC: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent successfully!',
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!',
  CONNECTION_RESTORED: 'Connection restored!',
};

// Theme
export const THEME = {
  COLORS: {
    PRIMARY: '#4ade80',
    PRIMARY_DARK: '#22c55e',
    SECONDARY: '#6b7280',
    BACKGROUND: '#1a1f2e',
    SURFACE: '#242b3d',
    BORDER: '#3a4759',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#9ca3af',
    ERROR: '#ef4444',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
  },
  BREAKPOINTS: {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1024px',
  },
};