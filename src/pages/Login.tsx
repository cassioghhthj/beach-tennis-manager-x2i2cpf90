import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAppStore()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login()
    navigate('/admin')
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://img.usecurling.com/p/1920/1080?q=beach%20tennis%20court&color=blue")',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      <Card className="w-full max-w-md shadow-2xl bg-background/95 backdrop-blur-sm border-0 relative z-10 animate-fade-in-up">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-32 h-32 flex items-center justify-center mb-2">
            <img
              src="/logo.png"
              alt="Arena Beach Luiziana Logo"
              className="w-full h-full object-contain drop-shadow-md"
              onError={(e) => {
                e.currentTarget.src = 'https://img.usecurling.com/i?q=tennis&color=yellow'
              }}
            />
          </div>
          <CardTitle className="text-3xl font-heading font-extrabold uppercase text-foreground tracking-tight drop-shadow-sm">
            Arena Beach
          </CardTitle>
          <CardDescription className="text-base font-medium text-primary uppercase tracking-wider">
            Gestão de Ligas • Luiziana
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email de Administrador</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@arenabeach.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                  Lembrar-me
                </Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline font-medium">
                Recuperar senha?
              </a>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              type="submit"
              className="w-full text-base font-bold uppercase tracking-wider h-12 shadow-md"
            >
              Acessar Sistema
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
