import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Medal, Calendar, Users, Trophy } from 'lucide-react'

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-background rounded-md shadow-sm p-1 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Arena Beach Luiziana Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://img.usecurling.com/i?q=tennis&color=yellow'
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl uppercase tracking-tight text-foreground">
                Arena Beach
              </span>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Luiziana
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link to="/login">Área Restrita</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 bg-card overflow-hidden">
          <div className="absolute inset-0 bg-secondary/90 z-0">
            <img
              src="https://img.usecurling.com/p/1920/1080?q=beach%20tennis%20court&color=black"
              alt="Background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tight drop-shadow-md">
              Ranking <span className="text-primary">Oficial</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
              Acompanhe a classificação, rodadas e resultados dos atletas da Arena Beach Luiziana.
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Medal className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold uppercase">Ranking</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>
                  Veja a classificação atualizada de todas as categorias masculinas, femininas e
                  mistas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold uppercase">Rodadas</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Acompanhe o calendário de jogos, resultados recentes e próximos confrontos.</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold uppercase">Atletas</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Conheça os jogadores que fazem parte das ligas da nossa arena.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              Tabela de Classificação
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Os dados de classificação estarão disponíveis assim que as primeiras rodadas forem
              computadas.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-secondary py-8 border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 grayscale opacity-50">
            <img
              src="/logo.png"
              alt="Logo Footer"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://img.usecurling.com/i?q=tennis&color=yellow'
              }}
            />
          </div>
          <p className="text-secondary-foreground/60 text-sm">
            © {new Date().getFullYear()} Arena Beach Luiziana. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
