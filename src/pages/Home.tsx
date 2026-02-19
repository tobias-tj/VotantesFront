import { useAuth } from "@/context/AuthContext";
import { getDirigentes } from "@/api/dirigente";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addPlanilla, getPlanillas } from "@/api/planilla";
import { useEffect, useState } from "react";
import { DashboardSidebar, type DashboardView } from "@/components/DashboardSidebar";
import type { AddPlanillaRequest, AlertState, Dirigente, PaginatedResponse, Planilla, PlanillaFilters } from "@/lib/types";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PlanillasTable } from "@/components/PlanillasTable";
import { AddPlanillaModal } from "@/components/AddPlanillaModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const { token } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>("tabla")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState<PlanillaFilters>({
    filterText: "",
    dateFrom: "",
    dateTo: "",
    filterPage: 1,
    filterSize: 10,
  });

  const [planillasPage, setPlanillasPage] = useState<PaginatedResponse<Planilla> | null>(null);
  const [dirigentes, setDirigentes] = useState<Dirigente[]>([]);
  const [alert, setAlert] = useState<AlertState | null>(null);




  const handleAddPlanilla = async (newPlanilla: AddPlanillaRequest) => {
    if (!token) throw new Error("Token no disponible");

    try {
      const response = await addPlanilla(newPlanilla);

      const { planillaId, cedulasRepetidas } = response.data;

      if (!planillaId) {
        if (cedulasRepetidas.length > 0) {
          setAlert({
            type: "error",
            title: "No se pudo crear la planilla",
            description: `Todas las cédulas ya estaban registradas: ${cedulasRepetidas.join(", ")}`,
          });
        } else {
          setAlert({
            type: "error",
            title: "Error al crear la planilla",
            description: "No se logró crear la planilla.",
          });
        }

        return response;
      }

      if (cedulasRepetidas.length > 0) {
        setAlert({
          type: "warning",
          title: "Planilla creada parcialmente",
          description: `Se creó correctamente, pero las siguientes cédulas ya estaban registradas: ${cedulasRepetidas.join(", ")}`,
        });
      } else {
        setAlert({
          type: "success",
          title: "Planilla creada correctamente",
          description: "La planilla fue registrada sin inconvenientes.",
        });
      }

      const data = await getPlanillas(filters);
      setPlanillasPage(data);

      return response;

    } catch (err: any) {
      setAlert({
        type: "error",
        title: "Error inesperado",
        description: "Ocurrió un error inesperado.",
      });

      throw err;
    }
  };





  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const data = await getPlanillas(filters);
      setPlanillasPage(data);
    };

    fetchData();
  }, [token, filters]);

  useEffect(() => {
    if (!showAddModal) return;
    const fetchDirigentes = async () => {
      if (!token) return;
      const data = await getDirigentes();
      setDirigentes(data);
    };
    fetchDirigentes();
  }, [showAddModal]);



  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [alert]);


  const getAlertStyles = (type: AlertState["type"]) => {
    switch (type) {
      case "error":
        return "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive";

      case "warning":
        return "flex items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400";

      case "success":
        return "flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400";

      default:
        return "";
    }
  };


  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {alert && (
          <div className="px-6 pt-4">
            <Alert className={getAlertStyles(alert.type)}>
              <div>
                <AlertTitle className="font-semibold">
                  {alert.title}
                </AlertTitle>
                <AlertDescription>
                  {alert.description}
                </AlertDescription>
              </div>
            </Alert>
          </div>
        )}


        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            {/* Page title */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {currentView === "tabla" && "Planillas"}
                {currentView === "estadisticas" && "Estadisticas Generales"}
                {currentView === "problemas" && "Planillas con Problemas"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentView === "tabla" &&
                  "Gestione y consulte las planillas de votantes."}
                {currentView === "estadisticas" &&
                  "Resumen general de votos y planillas del sistema."}
                {currentView === "problemas" &&
                  "Detalle de planillas con votos no encontrados."}
              </p>
            </div>

            {/* Admin Stats - show on estadisticas view */}
            {/* {isAdmin && currentView === "estadisticas" && (
              <AdminStats planillas={planillas} />
            )} */}

            {/* Problem Cards - show on problemas view */}
            {/* {isAdmin && currentView === "problemas" && (
              <ProblemCards planillas={planillas} />
            )} */}

            {/* Table - show on tabla view, and also on estadisticas */}
            {(currentView === "tabla" || currentView === "estadisticas") && (
              <>
                {/* {isAdmin && currentView === "tabla" && (
                  <AdminStats planillas={planillas} />
                )} */}
                {planillasPage && (
                  <PlanillasTable
                    data={planillasPage}
                    filters={filters}
                    onFilterChange={setFilters}
                    onAddPlanilla={() => setShowAddModal(true)}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <AddPlanillaModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        dirigentes={dirigentes}
        onSubmit={handleAddPlanilla}
      />
    </div>
  );
}
