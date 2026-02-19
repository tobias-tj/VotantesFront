import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import type { AddPlanillaRequest, AddPlanillaResponse, Dirigente } from "@/lib/types"

interface AddPlanillaModalProps {
    open: boolean
    onClose: () => void
    dirigentes: Dirigente[]
    onSubmit: (planilla: AddPlanillaRequest) => Promise<AddPlanillaResponse>
}

export function AddPlanillaModal({ open, onClose, dirigentes, onSubmit }: AddPlanillaModalProps) {
    const { user } = useAuth()
    const [selectedDirigente, setSelectedDirigente] = useState("")
    const [votantesText, setVotantesText] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const resetForm = () => {
        setSelectedDirigente("")
        setVotantesText("")
        setError("")
        setSuccess(false)
        setIsSubmitting(false)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const parseCedulas = (text: string): string[] => {
        return text
            .split(/[\n,;]+/)
            .map((c) => c.trim())
            .filter((c) => c.length > 0)
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (!selectedDirigente) {
            setError("Debe seleccionar un dirigente.");
            return;
        }

        const cedulas = parseCedulas(votantesText);
        if (cedulas.length === 0) {
            setError("Debe ingresar al menos una cedula de votante.");
            return;
        }

        setIsSubmitting(true);

        try {
            const planilla: AddPlanillaRequest = {
                cedulaDirigente: selectedDirigente,
                nombreDirigente: dirigentes.find(d => d.cedula === selectedDirigente)?.nombre || "",
                cedulaPlanillero: user?.id || "",
                cedulasVotantes: cedulas.map(c => Number(c)),
            };

            const result = await onSubmit(planilla);

            if (result.data.cedulasRepetidas.length > 0) {
                setError(`Hay cedulas repetidas: ${result.data.cedulasRepetidas.join(", ")}`);
                setSuccess(true);
                resetForm();
                onClose();
            } else {
                setSuccess(true);
                setError("");
                resetForm();
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            setError("Error al crear la planilla");
            setSuccess(false);
            resetForm();
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            setVotantesText(text)
        }
        reader.readAsText(file)
    }
    const cedulaCount = parseCedulas(votantesText).length

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Agregar Planilla</DialogTitle>
                    <DialogDescription>
                        Seleccione un dirigente y agregue las cedulas de los votantes.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2.5 text-sm text-success">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>Planilla creada exitosamente.</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label className="text-foreground">Dirigente</Label>
                        <Select
                            value={selectedDirigente}
                            onValueChange={setSelectedDirigente}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar dirigente..." />
                            </SelectTrigger>
                            <SelectContent>
                                {dirigentes.map((d) => (
                                    <SelectItem key={d.cedula} value={d.cedula}>
                                        {d.nombre} ({d.cedula})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-foreground">Cedulas de votantes</Label>
                            {cedulaCount > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {cedulaCount} cedula{cedulaCount !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                        <Textarea
                            placeholder={"Ingrese cedulas separadas por comas o lineas:\n001-0000001-1\n001-0000002-2\n001-0000003-3"}
                            value={votantesText}
                            onChange={(e) => setVotantesText(e.target.value)}
                            rows={6}
                            className="font-mono text-sm"
                        />
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="csv-upload"
                                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Cargar archivo CSV
                            </Label>
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting || success}>
                            {isSubmitting ? "Guardando..." : "Guardar planilla"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}