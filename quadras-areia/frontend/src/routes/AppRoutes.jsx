import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardCliente from '../pages/DashboardCliente';
import CourtsList from '../pages/CourtsList';
import CourtDetail from '../pages/CourtDetail';
import BookingPage from '../pages/BookingPage';
import MyBookings from '../pages/MyBookings';
import PaymentPage from '../pages/PaymentPage';
import Profile from '../pages/Profile';
import DashboardAdmin from '../pages/DashboardAdmin';
import ManageCourts from '../pages/ManageCourts';
import CourtForm from '../pages/CourtForm';
import ManageBookings from '../pages/ManageBookings';
import ManageClients from '../pages/ManageClients';
import ManagePayments from '../pages/ManagePayments';
import ManageInvoices from '../pages/ManageInvoices';
import BlockedTimes from '../pages/BlockedTimes';

import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import { useAuthStore } from '../store/useAuthStore';

function AuthRedirect({ children, adminOnly = false, clienteOnly = false }) {
  const { user, isAdmin, isCliente } = useAuthStore();
  if (!user) return children;
  if (adminOnly && isCliente()) return <Navigate to="/cliente" replace />;
  if (clienteOnly && isAdmin()) return <Navigate to="/admin" replace />;
  return children;
}

function AppInitializer({ children }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => { checkAuth(); }, [checkAuth]);
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route path="/cliente" element={
            <ProtectedRoute>
              <AuthRedirect clienteOnly>
                <DashboardCliente />
              </AuthRedirect>
            </ProtectedRoute>
          } />
          <Route path="/quadras" element={
            <ProtectedRoute>
              <AuthRedirect clienteOnly>
                <CourtsList />
              </AuthRedirect>
            </ProtectedRoute>
          } />
          <Route path="/quadras/:id" element={
            <ProtectedRoute>
              <AuthRedirect clienteOnly>
                <CourtDetail />
              </AuthRedirect>
            </ProtectedRoute>
          } />
          <Route path="/reservar/:courtId" element={
            <ProtectedRoute>
              <AuthRedirect clienteOnly>
                <BookingPage />
              </AuthRedirect>
            </ProtectedRoute>
          } />
          <Route path="/minhas-reservas" element={
            <ProtectedRoute>
              <AuthRedirect clienteOnly>
                <MyBookings />
              </AuthRedirect>
            </ProtectedRoute>
          } />
          <Route path="/pagamento/:bookingId" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<AdminRoute><DashboardAdmin /></AdminRoute>} />
          <Route path="/admin/quadras" element={<AdminRoute><ManageCourts /></AdminRoute>} />
          <Route path="/admin/quadras/:id" element={<AdminRoute><CourtForm /></AdminRoute>} />
          <Route path="/admin/reservas" element={<AdminRoute><ManageBookings /></AdminRoute>} />
          <Route path="/admin/clientes" element={<AdminRoute><ManageClients /></AdminRoute>} />
          <Route path="/admin/pagamentos" element={<AdminRoute><ManagePayments /></AdminRoute>} />
          <Route path="/admin/notas-fiscais" element={<AdminRoute><ManageInvoices /></AdminRoute>} />
          <Route path="/admin/bloqueios" element={<AdminRoute><BlockedTimes /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppInitializer>
    </BrowserRouter>
  );
}
