import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="w-full bg-white border-b border-slate-200 py-4 px-4 sm:px-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex-1 hidden sm:flex"></div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-1">
            <Link
              to="/"
              className="flex items-center justify-center hover:scale-105 transition-transform duration-300 bg-slate-900 rounded-full p-1 h-12 w-12 sm:h-16 sm:w-16 shadow-sm"
            >
              <img
                src="https://i.postimg.cc/KYB0J8rS/fe-e-forca-trn.png"
                alt="Fé e Força"
                className="w-full h-full object-contain drop-shadow-sm scale-110"
              />
            </Link>
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <Link
              to="/"
              className="flex items-center justify-center hover:scale-105 transition-transform duration-300"
            >
              <img
                src="https://i.postimg.cc/WzGjVVvs/logo-certo-arena-beach-sem-fundo.png"
                alt="Arena Beach Luiziana"
                className="h-14 sm:h-20 object-contain drop-shadow-sm"
              />
            </Link>
          </div>

          <div className="flex-1 flex justify-end">
            <Button
              asChild
              variant="outline"
              className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link to="/login">Área Restrita</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="sm:hidden border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs px-3 h-8"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      <footer className="w-full bg-white border-t border-slate-200 py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6">
          <Link to="/" className="hover:scale-105 transition-transform duration-300">
            <img
              src="https://i.postimg.cc/WzGjVVvs/logo-certo-arena-beach-sem-fundo.png"
              alt="Arena Beach Luiziana"
              className="h-16 md:h-20 object-contain drop-shadow-sm transition-opacity"
            />
          </Link>

          <div className="h-px w-24 bg-slate-200 rounded-full" />

          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} Arena Beach Luiziana. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
