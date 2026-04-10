import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Trophy,
  Users,
  Star,
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  Medal,
  LogOut,
  Search,
} from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAppStore from '@/stores/useAppStore'

export default function AdminLayout() {
  const { logout } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { name: 'Ligas / Categorias', to: '/admin/ligas', icon: Trophy },
    { name: 'Atletas', to: '/admin/atletas', icon: Users },
    { name: 'Sistemas de Pontuação', to: '/admin/sistemas', icon: Star },
    { name: 'Rodadas', to: '/admin/rodadas', icon: CalendarDays },
    { name: 'Lançar Resultados', to: '/admin/resultados', icon: ClipboardList },
    { name: 'Auditoria de Pontuação', to: '/admin/auditoria', icon: ShieldCheck },
    { name: 'Ranking Geral', to: '/admin/ranking', icon: Medal },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar className="border-r border-sidebar-border shadow-sm">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
                AB
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold uppercase tracking-tight text-sidebar-foreground">
                  Arena Beach
                </span>
                <span className="text-xs text-sidebar-foreground/70">Luiziana</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  (item.to !== '/admin' && location.pathname.startsWith(item.to))
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link to={item.to}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="ml-2 text-lg font-semibold capitalize tracking-tight hidden md:block">
                {navigation.find((n) => location.pathname === n.to)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden w-64 md:flex">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="w-full bg-muted/50 pl-8 rounded-full"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-primary/20 transition-all hover:ring-primary">
                    <Avatar className="h-full w-full">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=99" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair da conta</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
            <div key={location.pathname} className="animate-fade-in-up h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
