import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import useAppStore, { AppProvider } from '@/stores/useAppStore'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Index from './pages/Index'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Ligas from './pages/admin/Ligas'
import Atletas from './pages/admin/Atletas'
import Sistemas from './pages/admin/Sistemas'
import Rodadas from './pages/admin/Rodadas'
import RodadaDetalhes from './pages/admin/RodadaDetalhes'
import Auditoria from './pages/admin/Auditoria'
import Ranking from './pages/admin/Ranking'
import HistoricoPublicacoes from './pages/admin/HistoricoPublicacoes'
import ConfiguracoesWhatsapp from './pages/admin/ConfiguracoesWhatsapp'
import Configuracoes from './pages/admin/Configuracoes'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

const AppRoutes = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
        </Route>
        <Route path="/login" element={<Login />} />
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
          <Route path="publicacoes" element={<HistoricoPublicacoes />} />
          <Route path="whatsapp" element={<ConfiguracoesWhatsapp />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

const App = () => (
  <AuthProvider>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </AuthProvider>
)

export default App
