
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Download, FileText } from "lucide-react"
import { downloadCSV, downloadPDF } from "@/lib/download-utils"
import type { ProblemCardsResponse } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ProblemCardsProps {
    problemCards: ProblemCardsResponse[];
}

const getSeverityStyles = (value: number) => {
    if (value === 0) {
        return {
            card: "border-success/20 bg-success/5",
            badge: "border-success/30 bg-success/10 text-success",
            text: "text-success",
        }
    }

    if (value < 10) {
        return {
            card: "border-yellow-500/20 bg-yellow-500/5",
            badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",
            text: "text-yellow-600",
        }
    }

    return {
        card: "border-destructive/20 bg-destructive/5",
        badge: "border-destructive/30 bg-destructive/10 text-destructive",
        text: "text-destructive",
    }
}




export function ProblemCards({ problemCards }: ProblemCardsProps) {




    if (problemCards.length === 0) {
        return (
            <Card className="border-border/60">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                        <AlertTriangle className="h-6 w-6 text-success" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Sin problemas detectados</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Todas las planillas tienen un numero aceptable de votos no encontrados.
                    </p>
                </CardContent>
            </Card>
        )
    }
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Planillas con Problemas
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Dirigentes con mas de 10 votos no encontrados en alguna planilla
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                            const allProblem = problemCards.flatMap((g) => g.planillas)
                            // downloadCSV(allProblem, "planillas-problemas")
                        }}
                    >
                        <Download className="h-3.5 w-3.5" />
                        CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                            const allProblem = problemCards.flatMap((g) => g.planillas)
                            // downloadPDF(allProblem, "planillas-problemas")
                        }}
                    >
                        <FileText className="h-3.5 w-3.5" />
                        PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {problemCards.map((group) => {
                    const severity = getSeverityStyles(group.totalNoEncontrados)
                    const visiblePlanillas = group.planillas.slice(0, 5)
                    const hasMore = group.planillas.length > 5

                    return (
                        <Card
                            key={group.cedulaDirigente}
                            className={`${severity.card} transition-colors hover:shadow-sm`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base text-foreground">
                                            {group.nombreDirigente}
                                        </CardTitle>
                                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                            {group.cedulaDirigente}
                                        </p>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={severity.badge}
                                    >
                                        {group.totalNoEncontrados} no encontrados
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="flex flex-col gap-2">
                                    {visiblePlanillas.map((p) => (
                                        <div
                                            key={p.planillaId}
                                            className="flex items-center justify-between rounded-md border border-border/50 bg-card px-3 py-2 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-mono text-sm font-medium text-foreground">
                                                    Id planilla: {p.planillaId}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(p.fechaCreacion)}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <span className={`text-sm font-medium ${severity.text}`}>
                                                    {p.totalNoEncontrados} no encontrados
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    de {p.totalEnviados} enviados
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {hasMore && (
                                        <p className="pt-1 text-xs text-muted-foreground">
                                            + {group.planillas.length - 5} planillas adicionales
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>


        </div>
    )
}