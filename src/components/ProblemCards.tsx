import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CalendarDays, Download, FileText, Hash, User, Users, XCircle } from "lucide-react"
import { downloadAllProblemCardsCSV, downloadAllProblemCardsPDF, downloadProblemCardCSV, downloadProblemCardPDF } from "@/lib/download-utils"
import type { ProblemCardsResponse } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ProblemCardsProps {
    problemCards: ProblemCardsResponse[];
}

export function ProblemCards({ problemCards }: ProblemCardsProps) {

    function ValidosHighlight({ validos, total }: { validos: number; total: number }) {
        const pct = total > 0 ? Math.round((validos / total) * 100) : 0
        const circumference = 2 * Math.PI * 18
        const filled = (pct / 100) * circumference

        return (
            <div className="flex flex-col items-center gap-1">
                <div className="relative flex h-16 w-16 items-center justify-center">
                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 44 44">
                        <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-border"
                        />
                        <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${filled} ${circumference - filled}`}
                            strokeLinecap="round"
                            className="text-success"
                        />
                    </svg>
                    <span className="absolute text-lg font-bold text-success">
                        {pct}%
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-extrabold tracking-tight text-success">
                        {validos.toLocaleString("es-PY")}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-success/70">
                        Validos
                    </span>
                </div>
            </div>
        )
    }



    if (problemCards.length === 0) {
        return (
            <Card className="border-border/60">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                        <AlertTriangle className="h-6 w-6 text-success" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Sin Reportes</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Todas las planillas tienen un número aceptable de votos no encontrados.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <AlertTriangle className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {problemCards.length} {problemCards.length === 1 ? "dirigente" : "dirigentes"} con reportes
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => downloadAllProblemCardsCSV(problemCards)}
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Exportar</span> CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => downloadAllProblemCardsPDF(problemCards)}
                    >
                        <FileText className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Exportar</span> PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {problemCards.map((card) => {
                    const severityLevel =
                        card.totalNoEncontrados >= 40 ? "critical" :
                            card.totalNoEncontrados >= 20 ? "high" : "medium"

                    const severityStyles = {
                        critical: {
                            border: "border-primary/40",
                            indicator: "bg-primary",
                            badgeBg: "bg-primary/10 text-primary border-primary/20",
                        },
                        high: {
                            border: "border-primary/25",
                            indicator: "bg-primary/70",
                            badgeBg: "bg-primary/10 text-primary border-primary/20",
                        },
                        medium: {
                            border: "border-primary/40",
                            indicator: "bg-primary",
                            badgeBg: "bg-primary/10 text-primary border-primary/20",
                        },
                    }

                    const styles = severityStyles[severityLevel]

                    return (
                        <Card
                            key={card.cedulaDirigente}
                            className={`relative overflow-hidden ${styles.border} transition-all hover:shadow-lg`}
                        >
                            <div className={`absolute left-0 top-0 h-full w-1 ${styles.indicator}`} />

                            <CardContent className="flex flex-col gap-4 p-5 pl-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Dirigente
                                            </span>
                                        </div>
                                        <h3 className="mt-1 text-base font-bold text-foreground leading-tight text-balance">
                                            {card.nombreDirigente}
                                        </h3>
                                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                            {card.cedulaDirigente}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className={styles.badgeBg}>
                                                <XCircle className="mr-1 h-3 w-3" />
                                                {card.totalEnviados - card.votantesValidos} no validos
                                            </Badge>
                                            <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground">
                                                <Users className="mr-1 h-3 w-3" />
                                                {card.totalEnviados} enviados
                                            </Badge>
                                        </div>
                                    </div>

                                    <ValidosHighlight
                                        validos={card.votantesValidos}
                                        total={card.totalEnviados}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        <Hash className="h-3 w-3" />
                                        Planillas ({card.planillas.length})
                                    </span>
                                    <div className="flex flex-col gap-1.5">
                                        {card.planillas.map((p) => (
                                            <div
                                                key={p.planillaId}
                                                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                                                        {p.planillaId}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <CalendarDays className="h-3 w-3" />
                                                        {formatDate(p.fechaCreacion)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-semibold text-success">
                                                        {card.votantesValidos}
                                                        <span className="ml-0.5 font-normal text-muted-foreground">val.</span>
                                                    </span>
                                                    <span className="text-xs font-semibold text-destructive">
                                                        {card.totalEnviados - card.votantesValidos}
                                                        <span className="ml-0.5 font-normal text-muted-foreground">n/v</span>
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        de {card.totalEnviados}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 border-t border-border/40 pt-3">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 gap-1.5 px-3 text-xs text-muted-foreground hover:text-foreground"
                                        onClick={() => downloadProblemCardCSV(card)}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        CSV
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 gap-1.5 px-3 text-xs text-muted-foreground hover:text-foreground"
                                        onClick={() => downloadProblemCardPDF(card)}
                                    >
                                        <FileText className="h-3.5 w-3.5" />
                                        PDF
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
