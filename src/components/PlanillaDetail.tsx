import type { Planilla, PlanillaDetalle, Votante } from "@/lib/types"
import { downloadDetalleCSV, downloadDetallePDF } from "@/lib/download-utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, FileText, User, Users } from "lucide-react";
import { getPlanillas } from "@/api/planilla"
import { useAuth } from "@/context/AuthContext"

interface PlanillaDetailProps {
  planilla: PlanillaDetalle
}

export function PlanillaDetail({ planilla }: PlanillaDetailProps) {
const {user} = useAuth();

const votoBadge = (val: string) => {
    if (val === "SI") return "border-success/30 bg-success/10 text-success"
    if (val === "NO") return "border-destructive/30 bg-destructive/10 text-destructive"
    return "border-muted-foreground/30 bg-muted text-muted-foreground"
  }

  return (
     <div className="space-y-5 rounded-lg border border-border/50 bg-muted/20 p-5">
      {/* Dirigente Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Dirigente
            </p>
            <p className="text-lg font-semibold text-foreground">
              {planilla.dirigente.nombre_completo}
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {planilla.dirigente.cedula}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            onClick={() => downloadDetalleCSV(planilla)}
          >
            <Download className="h-3.5 w-3.5" />
            Descargar CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            onClick={() => downloadDetallePDF(planilla)}
          >
            <FileText className="h-3.5 w-3.5" />
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs">
          <Users className="h-3 w-3" />
          {planilla.planilla.votantes.length} votantes mostrados
        </Badge>
        <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
          {planilla.planilla.totalValidos} validos
        </Badge>
        {planilla.planilla.totalNoExistentes > 0 && (
          <Badge variant="outline" className="gap-1.5 border-destructive/30 bg-destructive/10 px-3 py-1 text-xs text-destructive">
            {planilla.planilla.totalNoExistentes} no existentes
          </Badge>
        )}
      </div>

      {/* Votantes table */}
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5 hover:bg-primary/5">
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Cedula</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Nombre</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Apellido</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">F. Nacimiento</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">F. Inscripcion</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Tipo</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Direccion</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Voto PLRA</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Voto ANR</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">V. Generales</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Afiliaciones</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Afil. PLRA 2025</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Departamento</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Distrito</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Zona</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">Comite</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">L. Generales</TableHead>
              <TableHead className="whitespace-nowrap text-xs font-semibold text-foreground">L. Interna</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planilla.planilla.votantes.map((v:Votante) => (
              <TableRow key={`${v.cedula}`} className="hover:bg-muted/30">
                <TableCell className="whitespace-nowrap font-mono text-xs font-medium text-foreground">
                  {v.cedula}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-foreground">{v.nombre}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-foreground">{v.apellido}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.fechaNacimiento}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.fechaInscripcion}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant="outline" className='text-[10px] border-primary/30 bg-primary/10 text-primary '>
                    {v.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground" title={v.direccion}>
                  {v.direccion}
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  <Badge variant="outline" className={`text-[10px] ${votoBadge(v.votoPlra)}`}>
                    {v.votoPlra}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  <Badge variant="outline" className={`text-[10px] ${votoBadge(v.votoAnr)}`}>
                    {v.votoAnr}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  <Badge variant="outline" className={`text-[10px] ${votoBadge(v.votoGenerales)}`}>
                    {v.votoGenerales}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.afiliaciones}</TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  <Badge variant="outline" className={`text-[10px] ${votoBadge(v.afiliadoPlra2025)}`}>
                    {v.afiliadoPlra2025}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.departamento}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.distrito}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.zona}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.comite}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.localGenerales}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{v.localInterna}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Planillero footer */}
      <div className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
          <User className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Planillero responsable
          </p>
          <p className="text-sm font-semibold text-foreground">
            {planilla.planilla.cedulaPlanillero}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {planilla.planilla.nombrePlanillero}
          </p>
        </div>
      </div>
    </div>
  )
}