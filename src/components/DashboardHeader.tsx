import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Vote, PanelLeft } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 lg:hidden">
          <Vote className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Planillas</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm text-muted-foreground">{user?.nombre}</span>
          <Badge
            variant={user?.isAdmin ? "default" : "secondary"}
            className={
              user?.isAdmin
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground"
            }
          >
            {user?.isAdmin ? "Administrador" : "Planillero"}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-2 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  );
}