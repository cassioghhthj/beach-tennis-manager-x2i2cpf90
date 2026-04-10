import { HardHat } from 'lucide-react'

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
      <div className="bg-primary/10 p-6 rounded-full">
        <HardHat className="w-16 h-16 text-primary" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-3xl font-heading font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-lg">
          Esta funcionalidade está em desenvolvimento e estará disponível em breve.
        </p>
      </div>
    </div>
  )
}
