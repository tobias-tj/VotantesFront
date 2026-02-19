import { useState, Fragment } from "react"
import type { PaginatedResponse, Planilla, PlanillaFilters } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  X,
} from "lucide-react"
import { downloadCSV, downloadPDF } from "@/lib/download-utils"
import { PlanillaDetail } from "./PlanillaDetail"
import { mapPlanillaDetalle } from "@/api/mappers/planilla.mapper"

interface PlanillasTableProps {
  data: PaginatedResponse<Planilla>;
  filters: PlanillaFilters;
  onFilterChange: (filters: PlanillaFilters) => void;
  onAddPlanilla: () => void
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 25]

export function PlanillasTable({ data, filters, onFilterChange, onAddPlanilla }: PlanillasTableProps) {

  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id))
  }

  const totalPages = data.totalPages;

  const start =
    data.totalElements === 0
      ? 0
      : (filters.filterPage - 1) * filters.filterSize + 1;

  const end = Math.min(
    filters.filterPage * filters.filterSize,
    data.totalElements
  );

  const hasActiveFilters = filters.filterText || filters.dateFrom || filters.dateTo

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg text-foreground">
            Tabla de Planillas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => downloadCSV(data.content)}
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => downloadPDF(data.content)}
            >
              <FileText className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Button
              size="sm"
              className="gap-2"
              onClick={onAddPlanilla}
            >
              Agregar planilla
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="search" className="mb-1.5 text-xs text-muted-foreground">
              Buscar
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar por ID, cedula o nombre dirigente..."
                value={filters.filterText}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    filterText: e.target.value,
                    filterPage: 1,
                  })
                }
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div>
              <Label htmlFor="dateFrom" className="mb-1.5 text-xs text-muted-foreground">
                Desde
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    dateFrom: e.target.value,
                    filterPage: 1,
                  })
                }
                className="w-36"
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="mb-1.5 text-xs text-muted-foreground">
                Hasta
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    dateTo: e.target.value,
                    filterPage: 1,
                  })
                }
                className="w-36"
              />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={() => onFilterChange({ ...filters, filterText: "", dateFrom: "", dateTo: "", filterPage: 1 })} className="shrink-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Limpiar filtros</span>
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-10" />
                <TableHead className="font-semibold text-foreground">ID</TableHead>
                <TableHead className="font-semibold text-foreground">Cedula Dirigente</TableHead>
                <TableHead className="font-semibold text-foreground">Nombre Dirigente</TableHead>
                <TableHead className="font-semibold text-foreground">Cedula Planillero</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Enviados</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Validos</TableHead>
                <TableHead className="text-right font-semibold text-foreground">No Existentes</TableHead>
                <TableHead className="font-semibold text-foreground">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No se encontraron planillas con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                data.content.map((planilla) => (
                  <Fragment key={planilla.id}>
                    <TableRow
                      className={`cursor-pointer transition-colors hover:bg-muted/30 ${expandedRow === planilla.id.toString() ? "bg-muted/40" : ""}`}
                      onClick={() => toggleRow(planilla.id.toString())}
                    >
                      <TableCell className="w-10 px-2">
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${expandedRow === planilla.id.toString() ? "rotate-180" : ""}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium text-foreground">
                        {planilla.id}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {planilla.cedulaDirigente}
                      </TableCell>
                      <TableCell className="text-foreground">{planilla.nombreDirigente}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {planilla.cedulaPlanillero}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {planilla.totalEnviados}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className="border-success/30 bg-success/10 font-medium text-success"
                        >
                          {planilla.totalValidos}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {planilla.totalNoExistentes > 0 ? (
                          <Badge
                            variant="outline"
                            className="border-destructive/30 bg-destructive/10 font-medium text-destructive"
                          >
                            {planilla.totalNoExistentes}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(planilla.fechaCreacion).toLocaleDateString("es-DO")}
                      </TableCell>
                    </TableRow>
                    {expandedRow === planilla.id.toString() && (
                      <TableRow key={`${planilla.id}-detail`}>
                        <TableCell colSpan={9} className="p-0">
                          <div className="p-4" onClick={(e) => e.stopPropagation()}>
                            <PlanillaDetail planilla={mapPlanillaDetalle(planilla)} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filas por pagina:</span>
            <Select
              value={String(filters.filterSize)}
              onValueChange={(val) =>
                onFilterChange({
                  ...filters,
                  filterSize: Number(val),
                  filterPage: 1,
                })
              }
            >

              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROWS_PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="ml-2">
              {data.totalElements === 0
                ? "0 resultados"
                : `${start}-${end} de ${data.totalElements}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={filters.filterPage === 1}
              onClick={() => onFilterChange({ ...filters, filterPage: 1 })}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primera pagina</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={filters.filterPage === 1}
              onClick={() =>
                onFilterChange({ ...filters, filterPage: filters.filterPage - 1 })
              }
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Pagina anterior</span>
            </Button>
            <span className="px-3 text-sm text-foreground">
              {filters.filterPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={data.page === data.totalPages}
              onClick={() =>
                onFilterChange({ ...filters, filterPage: data.page + 1 })
              }
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Pagina siguiente</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={filters.filterPage === totalPages}
              onClick={() =>
                onFilterChange({ ...filters, filterPage: totalPages })
              }
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Ultima pagina</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
