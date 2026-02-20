import { Card, CardContent } from "@/components/ui/card"
import { Send, CheckCircle, XCircle, FileSpreadsheet } from "lucide-react"
import type { GetEstadisticasResponseDTO } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface AdminStatsProps {
    estadisticas: GetEstadisticasResponseDTO
}

export function AdminStats({ estadisticas }: AdminStatsProps) {

    const totalPlanillas = estadisticas.totalPlanillas
    const totalValidos = estadisticas.totalValidos
    const totalNoExistentes = estadisticas.totalNoEncontrados
    const totalEnviados = estadisticas.totalEnviados

    const statCards = [
        {
            label: "Total Planillas",
            value: totalPlanillas,
            icon: <FileSpreadsheet className="h-5 w-5" />,
            color: "text-primary" as const,
            bgColor: "bg-primary/10" as const,
            title: "Total de planillas cargadas.",
            explanation: "Son todas las planillas cargadas por Dirigentes.",
        },
        {
            label: "Votantes Guardados",
            value: totalEnviados,
            icon: <Send className="h-5 w-5" />,
            color: "text-chart-2" as const,
            bgColor: "bg-chart-2/10" as const,
            title: "Votantes Guardados",
            explanation: "Son todos los votantes que fueron guardados en la base de datos.",
        },
        {
            label: "Votantes Validos",
            value: totalValidos,
            icon: <CheckCircle className="h-5 w-5" />,
            color: "text-success" as const,
            bgColor: "bg-success/10" as const,
            title: "Votantes Validos",
            explanation: "Son todos los votantes que están correctamente validados. Cumplen con las reglas para guardarlas.",
            reglas: [
                "Votante existe en la base de datos.",
                "Votante no fue cargado previamente por otro dirigente.",
            ]
        },
        {
            label: "Votantes No Encontrados",
            value: totalNoExistentes,
            icon: <XCircle className="h-5 w-5" />,
            color: "text-destructive" as const,
            bgColor: "bg-destructive/10" as const,
            explanation: "Son todos los votantes que no fueron encontrados en la base de datos.",

        },
    ]

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statCards.map((stat) => (
                <Popover key={stat.label}>
                    <PopoverTrigger asChild>
                        <Card className="border-border/60 cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}
                                >
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                                    <span className="text-xl font-bold text-foreground">{stat.value}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="space-y-2">
                            <p className="font-semibold text-foreground">{stat.title}</p>
                            <p className="text-muted-foreground text-xs leading-relaxed">{stat.explanation}</p>
                            {stat.reglas && (
                                <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                                    {stat.reglas.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            )}
                            {stat.label === "Votantes No Encontrados" && (
                                <p className="text-xs text-muted-foreground">
                                    Se recomienda revisar estos registros para evitar inconsistencias.
                                </p>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    )
}
