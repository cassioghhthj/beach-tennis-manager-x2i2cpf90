import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import useAppStore, { AppProvider } from '@/stores/useAppStore'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Ligas from './pages/admin/Ligas'
import Atletas from './pages/admin/Atletas'
import Sistemas from './pages/admin/Sistemas'
import Rodadas from './pages/admin/Rodadas'
import RodadaDetalhes from './pages/admin/RodadaDetalhes'
import Auditoria from './pages/admin/Auditoria'
import Ranking from './pages/admin/Ranking'
import Placeholder from './pages/admin/Placeholder'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppStore()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

const AppRoutes = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="ligas" element={<Ligas />} />
          <Route path="atletas" element={<Atletas />} />
          <Route path="sistemas" element={<Sistemas />} />
          <Route path="rodadas" element={<Rodadas />} />
          <Route path="rodadas/:id" element={<RodadaDetalhes />} />
          <Route path="resultados" element={<Navigate to="/admin/rodadas" replace />} />
          <Route path="auditoria" element={<Auditoria />} />
          <Route path="ranking" element={<Ranking />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

const App = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
)

export default App
