import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import SkillTree from './pages/SkillTree';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import CareerMap from './pages/CareerMap';
import ContentManage from './pages/ContentManage';
import ContentLibrary from './pages/ContentLibrary';
import OrgConfig from './pages/OrgConfig';
import OrgStudents from './pages/OrgStudents';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ThemeProvider from './components/ThemeProvider';
import { useThemeStore } from './store/useThemeStore';

function ThemedToaster() {
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isLight ? '#ffffff' : '#1a1a26',
          color: isLight ? '#0f172a' : '#f1f5f9',
          border: isLight ? '1px solid rgba(15,23,42,0.1)' : '1px solid rgba(0,245,255,0.2)',
        },
      }}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemedToaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/planos" element={<Plans />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/conteudos" element={<ContentLibrary />} />
            <Route path="/missoes" element={<Missions />} />
            <Route path="/skill-tree" element={<SkillTree />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/evolucao" element={<CareerMap />} />
            <Route path="/planos" element={<Plans />} />
            <Route
              path="/admin/conteudos"
              element={
                <ProtectedRoute orgAdminOnly>
                  <ContentManage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/config"
              element={
                <ProtectedRoute orgAdminOnly>
                  <OrgConfig />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alunos"
              element={
                <ProtectedRoute orgAdminOnly>
                  <OrgStudents />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
