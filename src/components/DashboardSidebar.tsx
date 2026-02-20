import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Vote,
  FileSpreadsheet,
  AlertTriangle,
  X,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext";

export type DashboardView = "tabla" | "estadisticas" | "reportes"

interface DashboardSidebarProps {
  currentView: DashboardView
  onViewChange: (view: DashboardView) => void
  open: boolean
  onClose: () => void
}

export function DashboardSidebar({
  currentView,
  onViewChange,
  open,
  onClose,
}: DashboardSidebarProps) {
  const { user } = useAuth()
  const isAdmin = user?.isAdmin

  const navItems: { id: DashboardView; label: string; icon: React.ReactNode; adminOnly: boolean }[] = [
    {
      id: "tabla",
      label: "Planillas",
      icon: <FileSpreadsheet className="h-4 w-4" />,
      adminOnly: false,
    },
    // {
    //   id: "estadisticas",
    //   label: "Estadisticas",
    //   icon: <BarChart3 className="h-4 w-4" />,
    //   adminOnly: true,
    // },
    {
      id: "reportes",
      label: "Reportes",
      icon: <AlertTriangle className="h-4 w-4" />,
      adminOnly: true,
    },
  ]

  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Vote className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Planillas
              </span>
              <span className="text-[11px] text-sidebar-foreground/60">
                Sistema Electoral
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={onClose}
            aria-label="Cerrar menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3">
          <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
            Navegacion
          </div>
          <div className="flex flex-col gap-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  onClose()
                }}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  currentView === item.id
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-foreground">
              {user?.nombre.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user?.nombre}
              </span>
              <Badge
                variant="outline"
                className="mt-0.5 w-fit border-sidebar-border text-[10px] text-sidebar-foreground/70"
              >
                {user?.isAdmin ? "Admin" : "Planillero"}
              </Badge>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}