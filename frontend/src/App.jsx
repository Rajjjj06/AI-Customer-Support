import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import CreateBotPage from '@/pages/CreateBotPage';
import DocumentsPage from '@/pages/DocumentsPage';
import ChatTestPage from '@/pages/ChatTestPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import EmbedPage from '@/pages/EmbedPage';
import SettingsPage from '@/pages/SettingsPage';
import WidgetPage from '@/pages/WidgetPage'; // Import standalone widget
import { Toaster } from 'sonner';
import { useAuthListener } from './hooks/useAuthListener';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  useAuthListener();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Standalone Widget Route (Hidden from standard layouts) */}
        <Route path="/widget/:id" element={<WidgetPage />} />

        {/* Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /> </ProtectedRoute>} >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-bot" element={<CreateBotPage />} />
          <Route path="/bot/:id/documents" element={<DocumentsPage />} />
          <Route path="/bot/:id/chat" element={<ChatTestPage />} />
          <Route path="/bot/:id/analytics" element={<AnalyticsPage />} />
          <Route path="/bot/:id/embed" element={<EmbedPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}
