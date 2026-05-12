import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-center shadow-sm sticky top-0 z-50">
        <Link
          to="/"
          className="flex items-center justify-center hover:scale-105 transition-transform duration-300"
        >
          <img
            src="https://i.postimg.cc/WzGjVVvs/logo-certo-arena-beach-sem-fundo.png"
            alt="Arena Beach Luiziana"
            className="h-16 md:h-20 object-contain drop-shadow-sm"
          />
        </Link>
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
