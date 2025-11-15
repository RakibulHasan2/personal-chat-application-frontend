import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ChatProvider } from './context/ChatContext';
import { MainLayout } from './layouts';
import { ChatPage, UsersPage } from './pages';
import { ROUTES } from './utils/constants';
import './styles/globals.css';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<ChatPage />} />
              <Route path={ROUTES.USERS} element={<UsersPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </div>
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          closeButton
        />
      </Router>
    </ChatProvider>
  );
}

export default App;
