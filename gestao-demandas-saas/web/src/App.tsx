import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DemandsPage } from "./pages/DemandsPage";
import { FinishedDemandsPage } from "./pages/FinishedDemandsPage";
import { CalendarPage } from "./pages/CalendarPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/demandas" replace />} />
        <Route path="/demandas" element={<DemandsPage />} />
        <Route path="/finalizadas" element={<FinishedDemandsPage />} />
        <Route path="/calendario" element={<CalendarPage />} />
      </Routes>
    </AppLayout>
  );
}
